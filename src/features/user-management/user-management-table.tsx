import React, { useEffect, useMemo, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { EditUserModal } from './edit-user-modal'
import { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'
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
  SelectPageSize,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { USER_MGT_COLUMNS, USER_MGT_TABLE_QUERIES_KEY } from './constants'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { ExportButton } from 'components/table-refactored/export-button'
import TableColumnSettings from 'components/table/table-column-settings'
import { generateSettingColumn } from 'components/table-refactored/make-data'
import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'

export const UserManagementTable = React.forwardRef((props: any, ref) => {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedUser, setSelectedUser] = useState(undefined)
  const [paginationInitialized, setPaginationInitialized] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ accountPayableInvoiced: false })

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.UserManagement)
  const { email } = useUserProfile() as Account

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: USER_MGT_TABLE_QUERIES_KEY,
      pagination,
      setPagination,
      sorting,
    })

  const { userMgt, isLoading, totalPages, dataCount } = useUsrMgt(
    queryStringWithPagination,
    pagination.pageIndex,
    pagination.pageSize,
  )

  const { onOpen } = useDisclosure()

  const {
    tableColumns,
    settingColumns,
    isFetched: tablePreferenceFetched,
  } = useTableColumnSettings(USER_MGT_COLUMNS, TableNames.UserManagement)

  const { refetch, isLoading: isExportDataLoading } = useGetAllUserMgt(queryStringWithoutPagination)

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }
  const { paginationRecord, columnsWithoutPaginationRecords } = useMemo(() => {
    const paginationCol = settingColumns.find(col => col.contentKey === 'pagination')
    const columnsWithoutPaginationRecords = settingColumns.filter(col => col.contentKey !== 'pagination')

    return {
      paginationRecord: paginationCol ? { ...paginationCol, field: paginationCol?.field || 0 } : null,
      columnsWithoutPaginationRecords,
    }
  }, [settingColumns])

  const onPageSizeChange = pageSize => {
    if (paginationRecord) {
      postGridColumn([...columnsWithoutPaginationRecords, { ...paginationRecord, field: pageSize }] as any)
    } else {
      const paginationSettings = generateSettingColumn({
        field: pageSize,
        contentKey: 'pagination' as string,
        order: USER_MGT_COLUMNS.length,
        userId: email,
        type: TableNames.project,
        hide: true,
      })
      settingColumns.push(paginationSettings)
      postGridColumn(settingColumns as any)
    }
  }

  useEffect(() => {
    if (!paginationInitialized && tablePreferenceFetched && settingColumns.length > 0 && !paginationRecord) {
      setPaginationInitialized(true)
      setPagination(prevState => ({ ...prevState, pageSize: 25 }))
    }
  }, [settingColumns, tablePreferenceFetched])

  useEffect(() => {
    if (settingColumns && paginationRecord?.field) {
      setPagination({ pageIndex: pagination.pageIndex, pageSize: Number(paginationRecord?.field) })
    }
  }, [settingColumns?.length])

  return (
    <>
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={selectedUser ? true : false}
          onClose={() => {
            setSelectedUser(undefined)
          }}
        />
      )}

      <Box overflow={'auto'} h="calc(100vh - 170px)" border="1px solid #CBD5E0" borderRadius="6px">
        <TableContextProvider
          id="user-managment"
          data={userMgt}
          columns={tableColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          totalPages={totalPages}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
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
              {settingColumns && (
                <TableColumnSettings
                  disabled={isLoading}
                  onSave={onSave}
                  columns={settingColumns.filter(
                    col =>
                      col.colId !== 'id' && col.colId !== 'flagged' && !(columnVisibility[col?.contentKey] === false),
                  )}
                />
              )}
            </ButtonsWrapper>
            <TablePagination>
              <ShowCurrentRecordsWithTotalRecords dataCount={dataCount} />
              <GotoFirstPage />
              <GotoPreviousPage />
              <GotoNextPage />
              <GotoLastPage />
              <SelectPageSize dataCount={dataCount} onPageSizeChange={onPageSizeChange} />
            </TablePagination>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </>
  )
})
