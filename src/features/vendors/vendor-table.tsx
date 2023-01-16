import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useFPMVendor, useVendor } from 'api/pc-projects'
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
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useUser } from 'api/user-management'
import { useAuth } from 'utils/auth-context'

export const VENDOR_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'status',
    accessorKey: 'statusLabel',
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
      return dateFormat(cellInfo.createdDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'coiglExpirationDate', //'COI-GL Expiration Date',
    accessorKey: 'coiglExpirationDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.coiglExpirationDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'coiWcExpirationDate',
    accessorKey: 'coiWcExpirationDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.coiWcExpirationDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'EIN/SSN',
    accessorKey: 'einNumber',
  },
  {
    header: 'totalCapacity',
    accessorKey: 'capacity',
    accessorFn(cellInfo) {
      return cellInfo?.capacity?.toString()
    },
  },
  {
    header: 'availableCapacity',
    accessorKey: 'availableCapacity',
    accessorFn(cellInfo) {
      return cellInfo?.availableCapacity?.toString()
    },
  },
  {
    header: 'constructionTrade',
    accessorKey: 'skills',
  },
  {
    header: 'market',
    accessorKey: 'market',
  },
  {
    header: 'businessPhoneNumber',
    accessorKey: 'businessPhoneNumber',
  },
]

type ProjectProps = {
  selectedCard: string
}
export const VendorTable: React.FC<ProjectProps> = ({ selectedCard }) => {
  const { vendors: allVendors, isLoading } = useVendor()
  const { isFPM } = useUserRolesSelector()

  // FPM portal -> Show vendors having same market as the logged in FPM
  const { data: account } = useAuth()
  const { data: userInfo } = useUser(account?.user?.email)
  const marketIDs = userInfo?.markets?.map(m => m.id)
  const { fpmVendors } = useFPMVendor(marketIDs)

  const vendors = isFPM ? fpmVendors : allVendors
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
              <ExportCustomButton columns={tableColumns} data={filterVendors} colorScheme="brand" fileName="vendors" />

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
}
