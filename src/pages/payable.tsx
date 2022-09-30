import { Box, Center, Checkbox, Divider, Flex, FormLabel, Icon, Spacer, Stack } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { ConfirmationBox } from 'components/Confirmation'
import TableColumnSettings from 'components/table/table-column-settings'
import { usePayableWeeklyCount } from 'features/recievable/hook'
import { PayableCardsFilter } from 'features/payable/payable-cards-filter'
import { PayableTable } from 'features/payable/payable-table'
import { AccountWeekDayFilters } from 'features/common/due-projects-weekly-filter/weekly-filter-accounts-details'
import { t } from 'i18next'
import numeral from 'numeral'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { BiExport, BiSync } from 'react-icons/bi'
import { TableNames } from 'types/table-column.types'
import { dateFormat } from 'utils/date-time-utils'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings'
import { compact } from 'lodash'
import { useBatchProcessingMutation, useCheckBatch } from 'api/account-payable'
import { ViewLoader } from 'components/page-level-loader'
import { OverPaymentTransactionsTable } from 'features/project-details/transactions/overpayment-transactions-table'

export const Payable = () => {
  const [projectTableInstance, setInstance] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<string>('')

  const clearAll = () => {
    setSelectedCard('')
    setSelectedDay('')
  }

  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  const { handleSubmit, register, reset, control } = useForm()

  const { mutate: batchCall } = useBatchProcessingMutation()
  const { refetch } = useCheckBatch(setLoading, loading)
  const formValues = useWatch({ control })

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

    if (!payableProjects.length) return

    setLoading(true)
    setIsBatchClick(true)

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

  const PAYABLE_COLUMNS = useMemo(
    () => [
      {
        Header: t('id'),
        accessor: 'projectId',
      },
      {
        Header: t('vendorName'),
        accessor: 'claimantName',
      },
      {
        Header: t('propertyAddress'),
        accessor: 'propertyAddress',
      },
      {
        Header: t('vendorAddress'),
        accessor: 'vendorAddress',
      },
      {
        Header: t('paymentTerms'),
        accessor: 'paymentTerm',
      },
      {
        Header: t('expectedPayDate'),
        accessor: 'expectedPaymentDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
        getCellExportValue(row) {
          return dateFormat(row.original.expectedPaymentDate)
        },
      },
      {
        Header: t('finalInvoice'),
        accessor: 'finalInvoiceAmount',
        Cell: ({ value }) => {
          return numeral(value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.finalInvoiceAmount).format('$0,0.00')
        },
      },
      {
        Header: t('markets'),
        accessor: 'marketName',
      },
      {
        Header: t('woStartDate'),
        accessor: 'workOrderStartDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
        getCellExportValue(row) {
          return dateFormat(row.original.workOrderStartDate)
        },
      },
      {
        Header: t('wOCompletedDate'),
        accessor: 'workOrderDateCompleted',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
        getCellExportValue(row) {
          return dateFormat(row.original.workOrderDateCompleted)
        },
      },
      {
        Header: t('wOIssueDate'),
        accessor: 'workOrderIssueDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
        getCellExportValue(row) {
          return dateFormat(row.original.workOrderIssueDate)
        },
      },
      {
        Header: t('checkbox'),
        accessor: 'checkbox',
        Cell: ({ row }) => {
          return (
            <Flex justifyContent="end" onClick={e => e.stopPropagation()}>
              <Spacer w="20px" />
              <Checkbox
                value={row.original?.id}
                {...register(`id.${row.index}`)}
                isChecked={!!formValues?.id?.[row.index]}
              />
            </Flex>
          )
        },
        disableExport: true,
      },
    ],
    [register, loading, formValues],
  )

  const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.payable)
  const { tableColumns, settingColumns, isLoading } = useTableColumnSettings(PAYABLE_COLUMNS, TableNames.payable)

  const onSave = columns => {
    postProjectColumn(columns)
  }

  const { weekDayFilters } = usePayableWeeklyCount()

  return (
    <form onSubmit={handleSubmit(Submit)}>
      <Box>
        <FormLabel variant="strong-label" size="lg">
          {t('Account Payable')}
        </FormLabel>
        <Box>
          <PayableCardsFilter onSelected={setSelectedCard} cardSelected={selectedCard} />
        </Box>
        <Flex alignItems="center" py="16px">
          <FormLabel variant="strong-label" size="lg" m="0" pl={2} whiteSpace="nowrap">
            {t('dueProjects')}
          </FormLabel>
          <Box ml="2">
            <Divider orientation="vertical" borderColor="#A0AEC0" h="23px" />
          </Box>
          <AccountWeekDayFilters
            weekDayFilters={weekDayFilters}
            onSelectDay={setSelectedDay}
            selectedDay={selectedDay}
            clear={clearAll}
          />
          <Spacer />
          <Button alignContent="right" colorScheme="brand" type="submit" disabled={selectedCard === '6'}>
            <Icon as={BiSync} fontSize="18px" mr={2} />
            {!loading ? 'Batch Process' : 'Processing...'}
          </Button>
        </Flex>
        <Divider border="2px solid #E2E8F0" />
      </Box>

      {/* -- If overpayment card is not selected, then show payable table. (Overpayment Card Id is 6) -- */}
      {selectedCard !== '6' ? (
        <>
          <Box mt={2}>
            {loading && <ViewLoader />}
            <PayableTable
              selectedCard={selectedCard as string}
              selectedDay={selectedDay as string}
              payableColumns={tableColumns}
              setTableInstance={setProjectTableInstance}
              weekDayFilters={weekDayFilters}
            />
          </Box>
          <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5} pb={4}>
            <Flex borderRadius="0 0 6px 6px" bg="#F7FAFC" border="1px solid #E2E8F0">
              <Button
                m={0}
                colorScheme="brand"
                variant="ghost"
                onClick={() => {
                  if (projectTableInstance) {
                    projectTableInstance?.exportData('xlsx', false)
                  }
                }}
              >
                <Icon as={BiExport} fontSize="18px" mr={1} />
                {t('export')}
              </Button>
              <Center>
                <Divider orientation="vertical" height="25px" border="1px solid" />
              </Center>

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </Flex>
          </Stack>
        </>
      ) : (
        <OverPaymentTransactionsTable />
      )}
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
  )
}
