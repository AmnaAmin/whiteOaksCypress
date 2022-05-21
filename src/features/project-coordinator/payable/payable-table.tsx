import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'

const payableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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

export const PayableTable = React.forwardRef((props: any, ref) => {
  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'Id',
        accessor: 'Id',
      },
      {
        Header: 'Vendor Name',
        accessor: 'Vendor Name',
      },
      {
        Header: 'Property Address',
        accessor: 'Property Address',
      },
      {
        Header: 'Vendor Address',
        accessor: 'Vendor Address',
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
        Header: 'Final Invoice',
        accessor: 'Final Invoice',
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <ReactTable
        onRowClick={props.onRowClick}
        columns={columns}
        data={[]}
        TableRow={payableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  )
})
