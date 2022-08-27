import { TableWrapper } from 'components/table/table'
import numeral from 'numeral'
import React from 'react'
import { useParams } from 'react-router-dom'
import { TableNames } from 'types/table-column.types'
import { useGetProjectFinancialOverview } from 'utils/projects'
import { useTableColumnSettings } from 'utils/table-column-settings'

export const FinancialOverviewTable = React.forwardRef((props, ref) => {
  const { projectId } = useParams<'projectId'>()
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
  const { isLoading, financialOveriewTableData } = useGetProjectFinancialOverview(projectId)

  console.log('financialOveriewTableData', financialOveriewTableData)
  return (
    <TableWrapper
      disableFilter
      isLoading={isLoading}
      columns={tableColumns}
      data={financialOveriewTableData}
      tableHeight="inherit"
      name="transaction-table"
    />
  )
})
