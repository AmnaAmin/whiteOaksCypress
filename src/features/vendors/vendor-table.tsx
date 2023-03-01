import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import {
  useFPMVendor,
  useGetAllVendors,
  useVendor,
  VENDORS_SELECTED_CARD_MAP_URL,
  useGetAllFPMVendors,
} from 'api/pc-projects'
import Status from 'features/common/status'
import { dateFormat } from 'utils/date-time-utils'
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'
import { Vendor as VendorType } from 'types/vendor.types'
import Vendor from './selected-vendor-modal'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useUser } from 'api/user-management'
import { useAuth } from 'utils/auth-context'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { useLocation, useNavigate } from 'react-router-dom'

const VENDOR_TABLE_QUERY_KEYS = {
  statusLabel: 'statusLabel.equals',
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
  state: 'state.contains',
  businessPhoneNumber: 'businessPhoneNumber.contains',
  businessEmailAddress: 'businessEmailAddress.contains',
}

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
    header: 'businessEmail',
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
      return cellInfo?.markets ? cellInfo?.markets : '- - -'
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
  const { isFPM } = useUserRolesSelector()
  const location = useLocation()
  const navigate = useNavigate()
  const vendor = (location?.state as any)?.data || {}

  useEffect(() => {
    if (vendor?.id) {
      setSelectedVendor(vendor)
      navigate(location.pathname, {})
    }
  }, [vendor])

  // FPM portal -> Show vendors having same market as the logged in FPM
  const { data: account } = useAuth()
  const { data: userInfo } = useUser(account?.user?.email)
  const marketIDs = userInfo?.markets?.map(m => m.id)

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [filteredUrl, setFilteredUrl] = useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: VENDOR_TABLE_QUERY_KEYS,
      pagination,
      setPagination,
      sorting,
      selectedCard,
    })

  useEffect(() => {
    if (selectedCard) {
      setFilteredUrl(VENDORS_SELECTED_CARD_MAP_URL[selectedCard])
      setPagination({ pageIndex: 0, pageSize: 20 })
    } else {
      setFilteredUrl(null)
    }
  }, [selectedCard])

  const {
    vendors: allVendors,
    isLoading: vendorsLoading,
    dataCount: vendorsDataCount,
    totalPages: vendorsTotalPages,
  } = useVendor(
    filteredUrl ? filteredUrl + '&' + queryStringWithPagination : queryStringWithPagination,
    pagination.pageSize,
  )

  const {
    vendors: fpmVendors,
    isLoading: isFPMVendorLoading,
    dataCount: fpmDataCount,
    totalPages: fpmTotalPages,
  } = useFPMVendor(
    marketIDs ? marketIDs : [],
    filteredUrl ? filteredUrl + '&' + queryStringWithPagination : queryStringWithPagination,
    pagination.pageSize,
    isFPM,
  )

  const [selectedVendor, setSelectedVendor] = useState<VendorType>()
  const { refetch: allVendorsRefetch, isLoading: isAllExportDataLoading } = useGetAllVendors(
    filteredUrl ? filteredUrl + '&' + queryStringWithoutPagination : queryStringWithoutPagination,
  )

  const { refetch: fpmVendorsRefetch, isLoading: isFPMExportDataLoading } = useGetAllFPMVendors(
    marketIDs,
    filteredUrl ? filteredUrl + '&' + queryStringWithoutPagination : queryStringWithoutPagination,
  )

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendors)
  const { tableColumns, settingColumns } = useTableColumnSettings(
    VENDOR_COLUMNS,
    TableNames.vendors,
    //  { statusLabel: selectedCard ? selectedCard : ''}
  )

  const onSave = columns => {
    postGridColumn(columns)
  }

  const vendors = isFPM ? fpmVendors : allVendors
  const isLoading = isFPM ? isFPMVendorLoading : vendorsLoading
  const dataCount = isFPM ? fpmDataCount : vendorsDataCount
  const totalPages = isFPM ? fpmTotalPages : vendorsTotalPages
  const refetch = isFPM ? fpmVendorsRefetch : allVendorsRefetch
  const isExportDataLoading = isFPM ? isFPMExportDataLoading : isAllExportDataLoading

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

      <Box overflowX={'auto'} minH="calc(100vh - 370px)" roundedTop={6} border="1px solid #CBD5E0">
        <TableContextProvider
          data={vendors}
          columns={tableColumns}
          totalPages={totalPages}
          pagination={pagination}
          setPagination={setPagination}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          sorting={sorting}
          setSorting={setSorting}
        >
          <Table
            onRowClick={row => setSelectedVendor(row)}
            isLoading={isLoading}
            isEmpty={!isLoading && !vendors?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="vendors"
                refetch={refetch}
                isLoading={isExportDataLoading}
              />
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
