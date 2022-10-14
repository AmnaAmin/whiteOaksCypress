import { TableWrapper } from 'components/table/table'
import numeral from 'numeral'
import React from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'api/table-column-settings'
import { percentageFormatter } from 'utils/string-formatters'
import { isDefined } from 'utils'
import { useGetProjectFinancialOverview } from 'api/projects'
import { TRANSACTION } from '../transactions/transactions.i18n'

type WorkOrderFinancialOverviewTableProps = { financialOveriewTableData: any; isLoading: boolean }

const getTotalOfKey = (key: string, rows) => {
  return rows.reduce((sum, row) => {
    return row.original[key] + sum
  }, 0)
}

export const WorkOrderFinancialOverviewTable = React.forwardRef((props: WorkOrderFinancialOverviewTableProps, ref) => {
  const { isLoading, financialOveriewTableData } = props
  const { projectTotalCost } = useGetProjectFinancialOverview(financialOveriewTableData[0]?.projectId)
  const projectCostValue = projectTotalCost.replace(/\$/g, '')
  const projectCost = parseFloat(projectCostValue.replace(',', ''))

  const { tableColumns } = useTableColumnSettings(
    [
      {
        Header: `${TRANSACTION}.vendor`,
        Footer: '',
        accessor: 'vendorName',
      },
      {
        Header: `${TRANSACTION}.trade`,
        Footer: 'Total',
        accessor: 'skillName',
      },
      {
        Header: `${TRANSACTION}.clientApprovedAmount`,
        accessor: 'originalAmount',
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('originalAmount', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.finalClientApprovedAmount`,
        accessor: 'newAmount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('newAmount', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.originalVendorWO`,
        accessor: 'workOrderOriginalAmount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('workOrderOriginalAmount', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.revisedVendorWO`,
        accessor: 'revisedVendorWorkOrder',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('revisedVendorWorkOrder', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.COs`,
        accessor: 'changeOrder',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('changeOrder', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.revisedCOs`,
        accessor: 'revisedChangeOrder',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('revisedChangeOrder', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.finalVendorWOs`,
        accessor: 'workOrderNewAmount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('workOrderNewAmount', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.draws`,
        accessor: 'draw',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('draw', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.materials`,
        accessor: 'material',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('material', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.vendorPayment`,
        accessor: 'vendorPaymentPercentage',
        Cell(cellInfo) {
          return isDefined(cellInfo.value) ? numeral(percentageFormatter(cellInfo.value)).format('0.00%') : ''
        },
        Footer: info => {
          const vendorPaymentPercentage = React.useMemo(
            () =>
              ((Math.abs(getTotalOfKey('material', info.rows)) + Math.abs(getTotalOfKey('draw', info.rows))) /
                projectCost) *
              100,
            [info.rows],
          )
          return isDefined(vendorPaymentPercentage)
            ? numeral(percentageFormatter(vendorPaymentPercentage)).format('0.00%')
            : ''
        },
      },
      {
        Header: `${TRANSACTION}.invoicedAmount`,
        accessor: 'accountPayable',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('accountPayable', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
      {
        Header: `${TRANSACTION}.profit`,
        accessor: 'profit',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        Footer: info => {
          const total = React.useMemo(() => getTotalOfKey('profit', info.rows), [info.rows])

          return numeral(total).format('$0,0.00')
        },
      },
    ],
    TableNames.projectFinancialOverview,
  )

  return (
    <TableWrapper
      disableFilter
      isShowFooter={true}
      isLoading={isLoading}
      columns={tableColumns}
      data={financialOveriewTableData}
      tableHeight="calc(100vh - 320px)"
      name="transaction-table"
    />
  )
})
