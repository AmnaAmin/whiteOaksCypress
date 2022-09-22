import { TableWrapper } from 'components/table/table'
import numeral from 'numeral'
import React from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'api/table-column-settings'
import { percentageFormatter } from 'utils/string-formatters'

type WorkOrderFinancialOverviewTableProps = { financialOveriewTableData: any; isLoading: boolean }

const getTotalOfKey = (key: string, rows) => {
  return rows.reduce((sum, row) => {
    return row.original[key] + sum
  }, 0)
}

export const WorkOrderFinancialOverviewTable = React.forwardRef((props: WorkOrderFinancialOverviewTableProps, ref) => {
  const { tableColumns } = useTableColumnSettings(
    [
      {
        Header: 'Vendor',
        Footer: '',
        accessor: 'vendorName',
      },
      {
        Header: 'Trade',
        Footer: 'Total',
        accessor: 'skillName',
      },
      {
        Header: 'Client Approved Amount',
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
        Header: 'Final Client Approved Amount',
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
        Header: 'Original Vendor WOs',
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
        Header: 'Revised Vendor WOs',
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
        Header: 'COs',
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
        Header: 'Revised COs',
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
        Header: 'Final Vendor WOs',
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
        Header: 'Draws',
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
        Header: 'Materials',
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
        Header: 'Vendor Payment',
        accessor: 'vendorPaymentPercentage',
        Cell(cellInfo) {
          return cellInfo.value ? numeral(percentageFormatter(cellInfo.value)).format('0.00%') : ''
        },
        Footer: info => {
          const vendorPaymentPercentage = React.useMemo(
            () => getTotalOfKey('vendorPaymentPercentage', info.rows),
            [info.rows],
          )
          return vendorPaymentPercentage ? numeral(percentageFormatter(vendorPaymentPercentage)).format('0.00%') : ''
        },
      },
      {
        Header: 'Invoiced Amount',
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
        Header: 'Profit',
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
  const { isLoading, financialOveriewTableData } = props

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
