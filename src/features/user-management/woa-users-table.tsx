import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { useGetAllUserMgt, useUsrMgt } from 'pages/admin/user-management'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { USER_MGT_COLUMNS, USER_MGT_TABLE_QUERIES_KEY } from './constants'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { ExportButton } from 'components/table-refactored/export-button'
import TableColumnSettings from 'components/table/table-column-settings'

export const WOAUsersTable = React.forwardRef((props: any, ref) => {
  const { setSelectedUser, onOpen } = props
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 })
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.woaUsersTable)

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: USER_MGT_TABLE_QUERIES_KEY,
      pagination,
      setPagination,
      sorting,
    })

  const { userMgt, isLoading, totalPages, dataCount } = useUsrMgt(
    queryStringWithPagination + '&userType.notIn=6&devAccount.equals=false',
    pagination.pageIndex,
    pagination.pageSize,
  )

  const { tableColumns, settingColumns } = useTableColumnSettings(USER_MGT_COLUMNS, TableNames.woaUsersTable)

  const { refetch, isLoading: isExportDataLoading } = useGetAllUserMgt(
    queryStringWithoutPagination + '&userType.notIn=6&devAccount.equals=false',
  )

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  return (
    <>
      <Box overflow={'auto'} h="calc(100vh - 170px)" border="1px solid #CBD5E0" borderRadius="6px">
        <TableContextProvider
          data={userMgt}
          columns={tableColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          totalPages={totalPages}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        >
          <Table
            onRowClick={row => {
              setSelectedUser(row)
              onOpen()
            }}
            isLoading={isLoading}
            isEmpty={!isLoading && !userMgt?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                refetch={refetch}
                isLoading={isExportDataLoading}
                fileName="user-managements"
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
    </>
  )
})
