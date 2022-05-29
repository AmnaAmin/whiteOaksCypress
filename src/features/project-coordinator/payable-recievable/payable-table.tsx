import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import ReactTable, { RowProps } from 'components/table/react-table'
import data from './moc-data.json'
import { Column } from 'react-table'

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
type ProjectProps = {
  payableColumns: Column[]
  resizeElementRef?: any
  setTableInstance: (tableInstance: any) => void
}
export const PayableTable: React.FC<ProjectProps> = ({ setTableInstance, payableColumns, resizeElementRef }) => {
  // const { columns } = useColumnWidthResize([
  //   {
  //     Header: 'Id',
  //     accessor: 'id',
  //   },
  //   {
  //     Header: 'Vendor Name',
  //     accessor: 'vendorName',
  //   },
  //   {
  //     Header: 'Property Address',
  //     accessor: 'propertyAddress',
  //   },
  //   {
  //     Header: 'Vendor Address',
  //     accessor: 'vendorAddress',
  //   },
  //   {
  //     Header: 'Payment Terms',
  //     accessor: 'paymentTerms',
  //   },
  //   {
  //     Header: 'Expected pay date',
  //     accessor: 'expectedPayDate',
  //   },
  //   {
  //     Header: 'Final Invoice',
  //     accessor: 'finalInvoice',
  //   },

  //   {
  //     Header: 'Markets',
  //     accessor: 'markets',
  //   },
  //   {
  //     Header: 'WO Start Date',
  //     accessor: 'woStarteDate',
  //   },
  //   {
  //     Header: 'WO Completed Date',
  //     accessor: 'woCompleteDate',
  //   },
  //   {
  //     Header: 'WO Issue Date',
  //     accessor: 'woIssueDate',
  //   },
  //   {
  //     Header: 'Checkbox',
  //     accessor: 'checkbox',
  //   },
  // ])

  return (
    <Box overflow="auto" width="100%">
      <ReactTable
        columns={payableColumns}
        setTableInstance={setTableInstance}
        data={data}
        TableRow={payableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  )
}
