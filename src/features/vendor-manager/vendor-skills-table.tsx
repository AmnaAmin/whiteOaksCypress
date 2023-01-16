import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'
import {  useTrades } from 'api/vendor-details'
import { Market } from 'types/vendor.types'
import { NewVendorSkillsModal } from './new-vendor-skill-modal'
import { VENDOR_MANAGER } from './vendor-manager.i18n'

export const VENDORSKILLS_COLUMNS: ColumnDef<any>[] = [
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
    accessorFn(cellInfo) {
      return cellInfo.createdDate ? dateFormat(cellInfo.createdDate) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: `${VENDOR_MANAGER}.modifiedBy`,
    accessorKey: 'modifiedBy',
  },
  {
    header: `${VENDOR_MANAGER}.modifiedDate`,
    accessorKey: 'modifiedDate',
    accessorFn(cellInfo) {
      return cellInfo.modifiedDate ? dateFormat(cellInfo.modifiedDate) : '- - -'
    },
    meta: { format: 'date' },
  },
]

export const VendorSkillsTable: React.FC<{}> = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { data: VendorSkills, isLoading, refetch } = useTrades()
    const [selectedVendorSkills, setSelectedVendorSkills] = useState<Market>()
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendorSkills)
  const { tableColumns, settingColumns } = useTableColumnSettings(VENDORSKILLS_COLUMNS, TableNames.vendorSkills)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box overflow="auto">
      {selectedVendorSkills && (
        <NewVendorSkillsModal
          isOpen={selectedVendorSkills ? true : false}
          onClose={() => {
            setSelectedVendorSkills(undefined)
          }}
          selectedVendorSkills={selectedVendorSkills}
        />
      )}
      <Box overflow={'auto'} h="calc(100vh - 225px)" border="1px solid #CBD5E0" borderBottomRadius="6px">
        <TableContextProvider data={VendorSkills} columns={tableColumns} sorting={sorting} setSorting={setSorting}>
          <Table
            onRowClick={row => setSelectedVendorSkills(row)}
            isLoading={isLoading}
            isEmpty={!isLoading && !VendorSkills?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="VendorSkills"
                refetch={refetch}
                isLoading={isLoading}
              />
              <CustomDivider />

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
}

