import React, { useMemo, useState } from 'react'
import { Box, Checkbox, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { TableContextProvider } from 'components/table-refactored/table-context'

import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import Table from 'components/table-refactored/table'
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { difference } from 'lodash'
import { useFetchAlerts, useFetchUserAlerts } from 'api/alerts'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'

enum PROJECT_CATEGORY {
  WARNING = 1,
  INFO = 2,
  ERROR = 3,
}

const ALERT_TABLE_QUERY_KEYS = {
  status: 'status.specified',
}

export const TriggeredAlertsTable = React.forwardRef((props: any, ref) => {
  const { selectedAlerts, setSelectedAlerts } = props
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const { t } = useTranslation()
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'dateCreated', desc: true }])

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: ALERT_TABLE_QUERY_KEYS,
      pagination,
      setPagination,
      sorting,
    })

  const { alerts, isLoading, isFetching, totalPages, dataCount } = useFetchAlerts(
    queryStringWithPagination,
    pagination.pageSize,
  )
  const { refetch: allAlertsFetch, isLoading: isAllExportDataLoading } = useFetchUserAlerts({
    query: queryStringWithoutPagination,
    isDisabled: true,
  })

  const TRIGGERED_ALERTS_COLUMNS: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: () => {
          return (
            <Flex minW={'60px'} justifyContent="center">
              <Checkbox
                style={{ backgroundColor: 'white', borderColor: 'gray.500' }}
                value={'all'}
                size="lg"
                isChecked={
                  alerts &&
                  alerts?.length > 0 &&
                  difference(
                    alerts.map(r => r.id),
                    selectedAlerts,
                  )?.length < 1
                }
                onChange={e => {
                  const allIds = alerts?.map(a => a?.id)
                  if (e.currentTarget?.checked) {
                    setSelectedAlerts(allIds ? [...allIds] : [])
                  } else {
                    setSelectedAlerts([])
                  }
                }}
              />
            </Flex>
          )
        },
        enableSorting: false,
        accessorKey: 'checkbox',
        accessorFn: () => true,
        cell: cellInfo => {
          const { row } = cellInfo
          const id = Number(row?.original?.id)
          return (
            <Flex justifyContent="center" onClick={e => e.stopPropagation()}>
              <Checkbox
                isChecked={selectedAlerts?.includes(id)}
                value={id}
                onChange={e => {
                  const val = Number(e.currentTarget.value)
                  if (e.currentTarget?.checked) {
                    if (!selectedAlerts?.includes(val)) {
                      setSelectedAlerts([...selectedAlerts, val])
                    }
                  } else {
                    setSelectedAlerts([...selectedAlerts.filter(s => s !== val)])
                  }
                }}
              />
            </Flex>
          )
        },
        size: 60,
      },
      {
        header: 'Name',
        accessorKey: 'subject',
      },

      {
        header: t('type') as string,
        accessorKey: 'triggeredType',
      },
      {
        header: t('value') as string,
        accessorKey: 'attribute',
      },
      {
        header: t('category') as string,
        accessorKey: 'category',
        accessorFn: cellInfo => PROJECT_CATEGORY[cellInfo.category],
        cell: ({ row }) => PROJECT_CATEGORY[row.original.category],
      },
      {
        header: t('status') as string,
        accessorKey: 'status',
        accessorFn: cellInfo => {
          return cellInfo.webSockectRead ? 'Read' : 'Unread'
        },
      },
      {
        header: t('dateTriggered') as string,
        accessorKey: 'dateCreated',
        accessorFn: row => datePickerFormat(row.dateCreated),
        cell: (row: any) => {
          const value = row?.row.original?.dateCreated
          return dateFormat(value)
        },
        meta: { format: 'date' },
      },
    ]
  }, [alerts, selectedAlerts, setSelectedAlerts])

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.alerts)
  const { tableColumns, settingColumns } = useTableColumnSettings(TRIGGERED_ALERTS_COLUMNS, TableNames.vendors)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box
      w="100%"
      minH="calc(100vh - 503px)"
      position="relative"
      borderRadius="6px"
      border="1px solid #CBD5E0"
      overflowX="auto"
      roundedRight={{ base: '0px', sm: '6px' }}
    >
      <TableContextProvider
        data={alerts}
        columns={tableColumns}
        totalPages={totalPages}
        pagination={pagination}
        setPagination={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        sorting={sorting}
        setSorting={setSorting}
      >
        <Table isLoading={isLoading || isFetching} isEmpty={!isLoading && !isFetching && !alerts?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={tableColumns}
              colorScheme="brand"
              fileName="alerts"
              refetch={allAlertsFetch}
              isLoading={isAllExportDataLoading}
            />
            <CustomDivider />

            {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
          </ButtonsWrapper>
          <TablePagination>
            <ShowCurrentRecordsWithTotalRecords dataCount={dataCount} />
            <GotoFirstPage />
            <GotoPreviousPage />
            <GotoNextPage />
            <GotoLastPage />
          </TablePagination>
        </TableFooter>
      </TableContextProvider>
    </Box>
  )
})
