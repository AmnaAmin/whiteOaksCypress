import React from 'react'
import { Box } from '@chakra-ui/react'
import { ColumnDef, ColumnFiltersState, PaginationState, Updater } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import TableColumnSettings from 'components/table/table-column-settings'
import { DASHBOARD } from './dashboard.i18n'
import { useTranslation } from 'react-i18next'
import { useGetAllUpcomingPaymentWorkOrders, usePaginatedUpcomingPayment } from 'api/vendor-dashboard'
import { dateFormat } from 'utils/date-time-utils'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import Status from 'features/common/status'

type workOrderType = {
  pagination: PaginationState
  queryStringWithPagination: string
  queryStringWithoutPagination: string
  setPagination: (updater: Updater<PaginationState>) => void
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
}

export const UpcomingPaymentTable: React.FC<workOrderType> = ({
  pagination,
  queryStringWithPagination,
  queryStringWithoutPagination,
  setPagination,
  setColumnFilters,
}) => {
  const { t } = useTranslation()

  const UPCOMING_PAYMENT_COLUMNS: ColumnDef<any>[] = [
    {
      header: t(`${DASHBOARD}.projectID`),
      accessorKey: 'projectId',
      accessorFn: row => row.projectId,
    },
    {
      header: t(`${DASHBOARD}.woStatus`),
      accessorKey: 'statusLabel',
      accessorFn: row => row.statusLabel,
      cell: (row: any) => {
        const value = row.cell.getValue()
        return <Status value={value} id={value} />
      },
    },
    {
      header: t(`${DASHBOARD}.woID`),
      accessorKey: 'id',
      accessorFn: row => row.id,
    },
    {
      header: t(`${DASHBOARD}.address`),
      accessorKey: 'vendorAddress',
      accessorFn: row => row.vendorAddress,
    },
    {
      header: t(`${DASHBOARD}.trade`),
      accessorKey: 'marketName',
      accessorFn: row => row.marketName,
    },
    {
      header: t(`${DASHBOARD}.dueDateWO`),
      accessorKey: 'workOrderExpectedCompletionDate',
      accessorFn: row => dateFormat(row.workOrderExpectedCompletionDate),
    },
    {
      header: t(`${DASHBOARD}.expectedPayment`),
      accessorKey: 'expectedPaymentDate',
      accessorFn: row => dateFormat(row.expectedPaymentDate),
    },
  ]

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.upcomingPayment)

  const onSave = columns => {
    postGridColumn(columns)
  }

  const { tableColumns, settingColumns } = useTableColumnSettings(UPCOMING_PAYMENT_COLUMNS, TableNames.upcomingPayment)

  const { refetch, isLoading: isExportDataLoading } = useGetAllUpcomingPaymentWorkOrders(queryStringWithoutPagination)

  const { workOrders, isLoading, totalPages, dataCount } = usePaginatedUpcomingPayment(
    queryStringWithPagination,
    pagination.pageSize,
  )

  return (
    <Box overflow={'auto'} h="calc(100vh - 225px)">
      <TableContextProvider
        data={workOrders}
        columns={tableColumns}
        totalPages={totalPages}
        pagination={pagination}
        setPagination={setPagination}
        setColumnFilters={setColumnFilters}
      >
        <Table onRowClick={() => {}} isLoading={isLoading} isEmpty={!isLoading && !workOrders?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={tableColumns}
              refetch={refetch}
              isLoading={isExportDataLoading}
              colorScheme="brand"
              fileName="projects.xlsx"
            />
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
}
