import { Box, Divider, Flex, FormLabel, Icon, Spacer } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { Button } from 'components/button/button'
import { ConfirmationBox } from 'components/Confirmation'
import { ViewLoader } from 'components/page-level-loader'
import { ReceivableFilter } from 'features/recievable/receivable-filter'
import { ReceivableTable } from 'features/recievable/receivable-table'
import { AccountWeekDayFilters } from 'features/common/due-projects-weekly-filter/weekly-filter-accounts-details'
import { t } from 'i18next'
import { compact } from 'lodash'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiSync } from 'react-icons/bi'
import { useBatchProcessingMutation, useCheckBatch } from 'api/account-receivable'
import { useWeeklyCount } from 'features/payable/hooks'
import { PaginationState } from '@tanstack/react-table'
import { PAYABLE_TABLE_QUERY_KEYS } from 'features/payable/payable.constants'
import { useColumnFiltersQueryString } from 'components/table-refactored/hooks'
import { useReceivableTableColumns } from 'features/recievable/hook'

export const Receivable = () => {
  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<string>('')

  const clearAll = () => {
    setSelectedCard('')
    setSelectedDay('')
  }

  const { handleSubmit, register, reset, control } = useForm()

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const { setColumnFilters, queryStringWithPagination, queryStringWithoutPagination } = useColumnFiltersQueryString({
    queryStringAPIFilterKeys: PAYABLE_TABLE_QUERY_KEYS,
    pagination,
    setPagination,
    selectedCard,
    selectedDay,
  })

  const { mutate: batchCall } = useBatchProcessingMutation()
  const { refetch } = useCheckBatch(setLoading, loading, queryStringWithPagination, queryStringWithoutPagination)
  const receivableTableColumns = useReceivableTableColumns(control, register)
  const { weekDayFilters } = useWeeklyCount()

  useEffect(() => {
    if (!loading) {
      reset()
    }
  }, [loading])

  const Submit = formValues => {
    const receivableProjects = compact(formValues.id).map(id => ({
      id: parseInt(id as string),
      type: 'Remaining Payments',
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
  }

  return (
    <>
      <form onSubmit={handleSubmit(Submit)}>
        <Box>
          <FormLabel variant="strong-label" size="lg">
            {t('Account Receivable')}
          </FormLabel>
          <Box mb={2}>
            <ReceivableFilter onSelected={setSelectedCard} cardSelected={selectedCard} />
          </Box>
          <Flex alignItems="center" py="16px">
            <FormLabel variant="strong-label" size="lg" m="0" pl={2} whiteSpace="nowrap">
              {t('dueProjects')}
            </FormLabel>
            <AccountWeekDayFilters
              weekDayFilters={weekDayFilters}
              onSelectDay={setSelectedDay}
              selectedDay={selectedDay}
              clear={clearAll}
            />
            <Spacer />
            <Button
              alignContent="right"
              // onClick={onNewProjectModalOpen}
              colorScheme="brand"
              type="submit"
            >
              <Icon as={BiSync} fontSize="18px" mr={2} />
              {!loading ? 'Batch Process' : 'Processing...'}
            </Button>
          </Flex>
          <Divider border="2px solid #E2E8F0" />
          <Box mt={2} pb="4">
            {loading && <ViewLoader />}
            <ReceivableTable
              receivableColumns={receivableTableColumns}
              setPagination={setPagination}
              setColumnFilters={setColumnFilters}
              pagination={pagination}
              queryStringWithPagination={queryStringWithPagination}
              queryStringWithoutPagination={queryStringWithoutPagination}
            />
          </Box>
        </Box>
        <ConfirmationBox
          title="Batch processing"
          content="Batch Process has been completed successfully."
          isOpen={!loading && isBatchClick}
          onClose={onNotificationClose}
          onConfirm={onNotificationClose}
          yesButtonText="Cancel"
          showNoButton={false}
        />
      </form>
      <DevTool control={control} />
    </>
  )
}
