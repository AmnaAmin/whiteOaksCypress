import React from 'react'
import { Box, Td, Tr, Text, Flex, Button } from '@chakra-ui/react'
import ReactTable, { RowProps } from 'components/table/react-table'
import { Column } from 'react-table'

export const AUDIT_LOGS_COLUMNS = [
  {
    Header: 'Modified By',
    accessor: 'modifiedBy',
  },
  {
    Header: 'Modified Date',
    accessor: 'modifiedDate',
  },
  {
    Header: 'Parameter',
    accessor: 'parameter',
  },
  {
    Header: 'Old Value',
    accessor: 'oldValue',
  },
  {
    Header: 'New Value',
    accessor: 'newValue',
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
  projectColumns: Column[]
  isLoading: boolean
  resizeElementRef?: any
  setTableInstance?: (tableInstance: any) => void
  onClose?: () => void
}
export const AuditLogs: React.FC<ProjectProps> = ({
  setTableInstance,
  projectColumns,
  resizeElementRef,
  isLoading,
  onClose,
}) => {
  return (
    <Box ref={resizeElementRef}>
      <ReactTable
        isLoading={isLoading}
        columns={projectColumns}
        data={[]}
        TableRow={VendorRow}
        name="vendor-table"
        tableHeight="calc(100vh - 350px)"
        setTableInstance={setTableInstance}
      />
      <Flex borderTop="2px solid #E2E8F0" alignItems="center" w="100%" h="100px" justifyContent="end">
        <Button colorScheme="brand" onClick={onClose} mr="3">
          Close
        </Button>
      </Flex>
    </Box>
  )
}
