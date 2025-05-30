import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useFetchUserDetails, useGetAllVendors, useVendor, VENDORS_SELECTED_CARD_MAP_URL } from 'api/pc-projects'
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
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAccountData } from 'api/user-account'

export const VENDOR_TABLE_QUERY_KEYS = {
  statusLabel: 'statusLabel.contains',
  companyName: 'companyName.contains',
  region: 'region.contains',
  ownerName: 'ownerName.contains',
  createdDateStart: 'createdDate.greaterThanOrEqual',
  createdDateEnd: 'createdDate.lessThanOrEqual',
  coiglExpirationDateStart: 'coiglExpirationDate.greaterThanOrEqual',
  coiglExpirationDateEnd: 'coiglExpirationDate.lessThanOrEqual',
  coiWcExpirationDateStart: 'coiWcExpirationDate.greaterThanOrEqual',
  coiWcExpirationDateEnd: 'coiWcExpirationDate.lessThanOrEqual',
  einNumber: 'einNumber.contains',
  capacity: 'capacity.equals',
  availableCapacity: 'availableCapacity.equals',
  skills: 'skills.contains',
  market: 'market.contains',
  state: 'state.contains',
  businessPhoneNumber: 'businessPhoneNumber.contains',
  businessEmailAddress: 'businessEmailAddress.contains',
  streetAddress: 'streetAddress.contains',
  city: 'city.contains',
  zipCode: 'zipCode.contains',
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
    header: 'vendorAddress',
    accessorKey: 'streetAddress',
  },
  {
    header: 'vendorCity',
    accessorKey: 'city',
  },
  {
    header: 'vendorZipCode',
    accessorKey: 'zipCode',
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
      const ein = cellInfo?.einNumber || ''
      const ssn = cellInfo?.ssnNumber || ''

      if (ein && ssn) {
        return `${ein} / ${ssn}`
      } else if (ein) {
        return ein
      } else if (ssn) {
        return ssn
      } else {
        return '- - -'
      }
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
  isReadOnly?: boolean
}

export const VendorTable: React.FC<ProjectProps> = ({ selectedCard, isReadOnly }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const vendorId = searchParams.get('vendorId');
  const vendor = (location?.state as any)?.data || {}
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [filteredUrl, setFilteredUrl] = useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { data: account } = useAccountData()
  const { user } = useFetchUserDetails(account?.email)

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: VENDOR_TABLE_QUERY_KEYS,
      pagination,
      setPagination,
      sorting,
    })

  const {
    vendors,
    isLoading: vendorsLoading,
    dataCount: vendorsDataCount,
    totalPages: vendorsTotalPages,
  } = useVendor(
    user,
    filteredUrl ? filteredUrl + '&' + queryStringWithPagination : queryStringWithPagination,
    pagination.pageSize,
  )

  const [selectedVendorId, setSelectedVendorId] = useState<number>()
  const { refetch: allVendorsRefetch, isLoading: isAllExportDataLoading } = useGetAllVendors(
    user,
    filteredUrl ? filteredUrl + '&' + queryStringWithoutPagination : queryStringWithoutPagination,
  )

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendors)
  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(VENDOR_COLUMNS, TableNames.vendors)

  useEffect(() => {
    if (vendor?.id) {
      setSelectedVendorId(vendor.id)
      navigate(location.pathname, {})
    }
  }, [vendor])

  useEffect(() => {
    if (vendorId) {
      setSelectedVendorId(Number(vendorId))
    }
  }, [vendorId])

  useEffect(() => {
    if (selectedCard) {
      setFilteredUrl(VENDORS_SELECTED_CARD_MAP_URL[selectedCard])
      setPagination({ pageIndex: 0, pageSize: 20 })
    } else {
      setFilteredUrl(null)
    }
  }, [selectedCard])

  const onSave = columns => {
    postGridColumn(columns)
  }

  const resetParams = () => {
    searchParams.delete('vendorId')
    setSearchParams(searchParams)
  }


  return (
    <Box overflow="auto">
      {selectedVendorId && (
        <Vendor
          vendorId={selectedVendorId}
          onClose={() => {
            setSelectedVendorId(undefined)
            resetParams()
          }}
        />
      )}

      <Box overflowX={'auto'} minH="calc(100vh - 370px)" roundedTop={6} border="1px solid #CBD5E0">
        <TableContextProvider
          data={vendors}
          columns={tableColumns}
          totalPages={vendorsTotalPages}
          pagination={pagination}
          setPagination={setPagination}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          sorting={sorting}
          setSorting={setSorting}
        >
          <Table
            onRowClick={row => setSelectedVendorId(row.id)}
            isFilteredByApi={true}
            isLoading={vendorsLoading}
            isEmpty={!vendorsLoading && !vendors?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="vendors"
                refetch={allVendorsRefetch}
                isLoading={isAllExportDataLoading}
              />
              <CustomDivider />

              {settingColumns && (
                <TableColumnSettings
                  refetch={refetchColumns}
                  disabled={vendorsLoading}
                  onSave={onSave}
                  columns={settingColumns}
                  tableName={TableNames.vendors}
                  isReadOnly={isReadOnly}
                />
              )}
            </ButtonsWrapper>

            <TablePagination>
              <ShowCurrentRecordsWithTotalRecords dataCount={vendorsDataCount} />
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
