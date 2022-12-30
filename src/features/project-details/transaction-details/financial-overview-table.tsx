import React from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { FINANCIAL_OVERVIEW_TABLE_COLUMNS } from 'constants/transaction-details.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { Box } from '@chakra-ui/react'

type FinancialOverviewTableProps = { financialOveriewTableData: any; isLoading: boolean }

export const FinancialOverviewTable = React.forwardRef((props: FinancialOverviewTableProps, ref) => {
  const { financialOveriewTableData, isLoading } = props

  const { tableColumns } = useTableColumnSettings(FINANCIAL_OVERVIEW_TABLE_COLUMNS, TableNames.projectFinancialOverview)

  return (
    <Box w="100%">
      <TableContextProvider data={financialOveriewTableData} columns={tableColumns}>
        <Table isLoading={isLoading} isEmpty={!isLoading && !financialOveriewTableData?.length} isHideFilters />
      </TableContextProvider>
    </Box>
  )
})
