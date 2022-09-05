import { useEffect } from 'react'
import { usePagination } from 'react-table'

import Table, {
  TableExtraProps,
  TableHeader,
  TableLoadingState,
  TableProps,
  TBody,
  TFooter,
  useCustomTable,
} from './react-table'

// Empty rows are for loading state
const emptyRows = [{}, {}, {}]

export const TableWrapper: React.FC<TableProps & TableExtraProps> = props => {
  const {
    TableRow,
    TableBody = TBody,
    TableHead = TableHeader,
    tableHeight,
    onRowClick,
    setTableInstance,
    isLoading,
    enablePagination = false,
    disableFilter = false,
    isShowFooter,
    rowHeight,
    ...restProps
  } = props
  const tableInstance = useCustomTable(
    { ...restProps, data: isLoading ? emptyRows : restProps.data, enablePagination },
    usePagination,
  )

  useEffect(() => {
    setTableInstance?.(tableInstance)
  }, [tableInstance, setTableInstance])

  return (
    <Table tableInstance={tableInstance} tableHeight={tableHeight}>
      <TableHead {...tableInstance} disableFilter={disableFilter} />
      {isLoading ? (
        <TableLoadingState {...tableInstance} />
      ) : (
        <TableBody {...tableInstance} onRowClick={onRowClick} TableRow={TableRow} rowHeight={rowHeight} />
      )}

      {isShowFooter && <TFooter {...tableInstance} />}
    </Table>
  )
}
