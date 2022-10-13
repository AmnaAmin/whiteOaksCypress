import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { USER_MANAGEMENT } from './user-management.i8n'

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
        Header: `${USER_MANAGEMENT}.table.email`,
        accessor: 'id',
      },
      {
        Header: `${USER_MANAGEMENT}.table.firstName`,
        accessor: 'firstName',
      },
      {
        Header: `${USER_MANAGEMENT}.table.lastName`,
        accessor: 'Last Name',
      },
      {
        Header: `${USER_MANAGEMENT}.table.account`,
        accessor: 'Account',
      },
      {
        Header: `${USER_MANAGEMENT}.table.language`,
        accessor: 'teleNumber',
        // Cell: ({ value }) => PROJECT_CATEGORY[value],
      },
      {
        Header: `${USER_MANAGEMENT}.table.status`,
        accessor: 'Status',
      },
      {
        Header: `${USER_MANAGEMENT}.table.createdDate`,
        accessor: 'Created  Date',
      },

      {
        Header: `${USER_MANAGEMENT}.table.modifiedBy`,
        accessor: 'Modified By',
        // Cell: ({ value }) => dateFormat(value),
      },
      {
        Header: `${USER_MANAGEMENT}.table.modifiedDate`,
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
