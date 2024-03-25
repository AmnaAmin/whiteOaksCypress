import React from 'react'
import { Box, Button, Flex, FormControl, Icon, Spacer } from '@chakra-ui/react'
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
import { BiChevronDown, BiChevronRight, BiSync } from 'react-icons/bi'
import { RECEIVABLE_TABLE_QUERY_KEYS } from 'features/recievable/receivable.constants'
import { BatchConfirmationBox } from 'features/recievable/receivable-confirmation-box'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import ReactSelect from 'components/form/react-select'
import { useAccountData } from 'api/user-account'
import { useDirectReports } from 'api/pc-projects'

const formatGroupLabel = props => (
  <Box onClick={props.onClick} cursor="pointer" display="flex" alignItems="center" fontWeight="normal" ml={'-7px'}>
    {props.isHidden ? <BiChevronRight fontSize={'20px'} /> : <BiChevronDown fontSize={'20px'} />} {props.label}
  </Box>
)

export const ReceivableContext = React.createContext<any>(null)

export const ConstructionPortalReceiveable: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay] = useState<string>('')
  const [userIds, setSelectedUserIds] = useState<any>([])

  const { data } = useAccountData()
  const { directReportOptions = [], isLoading: loadingReports } = useDirectReports(data?.email)

  // const clearAll = () => {
  //   setSelectedCard('')
  //   setSelectedDay('')
  // }

  const formReturn = useForm()

  const { register, reset, control, setValue, watch } = formReturn
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('RECEIVABLE.READ')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 })
  const [sorting, setSorting] = useState<SortingState>([])
  const { setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: RECEIVABLE_TABLE_QUERY_KEYS,
    pagination,
    setPagination,
    selectedCard,
    selectedDay,
    userIds,
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

  const formValues = watch()

  return (
    <ReceivableContext.Provider value={formReturn}>
      <form method="post">
        <Box pb="20">
          {/* <FormLabel variant="strong-label" size="lg">
            {t(`${ACCOUNTS}.accountReceivable`)}
          </FormLabel> */}
          <Box mb={'12px'}>
            <ReceivableFilter onSelected={setSelectedCard} cardSelected={selectedCard} userIds={userIds} />
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
              <FormControl w="215px" mr={'10px'}>
                <ReactSelect
                classNamePrefix={'recievableUsers'}
                  formatGroupLabel={formatGroupLabel}
                  onChange={user => {
                    user.value === 'ALL' ? setSelectedUserIds([]) : setSelectedUserIds([user.value])
                  }}
                  options={directReportOptions}
                  loadingCheck={loadingReports}
                  placeholder={'Select'}
                />
              </FormControl>
              <>
                {!isReadOnly && (
                  <Button
                    alignContent="right"
                    // onClick={onNewProjectModalOpen}
                    colorScheme="brand"
                    type="button"
                    minW={'140px'}
                    onClick={() => Submit(formValues)}
                  >
                    <Icon as={BiSync} fontSize="18px" mr={2} />
                    {!loading ? t(`${ACCOUNTS}.batch`) : t(`${ACCOUNTS}.processing`)}
                  </Button>
                )}
              </>
            </Flex>

            {/* {batchRunStatus && <Box>{failedRun?.description}</Box>} */}

            <Box>
              {loading && <ViewLoader />}
              <ReceivableTable
                setFormValue={setValue}
                receivableColumns={receivableTableColumns}
                setPagination={setPagination}
                setColumnFilters={setColumnFilters}
                pagination={pagination}
                sorting={sorting}
                setSorting={setSorting}
                queryStringWithPagination={queryStringWithPagination}
                queryStringWithoutPagination={queryStringWithoutPagination}
                isReadOnly={isReadOnly}
              />
            </Box>
          </Card>
        </Box>
        {batchLoading && <ViewLoader />}
        {batchRun?.length > 0 && !batchLoading && (
          <BatchConfirmationBox
            title={t(`${ACCOUNTS}.batchProcess`)}
            isOpen={!loading && isBatchClick && batchRun?.length > 0}
            onClose={onNotificationClose}
            batchData={batchRun}
            isLoading={isLoading}
            batchType={'RECEIVABLE'}
          />
        )}
      </form>
      <DevTool control={control} />
    </ReceivableContext.Provider>
  )
}
