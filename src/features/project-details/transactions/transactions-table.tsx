import React, { useCallback, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import { useTransactionsV1 } from 'api/transactions'
import { useParams } from 'react-router'
import UpdateTransactionModal from './update-transaction-modal'
import { TransactionDetailsModal } from './transaction-details-modal'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { ExportButton } from 'components/table-refactored/export-button'
import { TRANSACTION_TABLE_COLUMNS } from 'features/project-details/transactions/transaction.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'

type TransactionProps = {
  projectStatus: string
}

export const TransactionsTable = React.forwardRef((props: TransactionProps, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedTransactionName, setSelectedTransactionName] = useState<string>('')
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.transaction)
  const { tableColumns, settingColumns } = useTableColumnSettings(TRANSACTION_TABLE_COLUMNS, TableNames.transaction)

  const { refetch, transactions, isLoading } = useTransactionsV1(projectId)

  const { isOpen: isOpenEditModal, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const {
    isOpen: isOpenTransactionDetailsModal,
    onOpen: onTransactionDetailsModalOpen,
    onClose: onTransactionDetailsModalClose,
  } = useDisclosure()

  const onRowClick = useCallback(
    row => {
      setSelectedTransactionName(row.name)
      setSelectedTransactionId(row.id)
      onEditModalOpen()
    },
    [onEditModalOpen, onTransactionDetailsModalOpen],
  )
  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <>
        <Box overflow={'auto'} w="100%" h="calc(100vh - 300px)" position="relative" roundedTopRight={6}>
        <TableContextProvider data={transactions} columns={tableColumns}>
          <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !transactions?.length} />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                refetch={refetch}
                isLoading={isLoading}
                colorScheme="darkBlue"
                fileName="transactions"
              />
            <CustomDivider />
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
        projectStatus={props?.projectStatus as string}
      />
      <TransactionDetailsModal
        isOpen={isOpenTransactionDetailsModal}
        onClose={onTransactionDetailsModalClose}
        selectedTransactionId={selectedTransactionId as number}
      />
    </>
  )
})
