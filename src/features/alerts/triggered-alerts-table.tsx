import React, { useEffect, useMemo, useState } from 'react'
import { Box, Checkbox, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { useAuth } from 'utils/auth-context'

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
import { difference } from 'lodash'
import { useFetchUserAlerts } from 'api/alerts'

enum PROJECT_CATEGORY {
  WARNING = 1,
  INFO = 2,
  ERROR = 3,
}

export const TriggeredAlertsTable = React.forwardRef((props: any, ref) => {
  const { selectedAlerts, setSelectedAlerts } = props
  const { data } = useAuth()
  const account = data?.user
  const { data: alerts, isLoading, isFetching } = useFetchUserAlerts()
  const userAlerts = alerts?.filter(a => a.login === account?.login)
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
                isChecked={
                  userAlerts &&
                  userAlerts?.length > 0 &&
                  difference(
                    userAlerts.map(r => r.id),
                    selectedAlerts,
                  )?.length < 1
                }
                onChange={e => {
                  const allIds = userAlerts?.map(a => a?.id)
                  if (e.currentTarget?.checked) {
                    setSelectedAlerts(allIds ? [...allIds] : [])
                  } else {
                    setSelectedAlerts([])
                  }
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
          const id = Number(row?.original?.id)
          return (
            <Flex justifyContent="center" onClick={e => e.stopPropagation()}>
              <Checkbox
                isChecked={selectedAlerts?.includes(id)}
                value={id}
                onChange={e => {
                  const val = Number(e.currentTarget.value)
                  if (e.currentTarget?.checked) {
                    if (!selectedAlerts?.includes(val)) {
                      setSelectedAlerts([...selectedAlerts, val])
                    }
                  } else {
                    setSelectedAlerts([...selectedAlerts.filter(s => s !== val)])
                  }
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
        accessorFn: cellInfo => PROJECT_CATEGORY[cellInfo.category],
        cell: ({ row }) => PROJECT_CATEGORY[row.original.category],
      },
      {
        header: t('dateTriggered') as string,
        accessorKey: 'dateCreated',
        accessorFn: row => datePickerFormat(row.dateCreated),
        cell: (row: any) => {
          const value = row?.row.original?.dateCreated
          return dateFormat(value)
        },
        meta: { format: 'date' },
      },
    ]
  }, [userAlerts, selectedAlerts, setSelectedAlerts])

  useEffect(() => {
    if (!userAlerts?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((userAlerts?.length ?? 0) / 50))
      setTotalRows(userAlerts?.length ?? 0)
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
        data={userAlerts}
        columns={TRIGGERED_ALERTS_COLUMNS}
        manualPagination={false}
      >
        <Table isLoading={isLoading || isFetching} isEmpty={!isLoading && !isFetching && !alerts?.length} />
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
