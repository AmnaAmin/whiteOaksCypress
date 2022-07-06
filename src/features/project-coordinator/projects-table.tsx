import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import ReactTable, { RowProps } from 'components/table/react-table'
import { Link } from 'react-router-dom'
import { useProjects, useWeekDayProjectsDue } from 'utils/projects'
import Status from '../projects/status'
import { Column } from 'react-table'

export const PROJECT_COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'FPM',
    accessor: 'projectManager',
  },
  {
    Header: 'generalLabor',
    accessor: 'generalLabourName',
  },
  {
    Header: 'status',
    accessor: 'projectStatus',
    Cell: ({ value, row }) => <Status value={value} id={row.original.projectStatus} />,
  },
  {
    Header: 'address',
    accessor: 'streetAddress',
  },
  {
    Header: 'City',
    accessor: 'city',
  },
  {
    Header: 'Client Start Date',
    accessor: 'clientStartDate',
  },
  {
    Header: 'Client Due Date',
    accessor: 'clientDueDate',
  },
]

const ProjectRow: React.FC<RowProps> = ({ row, style }) => {
  const idCell = row.cells.find(cell => cell.column.id === 'id')
  const projectId = idCell?.value

  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
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
            <Link to={`/project-details/${projectId}`}>
              <Flex alignItems="center" h="72px" pl="3">
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
            </Link>
          </Td>
        )
      })}
    </Tr>
  )
}

type ProjectProps = {
  selectedCard: string
  selectedDay: string
  projectColumns: Column[]
  resizeElementRef: any
  setTableInstance: (tableInstance: any) => void
}
export const ProjectsTable: React.FC<ProjectProps> = ({
  setTableInstance,
  projectColumns,
  resizeElementRef,
  selectedCard,
  selectedDay,
}) => {
  const { projects } = useProjects()
  const [filterProjects, setFilterProjects] = useState(projects)

  const { data: days } = useWeekDayProjectsDue()

  useEffect(() => {
    // To get pastDue Ids
    const pastDueIds = projects?.filter(project => project?.pastDue)
    const idPastDue = pastDueIds?.map(project => project?.id)

    if (!selectedCard && !selectedDay) setFilterProjects(projects)
    setFilterProjects(
      projects?.filter(
        project =>
          !selectedCard ||
          project.projectStatus?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase() ||
          (selectedCard === 'pastDue' && idPastDue?.includes(project?.id)),
      ),
    )

    // Due Project Weekly Filter
    const getDates = days?.filter(day => {
      if (selectedDay === 'All' || selectedDay === day.dayName) {
        return true
      }
      return false
    })

    const clientDate = getDates?.map(dates => {
      var date = dates?.dueDate
      return date.substr(0, 10)
    })

    if (selectedDay) {
      setFilterProjects(projects?.filter(project => clientDate.includes(project?.clientDueDate?.substr(0, 10))))
    }
  }, [selectedCard, selectedDay, projects])

  return (
    <Box ref={resizeElementRef} height="100%">
      <ReactTable
        columns={projectColumns}
        data={filterProjects || []}
        TableRow={ProjectRow}
        name="my-table"
        setTableInstance={setTableInstance}
        tableHeight={'inherit'}
      />
    </Box>
  )
}
