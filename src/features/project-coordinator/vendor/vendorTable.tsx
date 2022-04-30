import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useVendor } from 'utils/pc-projects'
import { Column } from 'react-table'
import Status from 'features/projects/status'

export const VENDOR_COLUMNS = [
  {
    Header: 'Status',
    accessor: 'statusLabel',
    Cell: ({ value, row }) => <Status value={value} id={row.original.statusLabel} />,
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
    accessor: 'createdDate',
  },
  {
    Header: 'COI-GL Expiration Date',
    accessor: 'coiglExpirationDate',
  },
  {
    Header: 'COI-WC Expiration Date',
    accessor: 'coiWcExpirationDate',
  },
  {
    Header: 'EIN/SSN',
    accessor: 'einNumber',
  },
]

const VendorRow: React.FC<RowProps> = ({ row, style }) => {
  return (
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
  )
}

type ProjectProps = {
  selectedCard: string
  projectColumns: Column[]
  resizeElementRef: any
  setTableInstance: (tableInstance: any) => void
}
export const VendorTable: React.FC<ProjectProps> = ({
  setTableInstance,
  projectColumns,
  resizeElementRef,
  selectedCard,
}) => {
  const { vendors, isLoading } = useVendor()

  const [filterVendors, setFilterVendors] = useState(vendors)

  useEffect(() => {
    if (!selectedCard) setFilterVendors(vendors)
    setFilterVendors(
      vendors?.filter(
        vendor => !selectedCard || vendor.statusLabel?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
      ),
    )
  }, [selectedCard, vendors])

  return (
    <Box ref={resizeElementRef}>
      <ReactTable
        isLoading={isLoading}
        columns={projectColumns}
        data={filterVendors ? filterVendors : []}
        TableRow={VendorRow}
        name="vendor-table"
        tableHeight="calc(100vh - 350px)"
        setTableInstance={setTableInstance}
      />
    </Box>
  )
}
