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
  ExpandedState,
  getExpandedRowModel,
  VisibilityState,
} from '@tanstack/react-table'
import React, { useContext, useEffect } from 'react'

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
  id?: string // added to have unique id for sticky filter columns
  data: any
  columns: ColumnDef<any>[]
  pagination?: PaginationState
  columnFilters?: ColumnFiltersState
  setPagination?: (updater: Updater<PaginationState>) => void
  setColumnFilters?: (updater: Updater<ColumnFiltersState>) => void
  totalPages?: number
  defaultFlexStyle?: boolean
  manualPagination?: boolean
  sorting?: SortingState
  setSorting?: (updater: Updater<SortingState>) => void
  isExpandable?: boolean
  expandedState?: ExpandedState
  columnVisibility?: VisibilityState
  setColumnVisibility?: (updater: Updater<VisibilityState>) => void
}

export const TableContextProvider: React.FC<TableWrapperProps> = ({
  data,
  id,
  columns,
  pagination,
  setPagination,
  setColumnFilters,
  totalPages = 0,
  children,
  manualPagination = true,
  sorting,
  setSorting,
  isExpandable,
  expandedState,
  columnVisibility,
  setColumnVisibility,
}) => {
  const emptyRowsLength = 3
  const emptyRows = Array(emptyRowsLength).fill({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const [columnFiltersState, setColumnFiltersState] = React.useState<ColumnFiltersState>([])
  const [sortingState, setSortingState] = React.useState<SortingState>([])
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

  const sortState = !setSorting
    ? {
        sorting: sortingState,
      }
    : { sorting }

  const filtersConfigurations: any = setColumnFilters
    ? {
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
      }
    : {}

  useEffect(() => {
    if (expandedState) setExpanded(expandedState)
  }, [expandedState])

  const tableInstance = useReactTable({
    ...filtersConfigurations,
    meta: { id },
    data: data ?? emptyRows,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
    state: {
      ...paginationState,
      ...columnFilterState,
      ...sortState,
      expanded,
      columnVisibility,
    },
    filterFromLeafRows: true,
    onColumnVisibilityChange: setColumnVisibility,
    ...(isExpandable && { onExpandedChange: setExpanded, getSubRows: (row: any) => row.subRows }),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualPagination: manualPagination,
    manualSorting: !!setSorting,
    pageCount: totalPages ?? -1,
    ...(setPagination && { onPaginationChange: setPagination }),
    onSortingChange: setSorting ?? setSortingState,
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

