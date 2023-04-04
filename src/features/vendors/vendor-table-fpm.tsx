import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useFPMVendor, VENDORS_SELECTED_CARD_MAP_URL, useGetAllFPMVendors } from 'api/pc-projects'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'
import { Vendor as VendorType } from 'types/vendor.types'
import Vendor from './selected-vendor-modal'
import { FPMManagerTypes, useUser } from 'api/user-management'
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
import { VENDOR_COLUMNS, VENDOR_TABLE_QUERY_KEYS } from './vendor-table'

type ProjectProps = {
  selectedCard: string
}
export const FPMVendors: React.FC<ProjectProps> = ({ selectedCard }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const vendor = (location?.state as any)?.data || {}

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [fpmBasedQueryParams, setFpmBasedQueryParams] = useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])

  useEffect(() => {
    if (vendor?.id) {
      setSelectedVendor(vendor)
      navigate(location.pathname, {})
    }
  }, [vendor])

  const { data: account } = useAuth()
  const { data: userInfo } = useUser(account?.user?.email)

  useEffect(() => {
    if (userInfo?.id) {
      let fpmBasedFilters = ''
      switch (userInfo?.fieldProjectManagerRoleId) {
        case FPMManagerTypes.District: {
          const states = userInfo?.fpmStates?.map(m => m.code)?.join(',')
          fpmBasedFilters = 'stateCode.in=' + states
          break
        }
        case FPMManagerTypes.Regional: {
          const regions = userInfo?.regions?.join(',')
          fpmBasedFilters = 'regionId.in=' + regions
          break
        }
        case FPMManagerTypes.Regular: {
          const marketIds = userInfo?.markets?.map(m => m.id)?.join(',')
          fpmBasedFilters = 'marketId.in=' + marketIds
          break
        }
        case FPMManagerTypes.SrFPM: {
          const marketIds = userInfo?.markets?.map(m => m.id)?.join(',')
          fpmBasedFilters = 'marketId.in=' + marketIds
          break
        }
      }
      if (selectedCard) {
        setFpmBasedQueryParams(fpmBasedFilters + '&' + VENDORS_SELECTED_CARD_MAP_URL[selectedCard])
        setPagination({ pageIndex: 0, pageSize: 20 })
      } else {
        setFpmBasedQueryParams(fpmBasedFilters)
      }
    }
  }, [userInfo, selectedCard])

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: VENDOR_TABLE_QUERY_KEYS,
      pagination,
      setPagination,
      sorting,
    })

  const {
    vendors: fpmVendors,
    isLoading: isFPMVendorLoading,
    dataCount: fpmDataCount,
    totalPages: fpmTotalPages,
  } = useFPMVendor(fpmBasedQueryParams, queryStringWithPagination, pagination.pageSize)

  const [selectedVendor, setSelectedVendor] = useState<VendorType>()

  const { refetch: fpmVendorsRefetch, isLoading: isFPMExportDataLoading } = useGetAllFPMVendors(
    fpmBasedQueryParams,
    queryStringWithoutPagination,
  )

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

      <Box overflowX={'auto'} minH="calc(100vh - 370px)" roundedTop={6} border="1px solid #CBD5E0">
        <TableContextProvider
          data={fpmVendors}
          columns={tableColumns}
          totalPages={fpmTotalPages}
          pagination={pagination}
          setPagination={setPagination}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          sorting={sorting}
          setSorting={setSorting}
        >
          <Table
            onRowClick={row => setSelectedVendor(row)}
            isLoading={isFPMVendorLoading}
            isEmpty={!isFPMVendorLoading && !fpmVendors?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="vendors"
                refetch={fpmVendorsRefetch}
                isLoading={isFPMExportDataLoading}
              />
              <CustomDivider />

              {settingColumns && (
                <TableColumnSettings disabled={isFPMVendorLoading} onSave={onSave} columns={settingColumns} />
              )}
            </ButtonsWrapper>

            <TablePagination>
              <ShowCurrentRecordsWithTotalRecords dataCount={fpmDataCount} />
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
