import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, Button, RadioGroup, Stack, Radio, VStack } from '@chakra-ui/react'
import { VendorProfile } from 'types/vendor.types'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { t } from 'i18next'
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import TableColumnSettings from 'components/table/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { useVendorWorkOrders, useFetchAllVendorWorkOrders } from 'api/vendor-details'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import Status from 'features/common/status'

type ProjectProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile | undefined
}

const VENDOR_PROJECTS_QUERY_KEYS = {
  projectId: 'projectId.equals',
  projectType: 'projectType.contains',
  statusLabel: 'statusLabel.contains',
  propertyAddress: 'propertyAddress.contains',
  id: 'id.equals',
  pendingTransactions: 'pendingTransactions.equals',
}

export const VendorProjects: React.FC<ProjectProps> = ({ onClose, vendorProfileData }) => {
  const { isFPM } = useUserRolesSelector()

  const VENDOR_PROJECTS_TABLE_COLUMNS: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: 'projectId',
        accessorKey: 'projectId',
      },
      {
        header: 'type',
        accessorKey: 'projectType',
      },
      {
        header: 'status',
        accessorKey: 'statusLabel',
        cell: row => {
          const value = row.cell.getValue() as string
          return <Status value={value} id={value} />
        },
      },
      {
        header: 'streetAddress',
        accessorKey: 'propertyAddress',
      },
      {
        header: 'pendingTransactions',
        accessorKey: 'pendingTransactions',
        accessorFn(cellInfo) {
          return cellInfo.pendingTransactions
        },
      },
      {
        header: 'WoId',
        accessorKey: 'id',
      },
    ]
  }, [])
  const activeStatusFilter = '&status.in=34,36,110,111,114'
  const paidStatusFilter = '&status.in=68'
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [filteredUrl, setFilteredUrl] = useState<string | null>(activeStatusFilter)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: VENDOR_PROJECTS_QUERY_KEYS,
      pagination,
      setPagination,
      sorting,
    })

  const { isLoading: loadingAllVendorProjects, refetch } = useFetchAllVendorWorkOrders(
    queryStringWithoutPagination + `&vendorId.equals=${vendorProfileData?.id}` + filteredUrl,
  )
  const { vendorProjects, isLoading, isFetching, dataCount, totalPages } = useVendorWorkOrders(
    queryStringWithPagination + `&vendorId.equals=${vendorProfileData?.id}` + filteredUrl,
    pagination.pageSize,
  )

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendorProjects)
  const { tableColumns, settingColumns } = useTableColumnSettings(
    VENDOR_PROJECTS_TABLE_COLUMNS,
    TableNames.vendorProjects,
  )

  const [projectStatus, setProjectStatus] = useState('active')

  useEffect(() => {
    if (projectStatus === 'paid') setFilteredUrl(paidStatusFilter)
    else setFilteredUrl(activeStatusFilter)
  }, [projectStatus])

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  return (
    <>
      <VStack px="11px" gap="20px" mb="14px">
        <RadioGroup w="100%" justifyContent={'flex-start'} onChange={setProjectStatus} value={projectStatus}>
          <Stack direction="row">
            <Radio value="active" isDisabled={isFPM}>
              {t('active')}
            </Radio>
            <Radio value="paid" isDisabled={isFPM}>
              {t('paid')}
            </Radio>
          </Stack>
        </RadioGroup>
        <Box
          overflow={'auto'}
          w="100%"
          h="530px"
          position="relative"
          roundedTop={6}
          pointerEvents={isFPM ? 'none' : 'auto'}
          border="1px solid #CBD5E0"
          rounded="6px"
        >
          <TableContextProvider
            data={vendorProjects}
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
              isLoading={isLoading || isFetching}
              isEmpty={!isLoading && !isFetching && !(vendorProjects as Array<any>)?.length}
            />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportButton
                  columns={tableColumns}
                  colorScheme="brand"
                  fileName="vendors"
                  isLoading={loadingAllVendorProjects}
                  refetch={refetch}
                />
                <CustomDivider />

                {settingColumns && (
                  <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />
                )}
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
      </VStack>
      <Flex
        px={2}
        borderTop="2px solid #E2E8F0"
        alignItems="center"
        height="66px"
        pt="8px"
        w="100%"
        justifyContent="end"
      >
        {onClose && (
          <Button variant={isFPM ? 'solid' : 'outline'} colorScheme="brand" onClick={onClose} mr="3">
            {t('cancel')}
          </Button>
        )}
        {!isFPM && (
          <Button type="submit" variant="solid" colorScheme="brand" data-testid="saveMarkets" isDisabled={isFPM}>
            {t('save')}
          </Button>
        )}
      </Flex>
    </>
  )
}
