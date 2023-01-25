import { Box, useDisclosure } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { SUPPORT } from './support.i18n'
import { useState } from 'react'
import { useSupport } from 'api/support'
import { SupportModal } from './support-modal'

export const supportField = [
  { key: 4, value: 'bug' },
  { key: 5, value: 'Feature Request' },
  { key: 1, value: 'Major' },
  { key: 3, value: 'Medium' },
  { key: 2, value: 'Low' },
  { key: 66, value: 'New' },
  { key: 67, value: 'Work In Progress' },
  { key: 69, value: 'Resolved' },
  { key: 70, value: 'Rejected' },
]

export const SUPPORT_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${SUPPORT}.id`,
    accessorKey: 'id',
    accessorFn: row => {
      return row?.id?.toString() ?? '- - -'
    },
    filterFn: 'equals',
  },
  {
    header: `${SUPPORT}.title`,
    accessorKey: 'title',
  },
  {
    header: `${SUPPORT}.description`,
    accessorKey: 'description',
  },
  {
    header: `${SUPPORT}.issueType`,
    accessorKey: 'lkpSupportTypeId',
    accessorFn: row => {
      return supportField?.find(s => s.key === row.lkpSupportTypeId)?.value ?? '- - -'
    },
    filterFn: 'includesString',
  },
  {
    header: `${SUPPORT}.severity`,
    accessorKey: 'lkpSeverityId',
    accessorFn: row => {
      return supportField?.find(s => s.key === row.lkpSeverityId)?.value ?? '- - -'
    },
  },
  {
    header: `${SUPPORT}.status`,
    accessorKey: 'lkpStatusId',
    accessorFn: row => {
      return supportField?.find(s => s.key === row.lkpStatusId)?.value ?? '- - -'
    },
  },
  {
    header: `${SUPPORT}.createdBy`,
    accessorKey: 'createdBy',
    accessorFn: row => {
      return row.createdBy ?? '- - -'
    },
  },
]

export const SupportTable = () => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const { data: supportList, isLoading } = useSupport()
  const [selectedRow, setSelectedRow] = useState(supportList)
  return (
    <Box overflow="auto" roundedTop={8}>
      <SupportModal
        supportDetail={selectedRow}
        onClose={() => {
          setSelectedRow(undefined)
          onCloseDisclosure()
        }}
        isOpen={isOpen}
      />

      <Box overflow={'auto'} h="calc(100vh - 170px)" roundedTop={6} border="1px solid #CBD5E0">
        <TableContextProvider data={supportList} columns={SUPPORT_COLUMNS}>
          <Table
            isLoading={isLoading}
            onRowClick={row => {
              setSelectedRow(row)
              onOpen()
            }}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
}
