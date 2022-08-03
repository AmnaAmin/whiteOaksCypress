import { Box, Text, Flex, SimpleGrid, Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { BiCalendar } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { paymentsTerms } from 'utils/vendor-projects'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import Select from 'components/form/react-select'
import { useForm, Controller } from 'react-hook-form'
import { calendarIcon } from 'theme/common-style'
import { defaultValuesPayment, parsePaymentValuesToPayload, useFieldEnableDecision } from 'utils/work-order'
import { addDays, nextFriday } from 'date-fns'

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
        <Text minH="20px" color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
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
        <Text minH="20px" color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.value}
        </Text>
      </Box>
    </Flex>
  )
}

const PaymentInfoTab = props => {
  const { workOrder, onSave } = props

  const { t } = useTranslation()
  const { dateLeanWaiverSubmitted, datePermitsPulled, workOrderPayDateVariance } = props.workOrder

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

  const { register, handleSubmit, control, getValues, setValue } = useForm<FormValues>({
    defaultValues: defaultValuesPayment(workOrder, paymentsTerms),
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

  const onSubmit = values => {
    onSave(parsePaymentValuesToPayload(values))
  }

  return (
    <Box>
      <SimpleGrid columns={5} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <CalenderCard
          title={t('lwDate')}
          date={dateLeanWaiverSubmitted ? dateFormat(dateLeanWaiverSubmitted) : 'mm/dd/yyyy'}
        />
        <CalenderCard title={t('permitDate')} date={datePermitsPulled ? dateFormat(datePermitsPulled) : 'mm/dd/yyyy'} />
        <InformationCard title={t('payDateVariance')} value={workOrderPayDateVariance} />
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
                  onChange={e => {
                    const dateInvSubmitted = e.target.value
                    const paymentTermDate = addDays(
                      new Date(dateInvSubmitted as string),
                      getValues('paymentTerm')?.value,
                    )
                    const expectedPaymentDate = nextFriday(paymentTermDate)
                    setValue('paymentTermDate', datePickerFormat(paymentTermDate))
                    setValue('expectedPaymentDate', datePickerFormat(expectedPaymentDate))
                  }}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl height="40px">
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('paymentTerms')}
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
                          onChange={option => {
                            const dateInvSubmitted = getValues('dateInvoiceSubmitted')
                            const paymentTermDate = addDays(new Date(dateInvSubmitted as string), option.value)
                            const expectedPaymentDate = nextFriday(paymentTermDate)
                            setValue('paymentTermDate', datePickerFormat(paymentTermDate))
                            setValue('expectedPaymentDate', datePickerFormat(expectedPaymentDate))
                            field.onChange(option)
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
