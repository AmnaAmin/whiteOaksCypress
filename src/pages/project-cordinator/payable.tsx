import { Box, Center, Checkbox, Divider, Flex, FormLabel, Icon, Spacer, Stack } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { ConfirmationBox } from 'components/Confirmation'
import TableColumnSettings from 'components/table/table-column-settings'
import { usePayableWeeklyCount } from 'features/project-coordinator/payable-recievable/hook'
import { PayableCardsFilter } from 'features/project-coordinator/payable-recievable/payable-cards-filter'
import { PayableTable } from 'features/project-coordinator/payable-recievable/payable-table'
import { AccountWeekDayFilters } from 'features/project-coordinator/weekly-filter-accounts-details'
import { t } from 'i18next'
import numeral from 'numeral'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiExport, BiSync } from 'react-icons/bi'
import { TableNames } from 'types/table-column.types'
import { useBatchProcessingMutation, useCheckBatch } from 'utils/account-receivable'
import { dateFormat } from 'utils/date-time-utils'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'

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
  const { handleSubmit, register } = useForm()

  const { mutate: batchCall } = useBatchProcessingMutation()

  const Submit = e => {
    setLoading(true)
    setIsBatchClick(true)
    const payloadData = e.id.map(n => ({ id: parseInt(n), type: '' }))
    const obj = {
      typeCode: 'AP',
      entities: payloadData,
    }
    batchCall(obj as any)
    // batchCall?.(obj) not working
  }
  useCheckBatch(setLoading, 1)

  const onNotificationClose = () => {
    setIsBatchClick(false)
  }

  const PAYABLE_COLUMNS = [
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
      Header: t('wOStartDate'),
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
            <Checkbox isDisabled={loading} value={(row.original as any).id} {...register('id', { required: true })} />
          </Flex>
        )
      },
      disableExport: true,
    },
  ]

  const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.payable)
  const { tableColumns, settingColumns, isLoading } = useTableColumnSettings(PAYABLE_COLUMNS, TableNames.payable)

  const onSave = columns => {
    postProjectColumn(columns)
  }

  const { weekDayFilters } = usePayableWeeklyCount()
  console.log('WeekDay', weekDayFilters)

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
  )
}
