import numeral from 'numeral'
import React from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { percentageFormatter } from 'utils/string-formatters'
import { isDefined } from 'utils'
import { Box } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { TRANSACTION } from '../transactions/transactions.i18n'

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
        header: `${TRANSACTION}.vendor`,
        footer: '',
        accessorKey: 'vendorName',
      },
      {
        header: `${TRANSACTION}.trade`,
        footer: 'Total',
        accessorKey: 'skillName',
      },
      {
        header: `${TRANSACTION}.clientApprovedAmount`,
        accessorKey: 'originalAmount',
        accessorFn(row) {
          return numeral(row.originalAmount).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('originalAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.finalClientApprovedAmount`,
        accessorKey: 'newAmount',
        accessorFn(row) {
          return numeral(row.newAmount).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('newAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.originalVendorWO`,
        accessorKey: 'workOrderOriginalAmount',
        accessorFn(row) {
          return numeral(row.workOrderOriginalAmount).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('workOrderOriginalAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      // {
      //   header: `${TRANSACTION}.revisedVendorWO`,
      //   accessorKey: 'revisedVendorWorkOrder',
      //   accessorFn(row) {
      //     return numeral(row.revisedVendorWorkOrder).format('$0,0.00')
      //   },
      //   footer: props => {
      //     const total = getTotalOfKey('revisedVendorWorkOrder', financialOveriewTableData)

      //     return numeral(total).format('$0,0.00')
      //   },
      // },
      {
        header: `${TRANSACTION}.COs`,
        accessorKey: 'changeOrder',
        accessorFn(row) {
          return numeral(row.changeOrder).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('changeOrder', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      // {
      //   header: `${TRANSACTION}.revisedCOs`,
      //   accessorKey: 'revisedChangeOrder',
      //   accessorFn(row) {
      //     return numeral(row.revisedChangeOrder).format('$0,0.00')
      //   },
      //   footer: props => {
      //     const total = getTotalOfKey('revisedChangeOrder', financialOveriewTableData)

      //     return numeral(total).format('$0,0.00')
      //   },
      // },

      {
        header: `${TRANSACTION}.lateFee`,
        accessorKey: 'lateFee',
        accessorFn(row) {
          return numeral(row.lateFee).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('lateFee', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },

      {
        header: `${TRANSACTION}.factoring`,
        accessorKey: 'factoring',
        accessorFn(row) {
          return numeral(row.factoring).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('factoring', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.finalVendorWOs`,
        accessorKey: 'workOrderNewAmount',
        accessorFn(row) {
          return numeral(row.workOrderNewAmount).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('workOrderNewAmount', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.draws`,
        accessorKey: 'draw',
        accessorFn(row) {
          return numeral(row.draw).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('draw', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.materials`,
        accessorKey: 'material',
        accessorFn(row) {
          return numeral(row.material).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('material', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.percentagePaid`,
        accessorKey: 'vendorPaymentPercentage',
        accessorFn(row) {
          return isDefined(row.vendorPaymentPercentage)
            ? numeral(percentageFormatter(row.vendorPaymentPercentage)).format('0.00%')
            : ''
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
        header: `${TRANSACTION}.balance`,
        accessorKey: 'accountPayable',
        accessorFn(row) {
          return numeral(row.accountPayable).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('accountPayable', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.profit`,
        accessorKey: 'profit',
        accessorFn(row) {
          return numeral(row.profit).format('$0,0.00')
        },
        meta: { format: 'currency' },
        footer: props => {
          const total = getTotalOfKey('profit', financialOveriewTableData)

          return numeral(total).format('$0,0.00')
        },
      },
      {
        header: `${TRANSACTION}.profitPercentage`,
        accessorKey: 'vendorProfitPercentage',
        accessorFn(row) {
          return isDefined(row.vendorProfitPercentage)
            ? numeral(percentageFormatter(row.vendorProfitPercentage)).format('0.00%')
            : ''
        },
        footer: props => {
          const total =
            (getTotalOfKey('profit', financialOveriewTableData) /
              getTotalOfKey('newAmount', financialOveriewTableData)) *
            100
          return isDefined(total) ? numeral(percentageFormatter(total)).format('0.00%') : ''
        },
      },
    ],
    TableNames.projectFinancialOverview,
  )

  return (
    <Box w="100%" position="relative">
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
