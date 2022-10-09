import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { VendorManagerEdit } from './Vendor-Manager -edit'
import { useTranslation } from 'react-i18next'

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

const data = [
  {
    id: 'id',
    address: 'address',
    teleNumber: 'teleNumber',
  },
]

export const UserManagementTabel = React.forwardRef((props: any, ref) => {
  const [selectedVendorManager, setSelectedVendorManager] = useState(false)
  const { t } = useTranslation()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: t('userManagementTranslation.userManagementTable.email'),
        accessor: 'id',
      },
      {
        Header: t('userManagementTranslation.userManagementTable.firstName'),
        accessor: 'firstName',
      },
      {
        Header: t('userManagementTranslation.userManagementTable.lastName'),
        accessor: 'Last Name',
      },
      {
        Header: t('userManagementTranslation.userManagementTable.account'),
        accessor: 'Account',
      },
      {
        Header: t('userManagementTranslation.userManagementTable.language'),
        accessor: 'teleNumber',
        // Cell: ({ value }) => PROJECT_CATEGORY[value],
      },
      {
        Header: t('userManagementTranslation.userManagementTable.status'),
        accessor: 'Status',
      },
      {
        Header: t('userManagementTranslation.userManagementTable.createdDate'),
        accessor: 'Created  Date',
      },

      {
        Header: t('userManagementTranslation.userManagementTable.modifiedBy'),
        accessor: 'Modified By',
        // Cell: ({ value }) => dateFormat(value),
      },
      {
        Header: t('userManagementTranslation.userManagementTable.modifiedDate'),
        accessor: 'Modified  Date',
        // Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <VendorManagerEdit
        selectedVendorManager={selectedVendorManager}
        onClose={() => setSelectedVendorManager(!selectedVendorManager)}
      />

      <TableWrapper
        columns={columns}
        data={data || []}
        TableRow={userManagementTableRow}
        tableHeight="calc(100vh - 200px)"
        name="clients-table"
        onRowClick={() => setSelectedVendorManager(!selectedVendorManager)}
      />
    </Box>
  )
})
