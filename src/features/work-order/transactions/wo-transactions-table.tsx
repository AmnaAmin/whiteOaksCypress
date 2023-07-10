import React, { useCallback, useEffect, useState } from 'react'
import { Box, Center, Spinner, useDisclosure } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import { useWOTransactionsV1 } from 'api/transactions'
import { useParams } from 'react-router'

import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { ExportButton } from 'components/table-refactored/export-button'
import { TRANSACTION_TABLE_COLUMNS } from 'features/project-details/transactions/transaction.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import UpdateTransactionModal from 'features/project-details/transactions/update-transaction-modal'
import { TransactionDetailsModal } from 'features/project-details/transactions/transaction-details-modal'

type TransactionProps = {
  projectStatus: string
  workOrderId: string
  projectId?: string
}

export const WOTransactionsTable = React.forwardRef((props: TransactionProps, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedTransactionName, setSelectedTransactionName] = useState<string>('')
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.transaction)
  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(
    TRANSACTION_TABLE_COLUMNS.filter(col => col['accessorKey'] !== 'workOrderId'),
    TableNames.transaction,
  )
  const { refetch, transactions, isLoading } = useWOTransactionsV1(
    props.workOrderId,
    projectId ? projectId : props.projectId,
  )
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
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

  useEffect(() => {
    setTotalPages(Math.ceil((transactions?.length ?? 0) / 50))
    setTotalRows(transactions?.length ?? 0)
  }, [transactions])

  const setPageCount = rows => {
    setTotalPages(Math.ceil((rows?.length ?? 0) / 50))
    setTotalRows(rows?.length)
  }

  const { isVendor } = useUserRolesSelector()

  return (
    <>
      {isLoading && (
        <Center minH="calc(100vh - 450px)">
          <Spinner size="lg" />
        </Center>
      )}
      {transactions && (
        <Box
          w="100%"
          minH={isVendor ? 'calc(100vh - 420px)' : 'calc(100vh - 420px)'}
          position="relative"
          borderRadius="6px"
          border="1px solid #CBD5E0"
          overflowX="auto"
          roundedRight={{ base: '0px', sm: '6px' }}
        >
          <TableContextProvider
            totalPages={transactions?.length ? totalPages : -1}
            data={transactions}
            columns={tableColumns}
            manualPagination={false}
          >
            <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !transactions?.length} />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportButton columns={tableColumns} refetch={refetch} isLoading={isLoading} fileName="transactions" />
                <CustomDivider />
                {settingColumns && (
                  <TableColumnSettings
                    refetch={refetchColumns}
                    disabled={isLoading}
                    onSave={onSave}
                    columns={settingColumns?.filter(t => !!t.contentKey)}
                  />
                )}
              </ButtonsWrapper>
              <TablePagination>
                <ShowCurrentRecordsWithTotalRecords dataCount={totalRows} setPageCount={setPageCount} />
                <GotoFirstPage />
                <GotoPreviousPage />
                <GotoNextPage />
                <GotoLastPage />
              </TablePagination>
            </TableFooter>
          </TableContextProvider>
        </Box>
      )}

      <UpdateTransactionModal
        isOpen={isOpenEditModal}
        onClose={onEditModalClose}
        heading={selectedTransactionName as string}
        selectedTransactionId={selectedTransactionId as number}
        projectId={projectId as string}
        projectStatus={props?.projectStatus as string}
        screen="WORK_ORDER_TRANSACTION_TABLE_MODAL"
      />
      <TransactionDetailsModal
        isOpen={isOpenTransactionDetailsModal}
        onClose={onTransactionDetailsModalClose}
        selectedTransactionId={selectedTransactionId as number}
      />
    </>
  )
})
