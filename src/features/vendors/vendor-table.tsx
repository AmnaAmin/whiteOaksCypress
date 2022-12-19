import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useVendor, VENDORS_SELECTED_CARD_MAP_URL } from 'api/pc-projects'
import Status from 'features/common/status'
import { dateFormat } from 'utils/date-time-utils'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'
import { Vendor as VendorType } from 'types/vendor.types'
import Vendor from './selected-vendor-modal'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
// import { useGetAllWorkOrders, useWorkOrders } from 'api/projects'

const VENDOR_TABLE_QUERY_KEYS = {
  statusLabel: 'statusLabel.contains',
  companyName: 'companyName.contains',
  region: 'region.contains',
  ownerName: 'ownerName.contains',
  createdDate: 'createdDate.equals',
  coiglExpirationDate: 'coiglExpirationDate.equals',
  coiWcExpirationDate: 'coiWcExpirationDate.equals',
  einNumber: 'einNumber.contains',
  capacity: 'capacity.equals',
  availableCapacity: 'availableCapacity.equals',
  skills: 'skills.contains',
  market: 'market.contains',
}

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
    meta: { format: 'date' },
  },
  {
    header: 'COI-GL Expiration Date',
    accessorKey: 'coiglExpirationDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.coiglExpirationDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'COI-WC Expiration Date',
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
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [filteredUrl, setFilteredUrl] = useState<string | null>(null)

  const { columnFilters, setColumnFilters, queryStringWithPagination } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: VENDOR_TABLE_QUERY_KEYS,
    pagination,
    setPagination,
  })

  useEffect(() => {
    if (selectedCard) {
      setFilteredUrl(VENDORS_SELECTED_CARD_MAP_URL[selectedCard])
      setPagination({ pageIndex: 0, pageSize: 20 })
    } else {
      setFilteredUrl(null)
    }
  }, [selectedCard])

  const { vendors, isLoading, dataCount, totalPages } = useVendor(
    filteredUrl + '&' + queryStringWithPagination,
    pagination.pageSize,
  )

  // const [filterVendors, setFilterVendors] = useState(vendors)
  const [selectedVendor, setSelectedVendor] = useState<VendorType>()

  // const { refetch, isLoading: isExportDataLoading } = useGetAllWorkOrders(
  //   filteredUrl + '&' + queryStringWithoutPagination,
  // )

  // useEffect(() => {
  //   setFilterVendors(
  //     vendors?.filter(
  //       vendor => !selectedCard || vendor.statusLabel?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
  //     ),
  //   )
  // }, [selectedCard, vendors])

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

      <Box overflow={'auto'} h="calc(100vh - 320px)" roundedTop={6}>
        <TableContextProvider
          data={vendors}
          columns={tableColumns}
          totalPages={totalPages}
          pagination={pagination}
          setPagination={setPagination}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        >
          <Table
            onRowClick={row => setSelectedVendor(row)}
            isLoading={isLoading}
            // isEmpty={!isLoading && !filterVendors?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton columns={tableColumns} colorScheme="brand" fileName="vendors" />
              <CustomDivider />

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>

            <TablePagination>
              <ShowCurrentRecordsWithTotalRecords dataCount={dataCount} />
              <GotoFirstPage />
              <GotoPreviousPage />
              <GotoNextPage />
              <GotoLastPage />
            </TablePagination>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
}
