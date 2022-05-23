import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import data from './moc-data-receivable.json'

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

export const ReceivableTable: React.FC<{ setTableInstance: (tableInstance: any) => void }> = React.forwardRef(
  (props, ref) => {
    const { columns } = useColumnWidthResize(
      [
        {
          Header: 'Id',
          accessor: 'id',
        },
        {
          Header: 'Client',
          accessor: 'client',
        },
        {
          Header: 'Address',
          accessor: 'streetAddress',
        },
        {
          Header: 'terms',
          accessor: 'terms',
        },
        {
          Header: 'Payment Terms',
          accessor: 'paymentTerms',
        },
        {
          Header: 'Expected pay date',
          accessor: 'expectedPayDate',
        },
        {
          Header: 'Balance',
          accessor: 'balance',
        },
        {
          Header: 'final invoice',
          accessor: 'finalInvoice',
        },
        {
          Header: 'Markets',
          accessor: 'markets',
        },
        {
          Header: 'WO Invoice Date',
          accessor: 'woInvoiceDate',
        },
        {
          Header: 'PO No',
          accessor: 'poNumber',
        },
        {
          Header: 'WO No',
          accessor: 'woNumber',
        },
        {
          Header: 'Invoice No',
          accessor: 'invoiceNumber',
        },
        {
          Header: ' Checkbox',
          accessor: ' checkbox',
        },
      ],
      ref,
    )

    console.log(data)

    return (
      <Box overflow="auto" width="100%">
        <ReactTable
          columns={columns}
          setTableInstance={props.setTableInstance}
          data={data}
          TableRow={receivableRow}
          tableHeight="calc(100vh - 300px)"
          name="alerts-table"
        />
      </Box>
    )
  },
)
