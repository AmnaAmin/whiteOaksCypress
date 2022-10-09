import { Box, Center, Checkbox, Divider, Flex, FormLabel, Icon, Stack, Spacer } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { Button } from 'components/button/button'
import { ConfirmationBox } from 'components/Confirmation'
import { ViewLoader } from 'components/page-level-loader'
import TableColumnSettings from 'components/table/table-column-settings'
import { ReceivableFilter } from 'features/recievable/receivable-filter'
import { ReceivableTable } from 'features/recievable/receivable-table'
import { AccountWeekDayFilters } from 'features/common/due-projects-weekly-filter/weekly-filter-accounts-details'
import { t } from 'i18next'
import { compact } from 'lodash'
import numeral from 'numeral'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { BiExport, BiSync } from 'react-icons/bi'
import { TableNames } from 'types/table-column.types'
import { useBatchProcessingMutation, useCheckBatch } from 'api/account-receivable'
import { dateFormat } from 'utils/date-time-utils'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings'
import { useWeeklyCount } from './hooks'

export const Receivable = () => {
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
  const { handleSubmit, register, control, reset } = useForm()

  const formValues = useWatch({ control })

  const { refetch } = useCheckBatch(2, setLoading, loading)
  const { mutate: batchCall } = useBatchProcessingMutation()

  useEffect(() => {
    if (!loading) {
      reset()
    }
  }, [loading])

  const Submit = formValues => {
    const recievableProjects = compact(formValues.id).map(id => ({
      id: parseInt(id as string),
      type: 'Remaining Payments',
    }))

    if (!recievableProjects.length) return

    setLoading(true)
    setIsBatchClick(true)
    const obj = {
      typeCode: 'AR',
      entities: recievableProjects,
    }

    if (recievableProjects.length === 0) return

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

  const { weekDayFilters } = useWeeklyCount()

  const RECEIVABLE_COLUMNS = useMemo(
    () => [
      {
        Header: t('id'),
        accessor: 'projectId',
      },
      {
        Header: t('client'),
        accessor: 'clientName',
      },
      {
        Header: t('address'),
        accessor: 'propertyAddress',
      },
      {
        Header: t('terms'),
        accessor: 'paymentTerm',
      },
      {
        Header: t('paymentTypes'),
        accessor: 'type',
      },
      {
        Header: t('vendorWOExpectedPaymentDate'),
        accessor: 'expectedPaymentDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
        getCellExportValue(row) {
          return dateFormat(row.original.expectedPaymentDate)
        },
      },
      {
        Header: t('balance'),
        accessor: 'amount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.amount).format('$0,0.00')
        },
      },
      {
        Header: t('finalInvoice'),
        accessor: 'finalInvoice',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0.00')
        },
        getCellExportValue(row) {
          return numeral(row.original.finalInvoice).format('$0,0.00')
        },
      },
      {
        Header: t('markets'),
        accessor: 'marketName',
      },
      {
        Header: t('woInvoiceDate'),
        accessor: 'woaInvoiceDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
        getCellExportValue(row) {
          return dateFormat(row.original.woaInvoiceDate)
        },
      },
      {
        Header: t('poNo'),
        accessor: 'poNumber',
      },
      {
        Header: t('woNo'),
        accessor: 'woNumber',
      },
      {
        Header: t('invoiceNo'),
        accessor: 'invoiceNumber',
      },
      {
        Header: t('checkbox'),
        accessor: 'checkbox',
        Cell: ({ row }) => {
          return (
            <Flex justifyContent="end" onClick={e => e.stopPropagation()}>
              <Checkbox
                // isDisabled={loading}
                variant="link"
                value={row.original?.projectId}
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

  const { mutate: postReceviableColumn } = useTableColumnSettingsUpdateMutation(TableNames.receivable)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    RECEIVABLE_COLUMNS,
    TableNames.receivable,
  )
  const onSave = columns => {
    postReceviableColumn(columns)
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
          <Box mt={2}>
            {loading && <ViewLoader />}
            <ReceivableTable
              receivableColumns={tableColumns}
              selectedCard={selectedCard as string}
              selectedDay={selectedDay as string}
              setTableInstance={setProjectTableInstance}
              resizeElementRef={resizeElementRef}
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
