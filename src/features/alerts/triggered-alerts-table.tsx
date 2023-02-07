import React, { useEffect, useMemo, useState } from 'react'
import { Box, Checkbox, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { dateFormat } from 'utils/date-time-utils'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { useParams } from 'react-router-dom'
import { useAuth } from 'utils/auth-context'
import { useFetchUserAlerts } from 'api/projects'
import { TableFooter } from 'components/table-refactored/table-footer'
import Table from 'components/table-refactored/table'
import { ColumnDef } from '@tanstack/react-table'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'

enum PROJECT_CATEGORY {
  WARNING = 1,
  INFO = 2,
  ERROR = 3,
}

export const TriggeredAlertsTable = React.forwardRef((props: any, ref) => {
  const { data } = useAuth()
  const account = data?.user
  const { data: alerts, isLoading } = useFetchUserAlerts(account?.login)
  const { t } = useTranslation()
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const TRIGGERED_ALERTS_COLUMNS: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: () => {
          return (
            <Flex minW={'60px'} justifyContent="center">
              <Checkbox
                style={{ backgroundColor: 'white', borderColor: 'gray.500' }}
                value={'all'}
                size="lg"
                onChange={e => {
                  console.log(e.currentTarget.value)
                }}
              />
            </Flex>
          )
        },
        enableSorting: false,
        accessorKey: 'checkbox',
        accessorFn: () => true,
        cell: cellInfo => {
          const { row } = cellInfo
          return (
            <Flex justifyContent="center" onClick={e => e.stopPropagation()}>
              <Checkbox
                value={row.original.id}
                onChange={e => {
                  console.log(e.currentTarget.value)
                }}
              />
            </Flex>
          )
        },
        size: 60,
      },
      {
        header: 'Name',
        accessorKey: 'subject',
      },

      {
        header: t('type') as string,
        accessorKey: 'triggeredType',
      },
      {
        header: t('value') as string,
        accessorKey: 'attribute',
      },
      {
        header: t('category') as string,
        accessorKey: 'category',
        cell: ({ row }) => PROJECT_CATEGORY[row.original.category],
      },
      {
        header: t('dateTriggered') as string,
        accessorKey: 'dateCreated',
        cell: ({ row }) => dateFormat(row.original.dateCreated),
      },
    ]
  }, [])
  useEffect(() => {
    if (!alerts?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((alerts?.length ?? 0) / 50))
      setTotalRows(alerts?.length ?? 0)
    }
  }, [alerts])

  const setPageCount = rows => {
    if (!rows?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((rows?.length ?? 0) / 50))
      setTotalRows(rows?.length ?? 0)
    }
  }

  return (
    <Box
      w="100%"
      minH="calc(100vh - 503px)"
      position="relative"
      borderRadius="6px"
      border="1px solid #CBD5E0"
      overflowX="auto"
      roundedRight={{ base: '0px', sm: '6px' }}
    >
      <TableContextProvider
        totalPages={totalPages}
        data={alerts}
        columns={TRIGGERED_ALERTS_COLUMNS}
        manualPagination={false}
      >
        <Table isLoading={isLoading} isEmpty={!isLoading && !alerts?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <Box h="35px" />

          <TablePagination>
            <ShowCurrentRecordsWithTotalRecords dataCount={totalRows} setPageCount={setPageCount} />
            <GotoFirstPage />
            <GotoPreviousPage />
            <GotoNextPage />
            <GotoLastPage />
          </TablePagination>
        </TableFooter>
      </TableContextProvider>
    </Box>
  )
})
