import React, { useCallback, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import { useOverPaymentTransaction, useTransactionExport } from 'api/transactions'
import UpdateTransactionModal from './update-transaction-modal'
import { TransactionDetailsModal } from './transaction-details-modal'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { ExportCustomButton } from 'components/table-refactored/export-button'
import { TransactionTypeValues } from 'types/transaction.type'
import { PAYABLE_OVERPAYMENT_TABLE_COLUMNS } from 'features/payable/payable.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { TableFooter, ButtonsWrapper } from 'components/table-refactored/table-footer'

export const OverPaymentTransactionsTable = React.forwardRef((props, ref) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [projectId, setProjectId] = useState<null | string>()
  const [selectedTransactionName, setSelectedTransactionName] = useState<string>('')
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.transaction)
  const { transactions = [], isLoading } = useOverPaymentTransaction(TransactionTypeValues.overpayment)
  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(PAYABLE_OVERPAYMENT_TABLE_COLUMNS, TableNames.transaction)

  const { isOpen: isOpenEditModal, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const {
    isOpen: isOpenTransactionDetailsModal,
    onOpen: onTransactionDetailsModalOpen,
    onClose: onTransactionDetailsModalClose,
  } = useDisclosure()
  const { exportData } = useTransactionExport(projectId)

  const onRowClick = useCallback(
    row => {
      setSelectedTransactionName(row.name)
      setSelectedTransactionId(row.id)
      setProjectId(row.projectId)
      onEditModalOpen()
    },
    [onEditModalOpen, onTransactionDetailsModalOpen],
  )
  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <>
      <Box>
        <Box h="100%" maxH="calc(100vh - 250px)" overflow={'auto'}>
          <TableContextProvider data={transactions} columns={tableColumns}>
            <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !transactions?.length} />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportCustomButton columns={[]} data={exportData} colorScheme="brand" fileName="transactions" />

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
      <UpdateTransactionModal
        isOpen={isOpenEditModal}
        onClose={onEditModalClose}
        heading={selectedTransactionName as string}
        selectedTransactionId={selectedTransactionId as number}
        projectId={projectId as string}
        projectStatus={''} //TODO need to send project status when overpayment card is visible
      />
      <TransactionDetailsModal
        isOpen={isOpenTransactionDetailsModal}
        onClose={onTransactionDetailsModalClose}
        selectedTransactionId={selectedTransactionId as number}
      />
    </>
  )
})
