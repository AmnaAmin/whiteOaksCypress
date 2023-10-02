import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useGetAllProjects, useProjects, useWeekDayProjectsDue } from 'api/projects'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  SelectPageSize,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import TableColumnSettings from 'components/table/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'
import { PROJECT_COLUMNS } from 'constants/projects.constants'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { PROJECT_TABLE_QUERIES_KEY } from 'constants/projects.constants'
import { columns, generateSettingColumn } from 'components/table-refactored/make-data'
import { Account } from 'types/account.types'
import { useUserProfile } from 'utils/redux-common-selectors'

type ProjectProps = {
  selectedCard: string
  selectedDay: string
  userIds?: number[]
  selectedFPM?: any
  resetFilters: boolean
  selectedFlagged?: any
}

export const ProjectsTable: React.FC<ProjectProps> = ({
  selectedCard,
  selectedDay,
  userIds,
  selectedFPM,
  resetFilters,
  selectedFlagged,
}) => {
  const navigate = useNavigate()
  const { email } = useUserProfile() as Account
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [paginationInitialized, setPaginationInitialized] = useState(false)
  const { data: days } = useWeekDayProjectsDue(selectedFPM?.id)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ accountPayableInvoiced: false })

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: PROJECT_TABLE_QUERIES_KEY,
      pagination,
      setPagination,
      sorting,
      selectedCard,
      selectedDay,
      selectedFPM,
      userIds,
      days,
      selectedFlagged,
    })

  const { projects, isLoading, totalPages, dataCount } = useProjects(
    queryStringWithPagination,
    pagination.pageIndex,
    pagination.pageSize,
  )

  const { refetch, isLoading: isExportDataLoading } = useGetAllProjects(queryStringWithoutPagination)
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const {
    tableColumns,
    settingColumns,
    isFetched: tablePreferenceFetched,
    refetch: refetchColumns,
  } = useTableColumnSettings(
    PROJECT_COLUMNS,
    TableNames.project,
    {
      projectStatus: selectedCard !== 'past due' ? selectedCard : '',
      clientDueDate: !!days?.find(c => c.dayName === selectedDay)
        ? days?.find(c => c.dayName === selectedDay)?.dueDate
        : '',
      noteFlag: selectedFlagged,
      lienDueFlag: selectedFlagged,
    },
    resetFilters,
  )

  const { paginationRecord, columnsWithoutPaginationRecords } = useMemo(() => {
    const paginationCol = settingColumns.find(col => col.contentKey === 'pagination')
    const columnsWithoutPaginationRecords = settingColumns.filter(col => col.contentKey !== 'pagination')

    return {
      paginationRecord: paginationCol ? { ...paginationCol, field: paginationCol?.field || 0 } : null,
      columnsWithoutPaginationRecords,
    }
  }, [settingColumns])

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

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  const onRowClick = rowData => {
    navigate(`/project-details/${rowData.id}`)
  }

  const onPageSizeChange = pageSize => {
    if (paginationRecord) {
      postGridColumn([...columnsWithoutPaginationRecords, { ...paginationRecord, field: pageSize }] as any)
    } else {
      const paginationSettings = generateSettingColumn({
        field: pageSize,
        contentKey: 'pagination' as string,
        order: columns.length,
        userId: email,
        type: TableNames.project,
        hide: true,
      })
      settingColumns.push(paginationSettings)
      postGridColumn(settingColumns as any)
    }
  }

  return (
    <Box overflowX={'auto'} minH="calc(100vh - 370px)" roundedTop={6} border="1px solid #CBD5E0">
      <TableContextProvider
        id="projects"
        data={projects}
        columns={tableColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        totalPages={totalPages}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      >
        <Table
          allowStickyFilters={true}
          isFilteredByApi={true}
          isLoading={isLoading}
          onRowClick={onRowClick}
          isEmpty={!isLoading && !projects?.length}
        />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              data-testid="project_export"
              columns={tableColumns}
              refetch={refetch}
              isLoading={isExportDataLoading}
              fileName="projects"
            />
            <CustomDivider />
            {settingColumns && (
              <TableColumnSettings
                disabled={isLoading}
                onSave={onSave}
                refetch={refetchColumns}
                columns={settingColumns.filter(
                  col =>
                    col.colId !== 'displayId' &&
                    col.colId !== 'flagged' &&
                    !(columnVisibility[col?.contentKey] === false),
                )}
                tableNames={TableNames.project}
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
  )
}
