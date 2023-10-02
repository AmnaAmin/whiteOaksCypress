import React, { useEffect, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { mappingDataForClientExport, useClients } from 'api/clients'
import { Clients } from 'types/client.type'
import Client from 'features/clients/selected-client-modal'
import { CLIENTS } from './clients.i18n'
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import TableColumnSettings from 'components/table/table-column-settings'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { ExportButton } from 'components/table-refactored/export-button'
import { CLIENT_TABLE_QUERY_KEYS, useGetAllClients } from 'api/clients'
import { useTranslation } from 'react-i18next'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

export const ClientsTable = React.forwardRef((props: any, ref) => {
  const { defaultSelected } = props
  const [selectedClient, setSelectedClient] = useState<Clients>()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: CLIENT_TABLE_QUERY_KEYS,
      pagination,
      setPagination,
      sorting,
    })

  const { refetch: refetchAllClients, isLoading: isAllExportDataLoading } =
    useGetAllClients(queryStringWithoutPagination)

  const {
    data: clients,
    isLoading,
    dataCount: clientDataCount,
    totalPages: clientTotalPages,
    refetch,
  } = useClients(queryStringWithPagination, pagination.pageSize)
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.clients)
  const { t } = useTranslation()

  useEffect(() => {
    if (clients && clients.length > 0 && selectedClient?.id) {
      const updatedClient = clients?.find(c => c.id === selectedClient?.id)
      if (updatedClient) {
        setSelectedClient({ ...updatedClient })
      } else {
        setSelectedClient(undefined)
      }
    } else {
      setSelectedClient(undefined)
    }
  }, [clients])

  useEffect(() => {
    if (defaultSelected?.id) {
      setSelectedClient(defaultSelected)
      setPagination({ pageIndex: 0, pageSize: 20 })
      onOpen()
    }
  }, [defaultSelected])

  const CLIENT_COLUMNS: ColumnDef<any>[] = [
    {
      header: `${CLIENTS}.name`,
      accessorKey: 'companyName',
    },
    {
      header: `${CLIENTS}.contact`,
      accessorKey: 'contactName',
      accessorFn: row => {
        return row.contacts?.[0] ? row.contacts?.[0]?.contact : '- - -'
      },
    },
    {
      header: `${CLIENTS}.address`,
      accessorKey: 'streetAddress',
      accessorFn: row => {
        return row.streetAddress ? row.streetAddress : '- - -'
      },
    },
    {
      header: `${CLIENTS}.contactPhone`,
      accessorKey: 'contactPhone',
      accessorFn: row => {
        return row.contacts?.[0] ? row.contacts?.[0]?.phoneNumber : '- - -'
      },
    },
    {
      header: `${CLIENTS}.contactEmail`,
      accessorKey: 'contactEmail',
      accessorFn: row => {
        return row.contacts?.[0] ? row.contacts?.[0]?.emailAddress : '- - -'
      },
    },
    {
      header: `${CLIENTS}.accountsContact`,
      accessorKey: 'accountPayableContactInfosContact',
      accessorFn: row => {
        return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.contact : '- - -'
      },
    },
    {
      header: `${CLIENTS}.accountsEmail`,
      accessorKey: 'accountPayableContactInfosEmail',
      accessorFn: row => {
        return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.emailAddress : '- - -'
      },
    },
    {
      header: `${CLIENTS}.accountsPhone`,
      accessorKey: 'accountPayableContactInfosPhone',
      accessorFn: row => {
        return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.phoneNumber : '- - -'
      },
    },
  ]

  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(CLIENT_COLUMNS, TableNames.clients)
  const onSave = columns => {
    postGridColumn(columns)
  }

  const customExport = async ({ data }) => {
    const workbook = new Excel.Workbook()
    try {
      const worksheet = workbook.addWorksheet('Sheet 1') as any
      const columns = tableColumns || []
      const columnsNames = columns.map((column: any, index) => {
        return { header: t(column.header as string), key: column?.accessorKey }
      })
      worksheet.columns = columnsNames

      const dataMapped = mappingDataForClientExport(data, columns)
      dataMapped.forEach(singleData => {
        worksheet.addRow(singleData)
      })
      const buf = await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `${'clients'}.xlsx`)
    } catch (error) {
      console.error('Error...', error)
    } finally {
      workbook.removeWorksheet('Sheet 1')
    }
  }

  return (
    <Box>
      {isOpen && (
        <Client
          clientDetails={selectedClient as Clients}
          onClose={() => {
            refetch()
            setSelectedClient(undefined)
            onCloseDisclosure()
          }}
          isOpen={isOpen}
        />
      )}

      <Box overflow={'auto'} h="calc(100vh - 225px)" border="1px solid #CBD5E0" borderBottomRadius="6px">
        <TableContextProvider
          data={clients}
          columns={CLIENT_COLUMNS}
          totalPages={clientTotalPages}
          pagination={pagination}
          setPagination={setPagination}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          sorting={sorting}
          setSorting={setSorting}
        >
          <Table
            onRowClick={row => {
              setSelectedClient(row)
              onOpen()
            }}
            isFilteredByApi={true}
            isLoading={isLoading}
            isEmpty={!isLoading && !clients?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                customExport={data => {
                  customExport({ data })
                }}
                colorScheme="brand"
                fileName="clients"
                refetch={refetchAllClients}
                isLoading={isAllExportDataLoading}
              />
              <CustomDivider />

              {settingColumns && (
                <TableColumnSettings
                  refetch={refetchColumns}
                  disabled={isLoading}
                  onSave={onSave}
                  columns={settingColumns}
                  tableNames={TableNames.clients}
                />
              )}
            </ButtonsWrapper>
            <TablePagination>
              <ShowCurrentRecordsWithTotalRecords dataCount={clientDataCount} />
              <GotoFirstPage />
              <GotoPreviousPage />
              <GotoNextPage />
              <GotoLastPage />
            </TablePagination>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
})
