import React, { useCallback, useState } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure, HStack, Button, Icon, Divider } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { TableWrapper } from 'components/table/table'
import { RowProps } from 'components/table/react-table'
import { useTransactions } from 'utils/transactions'
import { useParams } from 'react-router'
import { dateFormat } from 'utils/date-time-utils'
import UpdateTransactionModal from './update-transaction-modal'
import { TransactionDetailsModal } from './transaction-details-modal'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import Status from '../status'
import { BiExport } from 'react-icons/bi'
import { FaAtom } from 'react-icons/fa'

const TransactionRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
  const { t } = useTranslation()

  const { columns } = useColumnWidthResize(
    [
      {
        Header: 'ID',
        accessor: 'name',
      },
      {
        Header: t('type') as string,
        accessor: 'transactionTypeLabel',
      },
      {
        Header: t('trade') as string,
        accessor: 'skillName',
      },
      {
        Header: t('totalAmount') as string,
        accessor: 'transactionTotal',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0[.]00')
        },
      },
      {
        Header: t('transactionStatus') as string,
        accessor: 'status',
        //@ts-ignore
        Cell: ({ value, row }) => <Status value={value} id={row.original.status} />,
      },
      {
        Header: t('submit') as string,
        accessor: 'modifiedDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
      },
      {
        Header: t('approvedBy') as string,
        accessor: 'approvedBy',
      },
    ],
    ref,
  )

  const { isOpen: isOpenEditModal, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const {
    isOpen: isOpenTransactionDetailsModal,
    onOpen: onTransactionDetailsModalOpen,
    onClose: onTransactionDetailsModalClose,
  } = useDisclosure()

  const onRowClick = useCallback(
    (_, row) => {
      const { original } = row

      setSelectedTransactionId(original.id)

      onEditModalOpen()
    },
    [onEditModalOpen, onTransactionDetailsModalOpen],
  )

  console.log(`table data - `, transactions);
  return (
    <Box h="100%">
      <TableWrapper
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
      <Flex justifyContent="end">
        <HStack bg="white" border="1px solid #E2E8F0" rounded="0 0 6px 6px" spacing={0}>
          <Button variant="ghost" colorScheme="brand" m={0}>
            <Icon as={BiExport} fontSize="18px" mr={1} />
            {t('export')}
          </Button>
          <Divider orientation="vertical" border="1px solid" h="20px" />
          <Button variant="ghost" colorScheme="brand" m={0}>
            <Icon as={FaAtom} fontSize="18px" mr={1} />
            {t('settings')}
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
})
