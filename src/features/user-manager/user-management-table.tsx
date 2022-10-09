import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'

const userManagementTableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
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
              <Text isTruncated title={cell.value} padding="0 15px">
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

export const UserManagementTable = React.forwardRef((props: any, ref) => {
  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'userManagement.managementTable.email',
        accessor: 'id',
      },
      {
        Header: 'userManagement.managementTable.firstName',
        accessor: 'firstName',
      },
      {
        Header: 'userManagement.managementTable.lastName',
        accessor: 'Last Name',
      },
      {
        Header: 'userManagement.managementTable.account',
        accessor: 'Account',
      },
      {
        Header: 'userManagement.managementTable.language',
        accessor: 'teleNumber',
        // Cell: ({ value }) => PROJECT_CATEGORY[value],
      },
      {
        Header: 'userManagement.managementTable.status',
        accessor: 'Status',
      },
      {
        Header: 'userManagement.managementTable.createdDate',
        accessor: 'Created  Date',
      },

      {
        Header: 'userManagement.managementTable.modifiedBy',
        accessor: 'Modified By',
        // Cell: ({ value }) => dateFormat(value),
      },
      {
        Header: 'userManagement.managementTable.modifiedDate',
        accessor: 'Modified  Date',
        // Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <TableWrapper
        columns={columns}
        data={[]}
        TableRow={userManagementTableRow}
        tableHeight="calc(100vh - 200px)"
        name="clients-table"
      />
    </Box>
  )
})
