import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { useAccountPayable } from 'utils/account-payable'
// import WorkOrderDetails from 'features/PayableData.workOrders/modals/project-coordinator/work-order/work-order-edit'
import { ProjectWorkOrderType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { TableWrapper } from 'components/table/table'
import { Column } from 'react-table'
import WorkOrderDetails from 'features/projects/modals/project-coordinator/work-order/work-order-edit'

const payableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
      }}
      onClick={e => {
        if (onRowClick) {
          onRowClick(e, row)
        }
      }}
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} p="0">
            <Flex alignItems="center" h="60px">
              <Text isTruncated title={cell.value} padding="0 15px">
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

type PayablePropsTyep = {
  resizeElementRef?: any
  ref?: any
  setTableInstance: (tableInstance: any) => void
  payableColumns: Column[]
  selectedCard: string
  selectedDay: string
  weekDayFilters: any[]
}

export const PayableTable: React.FC<PayablePropsTyep> = React.forwardRef(
  ({ setTableInstance, payableColumns, selectedCard, selectedDay, weekDayFilters }) => {
    const { data: PayableData, isLoading } = useAccountPayable()

    useEffect(() => {
      if (PayableData?.workOrders.length > 0 && selectedWorkOrder?.id) {
        const updatedWorkOrder = PayableData?.workOrders?.find(wo => wo.id === selectedWorkOrder?.id)
        if (updatedWorkOrder) {
          setSelectedWorkOrder({ ...updatedWorkOrder })
        } else {
          setSelectedWorkOrder(undefined)
        }
      } else {
        setSelectedWorkOrder(undefined)
      }
    }, [PayableData])
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()

    const [filterProjects, setFilterPayable] = useState(PayableData?.workOrders)

    useEffect(() => {
      if (!selectedCard && !selectedDay) setFilterPayable(PayableData?.workOrders)
      setFilterPayable(
        PayableData?.workOrders?.filter(
          payable =>
            !selectedCard || payable.durationCategory?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
        ),
      )

      // Due payable Weekly Filter
      const getDates = weekDayFilters.filter(day => selectedDay === day.id)

      const clientDate = getDates?.map(date => {
        return date?.date
      })

      if (selectedDay) {
        setFilterPayable(
          PayableData?.workOrders?.filter(payable => clientDate.includes(payable?.expectedPaymentDate?.substr(0, 10))),
        )
      }
    }, [selectedCard, selectedDay, PayableData?.workOrders])
    return (
      <Box overflow="auto" width="100%">
        {isLoading ? (
          <BlankSlate />
        ) : (
          <>
            <WorkOrderDetails
              workOrder={selectedWorkOrder as ProjectWorkOrderType}
              onClose={() => {
                setSelectedWorkOrder(undefined)
              }}
            />
            <TableWrapper
              columns={payableColumns}
              setTableInstance={setTableInstance}
              data={filterProjects || []}
              isLoading={isLoading}
              TableRow={payableRow}
              tableHeight="calc(100vh - 300px)"
              name="payable-table"
              defaultFlexStyle={false}
              onRowClick={(e, row) => setSelectedWorkOrder(row.original)}
            />
          </>
        )}
      </Box>
    )
  },
)
