import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex, Spinner, Center } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/pc-react-table'
import WorkOrderStatus from './work-order-status'
import { useProjectWorkOrders } from 'utils/projects'
import { dateFormat } from 'utils/date-time-utils'
// import WorkOrderDetails from './modals/work-order-details'
import { useTranslation } from 'react-i18next'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetails from './modals/work-order-details'

const WorkOrderRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: 'gray.100',
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
              <Text
                noOfLines={2}
                title={cell.value}
                padding="0 15px"
                color="#4A5568"
                fontStyle="normal"
                mt="10px"
                mb="10px"
                fontSize="14px"
                fontWeight={400}
              >
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}
interface PropType {
  onTabChange?: any
}

export const WorkOrdersTable = React.forwardRef(({ onTabChange }: PropType, ref) => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()

  const { data: workOrders, isLoading, refetch } = useProjectWorkOrders(projectId)

  const { columns } = useColumnWidthResize(
    [
      {
        Header: 'WO Status',
        accessor: 'statusLabel',
        Cell: ({ value, row }) => <WorkOrderStatus value={value} id={(row.original as any).status} />,
      },
      {
        Header: t('trade') as string,
        accessor: 'skillName',
      },
      {
        Header: t('name') as string,
        accessor: 'companyName',
      },
      {
        Header: t('email') as string,
        accessor: 'businessEmailAddress',
      },
      {
        Header: t('phone') as string,
        accessor: 'businessPhoneNumber',
      },
      {
        Header: t('issue') as string,
        accessor: 'workOrderIssueDate',
        Cell: ({ value }) => dateFormat(value),
      },
      {
        Header: t('expectedCompletion') as string,
        accessor: 'workOrderExpectedCompletionDate',
        Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )

  return (
    <Box>
      <WorkOrderDetails
        workOrder={selectedWorkOrder as ProjectWorkOrderType}
        onClose={() => {
          setSelectedWorkOrder(undefined)
          refetch()
        }}
        onProjectTabChange={onTabChange}
      />
      {isLoading && (
        <Center>
          <Spinner size="xl" />
        </Center>
      )}
      {workOrders && (
        <ReactTable
          columns={columns}
          data={workOrders}
          TableRow={WorkOrderRow}
          tableHeight="calc(100vh - 300px)"
          name="work-orders-table"
          onRowClick={(e, row) => setSelectedWorkOrder(row.original)}
        />
      )}
    </Box>
  )
})
