import React from 'react'
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
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Box,
  FormLabel,
  Center,
  Tfoot,
  TableContainer,
} from '@chakra-ui/react'
import { AutoSizer, List } from 'react-virtualized'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { Input } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useTranslation } from 'react-i18next'
import compact from 'lodash/compact'

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
  name: string
}

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
// Define a default UI for filtering

function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <Input
      bg="white"
      maxW="150px"
      size="sm"
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      borderRadius="4px"
      height="24px"
      paddingX={2}
    />
  )
}

type SortBy = {
  id?: string
  desc?: boolean
}

export interface TableProps {
  columns: Array<Column<object>>
  data: Array<object>
  enablePagination?: boolean
  sortBy?: SortBy
}

export type TableExtraProps = {
  disableFilter?: boolean
  headerGroups?: any
  name?: string
  TableRow?: React.ElementType
  TableBody?: React.ElementType
  TableHead?: React.ElementType
  tableHeight: string | number
  setTableInstance?: (i) => void
  onRowClick?: (e, row) => void
  isLoading?: boolean
  defaultFlexStyle?: boolean
  enablePagination?: boolean
  isShowFooter?: boolean
  rowHeight?: string | number
}

export function useCustomTable(props: TableProps, ...rest) {
  const { columns, data: tableData } = props

  const defaultColumn: any = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )
  const getExportFileBlob = ({ columns, data: tableData, fileType, fileName }) => {
    getFileBlob({ columns, data: tableData, fileType, fileName })
  }

  // console.log('tableData', tableData)
  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      defaultColumn,
      getExportFileBlob,
      initialState: {
        // @ts-ignore
        sortBy: compact([props.sortBy]),
      },
    },

    useBlockLayout,
    useFilters,
    useSortBy,
    useExportData,
    ...rest,
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
            <Text noOfLines={1} title={cell.value} pl={0}>
              {cell.render('Cell')}
            </Text>
          </Td>
        )
      })}
    </Tr>
  )
}

export const TableHeader = ({ headerGroups, disableFilter }: TableExtraProps) => {
  const { t } = useTranslation()

  return (
    <Thead bg="#F7FAFC" rounded="md">
      {headerGroups.map(headerGroup => (
        <Tr key={`th_${headerGroup.id}`} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => {
            const header = column.render('Header')

            return (
              // @ts-ignore
              <Th key={`th_td_${column.id}`} {...column.getHeaderProps(column.getSortByToggleProps())} p="0">
                <Flex py="2" px="2" pl="4" alignItems="center">
                  <Text
                    fontSize="14px"
                    color="gray.600"
                    fontWeight={500}
                    fontStyle="normal"
                    textTransform="none"
                    mr="2"
                    mt="20px"
                    mb="20px"
                    lineHeight="20px"
                    noOfLines={2}
                    isTruncated
                    display="inline-block"
                    title={typeof header === 'string' ? header : ''}
                  >
                    {typeof header === 'string' ? t(header) : header}
                  </Text>
                  {column.isSorted &&
                    (column.isSortedDesc ? (
                      <AiOutlineArrowDown fontSize="17px" />
                    ) : (
                      <AiOutlineArrowUp fontSize="17px" />
                    ))}
                </Flex>
              </Th>
            )
          })}
        </Tr>
      ))}

      {!disableFilter
        ? headerGroups.map(headerGroup => (
            <Tr key={`th_${headerGroup.id}`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th key={`th_td_${column.id}`} {...column.getHeaderProps()} py={4} px={4}>
                  {column.canFilter ? column.render('Filter') : null}
                </Th>
              ))}
            </Tr>
          ))
        : null}
    </Thead>
  )
}

export const TBody: React.FC<TableInstance & { TableRow?: React.ElementType } & TableExtraProps> = ({
  getTableBodyProps,
  rows,
  prepareRow,
  TableRow = Row,
  rowHeight,
  onRowClick,
}) => {
  const { t } = useTranslation()

  // Note: this hack for firefox to set the table body height
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
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

  const NoRowsRenderer = () => {
    return (
      <Box p={5} width={'calc(100vw - var(--sidebar-width))'}>
        <Center>
          <FormLabel variant="light-label">{t('noDataDisplayed')} </FormLabel>
        </Center>
      </Box>
    )
  }

  return (
    <Tbody
      {...getTableBodyProps()}
      flex={1}
      h={isFirefox ? '500px' : 'auto'}
      overflowY={isFirefox ? 'hidden' : 'unset'}
    >
      <AutoSizer>
        {({ width, height }) => {
          return (
            <List
              style={{ overflowY: 'overlay' }}
              height={height}
              rowCount={rows.length}
              rowHeight={rowHeight ?? 60}
              noRowsRenderer={NoRowsRenderer}
              rowRenderer={RenderRow}
              width={width}
            />
          )
        }}
      </AutoSizer>
    </Tbody>
  )
}

export const TFooter: React.FC<TableInstance> = ({ footerGroups }) => {
  return (
    <Tfoot bg="#F7FAFC" fontWeight="bold">
      {footerGroups.map(group => (
        <Tr {...group.getFooterGroupProps()}>
          {group.headers.map(column => (
            <Td {...column.getFooterProps()} padding="15px">
              {column.render('Footer')}
            </Td>
          ))}
        </Tr>
      ))}
    </Tfoot>
  )
}

export const TableLoadingState: React.FC<TableInstance> = ({ rows, prepareRow }) => {
  return (
    <Tbody>
      {rows.map(row => {
        prepareRow(row)
        return (
          <Tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return (
                <Td {...cell.getCellProps()}>
                  <BlankSlate size="sm" width="100%" />
                </Td>
              )
            })}
          </Tr>
        )
      })}
    </Tbody>
  )
}

export const Table: React.FC<{ tableInstance: any; tableHeight: string | number }> = ({
  tableInstance,
  tableHeight,
  children,
}) => {
  const { defaultFlexStyle } = tableInstance

  const defaultStyles = () => {
    if (defaultFlexStyle)
      return {
        display: 'flex',
        flexFlow: 'column',
      }
  }

  return (
    <TableContainer h="100%" roundedTop="lg" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
      <ChakraTable
        {...defaultStyles()}
        w="100%"
        bg="#FFFFFF"
        h={tableHeight}
        boxShadow="sm"
        {...tableInstance.getTableProps()}
      >
        {children}
      </ChakraTable>
    </TableContainer>
  )
}

export default Table
