import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'

const receivableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
      }}
      onClick={e => {
        if (onRowClick) {
          onRowClick(e, row)
        }
      }}
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
            <Flex alignItems="center" h="60px">
              <Text noOfLines={2} title={cell.value} padding="0 15px" color="blackAlpha.600">
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

export const ReceivableTable = React.forwardRef((props: any, ref) => {
  const { columns } = useColumnWidthResize(
    [
      {
        Header: 'Id',
        accessor: 'Id',
      },
      {
        Header: 'Client',
        accessor: 'Client',
      },
      {
        Header: 'Address',
        accessor: 'Address',
      },
      {
        Header: 'terms',
        accessor: 'terms',
      },
      {
        Header: 'Payment Terms',
        accessor: 'Payment Terms',
      },
      {
        Header: 'Expected pay date',
        accessor: 'Expected pay date',
      },
      {
        Header: 'Balance',
        accessor: 'Balance',
      },
      {
        Header: 'final invoice',
        accessor: 'final invoice',
      },
      {
        Header: 'Markets',
        accessor: 'Markets',
      },
      {
        Header: 'WO Invoice Date',
        accessor: 'WO Invoice Date',
      },
      {
        Header: 'PO No',
        accessor: 'PO No',
      },
      {
        Header: 'WO No',
        accessor: 'WO No',
      },
      {
        Header: 'Invoice No',
        accessor: 'Invoice No',
      },
      {
        Header: ' Checkbox',
        accessor: ' Checkbox',
      },
    ],
    ref,
  )

  return (
    <Box overflow="auto" width="100%">
      <ReactTable
        onRowClick={props.onRowClick}
        columns={columns}
        data={[]}
        TableRow={receivableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  )
})
