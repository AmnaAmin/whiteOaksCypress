import { Stack } from '@chakra-ui/react'
import { PaginationState } from '@tanstack/react-table'
import TableColumnSettings from 'components/table/table-column-settings'
import { useState } from 'react'
import { TableNames } from 'types/table-column.types'
import { ExportCustomButton } from './export-button'
import {
  columns,
  columnsWithPagination,
  defaultData,
  settingColumns,
  useTableColumnSettingsForFakeData,
  useTableColumnSettingsUpdateMutationForFakeData,
  useTodos,
} from './make-data'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentPageWithTotal,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from './pagination'
import Table from './table'
import { TableContextProvider } from './table-context'
import { ButtonsWrapper, TableFooter } from './table-footer'

export default {
  title: 'Table',
  component: Table,
}

export const WithAllComponents = () => {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const { isLoading, users, totalPages, dataCount } = useTodos(pagination)
  const { tableColumns, settingColumns } = useTableColumnSettingsForFakeData(
    columnsWithPagination,
    TableNames.testProject,
  )
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutationForFakeData(TableNames.testProject)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <TableContextProvider
      data={users}
      columns={tableColumns}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={totalPages}
    >
      <Table isLoading={isLoading} />
      <TableFooter position="sticky" bottom="0">
        <ButtonsWrapper>
          <ExportCustomButton columns={tableColumns} data={users} colorScheme="brand" fileName="todos" />
          {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} tableNames={TableNames.testProject} />}
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
  )
}

const TodosTable = () => {
  const { isLoading, users, totalPages } = useTodos()

  return (
    <Stack maxH="500px">
      <TableContextProvider data={users} columns={columnsWithPagination} totalPages={totalPages}>
        <Table isLoading={isLoading} />
      </TableContextProvider>
    </Stack>
  )
}

export const Defualt = () => {
  return <TodosTable />
}

export const WithPagination = () => {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const { isLoading, users, totalPages, dataCount } = useTodos(pagination)

  return (
    <TableContextProvider
      data={users}
      columns={columnsWithPagination}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={totalPages}
    >
      <Table isLoading={isLoading} />
      <TableFooter position="sticky" bottom="0" justifyContent={'end'} py="2">
        <TablePagination>
          <ShowCurrentRecordsWithTotalRecords dataCount={dataCount} />
          <GotoFirstPage />
          <GotoPreviousPage />
          <GotoNextPage />
          <GotoLastPage />
        </TablePagination>
      </TableFooter>
    </TableContextProvider>
  )
}

export const WithExportAndColumnSettings = () => {
  const { isLoading, users } = useTodos()
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutationForFakeData(TableNames.testProject)
  const { tableColumns, settingColumns } = useTableColumnSettingsForFakeData(
    columnsWithPagination,
    TableNames.testProject,
  )

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <TableContextProvider data={users} columns={tableColumns}>
      <Table isLoading={isLoading} />
      <TableFooter position="sticky" bottom="0">
        <ButtonsWrapper>
          <ExportCustomButton columns={tableColumns} data={users} colorScheme="brand" fileName="todos" />
          {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} tableNames={TableNames.testProject}/>}
        </ButtonsWrapper>
      </TableFooter>
    </TableContextProvider>
  )
}

export const TableFooterComponent = () => {
  return (
    <TableFooter>
      <ButtonsWrapper>
        <ExportCustomButton columns={columns} data={defaultData} colorScheme="brand" />
        <TableColumnSettings disabled={false} onSave={() => {}} columns={settingColumns} tableNames={TableNames.testProject} />
      </ButtonsWrapper>
    </TableFooter>
  )
}

export const TableInsideScrollableElement = () => {
  const { isLoading, users } = useTodos()
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutationForFakeData(TableNames.testProject)
  const { tableColumns, settingColumns } = useTableColumnSettingsForFakeData(
    columnsWithPagination,
    TableNames.testProject,
  )

  const onSave = columns => {
    postGridColumn(columns)
  }

  const onRowClick = rowData => {
    alert(`You clicked on ${rowData.name}`)
  }

  return (
    <Stack maxH="700px" overflow={'auto'}>
      <TableContextProvider data={users} columns={tableColumns}>
        <Table isLoading={isLoading} onRowClick={onRowClick} />
        <TableFooter position="sticky" bottom="0">
          <ButtonsWrapper>
            <ExportCustomButton columns={tableColumns} data={users} colorScheme="brand" fileName="todos" />
            {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} tableNames={TableNames.testProject} />}
          </ButtonsWrapper>
          <TablePagination>
            <ShowCurrentPageWithTotal />
            <GotoFirstPage />
            <GotoPreviousPage />
            <GotoNextPage />
            <GotoLastPage />
          </TablePagination>
        </TableFooter>
      </TableContextProvider>
    </Stack>
  )
}
