import React from 'react'
import { Box, Button, Flex, Icon, Spacer } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { ViewLoader } from 'components/page-level-loader'
import { ReceivableFilter } from 'features/recievable/receivable-filter'
import { ReceivableTable } from 'features/recievable/receivable-table'
import { compact } from 'lodash'
import { useEffect, useState } from 'react'
import { useBatchProcessingMutation, useBatchRun, useCheckBatch } from 'api/account-receivable'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { useForm } from 'react-hook-form'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { useReceivableTableColumns } from 'features/recievable/hook'
import { ACCOUNTS } from 'pages/accounts.i18n'
import { BiSync } from 'react-icons/bi'
import { RECEIVABLE_TABLE_QUERY_KEYS } from 'features/recievable/receivable.constants'
import { ReceivableConfirmationBox } from 'features/recievable/receivable-confirmation-box'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'

export const ConstructionPortalReceiveable: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay] = useState<string>('')

  // const clearAll = () => {
  //   setSelectedCard('')
  //   setSelectedDay('')
  // }

  const { handleSubmit, register, reset, control, setValue, watch } = useForm()

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 0 })
  const [sorting, setSorting] = useState<SortingState>([])
  const { setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: RECEIVABLE_TABLE_QUERY_KEYS,
    pagination,
    setPagination,
    selectedCard,
    selectedDay,
    sorting,
  })

  const [refetchInterval, setRefetchInterval] = useState<number | boolean>(false)

  const [batchLoading, setBatchLoading] = useState(false)
  const { data: run, mutate: batchCall } = useBatchProcessingMutation()
  const { refetch } = useCheckBatch(setLoading, loading, queryStringWithPagination)
  const receivableTableColumns = useReceivableTableColumns(control, register, setValue)
  const batchId = run?.data?.id || 0
  const {
    data: batchRun,
    isLoading,
    refetch: refetchBatch,
  } = useBatchRun(batchId, queryStringWithPagination, refetchInterval)
  const { t } = useTranslation()

  // const { weekDayFilters } = useWeeklyCount()

  useEffect(() => {
    if (!loading) {
      reset()
    }
    const timer = setTimeout(() => {
      setRefetchInterval(false)
    }, 12000)
    return () => {
      clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    if (batchId === 0) {
      setBatchLoading(true)
    }
    setBatchLoading(false)
    refetchBatch()
  }, [batchId])

  const Submit = formValues => {
    const receivableProjects = compact(formValues.selected)?.map((row: any) => ({
      id: row?.projectId,
      type: row?.type,
      transactionId: row?.changeOrderId,
    }))

    const obj = {
      typeCode: 'AR',
      entities: receivableProjects,
    }

    if (receivableProjects.length === 0) return

    setLoading(true)
    setIsBatchClick(true)

    batchCall(obj as any, {
      onSuccess: () => {
        refetch()
        setRefetchInterval(1000)
      },
    })
  }

  const onNotificationClose = () => {
    setIsBatchClick(false)
  }

  const formValues = watch();

  return (
    <>
      <form method='post'>
        <Box pb="20">
          {/* <FormLabel variant="strong-label" size="lg">
            {t(`${ACCOUNTS}.accountReceivable`)}
          </FormLabel> */}
          <Box mb={'12px'}>
            <ReceivableFilter onSelected={setSelectedCard} cardSelected={selectedCard} />
          </Box>

          {/* Temp comment */}
          <Card px="12px" py="16px">
            <Flex alignItems="center" mb="16px">
              {/* <FormLabel variant="strong-label" size="lg" m="0" pl={2} whiteSpace="nowrap">
              {t('dueProjects')}
            </FormLabel>
            <AccountWeekDayFilters
              weekDayFilters={weekDayFilters}
              onSelectDay={setSelectedDay}
              selectedDay={selectedDay}
              clear={clearAll}
            /> */}
              <Spacer />
              <Button
                alignContent="right"
                // onClick={onNewProjectModalOpen}
                colorScheme="brand"
                type="button"
                minW={'140px'}
                onClick={ () => Submit(formValues) }
              >
                <Icon as={BiSync} fontSize="18px" mr={2} />
                {!loading ? t(`${ACCOUNTS}.batch`) : t(`${ACCOUNTS}.processing`)}
              </Button>
            </Flex>

            {/* {batchRunStatus && <Box>{failedRun?.description}</Box>} */}

            <Box>
              {loading && <ViewLoader />}
              <ReceivableTable
                receivableColumns={receivableTableColumns}
                setPagination={setPagination}
                setColumnFilters={setColumnFilters}
                pagination={pagination}
                sorting={sorting}
                setSorting={setSorting}
                queryStringWithPagination={queryStringWithPagination}
                queryStringWithoutPagination={queryStringWithoutPagination}
              />
            </Box>
          </Card>
        </Box>
        {batchLoading && <ViewLoader />}
        {batchRun?.length > 0 && !batchLoading && (
          <ReceivableConfirmationBox
            title={t(`${ACCOUNTS}.batchProcess`)}
            isOpen={!loading && isBatchClick && batchRun?.length > 0}
            onClose={onNotificationClose}
            batchData={batchRun}
            isLoading={isLoading}
          />
        )}
      </form>
      <DevTool control={control} />
    </>
  )
}
