import React, { useCallback, useState } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure, Tag, TagLabel } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useTransactions } from 'utils/transactions'
import { useParams } from 'react-router'
import { dateFormat } from 'utils/date-time-utils'
import { UpdateTransactionModal } from './add-update-transaction'
import { TransactionTypeValues } from 'types/transaction.type'
import { TransactionDetailsModal } from './transaction-details-modal'
import { t } from 'i18next'

const STATUS_TAG_COLOR_SCHEME = {
  denied: {
    bg: 'purple.100',
    color: 'purple.600',
  },

  approved: {
    bg: '#E7F8EC',
    color: '#2AB450',
  },
  cancelled: {
    bg: 'red.100',
    color: 'red.400',
  },

  pending: {
    bg: '#FEEBCB',
    color: '#C05621',
  },
}

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'name',
  },
  {
    Header: t('type'),
    accessor: 'transactionTypeLabel',
  },
  {
    Header: t('trade'),
    accessor: 'skillName',
  },
  {
    Header: t('totalAmount'),
    accessor: 'transactionTotal',
  },
  {
    Header: t('status'),
    accessor: 'status',
    Cell(cellInfo) {
      const value = (cellInfo.value || '').toLowerCase()
      return (
        <Tag rounded="6px" textTransform="capitalize" size="md" {...STATUS_TAG_COLOR_SCHEME[value]}>
          <TagLabel fontWeight={400} fontSize="14px" fontStyle="normal" lineHeight="20px" p="3px">
            {value}
          </TagLabel>
        </Tag>
      )
    },
  },
  {
    Header: t('submit'),
    accessor: 'modifiedDate',
    Cell({ value }) {
      return <Box>{dateFormat(value)}</Box>
    },
  },
  {
    Header: t('approvedBy'),
    accessor: 'approvedBy',
  },
]

const TransactionRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
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
                noOfLines={2}
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

export const TransactionsTable = React.forwardRef((props, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const { transactions = [], isLoading } = useTransactions(projectId)
  const { columns } = useColumnWidthResize(COLUMNS, ref)
  const { isOpen: isOpenEditModal, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const {
    isOpen: isOpenTransactionDetailsModal,
    onOpen: onTransactionDetailsModalOpen,
    onClose: onTransactionDetailsModalClose,
  } = useDisclosure()

  const onRowClick = useCallback(
    (_, row) => {
      const { original } = row
      const isEditableByVendorTransactionType =
        original.transactionType === TransactionTypeValues.changeOrder ||
        original.transactionType === TransactionTypeValues.draw

      setSelectedTransactionId(original.id)

      if (original.status === 'PENDING' && isEditableByVendorTransactionType) {
        onEditModalOpen()
      } else {
        onTransactionDetailsModalOpen()
      }
    },
    [onEditModalOpen, onTransactionDetailsModalOpen],
  )

  return (
    <Box h="100%">
      <ReactTable
        isLoading={isLoading}
        columns={columns}
        data={transactions}
        TableRow={TransactionRow}
        tableHeight="calc(100vh - 400px)"
        name="transaction-table"
        onRowClick={onRowClick}
      />

      <UpdateTransactionModal
        isOpen={isOpenEditModal}
        onClose={onEditModalClose}
        selectedTransactionId={selectedTransactionId as number}
      />
      <TransactionDetailsModal
        isOpen={isOpenTransactionDetailsModal}
        onClose={onTransactionDetailsModalClose}
        selectedTransactionId={selectedTransactionId as number}
      />
    </Box>
  )
})
