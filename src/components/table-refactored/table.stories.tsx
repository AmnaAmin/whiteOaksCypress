import { Stack } from '@chakra-ui/react'
import { PaginationState } from '@tanstack/react-table'
import TableColumnSettings from 'components/table/table-column-settings'
import { useState } from 'react'
import { TableNames } from 'types/table-column.types'
import { ExportButton } from './export-button'
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
  const { isLoading, users, totalPages } = useTodos(pagination)
  const { tableColumns, settingColumns } = useTableColumnSettingsForFakeData(columnsWithPagination, TableNames.project)
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutationForFakeData(TableNames.project)

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
      <Table tableHeight="inherit" isLoading={isLoading} />
      <TableFooter position="sticky" bottom="0">
        <ButtonsWrapper>
          <ExportButton columns={tableColumns} data={users} colorScheme="brand" fileName="todos.xlsx" />
          {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
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
  )
}

const TodosTable = () => {
  const { isLoading, users, totalPages } = useTodos()

  return (
    <Stack maxH="500px">
      <TableContextProvider data={users} columns={columnsWithPagination} totalPages={totalPages}>
        <Table tableHeight="inherit" isLoading={isLoading} />
      </TableContextProvider>
    </Stack>
  )
}

export const Defualt = () => {
  return <TodosTable />
}

export const WithPagination = () => {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const { isLoading, users, totalPages } = useTodos(pagination)

  return (
    <TableContextProvider
      data={users}
      columns={columnsWithPagination}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={totalPages}
    >
      <Table tableHeight="inherit" isLoading={isLoading} />
      <TableFooter position="sticky" bottom="0" justifyContent={'end'} py="2">
        <TablePagination>
          <ShowCurrentPageWithTotal />
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
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutationForFakeData(TableNames.project)
  const { tableColumns, settingColumns } = useTableColumnSettingsForFakeData(columnsWithPagination, TableNames.project)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <TableContextProvider data={users} columns={tableColumns}>
      <Table tableHeight="inherit" isLoading={isLoading} />
      <TableFooter position="sticky" bottom="0">
        <ButtonsWrapper>
          <ExportButton columns={tableColumns} data={users} colorScheme="brand" fileName="todos.xlsx" />
          {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
        </ButtonsWrapper>
      </TableFooter>
    </TableContextProvider>
  )
}

export const TableFooterComponent = () => {
  return (
    <TableFooter>
      <ButtonsWrapper>
        <ExportButton columns={columns} data={defaultData} colorScheme="brand" />
        <TableColumnSettings disabled={false} onSave={() => {}} columns={settingColumns} />
      </ButtonsWrapper>
    </TableFooter>
  )
}
