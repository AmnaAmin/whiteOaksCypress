import React, { useCallback, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import { useTransactionExport, useTransactions } from 'api/transactions'
import { useParams } from 'react-router'
import UpdateTransactionModal from './update-transaction-modal'
import { TransactionDetailsModal } from './transaction-details-modal'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { ExportCustomButton } from 'components/table-refactored/export-button'
import { PaginationState } from '@tanstack/react-table'
import {
  TRANSACTION_TABLE_COLUMNS,
  TRANSACTION_TABLE_QUERIES_KEY,
} from 'features/project-details/transactions/transaction.constants'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentPageWithTotal,
  TablePagination,
} from 'components/table-refactored/pagination'

export const TransactionsTable = React.forwardRef((props, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedTransactionName, setSelectedTransactionName] = useState<string>('')
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.transaction)
  const { tableColumns, settingColumns } = useTableColumnSettings(TRANSACTION_TABLE_COLUMNS, TableNames.transaction)

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const { columnFilters, setColumnFilters, queryStringWithPagination } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: TRANSACTION_TABLE_QUERIES_KEY,
    pagination,
    setPagination,
  })

  const { transactions, isLoading, totalPages } = useTransactions(
    queryStringWithPagination,
    pagination.pageSize,
    projectId,
  )

  const { isOpen: isOpenEditModal, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const {
    isOpen: isOpenTransactionDetailsModal,
    onOpen: onTransactionDetailsModalOpen,
    onClose: onTransactionDetailsModalClose,
  } = useDisclosure()
  const { exportData } = useTransactionExport(projectId)

  const onRowClick = useCallback(
    row => {
      const { original } = row
      setSelectedTransactionName(original.name)
      setSelectedTransactionId(original.id)

      onEditModalOpen()
    },
    [onEditModalOpen, onTransactionDetailsModalOpen],
  )
  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <>
      <Box h="500px" overflow={'auto'}>
        <TableContextProvider
          data={transactions}
          columns={tableColumns}
          pagination={pagination}
          setPagination={setPagination}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          totalPages={totalPages}
        >
          <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !transactions?.length} />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportCustomButton columns={[]} data={exportData} colorScheme="brand" />

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
            <TablePagination>
              <ShowCurrentPageWithTotal />
              <GotoFirstPage />
              <GotoPreviousPage />
              <GotoNextPage />
              <GotoLastPage />
            </TablePagination>
          </TableFooter>
        </TableContextProvider>
      </Box>

      <UpdateTransactionModal
        isOpen={isOpenEditModal}
        onClose={onEditModalClose}
        heading={selectedTransactionName as string}
        selectedTransactionId={selectedTransactionId as number}
        projectId={projectId as string}
      />
      <TransactionDetailsModal
        isOpen={isOpenTransactionDetailsModal}
        onClose={onTransactionDetailsModalClose}
        selectedTransactionId={selectedTransactionId as number}
      />
    </>
  )
})
