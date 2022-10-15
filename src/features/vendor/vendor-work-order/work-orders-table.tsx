import React, { useState, useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useGetAllTransactions } from 'api/transactions'
import { useProjectWorkOrders } from 'api/projects'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetails from './work-order-details'
import { Project } from 'types/project.type'
import { WORK_ORDER_TABLE_COLUMNS, WORK_ORDER_TABLE_QUERY_KEYS } from './work-order.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
interface PropType {
  onTabChange?: any
  projectData: Project
}
export const WorkOrdersTable = React.forwardRef(({ onTabChange, projectData }: PropType, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()
  const { transactions = [] } = useGetAllTransactions(projectId)

  const { setColumnFilters, fitlersQueryString } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: WORK_ORDER_TABLE_QUERY_KEYS,
  })
  const { data: workOrders, isLoading, refetch } = useProjectWorkOrders(projectId, fitlersQueryString)
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
        <Box overflow={'auto'} w="100%" maxH="350px" position="relative">
          <TableContextProvider
            data={workOrdersNotCancelled}
            columns={WORK_ORDER_TABLE_COLUMNS}
            setColumnFilters={setColumnFilters}
          >
            <Table
              isLoading={isLoading}
              isEmpty={!isLoading && !workOrdersNotCancelled?.length}
              onRightClick={onRowClick}
            />
          </TableContextProvider>
        </Box>
      )}
    </Box>
  )
})
