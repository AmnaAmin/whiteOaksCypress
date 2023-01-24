import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetProjectFinancialOverview } from 'api/projects'
import { FinancialOverviewTable } from './financial-overview-table'
import { WorkOrderFinancialOverviewTable } from './project-workorders-overview-table'

export const TransactionDetails = React.forwardRef((props, ref) => {
  const { projectId } = useParams<'projectId'>()
  const { isLoading, financialOveriewTableData, workOrderFinancialOverviews, projectTotalCostNumber } =
    useGetProjectFinancialOverview(projectId)

  return (
    <>
      <Flex overflow={'auto'} mb="5">
        <FinancialOverviewTable ref={ref} financialOveriewTableData={financialOveriewTableData} isLoading={isLoading} />
      </Flex>
      <Flex overflow={'auto'} mb="5">
        <WorkOrderFinancialOverviewTable
          ref={ref}
          financialOveriewTableData={workOrderFinancialOverviews}
          projectTotalCostNumber={projectTotalCostNumber}
          isLoading={isLoading}
        />
      </Flex>
    </>
  )
})
