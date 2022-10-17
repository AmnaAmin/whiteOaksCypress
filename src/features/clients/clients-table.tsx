import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { useClients } from 'api/clients'
import { Clients } from 'types/client.type'
import Client from 'features/clients/selected-client-modal'
import { TableWrapper } from 'components/table/table'
import { useTranslation } from 'react-i18next'

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
          <Td {...cell.getCellProps()} p="0">
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
  const { data: clients, isLoading, refetch } = useClients()
  const [selectedClient, setSelectedClient] = useState<Clients>()
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()

  useEffect(() => {
    if (clients && clients.length > 0 && selectedClient?.id) {
      const updatedClient = clients?.find(c => c.id === selectedClient?.id)
      if (updatedClient) {
        setSelectedClient({ ...updatedClient })
      } else {
        setSelectedClient(undefined)
      }
    } else {
      setSelectedClient(undefined)
    }
  }, [clients])

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: t('name' as string),
        accessor: 'companyName',
      },
      {
        Header: t('contact'),
        accessor: 'contacts[0].contact',
      },
      {
        Header: t('address'),
        accessor: 'streetAddress',
      },
      {
        Header: t('phone'),
        accessor: 'contacts[0].phoneNumber',
      },
      {
        Header: t('email'),
        accessor: 'contacts[0].emailAddress',
      },
      {
        Header: t('contact'),
        accessor: 'accountPayableContactInfos[0].contact',
      },
      {
        Header: t('email'),
        accessor: 'accountPayableContactInfos[0].emailAddress',
      },

      {
        Header: t('phone'),
        accessor: 'accountPayableContactInfos[0].phoneNumber',
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      {isOpen && (
        <Client
          clientDetails={selectedClient as Clients}
          onClose={() => {
            refetch()
            setSelectedClient(undefined)
            onCloseDisclosure()
          }}
          isOpen={isOpen}
        />
      )}

      <TableWrapper
        columns={columns}
        data={clients || []}
        isLoading={isLoading}
        TableRow={clientsTableRow}
        tableHeight="calc(100vh - 225px)"
        name="clients-table"
        onRowClick={(e, row) => {
          setSelectedClient(row.original)
          onOpen()
        }}
      />
    </Box>
  )
})
