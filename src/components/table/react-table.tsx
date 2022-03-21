import React, { ReactElement, useEffect } from 'react'
import {
  Column,
  Row as RTRow,
  TableInstance,
  TableOptions,
  useBlockLayout,
  useFilters,
  useSortBy,
  useTable,
} from 'react-table'
import { getFileBlob } from './util'
import { useExportData } from 'react-table-plugins'
import { Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Text, Flex } from '@chakra-ui/react'
import { AutoSizer, List } from 'react-virtualized'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { Input } from '@chakra-ui/react'

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
  name: string
}

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
// Define a default UI for filtering

function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length

  return (
    <Input
      bg="white"
      maxW="150px"
      size="sm"
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
      css={{ borderRadius: '6px !important' }}
    />
  )
}
interface Props {
  columns: Array<Column<object>>
  data: Array<object>
}

export function useCustomTable(props: Props) {
  const { columns, data } = props

  const defaultColumn: any = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )
  const getExportFileBlob = ({ columns, data, fileType, fileName }) => {
    getFileBlob({ columns, data, fileType, fileName })
  }
  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      getExportFileBlob,
      initialState: {
        // @ts-ignore
        sortBy: [{ id: 'type', desc: false }],
      },
    },
    useBlockLayout,
    useFilters,
    useSortBy,
    useExportData,
  )

  return tableInstance
}

export type RowProps = {
  row: RTRow
  style: any
  onRowClick: (e, row) => void
}

export const Row: React.FC<RowProps> = ({ row, style }) => {
  return (
    <Tr
      as="tr"
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} padding="15px">
            <Text noOfLines={2} title={cell.value}>
              {cell.render('Cell')}
            </Text>
          </Td>
        )
      })}
    </Tr>
  )
}

export const TableHeader = ({ headerGroups }) => {
  return (
    <Thead bg="#F7FAFC" rounded="md">
      {headerGroups.map(headerGroup => (
        <Tr key={`th_${headerGroup.id}`} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => {
            return (
              // @ts-ignore
              <Th key={`th_td_${column.id}`} {...column.getHeaderProps(column.getSortByToggleProps())} p="0">
                <Flex py="2" px="2" pl="7" alignItems="center">
                  <Text
                    fontSize="14px"
                    color="#4A5568"
                    fontWeight={500}
                    fontStyle="normal"
                    textTransform="capitalize"
                    mr="2"
                    mt="20px"
                    mb="20px"
                    lineHeight="20px"
                    noOfLines={2}
                    isTruncated
                    display="inline-block"
                    title={column.render('Header')}
                  >
                    {column.render('Header')}
                  </Text>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <AiOutlineArrowUp fontSize="17px" />
                    ) : (
                      <AiOutlineArrowDown fontSize="17px" />
                    )
                  ) : (
                    ''
                  )}
                </Flex>
              </Th>
            )
          })}
        </Tr>
      ))}

      {headerGroups.map(headerGroup => (
        <Tr key={`th_${headerGroup.id}`} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <Th key={`th_td_${column.id}`} {...column.getHeaderProps()} py={4} px={4} pl="5">
              {column.canFilter ? column.render('Filter') : null}
            </Th>
          ))}
        </Tr>
      ))}
    </Thead>
  )
}

export const TBody: React.FC<TableInstance & { TableRow?: React.ElementType } & TableExtraProps> = ({
  getTableBodyProps,
  rows,
  prepareRow,
  TableRow = Row,
  onRowClick,
}) => {
  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      if (onRowClick) {
        style['cursor'] = 'pointer'
      }
      return <TableRow row={row} style={style} onRowClick={onRowClick} />
    },
    [prepareRow, rows, onRowClick, TableRow],
  )

  return (
    <Tbody {...getTableBodyProps()}>
      <AutoSizer>
        {({ width, height }) => {
          return <List height={height} rowCount={rows.length} rowHeight={60} rowRenderer={RenderRow} width={width} />
        }}
      </AutoSizer>
    </Tbody>
  )
}

type TableExtraProps = {
  name?: string
  TableRow?: React.ElementType
  TableBody?: React.ElementType
  TableHead?: React.ElementType
  tableHeight: string | number
  setTableInstance?: (i) => void
  onRowClick?: (e, row) => void
}

export function Table(props: Props & TableExtraProps): ReactElement {
  const {
    TableRow,
    TableBody = TBody,
    TableHead = TableHeader,
    tableHeight,
    onRowClick,
    setTableInstance,
    ...restProps
  } = props
  const tableInstance = useCustomTable(restProps)

  useEffect(() => {
    setTableInstance?.(tableInstance)
  }, [tableInstance, setTableInstance])

  return (
    <ChakraTable w="100%" bg="#FFFFFF" h={tableHeight} boxShadow="sm" rounded="md" {...tableInstance.getTableProps()}>
      <TableHead {...tableInstance} />
      <TableBody {...tableInstance} onRowClick={onRowClick} TableRow={TableRow} />
    </ChakraTable>
  )
}

export default Table
