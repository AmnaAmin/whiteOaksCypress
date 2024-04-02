import { Box, Flex, FormControl, Icon, Spacer } from '@chakra-ui/react'
import { Button } from 'components/button/button'
// import { usePayableWeeklyCount } from 'features/recievable/hook'
import { PayableCardsFilter } from 'features/payable/payable-cards-filter'
import { PayableTable } from 'features/payable/payable-table'
// import { AccountWeekDayFilters } from 'features/common/due-projects-weekly-filter/weekly-filter-accounts-details'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiChevronDown, BiChevronRight, BiSync } from 'react-icons/bi'
import { useBatchProcessingMutation, useBatchRun, useCheckBatch, usePaginatedAccountPayable } from 'api/account-payable'
import { ViewLoader } from 'components/page-level-loader'
import { OverPaymentTransactionsTable } from 'features/project-details/transactions/overpayment-transactions-table'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { PAYABLE_TABLE_QUERY_KEYS } from 'features/payable/payable.constants'
import { DevTool } from '@hookform/devtools'
import { ACCOUNTS } from 'pages/accounts.i18n'
import { Card } from 'components/card/card'
import { usePayableColumns } from './hooks'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import ReactSelect from 'components/form/react-select'
import { useAccountData } from 'api/user-account'
import { useDirectReports } from 'api/pc-projects'
import { BatchConfirmationBox } from 'features/recievable/receivable-confirmation-box'

const formatGroupLabel = props => (
  <Box onClick={props.onClick} cursor="pointer" display="flex" alignItems="center" fontWeight="normal" ml={'-7px'}>
    {props.isHidden ? <BiChevronRight fontSize={'20px'} /> : <BiChevronDown fontSize={'20px'} />} {props.label}
  </Box>
)

export const ConstructionPortalPayable = () => {
  const [loading, setLoading] = useState(false)
  const [openBatchConfirmation, setOpenBatchConfirmation] = useState(false)
  const [refetchInterval, setRefetchInterval] = useState(0)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [userIds, setSelectedUserIds] = useState<any>([])
  const [
    selectedDay,
    // setSelectedDay
  ] = useState<string>('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 })
  const [sorting, setSorting] = useState<SortingState>([])
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ')
  const { data } = useAccountData()
  const { directReportOptions = [], isLoading: loadingReports } = useDirectReports(data?.email)

  const { register, reset, control, watch } = useForm()
  const payableColumns = usePayableColumns(control, register)
  const { setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: PAYABLE_TABLE_QUERY_KEYS,
    pagination,
    setPagination,
    selectedCard,
    selectedDay,
    userIds,
    sorting,
  })

  const {
    workOrders,
    isLoading: isLoadingPayables,
    totalPages,
    dataCount,
    refetch: refetchPayables,
  } = usePaginatedAccountPayable(queryStringWithPagination, pagination.pageSize)

  const { data: run, mutate: batchCall } = useBatchProcessingMutation()
  const batchId = run?.data?.id || 0
  const { data: batchRun, isLoading: isLoadingBatchResult, refetch: fetchBatchResult } = useBatchRun(batchId)
  const { refetch: fetchBatchCheck } = useCheckBatch(
    queryStringWithPagination,
    setLoading,
    fetchBatchResult,
    refetchInterval,
    setRefetchInterval,
  )
const[isDrawForBatch, setIsDrawForBatch] = useState(false) 

  const Submit = formValues => {
    const id = [] as any
    for (let [key, value] of Object.entries(formValues.id)) {
      if (!!value) {
        id.push(key)
      }
    }
    const payloadArr = [] as any
    // Loop in for all selected ID's values on grid through checkbox
    id.forEach(selectedID => {
      //finding from all work order(payable grid's data) to save the checked id's in an array
      const payable = workOrders?.find(w => w.idd === selectedID)
      const isDraw = payable?.paymentType?.toLowerCase() === 'wo draw'
      setIsDrawForBatch(isDraw)
      
      if (isDraw) {
        const objDraw = {
          transactionId: parseInt(payable.transactionId as string),
          type: 'Draw',
        }
        payloadArr.push(objDraw)
      } else {
        const objPAyment = {
          id: payable?.id,
          type: 'Payment',
        }
        payloadArr.push(objPAyment)
      }
    })

    const obj = {
      typeCode: 'AP',
      entities: payloadArr,
    }

    if (payloadArr.length === 0) return

    setLoading(true)

    batchCall(obj as any, {
      onSuccess: () => {
        fetchBatchCheck()
        setRefetchInterval(1000)
      },
    })
  }
  useEffect(() => {
    reset()
    if (batchRun?.length > 0 && !isLoadingBatchResult) {
      setOpenBatchConfirmation(true)
    }
  }, [batchRun])

  const onNotificationClose = () => {
    setOpenBatchConfirmation(false)
  }
  const formValues = watch()

  useEffect(() => {
    if (!loading) {
      reset()
    }
  }, [loading])
  return (
    <form method="post">
      <Box pb="2">
        <Box mb={'12px'}>
          <PayableCardsFilter onSelected={setSelectedCard} cardSelected={selectedCard} userIds={userIds} />
        </Box>
        <Card px="12px" py="16px">
          <Flex alignItems="center" mb="16px">
            <Spacer />
            <FormControl w="215px" mr={'10px'}>
              <ReactSelect
              classNamePrefix={'userIds'}
                formatGroupLabel={formatGroupLabel}
                onChange={user => {
                  user.value === 'ALL' ? setSelectedUserIds([]) : setSelectedUserIds([user.value])
                }}
                options={directReportOptions}
                loadingCheck={loadingReports}
                placeholder={'Select'}
              />
            </FormControl>
            {!isReadOnly && (
              <Button
                alignContent="right"
                colorScheme="brand"
                type="button"
                onClick={() => Submit(formValues)}
                disabled={selectedCard === '6'}
                minW="140px"
              >
                <Icon as={BiSync} fontSize="18px" mr={2} />
                {!loading ? t(`${ACCOUNTS}.batch`) : t(`${ACCOUNTS}.processing`)}
              </Button>
            )}
          </Flex>

          {/* -- If overpayment card is not selected, then show payable table. (Overpayment Card Id is 6) -- */}
          {selectedCard !== '6' ? (
            <Box>
              {loading && <ViewLoader />}
              <PayableTable
                payableColumns={payableColumns}
                pagination={pagination}
                sorting={sorting}
                setSorting={setSorting}
                setPagination={setPagination}
                setColumnFilters={setColumnFilters}
                queryStringWithoutPagination={queryStringWithoutPagination}
                workOrders={workOrders as any}
                isLoading={isLoadingPayables}
                totalPages={totalPages}
                dataCount={dataCount}
                refetchPayables={refetchPayables}
                isReadOnly={isReadOnly}
              />
            </Box>
          ) : (
            <OverPaymentTransactionsTable />
          )}
        </Card>
      </Box>
      {openBatchConfirmation && (
        <BatchConfirmationBox
          title={t(`${ACCOUNTS}.batchProcess`)}
          isOpen={openBatchConfirmation}
          onClose={onNotificationClose}
          batchData={batchRun}
          isLoading={isLoadingBatchResult}
          batchType={'PAYABLE'}
         isDraw={isDrawForBatch}
        />
      )}

      <DevTool control={control} />
    </form>
  )
}
