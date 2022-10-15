import numeral from 'numeral'
import React from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { percentageFormatter } from 'utils/string-formatters'
import { isDefined } from 'utils'
import { Box } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'

type WorkOrderFinancialOverviewTableProps = {
  financialOveriewTableData: any
  projectTotalCostNumber: number
  isLoading: boolean
}

const getTotalOfKey = (key: string, financialOveriewTableData) => {
  return financialOveriewTableData.reduce((sum, row) => {
    return row[key] + sum
  }, 0)
}

export const WorkOrderFinancialOverviewTable = React.forwardRef((props: WorkOrderFinancialOverviewTableProps, ref) => {
  const { isLoading, financialOveriewTableData, projectTotalCostNumber } = props
  const { tableColumns } = useTableColumnSettings(
    [
      {
        header: 'Vendor',
        footer: '',
        accessorKey: 'vendorName',
      },
      {
        header: 'Trade',
        footer: 'Total',
        accessorKey: 'skillName',
      },
      {
        header: 'Client Approved Amount',
        accessorKey: 'originalAmount',
        accessorFn(row) {
          return numeral(row.originalAmount).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('originalAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Final Client Approved Amount',
        accessorKey: 'newAmount',
        accessorFn(row) {
          return numeral(row.newAmount).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('newAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Original Vendor WOs',
        accessorKey: 'workOrderOriginalAmount',
        accessorFn(row) {
          return numeral(row.workOrderOriginalAmount).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('workOrderOriginalAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Revised Vendor WOs',
        accessorKey: 'revisedVendorWorkOrder',
        accessorFn(row) {
          return numeral(row.revisedVendorWorkOrder).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('revisedVendorWorkOrder', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'COs',
        accessorKey: 'changeOrder',
        accessorFn(row) {
          return numeral(row.changeOrder).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('changeOrder', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Revised COs',
        accessorKey: 'revisedChangeOrder',
        accessorFn(row) {
          return numeral(row.revisedChangeOrder).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('revisedChangeOrder', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Final Vendor WOs',
        accessorKey: 'workOrderNewAmount',
        accessorFn(row) {
          return numeral(row.workOrderNewAmount).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('workOrderNewAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Draws',
        accessorKey: 'draw',
        accessorFn(row) {
          return numeral(row.draw).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('draw', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Materials',
        accessorKey: 'material',
        accessorFn(row) {
          return numeral(row.material).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('material', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Vendor Payment',
        accessorKey: 'vendorPaymentPercentage',
        accessorFn(row) {
          return isDefined(row.vendorPaymentPercentage) ? numeral(percentageFormatter(row.value)).format('0.00%') : ''
        },
        footer: props => {
          const vendorPaymentPercentage =
            ((Math.abs(getTotalOfKey('material', financialOveriewTableData)) +
              Math.abs(getTotalOfKey('draw', financialOveriewTableData))) /
              projectTotalCostNumber) *
            100
          return isDefined(vendorPaymentPercentage)
            ? numeral(percentageFormatter(vendorPaymentPercentage)).format('0.00%')
            : ''
        },
      },
      {
        header: 'Invoiced Amount',
        accessorKey: 'accountPayable',
        accessorFn(row) {
          return numeral(row.accountPayable).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('accountPayable', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: 'Profit',
        accessorKey: 'profit',
        accessorFn(row) {
          return numeral(row.profit).format('$0,0.00')
        },
        footer: props => {
          const total = getTotalOfKey('profit', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
    ],
    TableNames.projectFinancialOverview,
  )

  return (
    <Box overflow={'auto'} w="100%" maxH="350px" position="relative">
      <TableContextProvider data={financialOveriewTableData} columns={tableColumns}>
        <Table
          isLoading={isLoading}
          isEmpty={!isLoading && !financialOveriewTableData?.length}
          isHideFilters
          isShowFooter
        />
      </TableContextProvider>
    </Box>
  )
})
