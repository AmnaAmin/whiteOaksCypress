import React, { useCallback, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import AccountReceivableModal from 'features/recievable/account-receivable-modal'
import { usePaginatedAccountReceivables, useGetAllAccountReceivables } from 'api/account-receivable'
import UpdateTransactionModal from 'features/project-details/transactions/update-transaction-modal'
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, Updater } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import Table from 'components/table-refactored/table'
import { ExportButton } from 'components/table-refactored/export-button'
import TableColumnSettings from 'components/table/table-column-settings'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'

type ReceivableProps = {
  receivableColumns: ColumnDef<any>[]
  setPagination: (updater: Updater<PaginationState>) => void
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  pagination: PaginationState
  queryStringWithPagination: string
  queryStringWithoutPagination: string
  sorting: SortingState
  setSorting: (updater: Updater<SortingState>) => void
}

export const ReceivableTable: React.FC<ReceivableProps> = ({
  receivableColumns,
  setColumnFilters,
  setPagination,
  pagination,
  sorting,
  setSorting,
  queryStringWithPagination,
  queryStringWithoutPagination,
}) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedProjectId, setSelectedProjectId] = useState<string>()
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<string>()

  const {
    isOpen: isAccountReceivableModal,
    onOpen: onAccountReceivableModalOpen,
    onClose: onAccountReceivableModalClose,
  } = useDisclosure()
  const { isOpen: isOpenTransactionModal, onOpen: onEditModalOpen, onClose: onTransactionModalClose } = useDisclosure()

  const onRowClick = useCallback(
    row => {
      if (row.type === 'draw') {
        setSelectedTransactionId(row.changeOrderId)
        setSelectedProjectId(row.projectId)
        setSelectedProjectStatus(row?.projectStatus || '')
        onEditModalOpen()
      } else {
        setSelectedProjectId(row.projectId)
        setSelectedProjectStatus(row?.projectStatus || '')
        onAccountReceivableModalOpen()
      }
    },
    [onAccountReceivableModalOpen],
  )
  const {
    refetch: refetchPaginatedAccountReceivables,
    receivables,
    isLoading,
    totalPages,
    dataCount,
  } = usePaginatedAccountReceivables(queryStringWithPagination, pagination.pageSize)

  const { isLoading: isExportDataLoading, refetch } = useGetAllAccountReceivables(queryStringWithoutPagination)

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.receivable)
  const { tableColumns, settingColumns } = useTableColumnSettings(receivableColumns, TableNames.receivable)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box overflow="auto" width="100%" h="600px" roundedTop={6}>
      <TableContextProvider
        data={receivables}
        columns={tableColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        setColumnFilters={setColumnFilters}
        totalPages={totalPages}
      >
        <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !receivables?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={tableColumns}
              refetch={refetch}
              isLoading={isExportDataLoading}
              colorScheme="brand"
              fileName="receivable.xlsx"
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
      <AccountReceivableModal
        projectId={selectedProjectId}
        isOpen={isAccountReceivableModal}
        onClose={() => {
          onAccountReceivableModalClose()
          refetchPaginatedAccountReceivables()
        }}
      />
      <UpdateTransactionModal
        isOpen={isOpenTransactionModal}
        onClose={onTransactionModalClose}
        selectedTransactionId={selectedTransactionId as number}
        projectId={selectedProjectId as string}
        projectStatus={selectedProjectStatus as string}
      />
    </Box>
  )
}
