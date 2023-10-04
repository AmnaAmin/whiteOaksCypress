import { Box, Flex, Icon, Spacer } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { ConfirmationBox } from 'components/Confirmation'
// import { usePayableWeeklyCount } from 'features/recievable/hook'
import { PayableCardsFilter } from 'features/payable/payable-cards-filter'
import { PayableTable } from 'features/payable/payable-table'
// import { AccountWeekDayFilters } from 'features/common/due-projects-weekly-filter/weekly-filter-accounts-details'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiSync } from 'react-icons/bi'
import { compact } from 'lodash'
import { useBatchProcessingMutation, useCheckBatch, usePaginatedAccountPayable } from 'api/account-payable'
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

//All commented Code will be used later
export const ConstructionPortalPayable = () => {
  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedIDs, setSelectedIDs] = useState<any>([])
  const [
    selectedDay,
    // setSelectedDay
  ] = useState<string>('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 0 })
  const [sorting, setSorting] = useState<SortingState>([])
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ')

  // const clearAll = () => {
  //   setSelectedCard('')
  //   setSelectedDay('')
  // }

  const { register, reset, control, watch } = useForm()
  const payableColumns = usePayableColumns(control, register)
  const { setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: PAYABLE_TABLE_QUERY_KEYS,
    pagination,
    setPagination,
    selectedCard,
    selectedDay,
    sorting,
  })

  const {
    workOrders,
    isLoading,
    totalPages,
    dataCount,
    refetch: refetchPayables,
  } = usePaginatedAccountPayable(queryStringWithPagination, pagination.pageSize)

  const { mutate: batchCall } = useBatchProcessingMutation()
  const { refetch } = useCheckBatch(setLoading, loading, queryStringWithPagination)

  const Submit = formValues => {
    const id = compact(formValues.id).map(id => id)
    setSelectedIDs(id)
    const payloadArr = [] as any
    // Loop in for all selected ID's values on grid through checkbox
    compact(formValues.id).forEach(selectedID => {
      //finding from all work order(payable grid's data) to save the checked id's in an array
      const payable = workOrders?.find(w => w.id === parseInt(selectedID as string))
      const isDraw = payable?.paymentType?.toLowerCase() === 'wo draw'
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
    setIsBatchClick(true)

    batchCall(obj as any, {
      onSuccess: () => {
        refetch()
      },
    })
  }
  const onNotificationClose = () => {
    setIsBatchClick(false)
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
          <PayableCardsFilter onSelected={setSelectedCard} cardSelected={selectedCard} />
        </Box>
        <Card px="12px" py="16px">
          <Flex alignItems="center" mb="16px">
            {/* <FormLabel variant="strong-label" size="lg" m="0" pl={2} whiteSpace="nowrap">
            {t('dueProjects')}
          </FormLabel>
          <Box ml="2">
            <Divider orientation="vertical" borderColor="#A0AEC0" h="23px" />
          </Box> */}
            {/*
           This will be used in future 
          <AccountWeekDayFilters
            weekDayFilters={weekDayFilters}
            onSelectDay={setSelectedDay}
            selectedDay={selectedDay}
            clear={clearAll}
          /> */}
            <Spacer />
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
                isLoading={isLoading}
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

      <ConfirmationBox
        title={t(`${ACCOUNTS}.batchProcess`)}
        isOpen={!loading && isBatchClick}
        onClose={onNotificationClose}
        content={t(`${ACCOUNTS}.batchSuccess`)}
        contentMsg={t(`${ACCOUNTS}.batchSucessFor`)}
        idValues={selectedIDs}
        onConfirm={onNotificationClose}
        yesButtonText={t(`${ACCOUNTS}.ok`)}
        showNoButton={false}
      />
      <DevTool control={control} />
    </form>
  )
}
