import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
// import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
// import { useProjectAlerts } from 'utils/projects'
// import { useParams } from 'react-router-dom'
// import { useAuth } from 'utils/auth-context'
import { useVendor } from 'utils/pc-projects'
import { Link } from 'react-router-dom'

// const alertsRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
//   return (
//     <Tr
//       bg="white"
//       _hover={{
//         background: '#eee',
//       }}
//       onClick={e => {
//         if (onRowClick) {
//           onRowClick(e, row)
//         }
//       }}
//       {...row.getRowProps({
//         style,
//       })}
//     >
//       {row.cells.map(cell => {
//         return (
//           <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
//             <Flex alignItems="center" h="60px">
//               <Text noOfLines={2} title={cell.value} padding="0 15px" color="blackAlpha.600">
//                 {cell.render('Cell')}
//               </Text>
//             </Flex>
//           </Td>
//         )
//       })}
//     </Tr>
//   )
// }

export const VENDOR_COLUMNS = [
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Name',
    accessor: 'companyName',
  },
  {
    Header: 'Region',
    accessor: 'region',
  },
  {
    Header: 'State',
    accessor: 'state',
  },
  {
    Header: 'Active Date',
    accessor: 'dateCreated',
  },
  {
    Header: 'COI-GL Expiration Date',
    accessor: 'coiglExpirationDate',
  },
  {
    Header: 'COI-WC Expiration Date',
    accessor: 'coiWCExpirationDate',
  },
  {
    Header: 'EIN/SSN',
    accessor: 'einNumber',
  },
]

const ProjectRow: React.FC<RowProps> = ({ row, style }) => {
  const idCell = row.cells.find(cell => cell.column.id === 'id')
  const projectId = idCell?.value

  return (
    <Link to={`/project-details/${projectId}`} data-testid="project-table-row">
      <Tr
        bg="white"
        _hover={{
          background: 'gray.100',
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
            </Td>
          )
        })}
      </Tr>
    </Link>
  )
}

type ProjectProps = {
  selectedCard: string
  // projectColumns: Column[]
  resizeElementRef: any
  setTableInstance: (tableInstance: any) => void
}
export const ProjectsTable: React.FC<ProjectProps> = ({
  setTableInstance,
  // projectColumns,
  resizeElementRef,
  selectedCard,
}) => {
  const { projects, isLoading } = useVendor()
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
        isLoading={isLoading}
        columns={[]}
        data={filterProjects || []}
        TableRow={ProjectRow}
        name="my-table"
        setTableInstance={setTableInstance}
        tableHeight={'inherit'}
      />
    </Box>
  )
}
