import { Box, useDisclosure } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { SUPPORT } from './support.i18n'
import { useState } from 'react'
import { useSupport } from 'api/support'
import { SupportModal } from './support-modal'

export const SUPPORT_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${SUPPORT}.id`,
    accessorKey: 'value',
  },
  {
    header: `${SUPPORT}.title`,
    accessorKey: 'value',
  },
  {
    header: `${SUPPORT}.description`,
    accessorKey: 'value',
  },
  {
    header: `${SUPPORT}.issueType`,
    accessorKey: 'value',
  },
  {
    header: `${SUPPORT}.severity`,
    accessorKey: 'value',
  },
  {
    header: `${SUPPORT}.status`,
    accessorKey: 'value',
  },
  {
    header: `${SUPPORT}.createdBy`,
    accessorKey: 'value',
  },
  {
    header: `${SUPPORT}.createdDate`,
    accessorKey: 'value',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.createdDate)
    },
  },
  {
    header: `${SUPPORT}.modifiedDate`,
    accessorKey: 'value',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.modifiedDate)
    },
  },
]

export const SupportTable = () => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [selectedRow, setSelectedRow] = useState()
  const { data: supportList, isLoading } = useSupport()
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

      <Box overflow={'auto'} h="calc(100vh - 160px)">
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
