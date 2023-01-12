import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useVendor } from 'api/pc-projects'
import Status from 'features/common/status'
import { dateFormat } from 'utils/date-time-utils'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportCustomButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'
import { Vendor as VendorType } from 'types/vendor.types'
import Vendor from './selected-vendor-modal'

export const VENDOR_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'status',
    accessorKey: 'statusLabel',
    accessorFn: (cellInfo: any) => {
      return cellInfo.statusLabel ? cellInfo.statusLabel : ''
    },
    cell: cellInfo => {
      const value = cellInfo.getValue() as string

      return <Status value={value} id={cellInfo.row.original.statusLabel} />
    },
  },
  {
    header: 'primaryEmail',
    accessorKey: 'businessEmailAddress',
  },
  {
    header: 'name',
    accessorKey: 'companyName',
  },
  {
    header: 'region',
    accessorKey: 'region',
  },
  {
    header: 'primaryContact',
    accessorKey: 'ownerName',
  },
  {
    header: 'state',
    accessorKey: 'state',
  },
  {
    header: 'activeDate',
    accessorKey: 'createdDate',
    accessorFn(cellInfo) {
      return cellInfo.createdDate ? dateFormat(cellInfo.createdDate) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: 'coiglExpirationDate', //'COI-GL Expiration Date',
    accessorKey: 'coiglExpirationDate',
    accessorFn(cellInfo) {
      return cellInfo.coiglExpirationDate ? dateFormat(cellInfo.coiglExpirationDate) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: 'coiWcExpirationDate',
    accessorKey: 'coiWcExpirationDate',
    accessorFn(cellInfo) {
      return cellInfo.coiWcExpirationDate ? dateFormat(cellInfo.coiWcExpirationDate) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: 'EIN/SSN',
    accessorKey: 'einNumber',
    accessorFn(cellInfo) {
      return cellInfo?.einNumber ? cellInfo?.einNumber : '- - -'
    },
  },
  {
    header: 'totalCapacity',
    accessorKey: 'capacity',
    accessorFn(cellInfo) {
      return cellInfo?.capacity ? cellInfo?.capacity?.toString() : '- - -'
    },
    filterFn: 'equalsString',
  },
  {
    header: 'availableCapacity',
    accessorKey: 'availableCapacity',
    accessorFn(cellInfo) {
      return cellInfo?.availableCapacity ? cellInfo?.availableCapacity?.toString() : '- - -'
    },
    filterFn: 'equalsString',
  },
  {
    header: 'constructionTrade',
    accessorKey: 'skills',
    accessorFn(cellInfo) {
      return cellInfo?.skills ? cellInfo?.skills : '- - -'
    },
  },
  {
    header: 'market',
    accessorKey: 'market',
    accessorFn(cellInfo) {
      return cellInfo?.market ? cellInfo?.market : '- - -'
    },
  },
  {
    header: 'businessPhoneNumber',
    accessorKey: 'businessPhoneNumber',
    accessorFn(cellInfo) {
      return cellInfo?.businessPhoneNumber ? cellInfo?.businessPhoneNumber : '- - -'
    },
  },
]

type ProjectProps = {
  selectedCard: string
}
export const VendorTable: React.FC<ProjectProps> = ({ selectedCard }) => {
  const { vendors, isLoading } = useVendor()

  const [filterVendors, setFilterVendors] = useState(vendors)

  useEffect(() => {
    setFilterVendors(
      vendors?.filter(
        vendor => !selectedCard || vendor.statusLabel?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
      ),
    )
  }, [selectedCard, vendors])
  const [selectedVendor, setSelectedVendor] = useState<VendorType>()

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendors)
  const { tableColumns, settingColumns } = useTableColumnSettings(VENDOR_COLUMNS, TableNames.vendors)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box overflow="auto">
      {selectedVendor && (
        <Vendor
          vendorDetails={selectedVendor as VendorType}
          onClose={() => {
            setSelectedVendor(undefined)
          }}
        />
      )}

      <Box overflow={'auto'} h="calc(100vh - 320px)" roundedTop={6} border="1px solid #CBD5E0">
        <TableContextProvider data={filterVendors} columns={tableColumns}>
          <Table
            onRowClick={row => setSelectedVendor(row)}
            isLoading={isLoading}
            isEmpty={!isLoading && !filterVendors?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportCustomButton columns={tableColumns} data={filterVendors} fileName="vendors" />

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
}
