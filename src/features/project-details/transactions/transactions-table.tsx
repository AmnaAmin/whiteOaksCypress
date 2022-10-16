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
import { TRANSACTION_TABLE_COLUMNS } from 'features/project-details/transactions/transaction.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'

export const TransactionsTable = React.forwardRef((props, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedTransactionName, setSelectedTransactionName] = useState<string>('')
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.transaction)
  const { tableColumns, settingColumns } = useTableColumnSettings(TRANSACTION_TABLE_COLUMNS, TableNames.transaction)

  const { transactions, isLoading } = useTransactions(projectId)

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
        <TableContextProvider data={transactions} columns={tableColumns}>
          <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !transactions?.length} />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportCustomButton columns={[]} data={exportData} colorScheme="brand" />

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
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
