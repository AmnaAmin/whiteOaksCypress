// React Table Pagination Component
// ---------------------------------

import React, { ChangeEvent, useEffect } from 'react'

import { Button, ButtonProps, Flex, HStack, Input, Select, StackProps, Text } from '@chakra-ui/react'
import { useTableInstance } from './table-context'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi'

export const TablePagination: React.FC<StackProps> = ({ children, ...rest }) => {
  return (
    <HStack gap="2" {...rest}>
      {children}
    </HStack>
  )
}

const PaginationButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      size="xs"
      color="blackAlpha.700"
      variant="ghost"
      _hover={{ color: 'blackAlpha.800' }}
      minW="30px"
      {...props}
    >
      {children}
    </Button>
  )
}

export const GotoPage: React.FC = () => {
  const tableInstance = useTableInstance()
  const { pageIndex } = tableInstance.getState().pagination

  // handle page index change
  const handlePageIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPageIndex = parseInt(event.target.value, 10)

    if (newPageIndex >= 0 && newPageIndex < tableInstance.getPageCount()) {
      tableInstance.setPageIndex(newPageIndex)
    }
  }

  return (
    <Flex gap="1" alignItems="center">
      <Text>| Go to page:</Text>
      <Input type="number" defaultValue={pageIndex + 1} onChange={handlePageIndexChange} size="sm" maxWidth="70px" />
    </Flex>
  )
}

export const SelectPageSize = ({ onPageSizeChange, dataCount }) => {
  const tableInstance = useTableInstance()
  const { pageSize } = tableInstance.getState().pagination

  // handle page index change
  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    tableInstance.setPageSize(parseInt(event.target.value, 10))
    onPageSizeChange?.(event.target.value)
  }

  return (
    <Flex gap="1" alignItems="center">
      <Select
        disabled={dataCount <= 25 ? true : false}
        style={{ color: '#4A5568', border: '1px solid #CBD5E0' }}
        value={pageSize}
        onChange={handlePageSizeChange}
      >
        {[25, 50, 100].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </Select>
    </Flex>
  )
}

export const GotoFirstPage: React.FC<ButtonProps> = () => {
  const tableInstance = useTableInstance()

  // handle page first
  const handlePageFirst = () => {
    tableInstance.setPageIndex(0)
  }

  return (
    <PaginationButton onClick={handlePageFirst} disabled={!tableInstance.getCanPreviousPage()}>
      <HiOutlineChevronDoubleLeft fontSize="14px" />
    </PaginationButton>
  )
}

export const GotoPreviousPage: React.FC<ButtonProps> = () => {
  const tableInstance = useTableInstance()
  const { pageIndex } = tableInstance.getState().pagination

  // handle page previous
  const handlePagePrevious = () => {
    if (pageIndex > 0) {
      tableInstance.setPageIndex(pageIndex - 1)
    }
  }

  return (
    <PaginationButton onClick={handlePagePrevious} disabled={!tableInstance.getCanPreviousPage()}>
      <MdOutlineArrowBackIos />
    </PaginationButton>
  )
}

export const GotoNextPage: React.FC<ButtonProps> = () => {
  const tableInstance = useTableInstance()
  const { pageIndex } = tableInstance.getState().pagination

  // handle page next
  const handlePageNext = () => {
    if (pageIndex < tableInstance.getTotalSize() - 1) {
      tableInstance.setPageIndex(pageIndex + 1)
    }
  }

  return (
    <PaginationButton onClick={handlePageNext} disabled={!tableInstance.getCanNextPage()}>
      <MdOutlineArrowForwardIos />
    </PaginationButton>
  )
}

export const GotoLastPage: React.FC<ButtonProps> = () => {
  const tableInstance = useTableInstance()

  // handle page last
  const handlePageLast = () => {
    const lastIndex = tableInstance.getPageCount() - 1
    tableInstance.setPageIndex(lastIndex)
  }

  return (
    <PaginationButton onClick={handlePageLast} disabled={!tableInstance.getCanNextPage()}>
      <HiOutlineChevronDoubleRight fontSize="14px" />
    </PaginationButton>
  )
}

export const ShowCurrentRecordsWithTotalRecords = props => {
  const { dataCount, setPageCount } = props
  const tableInstance = useTableInstance()
  const { pageIndex, pageSize } = tableInstance.getState().pagination
  const lastRecordCount = pageIndex * pageSize + pageSize

  useEffect(() => {
    setPageCount?.(tableInstance?.getPrePaginationRowModel().rows) // setting page count in case of front end pagination. Manual Pagination (false)
  }, [tableInstance?.getPrePaginationRowModel().rows])

  return (
    <Flex gap="1" alignItems="center" whiteSpace="nowrap">
      {pageIndex !== -1 && dataCount > 0 && (
        <>
          <Text color="blackAlpha.800">
            {pageIndex * pageSize + 1} -{dataCount < lastRecordCount ? dataCount : lastRecordCount}
          </Text>
          {dataCount && <Text color="blackAlpha.600">of {dataCount}</Text>}
        </>
      )}
    </Flex>
  )
}

export const ShowCurrentPageWithTotal: React.FC = () => {
  const tableInstance = useTableInstance()
  const { pageIndex, pageSize } = tableInstance.getState().pagination
  return (
    <Flex gap="1" alignItems="center">
      <Text color="blackAlpha.800">
        {pageIndex + 1} - {pageSize}
      </Text>
      <Text color="blackAlpha.600">of {tableInstance.getPageCount()}</Text>
    </Flex>
  )
}
