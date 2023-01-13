import React, { useEffect, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useClients } from 'api/clients'
import { Clients } from 'types/client.type'
import Client from 'features/clients/selected-client-modal'
import { CLIENTS } from './clients.i18n'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'

export const ClientsTable = React.forwardRef((props: any, ref) => {
  const { data: clients, isLoading, refetch } = useClients()
  const [selectedClient, setSelectedClient] = useState<Clients>()
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

  const columns: ColumnDef<any>[] = [
    {
      header: `${CLIENTS}.name`,
      accessorKey: 'companyName',
    },
    {
      header: `${CLIENTS}.contact`,
      accessorKey: 'contacts[0].contact',
      accessorFn: row => {
        return row.contacts?.[0] ? row.contacts?.[0]?.contact : '- - -'
      },
    },
    {
      header: `${CLIENTS}.address`,
      accessorKey: 'streetAddress',
      accessorFn: row => {
        return row.streetAddress ? row.streetAddress : '- - -'
      },
    },
    {
      header: `${CLIENTS}.phone`,
      accessorKey: 'contacts[0].phoneNumber',
      accessorFn: row => {
        return row.contacts?.[0] ? row.contacts?.[0]?.phoneNumber : '- - -'
      },
    },
    {
      header: `${CLIENTS}.email`,
      accessorKey: 'contacts[0].emailAddress',
      accessorFn: row => {
        return row.contacts?.[0] ? row.contacts?.[0]?.emailAddress : '- - -'
      },
    },
    {
      header: `${CLIENTS}.contact`,
      accessorKey: 'accountPayableContactInfos[0].contact',
      accessorFn: row => {
        return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.contact : '- - -'
      },
    },
    {
      header: `${CLIENTS}.email`,
      accessorKey: 'accountPayableContactInfos[0].emailAddress',
      accessorFn: row => {
        return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.emailAddress : '- - -'
      },
    },
    {
      header: `${CLIENTS}.phone`,
      accessorKey: 'accountPayableContactInfos[0].phoneNumber',
      accessorFn: row => {
        return row.accountPayableContactInfos?.[0] ? row.accountPayableContactInfos?.[0]?.phoneNumber : '- - -'
      },
    },
  ]

  return (
    <Box>
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

      <Box overflow={'auto'} h="calc(100vh - 225px)" border="1px solid #CBD5E0" borderBottomRadius="6px">
        <TableContextProvider data={clients} columns={columns}>
          <Table
            onRowClick={row => {
              setSelectedClient(row)
              onOpen()
            }}
            isLoading={isLoading}
            isEmpty={!isLoading && !clients?.length}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
})
