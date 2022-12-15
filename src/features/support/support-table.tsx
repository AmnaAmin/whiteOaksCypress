import { Box, useDisclosure } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { SUPPORT } from './support.i18n'
import { useState } from 'react'
import { useSupport } from 'api/support'
import { SupportModal } from './support-modal'

export enum SUPPORT_FIELDS_TYPES {
  bug = 4,
  FeatureRequest = 5,
  Major = 1,
  Medium = 3,
  Low = 2,
  New = 66,
  WorkInProgress = 67,
  Resolved = 69,
  Rejected = 70,
}

const SupportTypes: React.FC<{ Id: number }> = ({ Id }) => {
  return (
    <>
      {Id === 4
        ? 'bug'
        : null || Id === SUPPORT_FIELDS_TYPES.bug
        ? 'Feature Request'
        : null || Id === SUPPORT_FIELDS_TYPES.FeatureRequest
        ? 'Feature Request'
        : null || Id === SUPPORT_FIELDS_TYPES.Major
        ? 'Major'
        : null || Id === SUPPORT_FIELDS_TYPES.Medium
        ? 'Medium'
        : null || Id === SUPPORT_FIELDS_TYPES.Low
        ? 'Low'
        : null || Id === SUPPORT_FIELDS_TYPES.New
        ? 'New'
        : null || Id === SUPPORT_FIELDS_TYPES.WorkInProgress
        ? 'WorkIn Progress'
        : null || Id === SUPPORT_FIELDS_TYPES.Resolved
        ? 'Resolved'
        : null || Id === SUPPORT_FIELDS_TYPES.Rejected
        ? 'Rejected'
        : null}
    </>
  )
}

export const SUPPORT_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${SUPPORT}.id`,
    accessorKey: 'id',
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
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <SupportTypes Id={value} />
    },
  },
  {
    header: `${SUPPORT}.severity`,
    accessorKey: 'lkpSeverityId',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <SupportTypes Id={value} />
    },
  },
  {
    header: `${SUPPORT}.status`,
    accessorKey: 'lkpStatusId',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <SupportTypes Id={value} />
    },
  },
  {
    header: `${SUPPORT}.createdBy`,
    accessorKey: 'createdBy',
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
