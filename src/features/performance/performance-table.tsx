import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { usePerformance } from 'api/performance'
import numeral from 'numeral'
import { PerformanceType } from 'types/performance.type'
import PerformanceModal from './performance-modal'

const performanceTableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
              <Text isTruncated title={cell.value} padding="0 15px">
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

export const PerformanceTable = React.forwardRef((props: any, ref) => {
  const { data: performance } = usePerformance()
  const [selectedUser, setSelectedUser] = useState<PerformanceType>()
  
  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'Name' as string,
        accessor: 'name',
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.revenue).format('$0,0.00')
        },
      },
      {
        Header: 'Profit',
        accessor: 'profit',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.profit).format('$0,0.00')
        },
      },
      {
        Header: 'Target',
        accessor: 'target',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.target).format('$0,0.00')
        },
      },
      {
        Header: 'Badge',
        accessor: 'badge',
      },
      {
        Header: 'Disqualified Revenue',
        accessor: 'disqualifiedRevenue',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.disqualifiedRevenue).format('$0,0.00')
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef} height={'450px'}>
      <PerformanceModal
        PerformanceDetails={selectedUser as PerformanceType}
        onClose={() => {
          setSelectedUser(undefined)
        }}
      />

      <TableWrapper
        columns={columns}
        data={performance || []}
        TableRow={performanceTableRow}
        tableHeight="calc(100vh - 225px)"
        name="performance-table"
        onRowClick={(e, row) => setSelectedUser(row.original)}
      />
    </Box>
  )
})
