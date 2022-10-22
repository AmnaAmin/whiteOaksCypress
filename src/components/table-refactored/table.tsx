import React from 'react'
import { Column, Table as TableType, TableOptions, flexRender } from '@tanstack/react-table'

import { Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Text, Flex, Stack, Tfoot, Center } from '@chakra-ui/react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { Input } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useTranslation } from 'react-i18next'
import { useTableInstance } from './table-context'

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
  name: string
}

function Filter({ column, table }: { column: Column<any, unknown>; table: TableType<any> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () => (typeof firstValue === 'number' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
    [column.getFacetedUniqueValues()],
  )

  return (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      bg="white"
      maxW="150px"
      // @ts-ignore
      size="sm"
      borderRadius="4px"
      height="24px"
      paddingX={2}
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

type TableProps = {
  onRowClick?: (row: any) => void
  onRightClick?: (row: any) => void
  isLoading?: boolean
  isEmpty?: boolean
  isHideFilters?: boolean
  isShowFooter?: boolean
}

export const Table: React.FC<TableProps> = ({
  isLoading,
  onRowClick,
  onRightClick,
  isEmpty,
  isHideFilters,
  isShowFooter,
  ...restProps
}) => {
  const { t } = useTranslation()

  const tableInstance = useTableInstance()
  const { getHeaderGroups, getRowModel, getFooterGroups } = tableInstance

  const getColumnMaxMinWidths = (column: any) => {
    const columnWidth = column?.getSize() + 'px'

    return {
      maxW: columnWidth,
      minW: columnWidth,
    }
  }

  return (
    <Stack display="table" minH="100%" w="100%" bg="white" boxShadow="sm" rounded="md" position="relative">
      <ChakraTable size="sm" w="100%" {...restProps}>
        <Thead rounded="md" top="0">
          {getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const title = header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())

                const sortedBy = header.column.getIsSorted()
                const sortedDesc = sortedBy === 'desc'
                const isSortable = header.column.getCanSort()

                return (
                  <Th
                    key={header.id}
                    position="sticky"
                    top="0"
                    py="3"
                    bg="#F7FAFC"
                    zIndex={1}
                    cursor={isSortable ? 'pointer' : ''}
                    onClick={header.column.getToggleSortingHandler()}
                    {...getColumnMaxMinWidths(header.column)}
                  >
                    <Flex alignItems="center">
                      <Text
                        fontSize="14px"
                        color="gray.600"
                        fontWeight={500}
                        fontStyle="normal"
                        textTransform="none"
                        // lineHeight="20px"
                        isTruncated
                        display="inline-block"
                        title={typeof title === 'string' ? t(title as string) : ''}
                      >
                        {typeof title === 'string' ? t(title as string) : title}
                      </Text>
                      {isSortable ? (
                        sortedDesc ? (
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

          {/** Header Filter Input Field for each column */}
          {!isHideFilters &&
            getHeaderGroups().map(headerGroup => {
              return (
                <Tr key={`th_${headerGroup.id}`}>
                  {headerGroup.headers.map(header => {
                    return (
                      <Th
                        key={`th_td_${header.id}`}
                        py="3"
                        position="sticky"
                        zIndex={1}
                        top="40px"
                        borderTop="1px solid #ddd"
                        bg="#F7FAFC"
                        {...getColumnMaxMinWidths(header.column)}
                      >
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={tableInstance} />
                          </div>
                        ) : null}
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
        </Thead>

        {isEmpty ? (
          <Tbody>
            <Tr>
              <Td colSpan={100} border="0">
                <Center pos="sticky" top="0" left="calc(50% - 200px)" mt="200px" w="300px" fontStyle="italic">
                  There is no data to display.
                </Center>
              </Td>
            </Tr>
          </Tbody>
        ) : (
          <>
            <Tbody>
              {isLoading
                ? getRowModel().rows.map(row => {
                    return (
                      <Tr key={row.id}>
                        {row.getVisibleCells().map(cell => {
                          return (
                            <Td key={cell.id} {...getColumnMaxMinWidths(cell.column)}>
                              <BlankSlate size="sm" width="100%" />
                            </Td>
                          )
                        })}
                      </Tr>
                    )
                  })
                : getRowModel().rows.map(row => (
                    <Tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      cursor={onRowClick ? 'pointer' : 'default'}
                      onContextMenu={() => onRightClick?.(row.original)}
                      _hover={{
                        bg: 'gray.50',
                      }}
                    >
                      {row.getVisibleCells().map(cell => {
                        const value = flexRender(cell.column.columnDef.cell, cell.getContext())

                        return (
                          <Td
                            key={cell.id}
                            isTruncated
                            title={cell.getContext()?.getValue() as string}
                            {...getColumnMaxMinWidths(cell.column)}
                          >
                            {cell.getContext()?.getValue() ? (
                              value
                            ) : (
                              <Text color="gray.400" fontWeight={500} ml={2}>
                                _ _ _
                              </Text>
                            )}
                          </Td>
                        )
                      })}
                    </Tr>
                  ))}
            </Tbody>

            {isShowFooter && (
              <Tfoot>
                {getFooterGroups().map(footerGroup => {
                  return (
                    <Tr>
                      {footerGroup.headers.map(footer => {
                        const footerValue = flexRender(footer.column.columnDef.footer, footer.getContext())
                        return (
                          <Td pos="sticky" bottom="0" fontWeight={'bold'} py="4">
                            {footerValue}
                          </Td>
                        )
                      })}
                    </Tr>
                  )
                })}
              </Tfoot>
            )}
          </>
        )}
      </ChakraTable>
    </Stack>
  )
}

export default Table
