import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { useClients } from 'utils/clients'
import { Clients } from 'types/client.type'
import Client from 'features/projects/modals/project-coordinator/client-modal'
import { TableWrapper } from 'components/table/table'

const clientsTableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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

export const ClientsTable = React.forwardRef((props: any, ref) => {
  const { data: clients } = useClients()
  const [selectedClientId, setSelectedClientId] = useState<Clients>()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'Name',
        accessor: 'companyName',
      },
      {
        Header: 'Contact',
        accessor: 'contacts[0].contact',
      },
      {
        Header: 'Address',
        accessor: 'streetAddress',
      },
      {
        Header: 'Phone',
        accessor: 'contacts[0].phoneNumber',
      },
      {
        Header: 'Email',
        accessor: 'contacts[0].emailAddress',
        // Cell: ({ value }) => PROJECT_CATEGORY[value],
      },
      {
        Header: 'Contact',
        accessor: 'accountPayableContactInfos[0].contact',
      },
      {
        Header: 'Email',
        accessor: 'accountPayableContactInfos[0].emailAddress',
      },

      {
        Header: 'Phone',
        accessor: 'accountPayableContactInfos[0].phoneNumber',
        // Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <Client
        clientDetails={selectedClientId as Clients}
        onClose={() => {
          setSelectedClientId(undefined)
        }}
      />

      <TableWrapper
        columns={columns}
        data={clients || []}
        TableRow={clientsTableRow}
        tableHeight="calc(100vh - 300px)"
        name="clients-table"
        onRowClick={(e, row) => setSelectedClientId(row.original)}
      />
    </Box>
  )
})
