import { Box, Button, Divider, Flex, FormLabel, Icon, Spacer } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { ConfirmationBox } from 'components/Confirmation'
import { ViewLoader } from 'components/page-level-loader'
import { ReceivableFilter } from 'features/recievable/receivable-filter'
import { ReceivableTable } from 'features/recievable/receivable-table'
import { reloadResources, t } from 'i18next'
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

export const Receivable = () => {
  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay] = useState<string>('')
  const [batchTitle, setBatchTitle] = useState<string>('')
  const [batchMsg, setBatchMsg] = useState<string | null>('')
  const [isBatchError, setIsBatchError] = useState(false)

  // const clearAll = () => {
  //   setSelectedCard('')
  //   setSelectedDay('')
  // }

  const { handleSubmit, register, reset, control, setValue } = useForm()

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

  const { data: run, mutate: batchCall } = useBatchProcessingMutation()
  const { refetch } = useCheckBatch(setLoading, loading, queryStringWithPagination)
  const receivableTableColumns = useReceivableTableColumns(control, register, setValue)
  const batchId = run?.data?.id || 0
  const { data: batchRun, refetch: refetchBatch } = useBatchRun(batchId, queryStringWithPagination)

  // Get Batch Run Errors
  console.log('batchRun', batchRun)

  const checkBatchRun = batchRun ? batchRun?.filter(br => br?.statusId === 2) : ''
  console.log('checkBatchRun', checkBatchRun)
  const batchResult = checkBatchRun ? checkBatchRun.map(a => a.value).join(', ') : ''
  console.log('batchResult', batchResult)

  // const { weekDayFilters } = useWeeklyCount()

  useEffect(() => {
    if (!loading) {
      reset()
    }
  }, [loading])

  const batchErrorCheck = async () => {
    await batchResult
    alert()
    // setTimeout(() => {
    if (!batchResult) {
      setIsBatchError(true)
      setBatchTitle(t(`${ACCOUNTS}.batchError`))
      setBatchMsg(t(`${ACCOUNTS}.batchErrorMsg`) + batchResult)
    } else {
      setIsBatchError(false)
      setBatchTitle(t(`${ACCOUNTS}.batchProcess`))
      setBatchMsg(t(`${ACCOUNTS}.batchSuccess`))
    }
    // }, 1000)
    // }, [batchResult])
  }

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
      },
    })
  }

  const onNotificationClose = () => {
    setIsBatchClick(false)
    setBatchTitle('')
    setBatchMsg(null)
  }

  return (
    <>
      <form onSubmit={handleSubmit(Submit)}>
        <Box>
          <FormLabel variant="strong-label" size="lg">
            {t(`${ACCOUNTS}.accountReceivable`)}
          </FormLabel>
          <Box mb={2}>
            <ReceivableFilter onSelected={setSelectedCard} cardSelected={selectedCard} />
          </Box>

          {/* Temp comment */}

          <Flex alignItems="center" py="16px">
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
              type="submit"
              minW={'140px'}
            >
              <Icon as={BiSync} fontSize="18px" mr={2} />
              {!loading ? t(`${ACCOUNTS}.batch`) : t(`${ACCOUNTS}.processing`)}
            </Button>
          </Flex>
          <Divider border="2px solid #E2E8F0" />

          {/* {batchRunStatus && <Box>{failedRun?.description}</Box>} */}

          <Box mt={2} pb="4">
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
        </Box>
        {!loading && isBatchClick && batchMsg && (
          <ConfirmationBox
            title={
              // batchTitle
              //checkBatchRun.length > 0
              isBatchError && batchResult ? t(`${ACCOUNTS}.batchError`) : t(`${ACCOUNTS}.batchProcess`)
            }
            content={
              // batchMsg
              // checkBatchRun.length > 0
              isBatchError && batchResult ? t(`${ACCOUNTS}.batchErrorMsg`) + batchResult : t(`${ACCOUNTS}.batchSuccess`)
            }
            isOpen={batchErrorCheck} //!loading && isBatchClick && isBatchError && batchResult}
            onClose={onNotificationClose}
            onConfirm={onNotificationClose}
            yesButtonText={t(`${ACCOUNTS}.close`)}
            showNoButton={false}
          />
        )}
      </form>
      <DevTool control={control} />
    </>
  )
}
