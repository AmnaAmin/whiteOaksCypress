// Table pagination context provider
// ---------------------------------
import {
  ColumnDef,
  Table as TableType,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  Updater,
} from '@tanstack/react-table'
import React, { useContext } from 'react'

export type TableInstance = TableType<any>
export type TableContextState = {
  tableInstance: TableInstance | null
}

const TableContext = React.createContext<TableContextState>({
  tableInstance: null,
})

TableContext.displayName = 'TableContext'

// Pagination context state types
type TableWrapperProps = {
  data: any
  columns: ColumnDef<any>[]
  pagination?: PaginationState
  columnFilters?: ColumnFiltersState
  setPagination?: (updater: Updater<PaginationState>) => void
  setColumnFilters?: (updater: Updater<ColumnFiltersState>) => void
  totalPages?: number
  defaultFlexStyle?: boolean
  manualPagination?: boolean
}

export const TableContextProvider: React.FC<TableWrapperProps> = ({
  data,
  columns,
  pagination,
  setPagination,
  setColumnFilters,
  totalPages = 0,
  children,
  manualPagination = true,
}) => {
  const emptyRowsLength = 3
  const emptyRows = Array(emptyRowsLength).fill({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFiltersState, setColumnFiltersState] = React.useState<ColumnFiltersState>([])

  // Create pagination state in case pagination object enabled
  const paginationState: { pagination: PaginationState } | {} = React.useMemo(() => {
    return pagination
      ? {
          pagination: {
            pageIndex: pagination?.pageIndex ?? 0,
            pageSize: pagination?.pageSize ?? 10,
          },
        }
      : {}
  }, [pagination?.pageIndex, pagination?.pageSize])
  const columnFilterState = !setColumnFilters
    ? {
        columnFilters: columnFiltersState,
      }
    : {}

  const filtersConfigurations: any = setColumnFilters
    ? {
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
      }
    : {}

  const tableInstance = useReactTable({
    ...filtersConfigurations,
    data: data ?? emptyRows,
    columns,
    state: {
      ...paginationState,
      ...columnFilterState,
      sorting,
    },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualPagination: manualPagination,
    pageCount: totalPages ?? -1,
    ...(setPagination && { onPaginationChange: setPagination }),
    onColumnFiltersChange: setColumnFilters ?? setColumnFiltersState,
  })
  return <TableContext.Provider value={{ tableInstance }}>{children}</TableContext.Provider>
}

export const useTableContext = (): TableContextState => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error('useTableContext must be used within a TableContextProvider')
  }
  return context
}

export const useTableInstance = (): TableInstance => {
  const { tableInstance } = useTableContext()
  if (!tableInstance) {
    throw new Error('useTableInstance must be used within a TableContextProvider')
  }
  return tableInstance
}
