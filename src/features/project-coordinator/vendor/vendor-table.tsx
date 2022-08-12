import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex, Center, Spinner } from '@chakra-ui/react'
import { TableWrapper } from 'components/table/table'
import { RowProps } from 'components/table/react-table'
import { useVendor } from 'utils/pc-projects'
import { Column } from 'react-table'
import Status from 'features/projects/status'
import Vendor from 'features/projects/modals/project-coordinator/vendor-table'
import { ProjectWorkOrderType } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'

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
    Cell({ value }) {
      return dateFormat(value)
    },
  },
  {
    Header: 'COI-GL Expiration Date',
    accessor: 'coiglExpirationDate',
    Cell({ value }) {
      return dateFormat(value)
    },
  },
  {
    Header: 'COI-WC Expiration Date',
    accessor: 'coiWcExpirationDate',
    Cell({ value }) {
      return dateFormat(value)
    },
  },
  {
    Header: 'EIN/SSN',
    accessor: 'einNumber',
  },
  {
    Header: 'Total Capacity',
    accessor: 'capacity',
  },
  {
    Header: 'Available Capacity',
    accessor: 'availableCapacity',
  },
  {
    Header: 'Construction Trade',
    accessor: 'skills',
  },
  {
    Header: 'Market',
    accessor: 'market',
  },
]

const VendorRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: 'gray.100',
        '& > td > a': {
          color: '#333',
        },
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
    setFilterVendors(
      vendors?.filter(
        vendor => !selectedCard || vendor.statusLabel?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
      ),
    )
  }, [selectedCard, vendors])
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()

  return (
    <Box overflow="auto">
      {selectedWorkOrder && (
        <Vendor
          vendorDetails={selectedWorkOrder as ProjectWorkOrderType}
          onClose={() => {
            setSelectedWorkOrder(undefined)
          }}
        />
      )}

      <TableWrapper
        isLoading={isLoading}
        columns={projectColumns}
        data={filterVendors ? filterVendors : []}
        TableRow={VendorRow}
        name="vendor-table"
        tableHeight="calc(100vh - 350px)"
        setTableInstance={setTableInstance}
        onRowClick={(e, row) => setSelectedWorkOrder(row.original)}
        sortBy={{ id: 'id', desc: true }}
      />
    </Box>
  )
}
