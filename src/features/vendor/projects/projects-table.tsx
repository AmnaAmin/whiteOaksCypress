import React, { useEffect, useState } from 'react'
import { Box, Link } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useGetAllWorkOrders, useWorkOrders } from 'api/projects'
import Status from '../../common/status'
import { dateFormat } from 'utils/date-time-utils'

import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import TableColumnSettings from 'components/table/table-column-settings'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { SELECTED_CARD_MAP_URL } from 'features/admin-dashboard/admin-dashboard.utils'

const PROJECT_TABLE_QUERY_KEYS = {
  projectId: 'projectId.equals',
  statusLabel: 'statusLabel.contains',
  id: 'id.equals',
  propertyAddress: 'propertyAddress.equals',
  skillName: 'skillName.contains',
  workOrderExpectedCompletionDate: 'workOrderExpectedCompletionDate.equals',
  expectedPaymentDate: 'expectedPaymentDate.equals',
}

export const PROJECT_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'projectID',
    accessorKey: 'projectId',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return (
        <Link
          href={`${process.env.PUBLIC_URL}/project-details/${value}`}
          color="#533f03"
          fontWeight="bold"
          _hover={{
            color: '#8d2638',
          }}
        >
          {value}
        </Link>
      )
    },
  },
  {
    header: 'WOstatus',
    accessorKey: 'statusLabel',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <Status value={value} id={value} />
    },
  },
  {
    header: 'WoID',
    accessorKey: 'id',
  },
  {
    header: 'address',
    accessorKey: 'propertyAddress',
  },
  {
    header: 'trade',
    accessorKey: 'skillName',
  },
  {
    header: 'dueDateWO',
    accessorKey: 'workOrderExpectedCompletionDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.workOrderExpectedCompletionDate)
    },
  },
  {
    header: 'expectedPaymentDate',
    accessorKey: 'expectedPaymentDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.expectedPaymentDate)
    },
  },
]

type ProjectProps = {
  selectedCard?: string
}

export const ProjectsTable: React.FC<ProjectProps> = ({ selectedCard }) => {
  const [filteredUrl, setFilteredUrl] = useState<string | null>(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (selectedCard) {
      setFilteredUrl(SELECTED_CARD_MAP_URL[selectedCard])
      setPagination({ pageIndex: 0, pageSize: 20 })
    }
  }, [selectedCard])

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: PROJECT_TABLE_QUERY_KEYS,
      pagination,
      setPagination,
      selectedCard,
      sorting,
    })

  const { refetch, isLoading: isExportDataLoading } = useGetAllWorkOrders(
    filteredUrl + '&' + queryStringWithoutPagination,
  )
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const { tableColumns, settingColumns } = useTableColumnSettings(PROJECT_COLUMNS, TableNames.project)
  const { workOrderData, isLoading, dataCount, totalPages } = useWorkOrders(
    filteredUrl + '&' + queryStringWithPagination,
    pagination.pageSize,
  )
  // const [filterProjects, setFilterProjects] = useState(workOrderData)

  const onRowClick = rowData => {
    navigate(`/project-details/${rowData.projectId}`)
  }

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  // useEffect(() => {
  //   if (!selectedCard) setFilterProjects(workOrderData)

  //   setFilterProjects(
  //     workOrderData?.filter(
  //       wo =>
  //         !selectedCard ||
  //         wo.statusLabel?.replace(/\s/g, '').toLowerCase() === selectedCard?.replace(/\s/g, '').toLowerCase(),
  //     ),
  //   )
  // }, [selectedCard, workOrderData])

  // console.log('dataCount', dataCount)

  return (
    <Box overflow={'auto'} h="calc(100vh - 270px)" roundedTop={6}>
      <TableContextProvider
        data={workOrderData}
        columns={tableColumns}
        totalPages={totalPages}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        setPagination={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      >
        <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !workOrderData?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={tableColumns}
              refetch={refetch}
              isLoading={isExportDataLoading}
              colorScheme="brand"
              fileName="workOrders.xlsx"
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
