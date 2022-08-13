import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { useAccountPayable } from 'utils/account-payable'
import WorkOrderDetails from 'features/projects/modals/project-coordinator/work-order/work-order-edit'
import { ProjectWorkOrderType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { TableWrapper } from 'components/table/table'
import { Column } from 'react-table'

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
}

export const PayableTable: React.FC<PayablePropsTyep> = React.forwardRef(({ setTableInstance, payableColumns }) => {
  const { data: PayableData, isLoading, refetch } = useAccountPayable()

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
              refetch()
            }}
          />
          <TableWrapper
            columns={payableColumns}
            setTableInstance={setTableInstance}
            data={PayableData?.workOrders || []}
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
})
