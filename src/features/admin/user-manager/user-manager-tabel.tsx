import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { Clients } from 'types/client.type'
import Client from 'features/clients/client-modal'
import { TableWrapper } from 'components/table/table'
import { useTranslation } from 'react-i18next'

const userManagerTableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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

export const UserManagerTabel = React.forwardRef((props: any, ref) => {
  // const { data: clients } = useClients()
  const [selectedClient, setSelectedClient] = useState<Clients>()
  const { t } = useTranslation()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: t('email'),
        accessor: 'email',
      },
      {
        Header: t('firstName'),
        accessor: 'firstName',
      },
      {
        Header: t('lastName'),
        accessor: 'Last Name',
      },
      {
        Header: t('account'),
        accessor: 'Account',
      },
      {
        Header: t('language'),
        accessor: 'Language',
        // Cell: ({ value }) => PROJECT_CATEGORY[value],
      },
      {
        Header: t('status'),
        accessor: 'Status',
      },
      {
        Header: t('createdDate'),
        accessor: 'Created  Date',
      },

      {
        Header: t('modifiedBy'),
        accessor: 'Modified By',
        // Cell: ({ value }) => dateFormat(value),
      },
      {
        Header: t('modified Date'),
        accessor: 'Modified  Date',
        // Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <Client
        clientDetails={selectedClient as Clients}
        onClose={() => {
          setSelectedClient(undefined)
        }}
      />

      <TableWrapper
        columns={columns}
        data={[]}
        TableRow={userManagerTableRow}
        tableHeight="calc(100vh - 200px)"
        name="clients-table"
        onRowClick={(e, row) => setSelectedClient(row.original)}
      />
    </Box>
  )
})
