import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useVendor } from 'api/pc-projects'
import Status from 'features/common/status'
import Vendor from 'features/vendors/selected-vendor-modal'
import { ProjectWorkOrderType } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportCustomButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'

export const VENDOR_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'Status',
    accessorKey: 'statusLabel',
    cell: cellInfo => {
      const value = cellInfo.getValue() as string

      return <Status value={value} id={cellInfo.row.original.statusLabel} />
    },
  },

  {
    header: 'Name',
    accessorKey: 'companyName',
  },
  {
    header: 'Region',
    accessorKey: 'region',
  },
  {
    header: 'Primary Contact',
    accessorKey: 'ownerName',
  },
  {
    header: 'State',
    accessorKey: 'state',
  },
  {
    header: 'Active Date',
    accessorKey: 'createdDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.createdDate)
    },
  },
  {
    header: 'COI-GL Expiration Date',
    accessorKey: 'coiglExpirationDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.coiglExpirationDate)
    },
  },
  {
    header: 'COI-WC Expiration Date',
    accessorKey: 'coiWcExpirationDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.coiWcExpirationDate)
    },
  },
  {
    header: 'EIN/SSN',
    accessorKey: 'einNumber',
  },
  {
    header: 'Total Capacity',
    accessorKey: 'capacity',
  },
  {
    header: 'Available Capacity',
    accessorKey: 'availableCapacity',
  },
  {
    header: 'Construction Trade',
    accessorKey: 'skills',
  },
  {
    header: 'Market',
    accessorKey: 'market',
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
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ProjectWorkOrderType>()

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendors)
  const { tableColumns, settingColumns } = useTableColumnSettings(VENDOR_COLUMNS, TableNames.vendors)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box overflow="auto">
      {selectedWorkOrder && (
        <Vendor
          vendorDetails={selectedWorkOrder as ProjectWorkOrderType}
          onClose={() => {
            setSelectedWorkOrder(undefined)
          }}
        />
      )}

      <Box overflow={'auto'} h="calc(100vh - 320px)">
        <TableContextProvider data={filterVendors} columns={tableColumns}>
          <Table
            onRowClick={row => setSelectedWorkOrder(row)}
            isLoading={isLoading}
            isEmpty={!isLoading && !filterVendors?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportCustomButton columns={[]} data={filterVendors} colorScheme="brand" fileName="documents.csv" />

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
}
