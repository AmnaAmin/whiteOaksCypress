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
import { useBatchProcessingMutation, useCheckBatch } from 'api/account-payable'
import { ViewLoader } from 'components/page-level-loader'
import { OverPaymentTransactionsTable } from 'features/project-details/transactions/overpayment-transactions-table'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { PAYABLE_TABLE_QUERY_KEYS } from 'features/payable/payable.constants'
import { DevTool } from '@hookform/devtools'
import { ACCOUNTS } from 'pages/accounts.i18n'
import { Card } from 'components/card/card'
import { usePayableColumns } from './hooks'

//All commented Code will be used later
export const ConstructionPortalPayable = () => {
  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [
    selectedDay,
    // setSelectedDay
  ] = useState<string>('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 0 })
  const [sorting, setSorting] = useState<SortingState>([])

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

  const { mutate: batchCall } = useBatchProcessingMutation()
  const { refetch } = useCheckBatch(setLoading, loading, queryStringWithPagination)

  useEffect(() => {
    if (!loading) {
      reset()
    }
  }, [loading])

  const Submit = formValues => {
    const payableProjects = compact(formValues.id).map(id => ({
      id: parseInt(id as string),
      type: '',
    }))

    const obj = {
      typeCode: 'AP',
      entities: payableProjects,
    }

    if (payableProjects.length === 0) return

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
  const formValues = watch();
  // const { weekDayFilters } = usePayableWeeklyCount({ pagination, queryStringWithPagination })

  return (
    <form method='post'>
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
            <Button alignContent="right" colorScheme="brand"  type="button"  onClick={ () => Submit(formValues) } disabled={selectedCard === '6'} minW="140px">
              <Icon as={BiSync} fontSize="18px" mr={2} />
              {!loading ? t(`${ACCOUNTS}.batch`) : t(`${ACCOUNTS}.processing`)}
            </Button>
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
                queryStringWithPagination={queryStringWithPagination}
                queryStringWithoutPagination={queryStringWithoutPagination}
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
        onClose={onNotificationClose}content={t(`${ACCOUNTS}.batchSuccess`)}
        onConfirm={onNotificationClose}
        yesButtonText={t(`${ACCOUNTS}.close`)}
        showNoButton={false}
      />
      <DevTool control={control} />
    </form>
  )
}
