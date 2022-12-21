import React, { useState, useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useTransactions } from 'api/transactions'
import { useProjectWorkOrders } from 'api/projects'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetails from './work-order-details'
import { Project } from 'types/project.type'
import { WORK_ORDER_TABLE_COLUMNS } from './work-order.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
interface PropType {
  onTabChange?: any
  projectData: Project
}
export const WorkOrdersTable = React.forwardRef(({ onTabChange, projectData }: PropType, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()
  const { transactions = [] } = useTransactions(projectId)

  const { data: workOrders, isLoading, refetch } = useProjectWorkOrders(projectId)
  // Do not show WO which have been cancelled
  const workOrdersNotCancelled = workOrders?.filter(wo => wo.status !== 35)

  useEffect(() => {
    if (workOrders && workOrders.length > 0 && selectedWorkOrder?.id) {
      const updatedWorkOrder = workOrders?.find(wo => wo.id === selectedWorkOrder?.id)
      if (updatedWorkOrder) {
        setSelectedWorkOrder({ ...updatedWorkOrder })
      }
    }
  }, [workOrders])

  const onRowClick = (row: any) => {
    setSelectedWorkOrder(row)
  }

  return (
    <Box>
      <WorkOrderDetails
        workOrder={selectedWorkOrder as ProjectWorkOrderType}
        projectData={projectData}
        onClose={() => {
          setSelectedWorkOrder(undefined)
          refetch()
        }}
        transactions={transactions}
        onProjectTabChange={onTabChange}
      />
      {isLoading && (
        <Center>
          <Spinner size="xl" />
        </Center>
      )}
      {workOrders && (
        <Box overflow={'auto'} w="100%" h="calc(100vh - 300px)" position="relative" border='1px solid #CBD5E0' borderRadius='6px'>
          <TableContextProvider data={workOrdersNotCancelled} columns={WORK_ORDER_TABLE_COLUMNS}>
            <Table
              isLoading={isLoading}
              isEmpty={!isLoading && !workOrdersNotCancelled?.length}
              onRowClick={onRowClick}
            />
          </TableContextProvider>
        </Box>
      )}
    </Box>
  )
})
