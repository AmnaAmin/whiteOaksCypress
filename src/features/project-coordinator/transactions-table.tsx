import React from 'react'
import { Box, Td, Tr, Text, Flex, Tag } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from '../../components/table/react-table'
// import { useTransactions } from 'utils/transactions'
import { dateFormat } from 'utils/date-time-utils'
import { t } from 'i18next'

const STATUS_TAG_COLOR_SCHEME = {
  denied: {
    bg: 'purple.100',
    color: 'purple.600',
  },

  approved: {
    bg: 'green.100',
    color: 'green.600',
  },
  cancelled: {
    bg: 'red.100',
    color: 'red.400',
  },

  pending: {
    bg: 'orange.100',
    color: 'orange.600',
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
      return (
        <Tag
          textTransform="capitalize"
          fontWeight={500}
          fontSize="12px"
          rounded="6px"
          fontStyle="normal"
          lineHeight="16px"
          size="lg"
          {...STATUS_TAG_COLOR_SCHEME[(cellInfo.value || '').toLowerCase()]}
        >
          {cellInfo.value}
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
              <Text noOfLines={2} title={cell.value} padding="0 15px" color="blackAlpha.700">
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
  // const { projectId } = useParams<{ projectId: string }>()
  const { columns } = useColumnWidthResize(COLUMNS, ref)

  return (
    <Box h="100%">
      <ReactTable
        columns={columns}
        data={[]}
        TableRow={TransactionRow}
        tableHeight="calc(100vh - 400px)"
        name="transaction-table"
        // onRowClick={onRowClick}
      />
    </Box>
  )
})
