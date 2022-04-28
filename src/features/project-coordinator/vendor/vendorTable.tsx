import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useVendor } from 'utils/pc-projects'
import { Link } from 'react-router-dom'
import { Column } from 'react-table'

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
  projectColumns: Column[]
  resizeElementRef: any
  // setTableInstance: (tableInstance: any) => void
}
export const VendorTable: React.FC<ProjectProps> = ({
  // setTableInstance,
  projectColumns,
  resizeElementRef,
  selectedCard,
}) => {
  const {
    vendors,
    //  isLoading
  } = useVendor()
  console.log('Veendo=', vendors)
  // const [filterVendors, setFilterVendors] = useState(vendors)

  // useEffect(() => {
  //   if (!selectedCard) setFilterVendors(vendors)
  //   setFilterVendors(
  //     vendors?.filter(
  //       project =>
  //         !selectedCard || project.companyName?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
  //     ),
  //   )
  // }, [selectedCard, vendors])

  return (
    <Box ref={resizeElementRef} height="1000px">
      <ReactTable
        // isLoading={isLoading}
        columns={projectColumns}
        data={vendors ? vendors : []}
        TableRow={ProjectRow}
        name="my-table"
        // setTableInstance={setTableInstance}
        tableHeight={'inherit'}
      />
    </Box>
  )
}
