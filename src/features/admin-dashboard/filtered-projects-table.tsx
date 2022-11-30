import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'

import { PROJECT_COLUMNS, PROJECT_TABLE_QUERIES_KEY } from 'constants/projects.constants'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import { SELECTED_CARD_MAP_URL } from './admin-dashboard.utils'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { useNavigate } from 'react-router-dom'
import { PaginationState } from '@tanstack/react-table'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { useGetAllProjects, useProjects } from 'api/projects'
import TableColumnSettings from 'components/table/table-column-settings'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
type ProjectProps = {
  selectedCard: string
}

export const FilteredProjectsData = ({ selectedCard }: ProjectProps) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (selectedCard) {
      setFilteredUrl(SELECTED_CARD_MAP_URL[selectedCard])
      setPagination({ pageIndex: 0, pageSize: 20 })
    }
  }, [selectedCard])

  const [filteredUrl, setFilteredUrl] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: PROJECT_TABLE_QUERIES_KEY,
      pagination,
      setPagination,
    })
  const { projects, isLoading, isFetching, totalPages, dataCount } = useProjects(
    filteredUrl + '&' + queryStringWithPagination,
    pagination.pageIndex,
    pagination.pageSize,
  )

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.adminDashboard)
  const { tableColumns, settingColumns } = useTableColumnSettings(PROJECT_COLUMNS, TableNames.adminDashboard)

  const { refetch, isLoading: isExportDataLoading } = useGetAllProjects(
    filteredUrl + '&' + queryStringWithoutPagination,
  )
  const onRowClick = rowData => {
    navigate(`/project-details/${rowData.id}`)
  }

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  return (
    <Box h={'500px'} overflow="auto">
      <TableContextProvider
        data={projects}
        columns={tableColumns}
        pagination={pagination}
        setPagination={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        totalPages={totalPages}
      >
        <Table onRowClick={onRowClick} isLoading={isLoading || isFetching} isEmpty={!isLoading && !projects?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={PROJECT_COLUMNS}
              refetch={refetch}
              isLoading={isExportDataLoading}
              colorScheme="brand"
              fileName="projects.xlsx"
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
