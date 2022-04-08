import React from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure, Tag, TagLabel } from '@chakra-ui/react'
import ReactTable, { RowProps } from 'components/table/react-table'
// import { useTransactions } from 'utils/transactions'
import { dateFormat } from 'utils/date-time-utils'

import { t } from 'i18next'
import { Column } from 'react-table'

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

export const COLUMNS = [
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

const TransactionRow: React.FC<RowProps> = ({ row, style }) => {
  const idCell = row.cells.find(cell => cell.column.id === 'id')
  const projectId = idCell?.value

  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
        '& > td > a': {
          color: '#333',
        },
      }}
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map((cell, index) => {
        return (
          <Td {...cell.getCellProps()} key={`row_${index}`} p="0" bg="transparent">
            <Flex alignItems="center" h="72px" pl="3">
              <Text
                noOfLines={2}
                title={cell.value}
                padding="0 15px"
                color="gray.600"
                mb="20px"
                mt="10px"
                fontSize="14px"
                fontStyle="normal"
                fontWeight="400"
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

type TransactionProps = {
  projectColumns: Column[]
  resizeElementRef: any
  setTableInstance: (tableInstance: any) => void
}
export const TransactionsTable: React.FC<TransactionProps> = ({
  setTableInstance,
  projectColumns,
  resizeElementRef,
}) => {
  return (
    <Box ref={resizeElementRef} height="100%">
      <ReactTable
        // isLoading={isLoading}
        columns={projectColumns}
        data={[]}
        TableRow={TransactionRow}
        name="my-table"
        setTableInstance={setTableInstance}
        tableHeight={'inherit'}
      />
    </Box>
  )
}
