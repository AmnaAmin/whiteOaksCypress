// React Table Pagination Component
// ---------------------------------

import React, { ChangeEvent } from 'react'

import { Button, ButtonProps, Flex, HStack, Input, StackProps, Text } from '@chakra-ui/react'
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

export const SelectPageSize: React.FC = () => {
  const tableInstance = useTableInstance()
  const { pageSize } = tableInstance.getState().pagination

  // handle page index change
  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    tableInstance.setPageSize(parseInt(event.target.value, 10))
  }

  return (
    <Flex gap="1" alignItems="center">
      <select value={pageSize} onChange={handlePageSizeChange}>
        {[5, 10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
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

export const ShowCurrentRecordsWithTotalRecords = ({ dataCount }) => {
  const tableInstance = useTableInstance()
  const { pageIndex, pageSize } = tableInstance.getState().pagination

  return (
    <Flex gap="1" alignItems="center">
      <>
        <Text color="blackAlpha.800">
          {pageIndex * pageSize + 1} - {pageIndex * pageSize + pageSize}
        </Text>
        {dataCount && <Text color="blackAlpha.600">of {dataCount}</Text>}
      </>
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
