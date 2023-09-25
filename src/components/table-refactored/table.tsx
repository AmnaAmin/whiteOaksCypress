import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Column, Table as TableType, TableOptions, flexRender } from '@tanstack/react-table'
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Stack,
  Box,
  Tfoot,
  HStack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@chakra-ui/react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { Input } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useTranslation } from 'react-i18next'
import { useTableInstance } from './table-context'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { MdClose } from 'react-icons/md'
import { useLayoutEffect } from 'react'
import _ from 'lodash'
import { useStickyState } from 'utils/hooks'
import { isValidAndNonEmpty } from 'utils'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRangePicker } from 'react-date-range'
import moment from 'moment'
export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
  name: string
}

function Filter({
  column,
  table,
  allowStickyFilters = false,
}: {
  column: Column<any, unknown>
  table: TableType<any>
  allowStickyFilters?: boolean
}) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  // We inject meta into certain columns where the filter state can be prefilled either by backend or by UI
  // In react table, meta key can be added to any column and meta can hold any arbitrary value
  const metaData: any = column.columnDef?.meta as any

  /* @ts-ignore */
  const tableId = table?.options?.meta?.id
  const columnKey = tableId ? tableId + '.' + column.id : column.id
  const [stickyFilter, setStickyFilter] = useStickyState(null, allowStickyFilters ? columnKey : null)
  const filterInitialState =
    metaData?.filterInitialState !== null && metaData?.filterInitialState !== undefined
      ? metaData?.filterInitialState
      : stickyFilter
  const columnFilterValue = filterInitialState || column.getFilterValue()
  const dateFilter = column.id.includes('Date') || column.id.includes('date')
  const currencyFilter = metaData?.format === 'currency' || metaData?.format === 'percentage'
  const sortedUniqueValues = React.useMemo(
    () => (typeof firstValue === 'number' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
    [column.getFacetedUniqueValues()],
  )

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }

  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: '',
    endDate: '',
  })
  const [selectedStartDate, setSelectedStartDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')

  const handleDateInputClick = e => {
    e.preventDefault()
    setIsDateRangePickerOpen(!isDateRangePickerOpen)
  }
  const handleClear = () => {
    column.setFilterValue('')
    setSelectedStartDate('')
    setIsDateRangePickerOpen(false)
  }

  return (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>

      {dateFilter ? (
        <>
          <div style={{ position: 'relative' }}>
            <DebouncedInput
              dateFilter
              value={
                selectedDateRange?.startDate === '' && selectedDateRange?.endDate === ''
                  ? 'mm/dd/yyyy'
                  : `${selectedStartDate} , ${selectedEndDate}`
              }
              className="w-36 border shadow rounded"
              list={column.id + 'list'}
              // @ts-ignore
              minW={dateFilter && '127px'}
              onMouseDown={handleDateInputClick}
              readOnly
            />
            {isDateRangePickerOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  backgroundColor: 'white',
                  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                }}
              >
                <div
                  onClick={handleClear}
                  style={{
                    color: 'rgb(61, 145, 255)',
                    marginLeft: '17px',
                    fontSize: '12px',
                    marginTop: '5px',
                    textTransform: 'capitalize',
                    paddingTop: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </div>

                <DateRangePicker
                  ranges={[selectionRange]}
                  onSelect={() => {
                    setIsDateRangePickerOpen(false)
                  }}
                  onChange={dateRange => {
                    const selectedStartDate = dateRange.selection.startDate
                    const selectedEndDate = dateRange.selection.endDate
                    const formattedStartDate = moment(selectedStartDate).format('YYYY-MM-DD')
                    const formattedEndDate = moment(selectedEndDate).format('YYYY-MM-DD')
                    setSelectedStartDate(formattedStartDate)
                    setSelectedEndDate(formattedEndDate)
                    setSelectedDateRange({ startDate: selectedStartDate, endDate: selectedEndDate })
                    column.setFilterValue(`${formattedStartDate} - ${formattedEndDate}`)
                    if (allowStickyFilters) setStickyFilter(`${formattedStartDate} - ${formattedEndDate}`)
                    setIsDateRangePickerOpen(false)
                  }}
                  maxDate={moment().toDate()}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <DebouncedInput
          type={dateFilter ? 'date' : currencyFilter ? 'number' : 'text'}
          value={(dateFilter ? datePickerFormat(columnFilterValue as string) : (columnFilterValue as string)) ?? ''}
          onChange={value => {
            column.setFilterValue(value)
            if (allowStickyFilters) setStickyFilter(value)
          }}
          className="w-36 border shadow rounded"
          list={column.id + 'list'}
          // @ts-ignore
          minW={dateFilter && '127px'}
          resetValue={!!metaData?.resetFilters}
          dateFilter
        />
      )}
      <div className="h-1" />
    </>
  )
}

export const useIsInViewport = ref => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  const observer = useMemo(() => new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting)), [])

  useEffect(() => {
    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, observer])

  return isIntersecting
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  resetValue,
  onChange,
  debounce = 500,
  dateFilter,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  resetValue?: boolean
  dateFilter?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)
  const [showClearIcon, setShowClearIcon] = useState(false)
  const [inputWidth, setInputWidth] = useState(0)
  const inputRef = useRef<any>()

  const isInputInViewPort = useIsInViewport(inputRef)

  useEffect(() => {
    if (typeof value === 'string' && value.replace(/\s+/g, '') !== '' && !dateFilter) {
      setShowClearIcon(true)
    }
  }, [])

  useEffect(() => {
    setValue(resetValue ? '' : initialValue)
  }, [initialValue, resetValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('00000000', value)
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  useLayoutEffect(() => {
    setInputWidth(inputRef.current.offsetWidth)

    const setW = () => {
      setInputWidth(inputRef.current.offsetWidth)
    }
    window.addEventListener('DOMContentLoaded', setW)

    const changeWidth = _.debounce(() => setInputWidth(inputRef.current.offsetWidth), 50)

    window.addEventListener('resize', changeWidth)

    return () => {
      window.removeEventListener('resize', changeWidth)
      window.removeEventListener('DOMContentLoaded', setW)
    }
  }, [isInputInViewPort])

  const onInputChange = e => {
    setValue(e.target.value)

    if (e.target.value.replace(/\s+/g, '') !== '') setShowClearIcon(true)
    else setShowClearIcon(false)
  }

  return (
    <HStack position={'relative'}>
      <Input
        bg="white"
        maxW="150px"
        // @ts-ignore
        size={5}
        borderRadius="4px"
        height="24px"
        paddingX={2}
        {...props}
        value={value}
        onChange={onInputChange}
        borderColor="gray.300"
        ref={inputRef}
        paddingRight={'13px'}
        data-testid="tableFilterInputField"
        _focus={{
          border: '1px solid #345EA6',
        }}
      />
      {showClearIcon ? (
        <Icon
          data-testid="tableFilterInputFieldClearIcon"
          cursor="pointer"
          as={MdClose}
          position="absolute"
          right={`calc(100% - ${inputWidth - 3}px)`}
          zIndex={10000}
          mr="-20px"
          onClick={e => {
            setValue('')
            setShowClearIcon(false)
          }}
          visibility={value === '' ? 'hidden' : 'visible'}
        />
      ) : null}
    </HStack>
  )
}

type TableProps = {
  onRowClick?: (row: any) => void
  onRightClick?: (row: any) => void
  isLoading?: boolean
  isEmpty?: boolean
  isHideFilters?: boolean
  isShowFooter?: boolean
  handleOnDrag?: (result) => void
  handleOnDragStart?: (result) => void
  allowStickyFilters?: boolean
}

export const Table: React.FC<TableProps> = ({
  isLoading,
  onRowClick,
  onRightClick,
  isEmpty,
  isHideFilters,
  isShowFooter,
  handleOnDrag,
  handleOnDragStart,
  allowStickyFilters,
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
    <Stack
      display="table"
      w="100%"
      boxShadow="sm"
      rounded="md"
      position="relative"
      zIndex={0}
      // border="1px solid #CBD5E0"
      bg="white"
      h="100%"
      minH={'inherit'}
    >
      <ChakraTable size="sm" w="100%" {...restProps}>
        <Thead rounded="md" top="0">
          {getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const title = header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())
                const checkBox = header?.id === 'checkbox'
                const sortedBy = header.column.getIsSorted()
                const sortedDesc = sortedBy === 'desc'
                const isSortable = header.column.getCanSort()

                return (
                  <Th
                    key={header.id}
                    position="sticky"
                    top="0"
                    py="3"
                    bg="#ECEDEE"
                    zIndex={1}
                    borderBottomColor="#ECEDEE"
                    cursor={isSortable ? 'pointer' : ''}
                    onClick={!checkBox ? header.column.getToggleSortingHandler() : () => null}
                    {...getColumnMaxMinWidths(header.column)}
                  >
                    <Flex
                      alignItems="center"
                      _before={{
                        content: '""',
                        bottom: '-2px',
                        left: '0px',
                        position: 'absolute',
                        minW: '100%',
                        borderBottom: '3px solid #ECEDEE',
                      }}
                    >
                      <Text
                        fontSize="14px"
                        color="gray.700"
                        fontWeight={500}
                        fontStyle="normal"
                        textTransform="none"
                        isTruncated
                        display="inline-block"
                        title={typeof title === 'string' ? t(title as string) : ''}
                        py="1px"
                      >
                        {typeof title === 'string' ? t(title as string) : title}
                      </Text>

                      {sortedBy &&
                        (isSortable ? (
                          sortedDesc ? (
                            <AiOutlineArrowUp fontSize="17px" />
                          ) : (
                            <AiOutlineArrowDown fontSize="17px" />
                          )
                        ) : (
                          ''
                        ))}
                    </Flex>
                  </Th>
                )
              })}
            </Tr>
          ))}

          {/** Header Filter Input Field for each column **/}
          {!isHideFilters &&
            getHeaderGroups().map(headerGroup => {
              return (
                <Tr key={`th_${headerGroup.id}`} position="relative">
                  {headerGroup.headers.map(header => {
                    return (
                      <Th
                        key={`th_td_${header.id}`}
                        py="3"
                        position="sticky"
                        zIndex={1}
                        top="43px"
                        // borderBottomColor="gray.300"
                        bg="#ECEDEE"
                        {...getColumnMaxMinWidths(header.column)}
                      >
                        {header.column.getCanFilter() ? (
                          <Box
                            _after={{
                              content: '""',
                              bottom: '0px',
                              left: '0px',
                              position: 'absolute',
                              minW: '100%',
                              borderBottom: '1px solid #CBD5E0',
                            }}
                            _before={{
                              content: '""',
                              top: '0px',
                              left: '0px',
                              position: 'absolute',
                              minW: '100%',
                              borderBottom: '1px solid #CBD5E0',
                            }}
                          >
                            {header.id !== 'expander' && (
                              <Filter
                                allowStickyFilters={allowStickyFilters}
                                column={header.column}
                                table={tableInstance}
                              />
                            )}
                          </Box>
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
                <Box pos="sticky" top="0" left="calc(50% - 50px)" mt="60px" w="300px">
                  {t('noDataDisplayed')}
                </Box>
              </Td>
            </Tr>
          </Tbody>
        ) : (
          <>
            {!handleOnDrag ? (
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
                          bg: !!onRowClick ? '#F3F8FF' : '',
                        }}
                        backgroundColor={row.getIsSelected() || row.depth ? '#F9F9F9' : ''}
                      >
                        {row.getVisibleCells().map(cell => {
                          const value = flexRender(cell.column.columnDef.cell, cell.getContext())
                          const title =
                            typeof cell.getContext()?.getValue() === 'string' ? cell.getContext()?.getValue() : null
                          const metaData = cell.column.columnDef?.meta as any
                          const isDate = metaData?.format === 'date'
                          const isCurrency = metaData?.format === 'currency'

                          return (
                            <Td
                              key={cell.id}
                              isTruncated
                              title={
                                !metaData?.hideTitle && title
                                  ? isDate
                                    ? dateFormat(title as string)
                                    : (title as string)
                                  : ''
                              }
                              {...getColumnMaxMinWidths(cell.column)}
                            >
                              {isValidAndNonEmpty(cell?.renderValue())
                                ? isDate && typeof value === 'string'
                                  ? new Date(value).toLocaleDateString()
                                  : isCurrency && typeof value === 'number'
                                  ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                  : value
                                : '_ _ _'}
                            </Td>
                          )
                        })}
                      </Tr>
                    ))}
              </Tbody>
            ) : (
              <DragDropEnabledRows
                handleOnDragStart={handleOnDragStart}
                handleOnDrag={handleOnDrag}
                getRowModel={getRowModel}
                onRowClick={onRowClick}
                onRightClick={onRightClick}
                getColumnMaxMinWidths={getColumnMaxMinWidths}
              />
            )}
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

const DragDropEnabledRows = ({
  handleOnDrag,
  getRowModel,
  onRowClick,
  onRightClick,
  getColumnMaxMinWidths,
  handleOnDragStart,
}) => {
  return (
    <DragDropContext
      onDragEnd={result => {
        handleOnDrag?.(result)
      }}
      onBeforeCapture={result => {
        handleOnDragStart?.(result)
      }}
    >
      <Droppable droppableId="droppable">
        {provided => (
          <Tbody {...provided.droppableProps} ref={provided.innerRef}>
            {getRowModel().rows.map?.(row => (
              <Draggable key={`${row.id}`} draggableId={row.id} index={row.index}>
                {(provided, snapshot) => (
                  <>
                    <Tr
                      h={'40px !important'}
                      key={row.id}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      onClick={() => onRowClick?.(row.original)}
                      cursor={onRowClick ? 'pointer' : 'default'}
                      onContextMenu={() => onRightClick?.(row.original)}
                      backgroundColor={snapshot.isDragging ? '#f0fff4' : 'transparent'}
                      boxShadow={snapshot.isDragging ? '0px 3px 5px 3px rgb(112 144 176 / 12%)' : 'none'}
                      _hover={{
                        bg: '#F3F8FF',
                      }}
                    >
                      {row.getVisibleCells().map(cell => {
                        const value = flexRender(cell.column.columnDef.cell, cell.getContext())

                        return (
                          <Td
                            py={0}
                            pr={'50px'}
                            key={cell.id}
                            isTruncated
                            title={cell.getContext()?.getValue() as string}
                            {...getColumnMaxMinWidths(cell.column)}
                          >
                            {value}
                          </Td>
                        )
                      })}
                    </Tr>
                  </>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Tbody>
        )}
      </Droppable>
    </DragDropContext>
  )
}
