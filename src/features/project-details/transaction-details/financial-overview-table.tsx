import { TableWrapper } from 'components/table/table'
import numeral from 'numeral'
import React from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'api/table-column-settings'

type FinancialOverviewTableProps = { financialOveriewTableData: any; isLoading: boolean }

export const FinancialOverviewTable = React.forwardRef((props: FinancialOverviewTableProps, ref) => {
  const { financialOveriewTableData, isLoading } = props

  const { tableColumns } = useTableColumnSettings(
    [
      {
        Header: 'client',
        accessor: 'skillName',
      },
      {
        Header: 'Original SOW Amount',
        accessor: 'originalAmount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'Revised SOW Amount',
        accessor: 'revisedSOWAmount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'COs',
        accessor: 'changeOrder',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'Revised COs',
        accessor: 'revisedChangeOrderAmount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'Draws',
        accessor: 'draw',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'Adjustment for SOW',
        accessor: 'adjustment',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'Final SOW Amount',
        accessor: 'finalSOWAmount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'Partial Payments',
        accessor: 'partialPayment',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
      {
        Header: 'AR',
        accessor: 'accountReceivable',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
      },
    ],
    TableNames.projectFinancialOverview,
  )

  return (
    <TableWrapper
      disableFilter
      isLoading={isLoading}
      columns={tableColumns}
      data={financialOveriewTableData}
      tableHeight="150px"
      name="transaction-table"
    />
  )
})
