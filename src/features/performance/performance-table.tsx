import React, { useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import numeral from 'numeral'
import { PerformanceType } from 'types/performance.type'
import PerformanceModal from './performance-modal'
import Badge from 'features/common/badge'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { ColumnDef } from '@tanstack/react-table'

export const PerformanceTable = React.forwardRef((props: any, ref) => {
  const { performance, isPerformanceTableLoading } = props

  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<PerformanceType>()

  const PERFORMANCE_COLUMNS: ColumnDef<any>[] = [
    {
      header: 'Name' as string,
      accessorKey: 'name',
    },
    {
      header: 'Revenue',
      accessorKey: 'revenue',
      accessorFn(row) {
        return numeral(row.revenue).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    {
      header: 'Profit',
      accessorKey: 'profit',
      accessorFn(row) {
        return numeral(row.profit).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    {
      header: 'Margin %',
      accessorKey: 'marginPercentage',
      accessorFn(row) {
        return numeral(row.marginPercentage / 100).format('0.00%')
      },
    },
    {
      header: 'Target',
      accessorKey: 'target',
      accessorFn(row) {
        return numeral(row.target).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    {
      header: 'Badge',
      accessorKey: 'badge',
      cell: (row: any) => {
        const value = row.cell.getValue()
        return <Badge value={value} id={value} />
      },
    },
    {
      header: 'Disqualified Revenue',
      accessorKey: 'disqualifiedRevenue',
      accessorFn(cellInfo) {
        return numeral(cellInfo.disqualifiedRevenue).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
  ]

  return (
    <Box overflowX={'auto'} minH="calc(100vh - 370px)" pb="2">
      {isOpen && selectedUser && (
        <PerformanceModal
          performanceDetails={selectedUser as PerformanceType}
          onClose={() => {
            setSelectedUser(undefined)
            onCloseDisclosure()
          }}
          isOpen={isOpen}
        />
      )}
      <Box overflowX={'auto'} minH="calc(100vh - 370px)" border="1px solid #CBD5E0" borderTopRadius="6px">
        <TableContextProvider data={performance} columns={PERFORMANCE_COLUMNS}>
          <Table
            onRowClick={row => {
              setSelectedUser(row)
              onOpen()
            }}
            isLoading={isPerformanceTableLoading}
            isEmpty={!isPerformanceTableLoading && !performance?.length}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
})
