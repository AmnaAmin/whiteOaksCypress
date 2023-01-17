import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SELECTED_CARD_MAP_URL, useGetAllWorkOrders, useWorkOrders } from 'api/projects'
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
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { Link } from 'react-router-dom'

const PROJECT_TABLE_QUERY_KEYS = {
  projectId: 'projectId.equals',
  statusLabel: 'statusLabel.contains',
  id: 'id.equals',
  propertyAddress: 'propertyAddress.contains',
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
        <Box
          fontWeight={'500'}
          _hover={{
            color: 'barColor.50',
            textDecor: 'underline',
          }}
          color="brand.300"
        >
          <Link to={`/project-details/${value}`}>{value}</Link>
        </Box>
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
    meta: { format: 'date' },
  },
  {
    header: 'expectedPaymentDate',
    accessorKey: 'expectedPaymentDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.expectedPaymentDate)
    },
    meta: { format: 'date' },
  },
]

type ProjectProps = {
  selectedCard?: string
}

export const ProjectsTable: React.FC<ProjectProps> = ({ selectedCard }) => {
  const [filteredUrl, setFilteredUrl] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const navigate = useNavigate()

  const { columnFilters, setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } =
    useColumnFiltersQueryString({
      queryStringAPIFilterKeys: PROJECT_TABLE_QUERY_KEYS,
      pagination,
      setPagination,
    })

  useEffect(() => {
    if (selectedCard) {
      setFilteredUrl(SELECTED_CARD_MAP_URL[selectedCard])
      setPagination({ pageIndex: 0, pageSize: 20 })
    } else {
      setFilteredUrl(null)
    }
  }, [selectedCard])

  const { refetch, isLoading: isExportDataLoading } = useGetAllWorkOrders(
    filteredUrl ? filteredUrl + '&' + queryStringWithoutPagination : queryStringWithoutPagination,
  )

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const { tableColumns, settingColumns } = useTableColumnSettings(PROJECT_COLUMNS, TableNames.project)
  const filtersInitialValues = {
    statusLabel: selectedCard !== 'pastDue' ? selectedCard : 'past Due',
  }

  const tableColumnsWithFilters = useMemo(() => {
    return tableColumns.map((col: any) => {
      if (Object.keys(filtersInitialValues).includes(col.accessorKey)) {
        return {
          ...col,
          meta: { filterInitialState: filtersInitialValues[col.accessorKey] },
        }
      }
      return col
    })
  }, [tableColumns])

  const { workOrderData, isLoading, dataCount, totalPages } = useWorkOrders(
    filteredUrl ? filteredUrl + '&' + queryStringWithPagination : queryStringWithPagination,
    pagination.pageSize,
  )

  const onRowClick = rowData => {
    navigate(`/project-details/${rowData.projectId}`)
  }

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  return (
    <Box overflowX={'auto'} minH="calc(100vh - 370px)">
      <TableContextProvider
        data={workOrderData}
        columns={tableColumnsWithFilters}
        totalPages={totalPages}
        pagination={pagination}
        setPagination={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      >
        <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !workOrderData?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={tableColumnsWithFilters}
              refetch={refetch}
              isLoading={isExportDataLoading}
              fileName="workOrders"
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
