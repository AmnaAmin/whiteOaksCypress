import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ModalFooter,
  ModalBody,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { BiCalendar, BiSpreadsheet } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { paymentsTerms } from 'api/vendor-projects'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import Select from 'components/form/react-select'
import { useForm, Controller } from 'react-hook-form'
import { calendarIcon } from 'theme/common-style'
import { defaultValuesPayment, parsePaymentValuesToPayload, useFieldEnableDecision } from 'api/work-order'
import { addDays, nextFriday } from 'date-fns'
import { useEffect } from 'react'
import { STATUS } from 'features/common/status'
import { CustomInput, CustomRequiredInput } from 'components/input/input'
import NumberFormat from 'react-number-format'
import { truncateWithEllipsis } from 'utils/string-formatters'

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
        <Text minH={'20px'} color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props?.date}
        </Text>
      </Box>
    </Flex>
  )
}

const InformationCard = props => {
  return (
    <Flex>
      {props?.icon && (
        <Box pr={4}>
          <Icon as={props?.icon} fontSize="23px" color="#718096" />
        </Box>
      )}
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text minH={'20px'} color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const PaymentInfoTab = props => {
  const { workOrder, onSave, navigateToProjectDetails, isWorkOrderUpdating } = props

  const { t } = useTranslation()
  const { dateLeanWaiverSubmitted, datePermitsPulled, workOrderPayDateVariance } = props.workOrder
  interface FormValues {
    dateInvoiceSubmitted: string | null
    paymentTerm: any
    paymentTermDate: string | null
    expectedPaymentDate: string | null
    datePaymentProcessed: string | null
    datePaid: string | null
    invoiceAmount: string | null
    clientOriginalApprovedAmount: string | null
    clientApprovedAmount: string | null
    partialPayment: number | undefined | string
    paymentDate: string | null
    finalInvoiceAmount: string | number
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
    trigger,
    getValues,
    setValue,
    watch,
    reset: resetPayments,
  } = useForm<FormValues>({
    defaultValues: defaultValuesPayment(workOrder, paymentsTerms),
  })
  const watchPartialPayment = watch('partialPayment')
  const watchPaymentDate = watch('paymentDate')

  useEffect(() => {
    if ([STATUS.Rejected]?.includes(workOrder?.statusLabel?.toLowerCase())) {
      setValue('dateInvoiceSubmitted', null)
      setValue('paymentTermDate', null)
      setValue('expectedPaymentDate', null)
      setValue('paymentTerm', null)
    } else {
      resetPayments(defaultValuesPayment(workOrder, paymentsTerms))
    }
  }, [workOrder])

  const {
    invoiceAmountEnabled,
    clientOriginalApprovedAmountEnabled,
    dateInvoiceSubmittedEnabled,
    datePaidEnabled,
    datePaymentProcessedEnabled,
    expectedPaymentDateEnabled,
    clientApprovedAmountEnabled,
    paymentTermDateEnabled,
    paymentTermEnabled,
    finalInvoiceAmountEnabled,
    paymentDateEnabled,
    partialPaymentEnabled,
  } = useFieldEnableDecision(workOrder)

  const onSubmit = values => {
    onSave(parsePaymentValuesToPayload(values))
  }

  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }
  const invoicedRequired = workOrder?.statusLabel?.toLowerCase() === 'invoiced'
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <ModalBody ml={30} h={'calc(100vh - 300px)'} overflow={'auto'}>
          <SimpleGrid
            columns={5}
            spacing={8}
            mr="30px"
            borderBottom="1px solid  #E2E8F0"
            minH="100px"
            alignItems={'center'}
          >
            <CalenderCard
              title={t('lwDate')}
              date={
                dateLeanWaiverSubmitted && workOrder.lienWaiverAccepted
                  ? dateFormat(dateLeanWaiverSubmitted)
                  : 'mm/dd/yyyy'
              }
            />
            <CalenderCard
              title={t('permitDate')}
              date={datePermitsPulled ? dateFormat(datePermitsPulled) : 'mm/dd/yyyy'}
            />
            <InformationCard title={t('payDateVariance')} date={workOrderPayDateVariance} />
          </SimpleGrid>

          <Box mt={10}>
            <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
              <Box>
                <FormControl isInvalid={!!errors.dateInvoiceSubmitted}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('invoicedSubmitted')}
                  </FormLabel>
                  <Input
                    id="dateInvoiceSubmitted"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={!dateInvoiceSubmittedEnabled}
                    variant={invoicedRequired ? 'required-field' : 'outline'}
                    {...register('dateInvoiceSubmitted', {
                      required: invoicedRequired && 'This is required',
                    })}
                    onChange={e => {
                      const dateInvSubmitted = e.target.value
                      if (dateInvSubmitted && dateInvSubmitted !== '') {
                        const paymentTermDate = addDays(
                          new Date(dateInvSubmitted as string),
                          getValues('paymentTerm')?.value,
                        )
                        const expectedPaymentDate = nextFriday(paymentTermDate)
                        setValue('paymentTermDate', datePickerFormat(paymentTermDate))
                        setValue('expectedPaymentDate', datePickerFormat(expectedPaymentDate))
                        setValue('dateInvoiceSubmitted', datePickerFormat(dateInvSubmitted))
                        trigger()
                      } else {
                        setValue('paymentTermDate', null)
                        setValue('expectedPaymentDate', null)
                        setValue('dateInvoiceSubmitted', null)
                      }
                    }}
                  />
                  <FormErrorMessage>{errors?.dateInvoiceSubmitted?.message}</FormErrorMessage>
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
                              field.onChange(option)
                              if (dateInvSubmitted) {
                                const paymentTermDate = addDays(new Date(dateInvSubmitted as string), option.value)
                                const expectedPaymentDate = nextFriday(paymentTermDate)
                                setValue('paymentTermDate', datePickerFormat(paymentTermDate))
                                setValue('expectedPaymentDate', datePickerFormat(expectedPaymentDate))
                              }
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
                <FormControl isInvalid={!!errors.paymentTermDate}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('paymentTermDate')}
                  </FormLabel>
                  <Input
                    id="paymentTermDate"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={!paymentTermDateEnabled}
                    variant={invoicedRequired ? 'required-field' : 'outline'}
                    {...register('paymentTermDate', {
                      required: invoicedRequired && 'This is required',
                    })}
                  />
                  <FormErrorMessage>{errors?.paymentTermDate?.message}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={!!errors.expectedPaymentDate}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('expectedPayDate')}
                  </FormLabel>
                  <Input
                    id="expectedPaymentDate"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={!expectedPaymentDateEnabled}
                    variant={invoicedRequired ? 'required-field' : 'outline'}
                    {...register('expectedPaymentDate', {
                      required: invoicedRequired && 'This is required',
                    })}
                  />
                  <FormErrorMessage>{errors?.expectedPaymentDate?.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </SimpleGrid>
          </Box>

          <Box mt={10} mb={10}>
            <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
              <Box>
                <FormControl isInvalid={!!errors.datePaymentProcessed}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('paymentProcessed')}
                  </FormLabel>
                  <Input
                    id="datePaymentProcessed"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={!datePaymentProcessedEnabled}
                    variant={invoicedRequired ? 'required-field' : 'outline'}
                    {...register('datePaymentProcessed', {
                      required: invoicedRequired && 'This is required',
                    })}
                  />
                  <FormErrorMessage>{errors?.datePaymentProcessed?.message}</FormErrorMessage>
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
                <FormControl isInvalid={!!errors.invoiceAmount}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('woOriginalAmount')}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="invoiceAmount"
                    rules={{ required: 'This is required' }}
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            value={field.value}
                            data-testid="invoice-amount"
                            thousandSeparator
                            customInput={CustomRequiredInput}
                            prefix={'$'}
                            disabled={!invoiceAmountEnabled}
                            onValueChange={e => {
                              field.onChange(e.floatValue ?? '')
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
                <FormControl isInvalid={!!errors.clientOriginalApprovedAmount}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('clientOriginalAmount')}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="clientOriginalApprovedAmount"
                    rules={{ required: 'This is required' }}
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            value={field.value}
                            data-testid="clientOriginalApprovedAmount"
                            thousandSeparator
                            customInput={CustomRequiredInput}
                            prefix={'$'}
                            disabled={!clientOriginalApprovedAmountEnabled}
                            onValueChange={e => {
                              field.onChange(e.floatValue ?? '')
                            }}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </Box>

              <Box height="80px">
                <FormControl isInvalid={!!errors.clientApprovedAmount}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {truncateWithEllipsis(t('clientFinalApprovedAmount'), 30)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="clientApprovedAmount"
                    rules={{ required: 'This is required' }}
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            value={field.value}
                            data-testid="clientApprovedAmount"
                            thousandSeparator
                            customInput={CustomRequiredInput}
                            prefix={'$'}
                            disabled={!clientApprovedAmountEnabled}
                            onValueChange={e => {
                              field.onChange(e.floatValue ?? '')
                            }}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </Box>
              <Box height="80px">
                <FormControl>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('balanceDue')}
                  </FormLabel>
                  <Input
                    id="finalInvoiceAmount"
                    type="text"
                    size="md"
                    isDisabled={!finalInvoiceAmountEnabled}
                    {...register('finalInvoiceAmount')}
                    variant="outline"
                  />
                </FormControl>
              </Box>
              <Box height="80px">
                <FormControl isInvalid={!!errors?.partialPayment}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('partialPayment')}
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{
                      max: { value: workOrder?.finalInvoiceAmount, message: 'Amount is greater than Balance Due.' },
                    }}
                    name="partialPayment"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            value={field.value}
                            data-testid="partial-payment-field"
                            thousandSeparator
                            customInput={CustomInput}
                            prefix={'$'}
                            disabled={!partialPaymentEnabled}
                            onValueChange={e => {
                              clearErrors('paymentDate')
                              field.onChange(e.floatValue ?? '')
                            }}
                            onBlur={e => {
                              if (!watchPaymentDate) {
                                if (watchPartialPayment && watchPartialPayment > 0) {
                                  setValue('paymentDate', datePickerFormat(new Date()))
                                }
                              }
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
                <FormControl isInvalid={!!errors?.paymentDate}>
                  <FormLabel variant={'strong-label'} size={'md'}>
                    {t('partialPaymentDate')}
                  </FormLabel>
                  <Input
                    id="paymentDate"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={!paymentDateEnabled}
                    variant="outline"
                    {...register('paymentDate', {
                      required: watchPartialPayment && watchPartialPayment > 0 ? 'This is required' : false,
                    })}
                  />
                  <FormErrorMessage>{errors?.paymentDate?.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </SimpleGrid>
          </Box>
        </ModalBody>
        <ModalFooter borderTop="1px solid #E2E8F0" p={5}>
          <HStack justifyContent="start" w="100%">
            {navigateToProjectDetails && (
              <Button
                variant="outline"
                colorScheme="brand"
                size="md"
                onClick={navigateToProjectDetails}
                leftIcon={<BiSpreadsheet />}
              >
                {t('seeProjectDetails')}
              </Button>
            )}
          </HStack>
          <HStack justifyContent="end">
            <Button data-testid="wo-cancel-btn" variant="outline" onClick={props.onClose} colorScheme="brand">
              {t('close')}
            </Button>
            <Button type="submit" colorScheme="brand" disabled={isWorkOrderUpdating}>
              {t('save')}
            </Button>
          </HStack>
        </ModalFooter>
      </form>
    </Box>
  )
}

export default PaymentInfoTab
