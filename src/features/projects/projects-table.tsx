import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import ReactTable, { RowProps } from '../../components/table/react-table'
import { Link } from 'react-router-dom'
import { useProjects } from 'utils/projects'
import Status from './status'
import { dateFormat } from 'utils/date-time-utils'
import { Column } from 'react-table'
import { t } from 'i18next'

export const PROJECT_COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: t('type'),
    accessor: 'projectTypeLabel',
  },
  {
    Header: t('WOstatus'),
    accessor: 'vendorWOStatusValue',
    Cell: ({ value, row }) => <Status value={value} id={row.original.vendorWOStatusValue} />,
  },
  {
    Header: t('address'),
    accessor: 'streetAddress',
  },
  {
    Header: t('region'),
    accessor: 'region',
  },
  {
    Header: t('pendingTransactions'),
    accessor: 'pendingTransactions',
  },
  {
    Header: t('pastDueWO'),
    accessor: 'pastDueWorkorders',
  },
  {
    Header: t('expectedPaymentDate'),
    accessor: 'vendorWOExpectedPaymentDate',
    Cell({ value, row }) {
      return dateFormat(value)
    },
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
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0" bg="transparent">
            <Link to={`/project-details/${projectId}`}>
              <Flex alignItems="center" h="72px" pl="3">
                <Text
                  noOfLines={2}
                  title={cell.value}
                  padding="0 15px"
                  color="black.500"
                  fontSize="sm"
                  fontWeight="300"
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
  const [filterProjects, setFilterProjects] = useState(projects)

  useEffect(() => {
    if (!selectedCard) setFilterProjects(projects)
    setFilterProjects(
      projects?.filter(
        project =>
          !selectedCard ||
          project.vendorWOStatusValue?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
      ),
    )
  }, [selectedCard, projects])

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
