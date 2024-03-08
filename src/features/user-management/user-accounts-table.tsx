import React from 'react'
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
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { ExportButton } from 'components/table-refactored/export-button'
import TableColumnSettings from 'components/table/table-column-settings'
import { Box } from '@chakra-ui/react'
import { USER_ACCOUNT_COLUMNS } from './constants'


const UserAccountsTable = () => {
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 25 })
  const [sorting, setSorting] = React.useState<SortingState>([])

  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(USER_ACCOUNT_COLUMNS, TableNames.vendorAccountTable)


  return (
    <Box h="calc(100% - 200px)">
      <TableContextProvider
        data={[]}
        columns={tableColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        totalPages={1}
      // columnFilters={null}
      // setColumnFilters={() => null}
      >
        <Table
          onRowClick={row => {
            // setSelectedUser(row)
            // onOpen()
          }}
          isFilteredByApi={true}
          // isLoading={isLoading}
          isLoading={false}
          // isEmpty={!isLoading && !userMgt?.length}
          isEmpty={true}
        />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            {/* <ExportButton
            columns={tableColumns}
            refetch={refetch}
            isLoading={isExportDataLoading}
            fileName="user-managements"
          /> */}
            <CustomDivider />
            {/* {settingColumns && (
            <TableColumnSettings
              refetch={refetchColumns}
              disabled={isLoading}
              onSave={onSave}
              columns={settingColumns}
              tableName={TableNames.vendorUsersTable}
              isReadOnly={isReadOnly}
            />
          )} */}
          </ButtonsWrapper>
          <TablePagination>
            {/* <ShowCurrentRecordsWithTotalRecords dataCount={dataCount} /> */}
            <GotoFirstPage />
            <GotoPreviousPage />
            <GotoNextPage />
            <GotoLastPage />
          </TablePagination>
        </TableFooter>
      </TableContextProvider>
    </Box>
  )
}

export default UserAccountsTable
