import React, { useEffect, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useGetAllWorkOrders, usePaginatedAccountPayable } from 'api/account-payable'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetails from 'features/work-order/work-order-edit'
import { ColumnDef, ColumnFiltersState, PaginationState, Updater } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import Table from 'components/table-refactored/table'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import TableColumnSettings from 'components/table/table-column-settings'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { ExportButton } from 'components/table-refactored/export-button'

type PayablePropsTyep = {
  payableColumns: ColumnDef<any>[]
  setPagination: (updater: Updater<PaginationState>) => void
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  pagination: PaginationState
  queryStringWithPagination: string
  queryStringWithoutPagination: string
}

export const PayableTable: React.FC<PayablePropsTyep> = React.forwardRef(
  ({
    payableColumns,
    setColumnFilters,
    setPagination,
    pagination,
    queryStringWithPagination,
    queryStringWithoutPagination,
  }) => {
    const { isOpen, onClose: onCloseDisclosure, onOpen } = useDisclosure()
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()

    const { workOrders, isLoading, totalPages, dataCount } = usePaginatedAccountPayable(
      queryStringWithPagination,
      pagination.pageSize,
    )

    const { refetch, isLoading: isExportDataLoading } = useGetAllWorkOrders(queryStringWithoutPagination)

    const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.payable)
    const { tableColumns, settingColumns } = useTableColumnSettings(payableColumns, TableNames.payable)

    useEffect(() => {
      if (workOrders && workOrders.length > 0 && selectedWorkOrder?.id) {
        const updatedWorkOrder = workOrders?.find(wo => wo.id === selectedWorkOrder?.id)
        if (updatedWorkOrder) {
          setSelectedWorkOrder({ ...updatedWorkOrder })
        } else {
          setSelectedWorkOrder(undefined)
        }
      } else {
        setSelectedWorkOrder(undefined)
      }
    }, [workOrders])

    const onRowClick = row => {
      setSelectedWorkOrder(row)
      onOpen()
    }

    const onSave = columns => {
      postGridColumn(columns)
    }

    return (
      <Box overflow="auto" width="100%">
        {isOpen && (
          <WorkOrderDetails
            workOrder={selectedWorkOrder as ProjectWorkOrderType}
            onClose={() => {
              setSelectedWorkOrder(undefined)
              // refetch()
              onCloseDisclosure()
            }}
            isOpen={isOpen}
          />
        )}

        <Box overflow={'auto'} height="calc(100vh - 100px)">
          <TableContextProvider
            data={workOrders}
            columns={tableColumns}
            pagination={pagination}
            setPagination={setPagination}
            // columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            totalPages={totalPages}
          >
            <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !workOrders?.length} />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportButton
                  columns={tableColumns}
                  refetch={refetch}
                  isLoading={isExportDataLoading}
                  colorScheme="brand"
                  fileName="payable.xlsx"
                />
                {settingColumns && (
                  <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />
                )}
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
      </Box>
    )
  },
)
