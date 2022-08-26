import React, { useCallback, useState } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure, HStack, Divider } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import TableColumnSettings from 'components/table/table-column-settings'
import { TableWrapper } from 'components/table/table'
import { useOverPaymentTransaction, useTransactionExport } from 'utils/transactions'
import { useParams } from 'react-router'
import { dateFormat } from 'utils/date-time-utils'
import UpdateTransactionModal from './update-transaction-modal'
import { TransactionDetailsModal } from './transaction-details-modal'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import Status from '../status'
import { ExportButton } from 'components/table-refactored/export-button'
import { TransactionTypeValues } from 'types/transaction.type'

const OverpaymentTransactionRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: 'gray.50',
      }}
      {...row.getRowProps({
        style,
      })}
      onClick={event => onRowClick(event, row)}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
            <Flex alignItems="center" h="60px" pl="2">
              <Text
                fontSize="14px"
                fontStyle="normal"
                fontWeight={400}
                noOfLines={1}
                title={cell.value}
                mt="10px"
                mb="10px"
                padding="0 15px"
                color="#4A5568"
              >
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

export const OverPaymentTransactionsTable = React.forwardRef((props, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedTransactionName, setSelectedTransactionName] = useState<string>('')
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.transaction)
  const { transactions = [], isLoading } = useOverPaymentTransaction(TransactionTypeValues.overpayment)
  const { t } = useTranslation()
  const { tableColumns, settingColumns } = useTableColumnSettings(
    [
      {
        Header: 'ID',
        accessor: 'name',
      },
      {
        Header: 'Type' as string,
        accessor: 'transactionTypeLabel',
      },
      {
        Header: 'Trade' as string,
        accessor: 'skillName',
      },
      {
        Header: 'Total Amount' as string,
        accessor: 'transactionTotal',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.transactionTotal).format('$0,0.00')
        },
      },
      {
        Header: 'Transaction Status' as string,
        accessor: 'status',
        Cell: ({ value, row }) => <Status value={value} id={row.original.status} />,
      },
      {
        Header: 'Submit' as string,
        accessor: 'modifiedDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
        getCellExportValue(row) {
          return dateFormat(row.original.modifiedDate)
        },
      },
      {
        Header: 'Approved By' as string,
        accessor: 'approvedBy',
      },
    ],
    TableNames.transaction,
  )

  const { isOpen: isOpenEditModal, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const {
    isOpen: isOpenTransactionDetailsModal,
    onOpen: onTransactionDetailsModalOpen,
    onClose: onTransactionDetailsModalClose,
  } = useDisclosure()
  const { exportData } = useTransactionExport(projectId)
  const onRowClick = useCallback(
    (_, row) => {
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
      <Box>
        <Box h="100%" overflow={'auto'}>
          <TableWrapper
            isLoading={isLoading}
            columns={tableColumns}
            data={transactions}
            TableRow={OverpaymentTransactionRow}
            tableHeight="calc(100vh - 300px)"
            setTableInstance={() => {}}
            name="transaction-table"
            onRowClick={onRowClick}
          />
        </Box>
        <Flex justifyContent="flex-end">
          <HStack bg="white" border="1px solid #E2E8F0" rounded="0 0 6px 6px" spacing={0}>
            <ExportButton columns={[]} data={exportData} colorScheme="brand" />
            <Divider orientation="vertical" border="1px solid" h="20px" />
            {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
          </HStack>
        </Flex>
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
