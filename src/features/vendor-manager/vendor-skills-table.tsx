import React, { useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useTrades } from 'api/vendor-details'
import { NewVendorSkillsModal } from './new-vendor-skill-modal'
import { dateFormat } from 'utils/date-time-utils'
import { VENDOR_MANAGER } from './vendor-manager.i18n'
import { Market } from 'types/vendor.types'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { ColumnDef } from '@tanstack/react-table'

export const VENDORE_SKILLS_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${VENDOR_MANAGER}.skills`,
    accessorKey: 'skill',
  },
  {
    header: `${VENDOR_MANAGER}.createdBy`,
    accessorKey: 'createdBy',
  },
  {
    header: `${VENDOR_MANAGER}.createdDate`,
    accessorKey: 'createdDate',
    accessorFn: cellInfo => dateFormat(cellInfo.createdDate),
    meta: { format: 'date' },
  },
  {
    header: `${VENDOR_MANAGER}.modifiedBy`,
    accessorKey: 'modifiedBy',
  },
  {
    header: `${VENDOR_MANAGER}.modifiedDate`,
    accessorKey: 'modifiedDate',
    accessorFn: cellInfo => dateFormat(cellInfo.modifiedDate),
    meta: { format: 'date' },
  },
]

export const VendorSkillsTable = () => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const { data: VendorSkills, isLoading, refetch } = useTrades()
  const [selectedVendorSkills, setSelectedVendorSkills] = useState<Market>()
  return (
    <Box overflow="auto" roundedTop={8}>
      <NewVendorSkillsModal
        selectedVendorSkills={selectedVendorSkills}
        onClose={() => {
          refetch()
          setSelectedVendorSkills(undefined)
          onCloseDisclosure()
        }}
        isOpen={isOpen}
      />

      <Box overflow={'auto'} h="calc(100vh - 160px)" roundedTop={6} border="1px solid #CBD5E0">
        <TableContextProvider data={VendorSkills} columns={VENDORE_SKILLS_COLUMNS}>
          <Table
            isLoading={isLoading}
            onRowClick={row => {
              setSelectedVendorSkills(row)
              onOpen()
            }}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
}
