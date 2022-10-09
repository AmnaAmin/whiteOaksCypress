import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { TableWrapper } from 'components/table/table'
import { RowProps } from 'components/table/react-table'
import { Link } from 'react-router-dom'
import { useProjects } from 'api/projects'
import Status from '../../common/status'
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
    Header: t('DueDateWO'),
    accessor: 'clientDueDate',
    Cell({ value }) {
      return dateFormat(value)
    },
    getCellExportValue(row) {
      return dateFormat(row.values.clientDueDate)
    },
  },
  {
    Header: t('expectedPaymentDate'),
    accessor: 'vendorWOExpectedPaymentDate',
    Cell({ value }) {
      return dateFormat(value)
    },
    getCellExportValue(row) {
      return dateFormat(row.values.vendorWOExpectedPaymentDate)
    },
  },
]

const ProjectRow: React.FC<RowProps> = ({ row, style }) => {
  const idCell = row.cells.find(cell => cell.column.id === 'id')
  const projectId = idCell?.value

  const redirectPath =
    process.env.NODE_ENV === 'development'
      ? `/project-details/${projectId}`
      : `/vendorPortal/project-details/${projectId}`

  return (
    <Link
      to={`/project-details/${projectId}`}
      data-testid="project-table-row"
      onContextMenu={() => window?.open(redirectPath)}
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
  const { projects, isLoading } = useProjects()
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
      <TableWrapper
        isLoading={isLoading}
        columns={projectColumns}
        data={filterProjects || []}
        TableRow={ProjectRow}
        name="my-table"
        setTableInstance={setTableInstance}
        tableHeight={'inherit'}
        sortBy={{ id: 'id', desc: true }}
      />
    </Box>
  )
}
