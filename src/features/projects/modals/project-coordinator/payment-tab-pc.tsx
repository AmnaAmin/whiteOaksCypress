import { Box, Text, Flex, SimpleGrid, Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { useEffect } from 'react'
import { BiCalendar } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { paymentsTerms } from 'utils/vendor-projects'
import { dateFormat, dateISOFormat, datePickerFormat } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/stringFormatters'
import Select from 'components/form/react-select'
import { useForm, Controller } from 'react-hook-form'
import { calendarIcon } from 'theme/common-style'
import { useFieldEnableDecision } from 'utils/work-order'
// import { addDays } from 'date-fns'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props?.date}
        </Text>
      </Box>
    </Flex>
  )
}

const InformationCard = props => {
  return (
    <Flex>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const PaymentInfoTab = props => {
  const { workOrder, onSave } = props

  const { t } = useTranslation()
  const { leanWaiverSubmitted, paymentTermDate, durationCategory } = props.workOrder

  interface FormValues {
    dateInvoiceSubmitted: string | null
    paymentTerm: any
    paymentTermDate: string | null
    expectedPaymentDate: string | null
    datePaymentProcessed: string | null
    datePaid: string | null
    clientApprovedAmount: string | null
    clientOriginalApprovedAmount: string | null
    finalInvoiceAmount: string | null
  }

  const { register, handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      dateInvoiceSubmitted: datePickerFormat(workOrder?.dateInvoiceSubmitted),
      paymentTerm: workOrder?.paymentTerm
        ? paymentsTerms.find(p => p.value === workOrder?.paymentTerm)
        : paymentsTerms.find(p => p.value === '20'),
      paymentTermDate: datePickerFormat(workOrder?.paymentTermDate),
      expectedPaymentDate: datePickerFormat(workOrder?.expectedPaymentDate),
      datePaymentProcessed: datePickerFormat(workOrder?.datePaymentProcessed),
      datePaid: datePickerFormat(workOrder?.datePaid),
      clientApprovedAmount: currencyFormatter(workOrder?.clientApprovedAmount),
      clientOriginalApprovedAmount: currencyFormatter(workOrder?.clientOriginalApprovedAmount),
      finalInvoiceAmount: currencyFormatter(workOrder?.finalInvoiceAmount),
    },
  })

  const {
    clientApprovedAmountEnabled,
    clientOriginalApprovedAmountEnabled,
    dateInvoiceSubmittedEnabled,
    datePaidEnabled,
    datePaymentProcessedEnabled,
    expectedPaymentDateEnabled,
    finalInvoiceAmountEnabled,
    paymentTermDateEnabled,
    paymentTermEnabled,
  } = useFieldEnableDecision(workOrder)

  const watchAllFields = watch()
  useEffect(() => {
    const subscription = watch(value => {
      console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

  const parseValuesToPayload = formValues => {
    return {
      dateInvoiceSubmitted: dateISOFormat(formValues?.dateInvoiceSubmitted),
      paymentTerm: formValues?.paymenTerm?.value,
      paymentTermDate: dateISOFormat(formValues?.paymentTermDate),
      expectedPaymentDate: dateISOFormat(formValues?.expectedPaymentDate),
      datePaymentProcessed: dateISOFormat(formValues?.datePaymentProcessed),
      datePaid: dateISOFormat(formValues?.datePaid),
    }
  }

  const onSubmit = values => {
    onSave(parseValuesToPayload(values))
  }

  return (
    <Box>
      <SimpleGrid columns={5} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <CalenderCard title={t('lwDate')} date={leanWaiverSubmitted ? dateFormat(leanWaiverSubmitted) : 'mm/dd/yyyy'} />
        <CalenderCard title={t('permitDate')} date={paymentTermDate ? dateFormat(paymentTermDate) : 'mm/dd/yyyy'} />
        <InformationCard title={t('payDateVariance')} date={durationCategory} />
      </SimpleGrid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={10}>
          <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
            <Box>
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('invoicedSubmitted')}
                </FormLabel>
                <Input
                  id="dateInvoiceSubmitted"
                  type="date"
                  size="md"
                  css={calendarIcon}
                  isDisabled={!dateInvoiceSubmittedEnabled}
                  variant="outline"
                  {...register('dateInvoiceSubmitted')}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl height="40px">
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('payemtTerms')}
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentTerm"
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <Select
                          {...field}
                          options={paymentsTerms}
                          isDisabled={!paymentTermEnabled}
                          size="md"
                          value={field.value}
                          selectProps={{ isBorderLeft: false }}
                          onChange={e => {
                            // const dateInvoiceSubmitted = getValues('dateInvoiceSubmitted')
                          }}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )
                  }}
                />
              </FormControl>
            </Box>

            <Box>
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('paymentTermDate')}
                </FormLabel>
                <Input
                  id="paymentTermDate"
                  type="date"
                  size="md"
                  css={calendarIcon}
                  isDisabled={!paymentTermDateEnabled}
                  variant="outline"
                  {...register('paymentTermDate')}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('expectedPayDate')}
                </FormLabel>
                <Input
                  id="expectedPaymentDate"
                  type="date"
                  size="md"
                  css={calendarIcon}
                  isDisabled={!expectedPaymentDateEnabled}
                  variant="outline"
                  {...register('expectedPaymentDate')}
                />
              </FormControl>
            </Box>
          </SimpleGrid>
        </Box>

        <Box mt={10}>
          <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
            <Box>
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('paymentProcessed')}
                </FormLabel>
                <Input
                  id="datePaymentProcessed"
                  type="date"
                  size="md"
                  css={calendarIcon}
                  isDisabled={!datePaymentProcessedEnabled}
                  variant="outline"
                  {...register('datePaymentProcessed')}
                />
              </FormControl>
            </Box>

            <Box>
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('paid')}
                </FormLabel>
                <Input
                  id="datePaid"
                  type="date"
                  size="md"
                  css={calendarIcon}
                  isDisabled={!datePaidEnabled}
                  variant="outline"
                  {...register('datePaid')}
                />
              </FormControl>
            </Box>

            <Box>
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('woOriginalAmount')}
                </FormLabel>
                <Input
                  id="clientApprovedAmount"
                  type="text"
                  size="md"
                  isDisabled={!clientApprovedAmountEnabled}
                  variant="outline"
                  {...register('clientApprovedAmount')}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('clientOriginalAmount')}
                </FormLabel>
                <Input
                  id="clientApprovedAmount"
                  type="text"
                  size="md"
                  isDisabled={!clientOriginalApprovedAmountEnabled}
                  variant="outline"
                  {...register('clientOriginalApprovedAmount')}
                />
              </FormControl>
            </Box>

            <Box height="80px">
              <FormControl>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('clientFinalApprovedAmount')}
                </FormLabel>
                <Input
                  id="cc"
                  type="text"
                  size="md"
                  isDisabled={!finalInvoiceAmountEnabled}
                  variant="outline"
                  {...register('finalInvoiceAmount')}
                />
              </FormControl>
            </Box>
          </SimpleGrid>
        </Box>

        <Flex mt="40px" borderTop="1px solid #CBD5E0" h="100px" alignItems="center" justifyContent="end">
          <Button variant="outline" onClick={props.onClose} colorScheme="brand" mr={3}>
            {t('close')}
          </Button>
          <Button type="submit" colorScheme="brand">
            {t('save')}
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default PaymentInfoTab
