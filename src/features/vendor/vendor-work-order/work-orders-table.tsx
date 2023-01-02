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
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
interface PropType {
  onTabChange?: any
  projectData: Project
}
export const WorkOrdersTable = React.forwardRef(({ onTabChange, projectData }: PropType, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()
  const { transactions = [] } = useTransactions(projectId)
  const [totalPages, setTotalPages] = useState(0)

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

  useEffect(() => {
    setTotalPages(Math.ceil((workOrders?.length ?? 0) / 10))
  }, [workOrders])

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
      {workOrdersNotCancelled && workOrdersNotCancelled?.length && (
        <Box
          overflow={'auto'}
          w="100%"
          h="calc(100vh - 300px)"
          position="relative"
          border="1px solid #CBD5E0"
          borderRadius="6px"
          roundedRight={{ base: '0px', sm: '6px' }}
        >
          <TableContextProvider
            totalPages={workOrdersNotCancelled?.length ? totalPages : -1}
            data={workOrdersNotCancelled}
            columns={WORK_ORDER_TABLE_COLUMNS}
            manualPagination={false}
          >
            <Table
              isLoading={isLoading}
              isEmpty={!isLoading && !workOrdersNotCancelled?.length}
              onRowClick={onRowClick}
            />
            <TablePagination>
              <ShowCurrentRecordsWithTotalRecords dataCount={null} />
              <GotoFirstPage />
              <GotoPreviousPage />
              <GotoNextPage />
              <GotoLastPage />
            </TablePagination>
          </TableContextProvider>
        </Box>
      )}
    </Box>
  )
})
