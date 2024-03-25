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
  HStack,
} from '@chakra-ui/react'
import { BiCalendar, BiFile, BiSpreadsheet } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { paymentsTerms } from 'api/vendor-projects'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import Select from 'components/form/react-select'
import { useForm, Controller } from 'react-hook-form'
import { calendarIcon } from 'theme/common-style'
import { defaultValuesPayment, parsePaymentValuesToPayload, useFieldEnableDecision } from 'api/work-order'
import { isWednesday, nextFriday, nextWednesday } from 'date-fns'
import { useEffect } from 'react'
import { STATUS } from 'features/common/status'
import { CustomInput, CustomRequiredInput } from 'components/input/input'
import NumberFormat from 'react-number-format'
import { truncateWithEllipsis, validateAmountDigits } from 'utils/string-formatters'
import moment from 'moment'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { WORK_ORDER_STATUS } from 'components/chart/Overview'
import { useLocation } from 'react-router-dom'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="gray.600" />
      </Box>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.700" mb="1">
          {props.title}
        </Text>
        <Text minH={'20px'} color="gray.600" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props?.date}
        </Text>
      </Box>
    </Flex>
  )
}

const InformationCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        {/* <Icon as={<BiFile/>} fontSize="23px" color="#718096" /> */}
        <BiFile size={23} color="gray.600" />
      </Box>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text minH={'20px'} color="gray.600" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const PaymentInfoTab = props => {
  const { workOrder, onSave, navigateToProjectDetails, isWorkOrderUpdating, isLoading } = props

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
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const isPayableRead = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ') && isPayable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isPayableRead || isProjRead
  const isWOCancelled = WORK_ORDER_STATUS.Cancelled === workOrder?.status
  useEffect(() => {
    if ([STATUS.Rejected]?.includes(workOrder?.statusLabel?.toLowerCase())) {
      setValue('dateInvoiceSubmitted', null)
      setValue('paymentTermDate', null)
      setValue('expectedPaymentDate', null)
      setValue('paymentTerm', null)
    } else {
      if (isWorkOrderUpdating || isLoading) {
        return
      }
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

  const calculatePaymentDates = paymentTermDate => {
    setValue('paymentTermDate', datePickerFormat(paymentTermDate))
    if (!isWednesday(paymentTermDate)) {
      setValue('datePaymentProcessed', datePickerFormat(nextWednesday(paymentTermDate)))
    } else {
      setValue('datePaymentProcessed', datePickerFormat(paymentTermDate))
    }
    const expectedPaymentDate = moment(getValues('datePaymentProcessed') as string)?.toDate()
    setValue('expectedPaymentDate', datePickerFormat(nextFriday(expectedPaymentDate)))
  }
  const invoicedRequired = [STATUS.Invoiced, STATUS.Paid].includes(workOrder?.statusLabel?.toLowerCase())

  useEffect(() => {
    if (isReadOnly) {
      Array.from(document.querySelectorAll('input')).forEach(input => {
        if (input.getAttribute('data-testid') !== 'tableFilterInputField') {
          input.setAttribute('disabled', 'true')
        }
      })
    }
  }, [])
  return (
    <Box overflow={'auto'} p="25px">
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        {/* <ModalBody ml={30} h="600px" overflow={'auto'}> */}
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
                  data-testid="dateInvoiceSubmitted"
                  type="date"
                  size="md"
                  css={calendarIcon}
                  isDisabled={!dateInvoiceSubmittedEnabled || isWOCancelled}
                  variant={invoicedRequired ? 'required-field' : 'outline'}
                  {...register('dateInvoiceSubmitted', {
                    required: invoicedRequired && 'This is required',
                  })}
                  onChange={e => {
                    const dateInvSubmitted = e.target.value
                    if (dateInvSubmitted && dateInvSubmitted !== '') {
                      //using moment here to convert to date, to avoid shifting due to timezone
                      const paymentTermDate = moment(dateInvSubmitted).add(
                        parseInt(getValues('paymentTerm')?.value, 10),
                        'days',
                      )
                      setValue('dateInvoiceSubmitted', datePickerFormat(dateInvSubmitted))
                      calculatePaymentDates(paymentTermDate?.toDate())
                      trigger()
                    } else {
                      setValue('paymentTermDate', null)
                      setValue('expectedPaymentDate', null)
                      setValue('dateInvoiceSubmitted', null)
                      setValue('datePaymentProcessed', null)
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
                      <div data-testid="paymentTerms">
                        <Select
                          {...field}
                          classNamePrefix={'paymentTermTab'}
                          options={paymentsTerms}
                          isDisabled={!paymentTermEnabled || isWOCancelled}
                          size="md"
                          value={field.value}
                          selectProps={{ isBorderLeft: false }}
                          onChange={option => {
                            const dateInvSubmitted = getValues('dateInvoiceSubmitted')
                            field.onChange(option)
                            if (dateInvSubmitted && dateInvSubmitted !== '') {
                              const paymentTermDate = moment(dateInvSubmitted).add(option.value, 'days')
                              calculatePaymentDates(paymentTermDate?.toDate())
                              trigger()
                            } else {
                              setValue('paymentTermDate', null)
                              setValue('expectedPaymentDate', null)
                              setValue('dateInvoiceSubmitted', null)
                              setValue('datePaymentProcessed', null)
                            }
                          }}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </div>
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
                  data-testid="paymentTermDate"
                  size="md"
                  css={calendarIcon}
                  isDisabled={!paymentTermDateEnabled || isWOCancelled}
                  variant={invoicedRequired ? 'required-field' : 'outline'}
                  {...register('paymentTermDate', {
                    required: invoicedRequired && 'This is required',
                  })}
                />
                <FormErrorMessage>{errors?.paymentTermDate?.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl isInvalid={!!errors.datePaymentProcessed}>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('paymentProcessed')}
                </FormLabel>
                <Input
                  id="datePaymentProcessed"
                  type="date"
                  size="md"
                  data-testid="datePaymentProcessed"
                  css={calendarIcon}
                  isDisabled={!datePaymentProcessedEnabled || isWOCancelled}
                  variant={invoicedRequired ? 'required-field' : 'outline'}
                  {...register('datePaymentProcessed', {
                    required: invoicedRequired && 'This is required',
                  })}
                />
                <FormErrorMessage>{errors?.datePaymentProcessed?.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </SimpleGrid>
        </Box>

        <Box mt={10} mb={10}>
          <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
            <Box>
              <FormControl isInvalid={!!errors.expectedPaymentDate}>
                <FormLabel variant={'strong-label'} size={'md'}>
                  {t('expectedPayDate')}
                </FormLabel>
                <Input
                  id="expectedPaymentDate"
                  type="date"
                  size="md"
                  data-testid="expectedPaymentDate"
                  css={calendarIcon}
                  isDisabled={!expectedPaymentDateEnabled || isWOCancelled}
                  variant={invoicedRequired ? 'required-field' : 'outline'}
                  {...register('expectedPaymentDate', {
                    required: invoicedRequired && 'This is required',
                  })}
                />
                <FormErrorMessage>{errors?.expectedPaymentDate?.message}</FormErrorMessage>
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
                  data-testid="datePaid"
                  css={calendarIcon}
                  isDisabled={!datePaidEnabled || isWOCancelled}
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
                  rules={{
                    validate: {
                      matchPattern: (v: any) => {
                        return validateAmountDigits(v)
                      },
                    },
                    required: 'This is required',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <NumberFormat
                          value={field.value}
                          data-testid="invoiceAmount"
                          thousandSeparator
                          customInput={CustomRequiredInput}
                          prefix={'$'}
                          disabled={!invoiceAmountEnabled || isWOCancelled}
                          onValueChange={e => {
                            clearErrors('invoiceAmount')
                            const inputValue = e.value ?? ''
                            field.onChange(inputValue)
                            trigger('invoiceAmount')
                          }}
                        />
                        {!!errors.invoiceAmount && (
                          <FormErrorMessage>{errors?.invoiceAmount?.message}</FormErrorMessage>
                        )}
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
                  rules={{
                    validate: {
                      matchPattern: (v: any) => {
                        return validateAmountDigits(v)
                      },
                    },
                    required: 'This is required',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <NumberFormat
                          value={field.value}
                          data-testid="clientOriginalApprovedAmount"
                          thousandSeparator
                          customInput={CustomRequiredInput}
                          prefix={'$'}
                          disabled={!clientOriginalApprovedAmountEnabled || isWOCancelled}
                          onValueChange={e => {
                            const inputValue = e.value ?? ''
                            field.onChange(inputValue) // Update the form state using e.value
                            trigger('clientOriginalApprovedAmount')
                          }}
                        />
                        {!!errors.clientOriginalApprovedAmount && (
                          <FormErrorMessage>{errors?.clientOriginalApprovedAmount?.message}</FormErrorMessage>
                        )}
                      </>
                    )
                  }}
                />
              </FormControl>
            </Box>

            <Box height="80px">
              <FormControl isInvalid={!!errors.clientApprovedAmount}>
                <FormLabel
                  isTruncated
                  title={'Client Final Approved Amount'}
                  variant={'strong-label'}
                  size={'md'}
                  whiteSpace={'nowrap'}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                >
                  {truncateWithEllipsis(t('clientFinalApprovedAmount').trim(), 30)}
                </FormLabel>
                <Controller
                  control={control}
                  name="clientApprovedAmount"
                  rules={{
                    validate: {
                      matchPattern: (v: any) => {
                        return validateAmountDigits(v)
                      },
                    },
                    required: 'This is required',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <NumberFormat
                          value={field.value}
                          data-testid="clientApprovedAmount"
                          thousandSeparator
                          customInput={CustomRequiredInput}
                          prefix={'$'}
                          disabled={!clientApprovedAmountEnabled || isWOCancelled}
                          onValueChange={e => {
                            const inputValue = e.value ?? ''
                            field.onChange(inputValue)
                            trigger('clientApprovedAmount')
                          }}
                        />
                        {!!errors.clientApprovedAmount && (
                          <FormErrorMessage>{errors?.clientApprovedAmount?.message}</FormErrorMessage>
                        )}
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
                  data-testid="finalInvoiceAmount"
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
                          disabled={!partialPaymentEnabled || isWOCancelled}
                          onValueChange={e => {
                            clearErrors('paymentDate')
                            field.onChange(e.floatValue ?? '')
                          }}
                          onBlur={e => {
                            if (!watchPaymentDate) {
                              if (watchPartialPayment && (watchPartialPayment as number) > 0) {
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
                  data-testid="partialPaymentDate"
                  css={calendarIcon}
                  isDisabled={!paymentDateEnabled || isWOCancelled}
                  variant="outline"
                  {...register('paymentDate', {
                    required: watchPartialPayment && (watchPartialPayment as number) > 0 ? 'This is required' : false,
                  })}
                />
                <FormErrorMessage>{errors?.paymentDate?.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </SimpleGrid>
        </Box>
        {/* </ModalBody> */}
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
            {props.onClose && (
              <Button data-testid="wo-cancel-btn" variant="outline" onClick={props.onClose} colorScheme="brand">
                {t('cancel')}
              </Button>
            )}
            <>
              {!isReadOnly && (
                <Button
                  type="submit"
                  data-testid="submit-btn"
                  colorScheme="brand"
                  disabled={isWorkOrderUpdating || isWOCancelled || !workOrder?.visibleToVendor}
                >
                  {t('save')}
                </Button>
              )}
            </>
          </HStack>
        </ModalFooter>
      </form>
    </Box>
  )
}

export default PaymentInfoTab
