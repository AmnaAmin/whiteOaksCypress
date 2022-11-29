import React, { useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { USER_MANAGEMENT } from './user-management.i8n'
import { useUserManagement } from 'api/user-management'
import { dateFormat } from 'utils/date-time-utils'
import { StatusUserMgt } from './status-user-mgt'
import { EditUserModal } from './edit-user-modal'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'

export const UserManagementTable = React.forwardRef((props: any, ref) => {
  const { data, isLoading } = useUserManagement()
  const [selectedUser, setSelectedUser] = useState(undefined)
  const { onOpen } = useDisclosure()

  const columns: ColumnDef<any>[] = [
    {
      header: `${USER_MANAGEMENT}.table.email`,
      accessorKey: 'email',
    },
    {
      header: `${USER_MANAGEMENT}.table.firstName`,
      accessorKey: 'firstName',
    },
    {
      header: `${USER_MANAGEMENT}.table.lastName`,
      accessorKey: 'lastName',
    },
    {
      header: `${USER_MANAGEMENT}.table.account`,
      accessorKey: 'userTypeLabel',
    },
    {
      header: `${USER_MANAGEMENT}.table.language`,
      accessorKey: 'langKey',
    },
    {
      header: `${USER_MANAGEMENT}.table.status`,
      accessorKey: 'status',
      cell: (row: any) => {
        const value = row?.row.original?.activated
        return <StatusUserMgt id={value} />
      },
    },
    {
      header: `${USER_MANAGEMENT}.table.createdDate`,
      accessorKey: 'createdDate',
      accessorFn: value => dateFormat(value.createdDate),
    },

    {
      header: `${USER_MANAGEMENT}.table.modifiedBy`,
      accessorKey: 'lastModifiedBy',
    },
    {
      header: `${USER_MANAGEMENT}.table.modifiedDate`,
      accessorKey: 'lastModifiedDate',
      accessorFn: value => dateFormat(value.lastModifiedDate),
    },
  ]

  return (
    <>
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={selectedUser ? true : false}
          onClose={() => {
            setSelectedUser(undefined)
          }}
        />
      )}

      <Box overflow={'auto'} h="calc(100vh - 225px)">
        <TableContextProvider data={data} columns={columns}>
          <Table
            onRowClick={row => {
              setSelectedUser(row)
              onOpen()
            }}
            isLoading={isLoading}
            isEmpty={!isLoading && !data?.length}
          />
        </TableContextProvider>
      </Box>
    </>
  )
})
