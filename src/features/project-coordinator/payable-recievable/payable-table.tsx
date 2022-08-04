import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex, Checkbox, Spacer } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { useAccountPayable } from 'utils/account-payable'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import WorkOrderDetails from 'features/projects/modals/project-coordinator/work-order/work-order-edit'
import { ProjectWorkOrderType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { TableWrapper } from 'components/table/table'

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
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
            <Flex alignItems="center" h="60px">
              <Text noOfLines={2} title={cell.value} padding="0 15px">
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
  register: UseFormRegister<FieldValues>
  loading?: boolean
}

export const PayableTable: React.FC<PayablePropsTyep> = React.forwardRef(
  ({ ref, loading, register, setTableInstance }) => {
    const { columns } = useColumnWidthResize(
      [
        {
          Header: 'Id',
          accessor: 'id',
        },
        {
          Header: 'Vendor Name',
          accessor: 'claimantName',
        },
        {
          Header: 'Property Address',
          accessor: 'propertyAddress',
        },
        {
          Header: 'Vendor Address',
          accessor: 'vendorAddress',
        },
        {
          Header: 'Payment Terms',
          accessor: 'paymentTerm',
        },
        {
          Header: 'Expected pay date',
          accessor: 'expectedPaymentDate',
        },
        {
          Header: 'Final Invoice',
          accessor: 'finalInvoiceAmount',
        },
        {
          Header: 'Markets',
          accessor: 'marketName',
        },
        {
          Header: 'WO Start Date',
          accessor: 'workOrderStartDate',
        },
        {
          Header: 'WO Completed Date',
          accessor: 'workOrderDateCompleted',
        },
        {
          Header: 'WO Issue Date',
          accessor: 'workOrderIssueDate',
        },
        {
          Header: 'Checkbox',
          Cell: ({ row }) => {
            return (
              <Flex justifyContent="end">
                <Spacer w="50px" />
                <Checkbox
                  isDisabled={loading}
                  value={(row.original as any).id}
                  {...register('id', { required: true })}
                />
              </Flex>
            )
          },
        },
      ],
      ref,
    )
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
              columns={columns}
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
  },
)
