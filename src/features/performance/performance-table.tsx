import React, { useEffect, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import numeral from 'numeral'
import { PerformanceType } from 'types/performance.type'
import PerformanceModal from './performance-modal'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { ColumnDef } from '@tanstack/react-table'
import { PERFORMANCE } from './performance.i18n'
import { ExportButton } from 'components/table-refactored/export-button'
import { TableFooter } from 'components/table-refactored/table-footer'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { removeCurrencyFormat } from 'utils/string-formatters'

export const PerformanceTable = React.forwardRef((props: any, ref) => {
  const { performance, isPerformanceTableLoading, defaultSelected } = props

  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<PerformanceType>()

  useEffect(() => {
    if (defaultSelected?.[0]?.userId) {
      setSelectedUser(defaultSelected?.[0])
      onOpen()
    }
  }, [defaultSelected])

  const PERFORMANCE_COLUMNS: ColumnDef<any>[] = [
    {
      header: `${PERFORMANCE}.name` as string,
      accessorKey: 'name',
    },
    {
      header: `${PERFORMANCE}.month` as string,
      accessorKey: 'monthName',
    },
    {
      header: `${PERFORMANCE}.revenue`,
      accessorKey: 'revenue',
      filterFn: 'includesString',
      accessorFn(cellInfo: any) {
        const value = cellInfo?.revenue as string
        const formattedVal = numeral(value).format('$0,0.00')
        return removeCurrencyFormat(formattedVal)
      },
      cell: (row: any) => {
        const value = row.cell.getValue() as string
        return numeral(value).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    {
      header: `${PERFORMANCE}.profit`,
      accessorKey: 'profit',
      filterFn: 'includesString',
      accessorFn(cellInfo: any) {
        const value = cellInfo?.profit as string
        const formattedVal = numeral(value).format('$0,0.00')
        return removeCurrencyFormat(formattedVal)
      },
      cell: (row: any) => {
        const value = row.cell.getValue() as string
        return numeral(value).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    {
      header: `${PERFORMANCE}.bonus`,
      accessorKey: 'currentBonus',
      filterFn: 'includesString',
      accessorFn(cellInfo: any) {
        const value = cellInfo?.currentBonus as string
        const formattedVal = numeral(value).format('$0,0.00')
        return removeCurrencyFormat(formattedVal)
      },
      cell: (row: any) => {
        const value = row.cell.getValue() as string
        return numeral(value).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    {
      header: `${PERFORMANCE}.margin`,
      accessorKey: 'marginPercentage',
      accessorFn(row) {
        return numeral(row.marginPercentage / 100).format('0.00%')
      },
    },
    {
      header: `${PERFORMANCE}.target`,
      accessorKey: 'target',
      filterFn: 'includesString',
      accessorFn(cellInfo: any) {
        const value = cellInfo?.target as string
        const formattedVal = numeral(value).format('$0,0.00')
        return removeCurrencyFormat(formattedVal)
      },
      cell: (row: any) => {
        const value = row.cell.getValue() as string
        return numeral(value).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
    // {
    //   header: 'Badge',
    //   accessorKey: 'badge',
    //   cell: (row: any) => {
    //     const value = row.cell.getValue()
    //     return <Badge value={value} id={value} />
    //   },
    // },
    {
      header: `${PERFORMANCE}.disqualifiedRevenue`,
      accessorKey: 'disqualifiedRevenue',
      accessorFn(cellInfo: any) {
        const value = cellInfo?.disqualifiedRevenue as string
        const formattedVal = numeral(value).format('$0,0.00')
        return removeCurrencyFormat(formattedVal)
      },
      cell: (row: any) => {
        const value = row.cell.getValue() as string
        return numeral(value).format('$0,0.00')
      },
      meta: { format: 'currency' },
    },
  ]
  const { tableColumns } = useTableColumnSettings(PERFORMANCE_COLUMNS, TableNames.performance)

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
        <TableContextProvider data={performance} columns={tableColumns}>
          <Table
            onRowClick={row => {
              setSelectedUser(row)
              onOpen()
            }}
            isLoading={isPerformanceTableLoading}
            isEmpty={!isPerformanceTableLoading && !performance?.length}
          />
          <TableFooter>
            <Box>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="performance"
                isLoading={isPerformanceTableLoading}
                fetchedData={performance}
              />
            </Box>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
})
