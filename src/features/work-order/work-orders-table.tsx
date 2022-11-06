import React, { useEffect, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useProjectWorkOrders } from 'api/projects'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetails from 'features/work-order/work-order-edit'
import { useGanttChart } from 'api/pc-projects'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { WORK_ORDER_TABLE_COLUMNS } from 'features/vendor/vendor-work-order/work-order.constants'

export const WorkOrdersTable = React.forwardRef((_, ref) => {
  const { projectId } = useParams<'projectId'>()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()

  const { data: workOrders, isFetching } = useProjectWorkOrders(projectId)
  const { refetch: refetchGantt } = useGanttChart(projectId)

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

  const onRowClick = row => {
    setSelectedWorkOrder(row)
    onOpen()
  }

  return (
    <Box>
      {isOpen && (
        <WorkOrderDetails
          workOrder={selectedWorkOrder as ProjectWorkOrderType}
          onClose={() => {
            setSelectedWorkOrder(undefined)
            refetchGantt()
            onCloseDisclosure()
          }}
          isOpen={isOpen}
        />
      )}

      <Box overflow={'auto'} w="100%" h="calc(100vh - 350px)" position="relative">
        <TableContextProvider data={workOrdersNotCancelled} columns={WORK_ORDER_TABLE_COLUMNS}>
          <Table
            isLoading={isFetching}
            isEmpty={!isFetching && !workOrdersNotCancelled?.length}
            onRowClick={onRowClick}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
})
