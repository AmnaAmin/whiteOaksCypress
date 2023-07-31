import React, { useEffect, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useClients } from 'api/clients'
import { Clients } from 'types/client.type'
import Client from 'features/clients/selected-client-modal'
import { CLIENTS } from './clients.i18n'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { ExportButton } from 'components/table-refactored/export-button'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import TableColumnSettings from 'components/table/table-column-settings'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  SelectPageSize,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { columns } from 'components/table-refactored/make-data'

export const CLIENTS_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${CLIENTS}.name`,
    accessorKey: 'companyName',
  },
  {
    header: `${CLIENTS}.contact`,
    accessorKey: 'contacts[0].contact',
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
    header: `${CLIENTS}.phone`,
    accessorKey: 'contacts[0].phoneNumber',
    accessorFn: row => {
      return row.contacts?.[0] ? row.contacts?.[0]?.phoneNumber : '- - -'
    },
  },
  {
    header: `${CLIENTS}.email`,
    accessorKey: 'contacts[0].emailAddress',
    accessorFn: row => {
      return row.contacts?.[0] ? row.contacts?.[0]?.emailAddress : '- - -'
    },
  },
  {
    header: `${CLIENTS}.contact`,
    accessorKey: 'accountPayableContactInfos[0].contact',
    accessorFn: row => {
      return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.contact : '- - -'
    },
  },
  {
    header: `${CLIENTS}.email`,
    accessorKey: 'accountPayableContactInfos[0].emailAddress',
    accessorFn: row => {
      return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.emailAddress : '- - -'
    },
  },
  {
    header: `${CLIENTS}.phone`,
    accessorKey: 'accountPayableContactInfos[0].phoneNumber',
    accessorFn: row => {
      return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.phoneNumber : '- - -'
    },
  },
]
export const ClientsTable = React.forwardRef((props: any, ref) => {
  const { defaultSelected } = props
  const { data: clients, isLoading, refetch } = useClients()
  const [selectedClient, setSelectedClient] = useState<Clients>()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()

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
      onOpen()
    }
  }, [defaultSelected])

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.clients)

  const {
    tableColumns,
    settingColumns,
    isFetched: tablePreferenceFetched,
    refetch: refetchColumns,
  } = useTableColumnSettings(CLIENTS_COLUMNS, TableNames.clients)
  const onSave = columns => {
    postGridColumn(columns)
  }
console.log(tableColumns)
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
        <TableContextProvider data={clients} columns={tableColumns}>
          <Table
            onRowClick={row => {
              setSelectedClient(row)
              onOpen()
            }}
            isLoading={isLoading}
            isEmpty={!isLoading && !clients?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="client"
                refetch={refetch}
                isLoading={isLoading}
              />
              {settingColumns && (
                <TableColumnSettings
                  refetch={refetchColumns}
                  disabled={isLoading}
                  onSave={onSave}
                  columns={settingColumns}
                />
              )}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
})
