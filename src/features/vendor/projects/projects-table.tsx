import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { TableWrapper } from 'components/table/table'
import { RowProps } from 'components/table/react-table'
import { Link } from 'react-router-dom'
import { useProjects, useWorkOrders } from 'api/projects'
import Status from '../../common/status'
import { dateFormat } from 'utils/date-time-utils'
import { Column } from 'react-table'
import { t } from 'i18next'

export const PROJECT_COLUMNS = [
  {
    Header: 'projectID',
    accessor: 'projectId',
  },
  // {
  //   Header: t('type'),
  //   accessor: 'projectTypeLabel',
  // },
  {
    Header: t('WOstatus'),
    accessor: 'statusLabel',
    Cell: ({ value, row }) => <Status value={value} id={row.original.statusLabel} />,
  },
  {
    Header: 'WO ID',
    accessor: 'id',
  },
  {
    Header: t('address'),
    accessor: 'vendorAddress', // or business address
  },
  {
    Header: 'trade',
    accessor: 'skillName',
  },
  {
    Header: t('pastDueWO'),
    accessor: '', //'pastDueWorkorders',
  },
  {
    Header: t('DueDateWO'),
    accessor: '', //'clientDueDate',
    Cell({ value }) {
      return dateFormat(value)
    },
    getCellExportValue(row) {
      return dateFormat(row.values.clientDueDate)
    },
  },
  {
    Header: t('expectedPaymentDate'),
    accessor: 'expectedPaymentDate',
    Cell({ value }) {
      return dateFormat(value)
    },
    getCellExportValue(row) {
      return dateFormat(row.values.expectedPaymentDate)
    },
  },
]

const ProjectRow: React.FC<RowProps> = ({ row, style }) => {
  const idCell = row.cells.find(cell => cell.column.id === 'id')
  const projectId = idCell?.value

  return (
    <Link
      to={`/project-details/${projectId}`}
      data-testid="project-table-row"
      onContextMenu={() => window.open(`${process.env.PUBLIC_URL}/project-details/${projectId}`)}
    >
      <Tr
        bg="white"
        _hover={{
          background: 'gray.50',
          '& > td > a': {
            color: '#333',
          },
        }}
        {...row.getRowProps({
          style,
        })}
      >
        {row.cells.map((cell, index) => {
          return (
            <Td {...cell.getCellProps()} key={`row_${index}`} p="0" bg="transparent">
              <Flex alignItems="center" h="72px" pl="10px">
                <Text
                  noOfLines={2}
                  title={cell.value}
                  padding="0 15px"
                  color="gray.600"
                  mb="20px"
                  mt="10px"
                  fontSize="14px"
                  fontStyle="normal"
                  fontWeight="400"
                >
                  {cell.render('Cell')}
                </Text>
              </Flex>
            </Td>
          )
        })}
      </Tr>
    </Link>
  )
}

type ProjectProps = {
  selectedCard: string
  projectColumns: Column[]
  resizeElementRef: any
  setTableInstance: (tableInstance: any) => void
}
export const ProjectsTable: React.FC<ProjectProps> = ({
  setTableInstance,
  projectColumns,
  resizeElementRef,
  selectedCard,
}) => {

  const { projects } = useProjects()
  const { workOrderData, isLoading } = useWorkOrders()
  const [filterProjects, setFilterProjects] = useState(workOrderData)

  console.log(projects)

  useEffect(() => {
    if (!selectedCard) setFilterProjects(workOrderData)

    setFilterProjects(
      workOrderData?.filter(
        wo =>
          !selectedCard ||
          wo.statusLabel?.replace(/\s/g, '').toLowerCase() === selectedCard?.replace(/\s/g, '').toLowerCase(),
      ),
    )
  }, [selectedCard, workOrderData])

  return (
    <Box w="100%" ref={resizeElementRef}>
      <TableWrapper
        isLoading={isLoading}
        columns={projectColumns}
        data={filterProjects || []}
        TableRow={ProjectRow}
        name="my-table"
        setTableInstance={setTableInstance}
        tableHeight="calc(100vh - 270px)"
        sortBy={{ id: 'id', desc: true }}
      />
    </Box>
  )
}
