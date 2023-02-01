import React, { useEffect, useState } from 'react'
import { Box, Center, Spinner, useDisclosure } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useProjectWorkOrders } from 'api/projects'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetails from 'features/work-order/work-order-edit'
import { useGanttChart } from 'api/pc-projects'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { WORK_ORDER_TABLE_COLUMNS } from 'features/vendor/vendor-work-order/work-order.constants'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { TableFooter } from 'components/table-refactored/table-footer'

export const WorkOrdersTable = React.forwardRef((_, ref) => {
  const { projectId } = useParams<'projectId'>()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()

  const { data: workOrders, isFetching, isLoading } = useProjectWorkOrders(projectId)
  const { refetch: refetchGantt } = useGanttChart(projectId)

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

  useEffect(() => {
    if (!workOrders?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((workOrders?.length ?? 0) / 50))
      setTotalRows(workOrders?.length ?? 0)
    }
  }, [workOrders])

  const setPageCount = rows => {
    /*Test in Preprod*/
    if (!rows?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((rows?.length ?? 0) / 50))
      setTotalRows(rows?.length ?? 0)
    }
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
      {isLoading && (
        <Center minH="calc(100vh - 450px)">
          <Spinner size="lg" />
        </Center>
      )}
      {workOrders && (
        <Box
          w="100%"
          minH="calc(100vh - 503px)"
          position="relative"
          borderRadius="6px"
          border="1px solid #CBD5E0"
          overflowX="auto"
          roundedRight={{ base: '0px', sm: '6px' }}
        >
          <TableContextProvider
            totalPages={totalPages}
            data={workOrders}
            columns={WORK_ORDER_TABLE_COLUMNS}
            manualPagination={false}
          >
            <Table isLoading={isFetching} isEmpty={!isFetching && !workOrders?.length} onRowClick={onRowClick} />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <Box h="35px" />

              <TablePagination>
                <ShowCurrentRecordsWithTotalRecords dataCount={totalRows} setPageCount={setPageCount} />
                <GotoFirstPage />
                <GotoPreviousPage />
                <GotoNextPage />
                <GotoLastPage />
              </TablePagination>
            </TableFooter>
          </TableContextProvider>
        </Box>
      )}
    </Box>
  )
})
