import React, { useCallback, useEffect, useState } from 'react'
import { Box, Center, Spinner, useDisclosure } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import { useTransactionsV1 } from 'api/transactions'
import { useParams } from 'react-router'
import UpdateTransactionModal from './update-transaction-modal'
import { TransactionDetailsModal } from './transaction-details-modal'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { ExportButton } from 'components/table-refactored/export-button'
import {
  mapDataForExpandableRows,
  mapIndexForExpendingTransRow,
  TRANSACTION_TABLE_COLUMNS,
} from 'features/project-details/transactions/transaction.constants'
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
import { TransactionType, TransactionTypeValues } from 'types/transaction.type'
import InvoiceModal from 'features/update-project-details/add-invoice-modal'
import { Project } from 'types/project.type'

type TransactionProps = {
  projectStatus: string
  defaultSelected?: TransactionType
  transId?: any
  isVendorExpired?: boolean
  isReadOnly?: boolean
  projectData?: Project | undefined
}

export const TransactionsTable = React.forwardRef((props: TransactionProps, ref) => {
  // const { isVendorExpired } = props
  const { projectId } = useParams<'projectId'>()
  const { isOpen: isOpenInvoiceModal, onClose: onInvoiceModalClose, onOpen: onInvoiceModalOpen } = useDisclosure()
  const { defaultSelected, projectData } = props
  const [dataTrans, setDataTrans] = useState<any>([])
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedTransactionName, setSelectedTransactionName] = useState<string>('')
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.transaction)
  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(TRANSACTION_TABLE_COLUMNS, TableNames.transaction)
  const { refetch, transactions, isLoading } = useTransactionsV1(projectId)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const { isOpen: isOpenEditModal, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const {
    isOpen: isOpenTransactionDetailsModal,
    onOpen: onTransactionDetailsModalOpen,
    onClose: onTransactionDetailsModalClose,
  } = useDisclosure()
  const [expandedState, setExpandedState] = useState({})

  useEffect(() => {
    if (defaultSelected?.id) {
      setSelectedTransactionId(defaultSelected?.id)
      setSelectedTransactionName(defaultSelected?.name)
      onEditModalOpen()
    }
  }, [defaultSelected])

  const onRowClick = useCallback(
    row => {
      if (row?.transactionType === TransactionTypeValues.invoice) {
        setSelectedInvoice(row?.invoiceId)
        onInvoiceModalOpen()
      } else {
        setSelectedTransactionName(row.name)
        setSelectedTransactionId(row.id)
        onEditModalOpen()
      }
    },
    [onEditModalOpen, onTransactionDetailsModalOpen],
  )
  const onSave = columns => {
    postGridColumn(columns)
  }

  useEffect(() => {
    if (props.transId) {
      mapIndexForExpendingTransRow(props.transId, dataTrans, setExpandedState)
    }
  }, [props.transId])

  useEffect(() => {
    if (!transactions?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((transactions?.length ?? 0) / 50))
      setTotalRows(transactions?.length ?? 0)
    }
  }, [transactions])

  const setPageCount = rows => {
    if (!rows?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((rows?.length ?? 0) / 50))
      setTotalRows(rows?.length ?? 0)
    }
  }

  // sort the array and specify that the value with parentWorkOrder null comes before all other values, and that all other values are equal
  const sortTransData = data => {
    if (data && data?.length > 0) {
      data.sort((x, y) => {
        return x?.parentWorkOrderId === null ? -1 : y?.parentWorkOrderId === null ? 1 : 0
      })
      return data
    } else return []
  }

  useEffect(() => {
    if (transactions && transactions?.length > 0) {
      setDataTrans(mapDataForExpandableRows(transactions as any, isVendor as boolean))
    }
  }, [transactions])

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
          minH={isVendor ? 'calc(100vh - 370px)' : 'calc(100vh - 510px)'}
          position="relative"
          borderRadius="6px"
          border="1px solid #CBD5E0"
          overflowX="auto"
          roundedRight={{ base: '0px', sm: '6px' }}
        >
          <TableContextProvider
            totalPages={transactions?.length ? totalPages : -1}
            data={sortTransData(dataTrans)}
            columns={tableColumns}
            manualPagination={false}
            isExpandable={true}
            expandedState={expandedState}
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
                    columns={settingColumns?.filter(t => !!t.contentKey)} //Adding this check to avoid 'Expander' column from showing in the settings.
                    tableName={TableNames.transaction}
                    isReadOnly={props?.isReadOnly}
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
      />
      <TransactionDetailsModal
        isOpen={isOpenTransactionDetailsModal}
        onClose={onTransactionDetailsModalClose}
        selectedTransactionId={selectedTransactionId as number}
      />
      <InvoiceModal
        isOpen={isOpenInvoiceModal}
        onClose={() => {
          setSelectedInvoice(null)
          onInvoiceModalClose()
        }}
        projectData={projectData}
        selectedInvoice={selectedInvoice}
      />
    </>
  )
})
