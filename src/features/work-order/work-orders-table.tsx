import React, { useEffect, useState } from 'react'
import { Box, Center, Spinner } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useProjectWorkOrders } from 'api/projects'

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

export const WorkOrdersTable = props => {
  const { defaultSelected, setShowNewWO, setSelectedWorkOrder, selectedWorkOrder, defaultWorkorderId, setDefaultWorkorder } = props
  const { projectId } = useParams<'projectId'>()
  // const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)

  const { data: workOrders, isFetching, isLoading } = useProjectWorkOrders(projectId)

  useEffect(() => {
    if (workOrders && workOrders.length > 0 && selectedWorkOrder?.id) {
      const updatedWorkOrder = workOrders?.find(wo => wo.id === selectedWorkOrder?.id)
      if (updatedWorkOrder) {
        setDefaultWorkorder(null)
        setSelectedWorkOrder({ ...updatedWorkOrder })
      }
    }
  }, [workOrders])

  useEffect(() => {
    if (workOrders && workOrders.length > 0 && defaultWorkorderId) {
      const wo = workOrders?.find(wo => wo.id === defaultWorkorderId)
      if (wo) {
        setSelectedWorkOrder({ ...wo })
        setShowNewWO(true)
      }
    }
  }, [defaultWorkorderId, workOrders])

  useEffect(() => {
    if (defaultSelected?.id) {
      setDefaultWorkorder(null)
      setSelectedWorkOrder(defaultSelected)
      setShowNewWO(true)
    }
  }, [defaultSelected])

  const onRowClick = row => {
    setDefaultWorkorder(null)
    setSelectedWorkOrder(row)
    setShowNewWO(true)
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
      {/* //commented here the modal view for keeping it as a reference */}

      {/* {isOpen && (
        <WorkOrderDetails
          workOrder={selectedWorkOrder as ProjectWorkOrderType}
          onClose={() => {
            setSelectedWorkOrder(undefined)
            refetchGantt()
            onCloseDisclosure()
          }}
          isOpen={isOpen}
        />
      )} */}

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
}
