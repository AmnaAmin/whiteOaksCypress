import React, { useState } from 'react'
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
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import TableColumnSettings from 'components/table/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { PROJECT_COLUMNS } from 'constants/projects.constants'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { PROJECT_TABLE_QUERIES_KEY } from 'constants/projects.constants'

type ProjectProps = {
  selectedCard: string
  selectedDay: string
  userIds?: number[]
  selectedFPM?: any
  resetFilters: boolean
}

export const ProjectsTable: React.FC<ProjectProps> = ({
  selectedCard,
  selectedDay,
  userIds,
  selectedFPM,
  resetFilters,
}) => {
  const navigate = useNavigate()

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { data: days } = useWeekDayProjectsDue(selectedFPM?.id)

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
    })

  const { projects, isLoading, totalPages, dataCount } = useProjects(
    queryStringWithPagination,
    pagination.pageIndex,
    pagination.pageSize,
  )

  const { refetch, isLoading: isExportDataLoading } = useGetAllProjects(queryStringWithoutPagination)
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const { tableColumns, settingColumns } = useTableColumnSettings(
    PROJECT_COLUMNS,
    TableNames.project,
    {
      projectStatus: selectedCard !== 'past due' ? selectedCard : '',
      clientDueDate: days?.find(c => c.dayName === selectedDay)?.dueDate,
    },
    resetFilters,
  )

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  const onRowClick = rowData => {
    navigate(`/project-details/${rowData.id}`)
  }

  return (
    <Box overflow={'auto'} height="calc(100vh - 100px)" roundedTop={6}>
      <TableContextProvider
        data={projects}
        columns={tableColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        totalPages={totalPages}
      >
        <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !projects?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={tableColumns}
              refetch={refetch}
              isLoading={isExportDataLoading}
              colorScheme="brand"
              fileName="projects"
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
  )
}
