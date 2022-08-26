import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetProjectFinancialOverview } from 'utils/projects'
import { FinancialOverviewTable } from './financial-overview-table'
import { WorkOrderFinancialOverviewTable } from './project-workorders-overview-table'

export const TransactionDetails = React.forwardRef((props, ref) => {
  const { projectId } = useParams<'projectId'>()
  const { isLoading, financialOveriewTableData, workOrderFinancialOverviews } =
    useGetProjectFinancialOverview(projectId)

  return (
    <>
      <Flex overflow={'auto'} mb="5" h="135px">
        <FinancialOverviewTable ref={ref} financialOveriewTableData={financialOveriewTableData} isLoading={isLoading} />
      </Flex>
      <Flex overflow={'auto'} mb="5" h="350px">
        <WorkOrderFinancialOverviewTable
          ref={ref}
          financialOveriewTableData={workOrderFinancialOverviews}
          isLoading={isLoading}
        />
      </Flex>
    </>
  )
})
