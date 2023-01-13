import React, { useEffect, useMemo, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useGetAllWorkOrders, usePaginatedAccountPayable } from 'api/account-payable'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetails from 'features/work-order/work-order-edit'
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, Updater } from '@tanstack/react-table'
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
  SelectPageSize,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { ExportButton } from 'components/table-refactored/export-button'
import { generateSettingColumn } from 'components/table-refactored/make-data'
import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'
import UpdateTransactionModal from 'features/project-details/transactions/update-transaction-modal'

type PayablePropsTyep = {
  payableColumns: ColumnDef<any>[]
  setPagination: (updater: Updater<PaginationState>) => void
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  pagination: PaginationState
  queryStringWithPagination: string
  queryStringWithoutPagination: string
  sorting: SortingState
  setSorting: (updater: Updater<SortingState>) => void
}

export const PayableTable: React.FC<PayablePropsTyep> = React.forwardRef(
  ({
    payableColumns,
    setColumnFilters,
    setPagination,
    setSorting,
    sorting,
    pagination,
    queryStringWithPagination,
    queryStringWithoutPagination,
  }) => {
    const { isOpen, onClose: onCloseDisclosure, onOpen } = useDisclosure()
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()
    const {
      isOpen: isOpenTransactionModal,
      onOpen: onOpenTransactionModal,
      onClose: onCloseTransactionModal,
    } = useDisclosure()
    const [selectedTransaction, setSelectedTransaction] = useState<{
      transactionId: number
      transactionName: string
      projectId: string | number
    }>()
    const [paginationInitialized, setPaginationInitialized] = useState(false)
    const {
      workOrders,
      isLoading,
      totalPages,
      dataCount,
      refetch: refetchPayables,
    } = usePaginatedAccountPayable(queryStringWithPagination, pagination.pageSize)
    const { email } = useUserProfile() as Account

    const { refetch, isLoading: isExportDataLoading } = useGetAllWorkOrders(queryStringWithoutPagination)

    const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.payable)
    const {
      tableColumns,
      settingColumns,
      isFetched: tablePreferenceFetched,
    } = useTableColumnSettings(payableColumns, TableNames.payable)

    const { paginationRecord, columnsWithoutPaginationRecords } = useMemo(() => {
      const paginationCol = settingColumns.find(col => col.contentKey === 'pagination')
      const columnsWithoutPaginationRecords = settingColumns.filter(col => col.contentKey !== 'pagination')

      return {
        paginationRecord: paginationCol ? { ...paginationCol, field: paginationCol?.field || 0 } : null,
        columnsWithoutPaginationRecords,
      }
    }, [settingColumns])

    useEffect(() => {
      const paginationToBeDefaulted =
        !paginationInitialized && tablePreferenceFetched && settingColumns.length > 0 && !paginationRecord
      const paginationsMismatchFound =
        !paginationInitialized &&
        pagination &&
        paginationRecord &&
        (paginationRecord.field as Number) !== pagination.pageSize

      if (paginationToBeDefaulted || paginationsMismatchFound) {
        setPaginationInitialized(true)
        setPagination(prevState => ({
          ...prevState,
          pageSize: paginationToBeDefaulted ? 25 : Number(paginationRecord?.field) || 25,
        }))
      }
    }, [pagination, settingColumns, tablePreferenceFetched])

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
      if (row.paymentType?.toLowerCase() === 'wo draw') {
        setSelectedTransaction(row)
        onOpenTransactionModal()
      } else {
        setSelectedWorkOrder(row)
        onOpen()
      }
    }

    const onSave = columns => {
      postGridColumn(columns)
    }

    const onPageSizeChange = pageSize => {
      if (paginationRecord) {
        postGridColumn([...columnsWithoutPaginationRecords, { ...paginationRecord, field: pageSize }] as any)
      } else {
        const paginationSettings = generateSettingColumn({
          field: pageSize,
          contentKey: 'pagination' as string,
          order: columnsWithoutPaginationRecords.length,
          userId: email,
          type: TableNames.payable,
          hide: true,
        })
        settingColumns.push(paginationSettings)
        postGridColumn(settingColumns as any)
      }
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
        {isOpenTransactionModal && !!selectedTransaction && (
          <UpdateTransactionModal
            isOpen={isOpenTransactionModal}
            onClose={() => {
              setSelectedTransaction(undefined)
              refetchPayables()
              onCloseTransactionModal()
            }}
            heading={selectedTransaction?.transactionName}
            selectedTransactionId={selectedTransaction?.transactionId as number}
            projectId={`${selectedTransaction?.projectId}`}
            projectStatus={''}
          />
        )}

        <Box overflowX={'auto'} minH="calc(100vh - 370px)" roundedTop={6} border="1px solid #CBD5E0">
          <TableContextProvider
            data={workOrders}
            columns={tableColumns}
            pagination={pagination}
            setPagination={setPagination}
            // columnFilters={columnFilters}
            sorting={sorting}
            setSorting={setSorting}
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
                  fileName="payable"
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
                <SelectPageSize dataCount={dataCount} onPageSizeChange={onPageSizeChange} />
              </TablePagination>
            </TableFooter>
          </TableContextProvider>
        </Box>
      </Box>
    )
  },
)
