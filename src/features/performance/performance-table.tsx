import React, { useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { usePerformance } from 'api/performance'
import numeral from 'numeral'
import { PerformanceType } from 'types/performance.type'
import PerformanceModal from './performance-modal'
import Badge from 'features/common/badge'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { ColumnDef } from '@tanstack/react-table'

export const PerformanceTable = React.forwardRef((props: any, ref) => {
  const { data: performance, isLoading } = usePerformance()
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
    },
    {
      header: 'Profit',
      accessorKey: 'profit',
      accessorFn(row) {
        return numeral(row.profit).format('$0,0.00')
      },
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
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
  ]

  return (
    <Box overflow={'auto'} h="calc(100vh - 320px)">
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
      <Box overflow={'auto'} h="calc(100vh - 320px)" roundedTop={6}>
        <TableContextProvider data={performance || []} columns={PERFORMANCE_COLUMNS}>
          <Table
            onRowClick={row => {
              setSelectedUser(row)
              onOpen()
            }}
            isLoading={isLoading}
            isEmpty={!isLoading && !performance?.length}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
})
