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
import { TableFooter } from 'components/table-refactored/table-footer'
interface PropType {
  onTabChange?: any
  projectData: Project
  isVendorExpired?: boolean
}
export const WorkOrdersTable = React.forwardRef(({ onTabChange, projectData, isVendorExpired }: PropType, ref) => {
  const { projectId } = useParams<'projectId'>()
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()
  const { transactions = [] } = useTransactions(projectId)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  let WORK_ORDER_TABLE_COLUMNS_FILTERED = WORK_ORDER_TABLE_COLUMNS.filter(
    c => c.header !== 'Payment Groups' && c.header !== 'Profit Percentage',
  )

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
    setTotalPages(Math.ceil((workOrdersNotCancelled?.length ?? 0) / 50))
    setTotalRows(workOrdersNotCancelled?.length ?? 0)
  }, [workOrdersNotCancelled?.length])

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
      <WorkOrderDetails
        workOrder={selectedWorkOrder as ProjectWorkOrderType}
        projectData={projectData}
        isVendorExpired={isVendorExpired}
        onClose={() => {
          setSelectedWorkOrder(undefined)
          refetch()
        }}
        transactions={transactions}
        onProjectTabChange={onTabChange}
      />
      {isLoading && (
        <Center h="calc(100vh - 300px)">
          <Spinner size="lg" />
        </Center>
      )}
      {workOrdersNotCancelled && (
        <Box
          overflowX="auto"
          w="100%"
          minH="calc(100vh - 310px)"
          position="relative"
          border="1px solid #CBD5E0"
          borderRadius="6px"
          roundedRight={{ base: '0px', sm: '6px' }}
        >
          <TableContextProvider
            totalPages={workOrdersNotCancelled?.length ? totalPages : -1}
            data={workOrdersNotCancelled}
            columns={WORK_ORDER_TABLE_COLUMNS_FILTERED}
            manualPagination={false}
          >
            <Table
              isLoading={isLoading}
              isEmpty={!isLoading && !workOrdersNotCancelled?.length}
              onRowClick={onRowClick}
            />
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
