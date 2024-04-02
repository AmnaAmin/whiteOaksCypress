import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Input,
  Link,
  HStack,
  VStack,
  Text,
  Button,
  Center,
} from '@chakra-ui/react'
import { NumberFormatValues } from 'react-number-format'
import addDays from 'date-fns/addDays'
import ChooseFileField from 'components/choose-file/choose-file'
import ReactSelect from 'components/form/react-select'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import React, { ChangeEvent, useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import { datePickerFormat } from 'utils/date-time-utils'
import { SelectOption } from 'types/transaction.type'
import { NumberInput } from 'components/input/input'
import { useTranslation } from 'react-i18next'
import { Project } from 'types/project.type'
import { PROJECT_STATUS, STATUS } from 'features/common/status'
import { MdOutlineCancel, MdOutlineEmail } from 'react-icons/md'
import { calendarIcon } from 'theme/common-style'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import moment from 'moment'

type invoiceAndPaymentProps = {
  projectData: Project
  isReadOnly?: boolean
}
const InvoiceAndPayments: React.FC<invoiceAndPaymentProps> = ({ projectData, isReadOnly }) => {
  const formControl = useFormContext<ProjectDetailsFormValues>()
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = formControl

  const {
    isOriginalSOWAmountDisabled,
    isFinalSOWAmountDisabled,
    isPaymentTermsDisabled,
    isOverPaymentDisalbed,
    isWOAExpectedPayDateDisabled,
    isWOAInvoiceDateDisabled,
    isRemainingPaymentDisabled,
    isPaymentDisabled,
    isStatusInvoiced,
  } = useFieldsDisabled(control, projectData)

  const formValues = getValues()

  const isUploadInvoiceRequired = isStatusInvoiced && !formValues.invoiceLink
  const isDepreciationDisabled = projectData?.projectStatus === PROJECT_STATUS.invoiced.label

  const onInvoiceBackDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const paymentTerm = getValues().paymentTerms?.value

    // Do not calculated WOA expect date if payment term is not selected
    if (!paymentTerm) return

    const woaExpectedDate = addDays(utcDate, paymentTerm)
    setValue('woaExpectedPayDate', datePickerFormat(woaExpectedDate))
  }

  const onPaymentTermChange = (option: SelectOption) => {
    const { invoiceBackDate, woaInvoiceDate } = getValues()
    const date = new Date(
      invoiceBackDate === null || invoiceBackDate === '' ? (woaInvoiceDate as string) : (invoiceBackDate as string),
    )
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const paymentTerm = Number(option.value)

    // Do not calculated WOA expect date if payment term is not selected
    if (!date) return
    const woaExpectedDate = addDays(utcDate, paymentTerm)
    setValue('woaExpectedPayDate', datePickerFormat(woaExpectedDate))
  }

  const onPaymentValueChange = (values: NumberFormatValues) => {
    const payment = Number(values.value)
    const depreciation = Number(getValues()?.depreciation ?? 0)
    const overyPayment = payment + depreciation - (getValues().remainingPayment || 0)

    setValue('overPayment', overyPayment < 0 ? 0 : overyPayment)
  }

  const onDepreciationValueChange = (values: NumberFormatValues) => {
    const depreciation = Number(values.value)
    const payment = Number(getValues()?.payment ?? 0)
    const overyPayment = depreciation + payment - (getValues().remainingPayment || 0)

    setValue('overPayment', overyPayment < 0 ? 0 : overyPayment)
  }

  useEffect(() => {
    if (isStatusInvoiced && !formValues.woaInvoiceDate) {
      setValue('woaInvoiceDate', datePickerFormat(new Date()))
    }
    setValue('remainingPayment', getValues().overPayment ? 0 : getValues().remainingPayment)
  }, [isStatusInvoiced])

  const isInvoicedOrPaid = [
    STATUS.ClientPaid?.toUpperCase(),
    STATUS.Invoiced.toUpperCase(),
    STATUS.Paid?.toUpperCase(),
    STATUS.Overpayment?.toUpperCase(),
    STATUS.Disputed?.toUpperCase(),
  ].includes(projectData?.projectStatus as string)

  const { t } = useTranslation()

  return (
    <HStack gap="8" alignItems={'flex-start'} overflowX="auto" width="100%">
      <Box>
        <Grid templateColumns="repeat(4,1fr)" gap={4} rowGap="32px" columnGap="32px" w="100%" overflowX={'auto'}>
          {projectData?.projectStatus === STATUS.Invoiced?.toUpperCase() && (
            <GridItem colSpan={4} minH="8px"></GridItem>
          )}
          <GridItem>
            <VStack alignItems="end" spacing="0px" position="relative">
              <FormControl w="215px" isInvalid={!!errors.originalSOWAmount}>
                <FormLabel htmlFor="originSowAmount" variant="strong-label" size="md">
                  {t(`project.projectDetails.originalSowAmount`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="originalSOWAmount"
                  render={({ field, fieldState }) => {
                    return (
                      <NumberInput
                        datatest-id="SowAmount"
                        value={field.value}
                        onChange={event => {
                          field.onChange(event)
                        }}
                        disabled={isOriginalSOWAmountDisabled}
                        customInput={Input}
                        thousandSeparator={true}
                        prefix={'$'}
                      />
                    )
                  }}
                />
              </FormControl>
              {formValues.sowLink && (
                <Link
                  download
                  href={formValues.sowLink || ''}
                  target="_blank"
                  color="#4E87F8"
                  display={'flex'}
                  fontSize="xs"
                  alignItems={'center'}
                  mt="2"
                  position={'absolute'}
                  top="76px"
                >
                  <Icon as={BiDownload} fontSize="14px" />
                  <Text ml="1">{t(`project.projectDetails.originalSOW`)}</Text>
                </Link>
              )}
            </VStack>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.finalSOWAmount}>
              <FormLabel variant="strong-label" size="md" htmlFor="finalSowAmount">
                {t(`project.projectDetails.finalSowAmount`)}
              </FormLabel>
              <Controller
                control={control}
                name="finalSOWAmount"
                render={({ field }) => {
                  return (
                    <NumberInput
                      datatest-id="final-Sow-Amount"
                      value={field.value}
                      onChange={event => {
                        field.onChange(event)
                      }}
                      disabled={isFinalSOWAmountDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.invoiceNumber}>
              <FormLabel htmlFor="invoiceNo" variant="strong-label" size="md">
                {t(`project.projectDetails.invoiceNo`)}
              </FormLabel>
              <Input id="invoiceNo" {...register('invoiceNumber')} />
              <FormErrorMessage>{errors?.invoiceNumber?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <VStack alignItems="end" spacing="0px" position="relative">
              <FormControl isInvalid={!!errors?.invoiceAttachment}>
                <FormLabel variant="strong-label" size="md">
                  {t(`project.projectDetails.uploadInvoice`)}
                </FormLabel>
                <Controller
                  name="invoiceAttachment"
                  control={control}
                  rules={{ required: isUploadInvoiceRequired ? 'This is required field' : false }}
                  render={({ field, fieldState }) => {
                    const fileName = field?.value?.name ?? (t('chooseFile') as string)

                    return (
                      <VStack alignItems="baseline">
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={fileName}
                            isRequired={isUploadInvoiceRequired}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              field.onChange(file)
                            }}
                            disabled={isReadOnly}
                          />

                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                      </VStack>
                    )
                  }}
                />
              </FormControl>

              {formValues.invoiceLink && (
                <Link
                  href={formValues.invoiceLink || ''}
                  download
                  display={'flex'}
                  target="_blank"
                  color="#4E87F8"
                  fontSize="xs"
                  alignItems={'center'}
                  mt="2"
                  position={'absolute'}
                  top={'76px'}
                >
                  <Icon as={BiDownload} fontSize="14px" />
                  <Text ml="1">{t(`project.projectDetails.invoice`)}</Text>
                </Link>
              )}
            </VStack>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.invoiceBackDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.invoiceBackDate`)}
              </FormLabel>

              <Input
                w="215px"
                size="md"
                type="date"
                id="invoiceBackDate"
                {...register('invoiceBackDate', {
                  onChange: onInvoiceBackDateChange,
                })}
              />

              <FormErrorMessage>{errors?.invoiceBackDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl data-testid="payment-term" w="215px" isInvalid={!!errors.paymentTerms}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.paymentTerms`)}
              </FormLabel>
              <Controller
                control={control}
                name="paymentTerms"
                rules={{ required: !isPaymentTermsDisabled ? 'This is required field.' : false }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      classNamePrefix={'paymentTermsInvoice'}
                      {...field}
                      isDisabled={isPaymentTermsDisabled || isReadOnly}
                      options={PAYMENT_TERMS_OPTIONS.filter(option => option.value !== 60)}
                      selectProps={{ isBorderLeft: !isPaymentTermsDisabled, menuHeight: '100px' }}
                      onChange={(option: SelectOption) => {
                        onPaymentTermChange(option)
                        field.onChange(option)
                      }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.woaInvoiceDate}>
              <FormLabel htmlFor="woaInvoiceDate" variant="strong-label" size="md">
                {t(`project.projectDetails.woaInvoiceDate`)}
              </FormLabel>
              <Input
                datatest-id="woa-InvoiceDate"
                isDisabled={isWOAInvoiceDateDisabled}
                id="woaInvoiceDate"
                {...register('woaInvoiceDate', {
                  required: isWOAInvoiceDateDisabled ? false : 'This is required field.',
                })}
                type="date"
                w="215px"
                size="md"
              />
              <FormErrorMessage>{errors?.woaInvoiceDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.woaExpectedPayDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.woaExpectedPay`)}
              </FormLabel>

              <Input
                datatest-id="woa-ExpectedDate"
                isDisabled={isWOAExpectedPayDateDisabled}
                id="woaExpectedPay"
                {...register('woaExpectedPayDate')}
                type="date"
              />

              <FormErrorMessage>{errors?.woaExpectedPayDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.overPayment}>
              <FormLabel htmlFor="overPayment" variant="strong-label" size="md">
                {t(`project.projectDetails.overpayment`)}
              </FormLabel>

              <Controller
                control={control}
                name="overPayment"
                render={({ field }) => {
                  return (
                    <NumberInput
                      datatest-id="over-Payment"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      disabled={isOverPaymentDisalbed}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                      decimalScale={2}
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.remainingPayment}>
              <FormLabel htmlFor="remainingPayment" variant="strong-label" size="md">
                {t(`project.projectDetails.remainingPayment`)}
              </FormLabel>

              <Controller
                control={control}
                name="remainingPayment"
                render={({ field }) => {
                  return (
                    <NumberInput
                      data-testid="remaining-Payment"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      disabled={isRemainingPaymentDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.payment}>
              <FormLabel htmlFor="payment" variant="strong-label" size="md">
                {t(`project.projectDetails.payment`)}
              </FormLabel>
              <Controller
                control={control}
                name="payment"
                render={({ field, fieldState }) => {
                  return (
                    <NumberInput
                      value={field.value}
                      onValueChange={(values: NumberFormatValues) => {
                        onPaymentValueChange(values)
                        field.onChange(values.value)
                      }}
                      disabled={isPaymentDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                      data-testid="payment-field"
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.depreciation}>
              <FormLabel htmlFor="depreciation" variant="strong-label" size="md">
                {t(`project.projectDetails.depreciation`)}
              </FormLabel>
              <Controller
                control={control}
                name="depreciation"
                render={({ field, fieldState }) => {
                  return (
                    <NumberInput
                      value={field.value}
                      onValueChange={(values: NumberFormatValues) => {
                        onDepreciationValueChange(values)
                        field.onChange(values.value)
                      }}
                      disabled={!isDepreciationDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                      data-testid="depreciation-field"
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
      <Box>
        {isInvoicedOrPaid && <RevisedAmounts isReadOnly={isReadOnly} formControl={formControl} project={projectData} />}
      </Box>
    </HStack>
  )
}

const RevisedAmounts = ({ formControl, project, isReadOnly }) => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = formControl

  const {
    fields: resubmittedInvoice,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'resubmittedInvoice',
  })

  const { t } = useTranslation()
  const watchResubmissions = watch('resubmittedInvoice')

  const { isAdmin } = useUserRolesSelector()

  return (
    <Box borderLeft={'1px solid #CBD5E0'} h="420px" overflowY="auto">
      {project?.projectStatus === STATUS.Invoiced?.toUpperCase() && (
        <HStack
          pl="20px"
          pb="10px"
          onClick={() => {
            append({
              notificationDate: null,
              resubmissionDate: datePickerFormat(moment.now()),
              paymentTerms: null,
              dueDate: null,
              invoiceNumber: '',
              uploadedInvoice: null,
              id: null,
            })
          }}
        >
          <Button colorScheme="darkPrimary" size="square-sm" variant="cubicle">
            +
          </Button>
          <FormLabel w="150px" variant={'clickable-label'} size="md">
            {t(`newRow`)}
          </FormLabel>
        </HStack>
      )}
      <VStack minH="auto" alignItems={'flex-start'} w="100%" pl="20px" pr="20px" overflow={'auto'} gap={'4px'}>
        {resubmittedInvoice.map((resubmit, index) => {
          return (
            <VStack alignItems={'flex-start'} borderBottom="1px solid #E5E5E5">
              {project?.resubmissionDTOList?.[index]?.id && (
                <Text
                  display="flex"
                  fontStyle={'italic'}
                  fontSize="12px"
                  fontWeight={400}
                  pl="3px"
                  pr="5px"
                  background={'blue.50'}
                  color={'gray.500'}
                >
                  <Box as="span" mt="2px">
                    <Icon as={MdOutlineEmail} boxSize={3} mr="3px" />
                  </Box>
                  {project?.resubmissionDTOList?.[index]?.createdBy}
                </Text>
              )}
              <HStack>
                <FormControl w={'215px'} isInvalid={!!errors.resubmittedInvoice?.[index]?.notificationDate}>
                  <FormLabel variant="strong-label" size="md">
                    {t('project.projectDetails.notificationDate')}
                  </FormLabel>
                  <Input
                    data-testid="notification-date"
                    id="notification"
                    type="date"
                    size="md"
                    variant={'required-field'}
                    css={calendarIcon}
                    disabled={!!watchResubmissions?.[index].id || isReadOnly}
                    {...register(`resubmittedInvoice.${index}.notificationDate`, {
                      required: 'This is a required field',
                    })}
                  />
                  <Box minH="20px" mt="3px">
                    <FormErrorMessage whiteSpace="nowrap">
                      {errors.resubmittedInvoice?.[index]?.notificationDate?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
                <FormControl w={'215px'} isInvalid={!!errors.resubmittedInvoice?.[index]?.resubmissionDate}>
                  <FormLabel variant="strong-label" size="md">
                    {t('project.projectDetails.resubmissionDate')}
                  </FormLabel>
                  <Input
                    data-testid="resubmission-date"
                    id="resubmissionDate"
                    type="date"
                    size="md"
                    disabled={!isAdmin || !!watchResubmissions?.[index]?.id}
                    variant={'required-field'}
                    css={calendarIcon}
                    {...register(`resubmittedInvoice.${index}.resubmissionDate`, {
                      required: 'This is a required field',
                    })}
                    onChange={option => {
                      const resubmissionDate = option.target.value
                      if (resubmissionDate && watchResubmissions?.[index]?.paymentTerms) {
                        const dueDate = moment(resubmissionDate)
                          .add(parseInt(watchResubmissions?.[index]?.paymentTerms.value, 10), 'days')
                          ?.toDate()
                        setValue(`resubmittedInvoice.${index}.dueDate`, datePickerFormat(dueDate))
                      }
                    }}
                  />

                  <Box minH="20px" mt="3px">
                    <FormErrorMessage whiteSpace="nowrap">
                      {errors.resubmittedInvoice?.[index]?.resubmissionDate?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>

                <FormControl
                  w={{ base: '100%', md: '215px' }}
                  isInvalid={!!errors.resubmittedInvoice?.[index]?.paymentTerms}
                >
                  <FormLabel size="md" color="#2D3748">
                    {t('project.projectDetails.paymentTerms')}
                  </FormLabel>
                  <Controller
                    control={control}
                    name={`resubmittedInvoice.${index}.paymentTerms`}
                    rules={{ required: 'This is a required field' }}
                    render={({ field, fieldState }) => (
                      <>
                        <ReactSelect
                          {...field}
                          classNamePrefix={'paymentTermsResubmitted'}
                          options={PAYMENT_TERMS_OPTIONS.filter(option => option.value !== 60)}
                          selectProps={{ isBorderLeft: true, menuHeight: '105px' }}
                          isDisabled={!!watchResubmissions?.[index]?.id || isReadOnly}
                          onChange={(option: SelectOption) => {
                            field.onChange(option)
                            if (option?.value && watchResubmissions?.[index]?.resubmissionDate) {
                              const dueDate = moment(watchResubmissions?.[index]?.resubmissionDate)
                                .add(parseInt(option?.value, 10), 'days')
                                ?.toDate()
                              setValue(`resubmittedInvoice.${index}.dueDate`, datePickerFormat(dueDate))
                            }
                          }}
                        />
                      </>
                    )}
                  />
                  <Box minH="20px" mt="3px">
                    <FormErrorMessage whiteSpace="nowrap">
                      {errors.resubmittedInvoice?.[index]?.paymentTerms?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>

                {!watchResubmissions?.[index]?.id && (
                  <Box w="2em" color="#345EA6" fontSize="15px" m={{ base: '4%', md: 0 }}>
                    <Center>
                      <Icon
                        as={MdOutlineCancel}
                        onClick={() => remove(index)}
                        data-testid={`removeResubmittedInvoice-` + index}
                        cursor="pointer"
                        boxSize={5}
                        mt="6px"
                      />
                    </Center>
                  </Box>
                )}
              </HStack>
              <VStack alignItems={'flex-start'}>
                <HStack>
                  <FormControl
                    w={{ base: '100%', md: '215px' }}
                    isInvalid={!!errors.resubmittedInvoice?.[index]?.dueDate}
                  >
                    <FormLabel variant="strong-label" size="md">
                      {t('dueDate')}
                    </FormLabel>
                    <Input
                      data-testid="due-date"
                      id="dueDaye"
                      type="date"
                      size="md"
                      css={calendarIcon}
                      disabled={true}
                      {...register(`resubmittedInvoice.${index}.dueDate`)}
                    />

                    <Box minH="20px" mt="3px">
                      <FormErrorMessage whiteSpace="nowrap">
                        {errors.resubmittedInvoice?.[index]?.dueDate?.message}
                      </FormErrorMessage>
                    </Box>
                  </FormControl>
                  <FormControl
                    w={{ base: '100%', md: '215px' }}
                    isInvalid={!!errors.resubmittedInvoice?.[index]?.invoiceNumber}
                  >
                    <FormLabel variant="strong-label" size="md">
                      {t(`project.projectDetails.invoiceNo`)}
                    </FormLabel>
                    <Input
                      id="invoiceNo"
                      size="md"
                      disabled={!!watchResubmissions?.[index].id || isReadOnly}
                      variant={'required-field'}
                      {...register(`resubmittedInvoice.${index}.invoiceNumber`, {
                        required: 'This is a required field',
                      })}
                    />
                    <Box minH="20px" mt="3px">
                      <FormErrorMessage whiteSpace="nowrap">
                        {errors.resubmittedInvoice?.[index]?.invoiceNumber?.message}
                      </FormErrorMessage>
                    </Box>
                  </FormControl>

                  <FormControl
                    w={{ base: '100%', md: '215px' }}
                    isInvalid={!!errors.resubmittedInvoice?.[index]?.uploadedInvoice}
                  >
                    <FormLabel size="md" variant="strong-label">
                      {t(`project.projectDetails.uploadInvoice`)}
                    </FormLabel>
                    <Controller
                      name={`resubmittedInvoice.${index}.uploadedInvoice`}
                      control={control}
                      rules={{
                        required:
                          !watchResubmissions?.[index]?.uploadedInvoice && !watchResubmissions?.[index].docUrl
                            ? 'This is a required field'
                            : false,
                      }}
                      render={({ field, fieldState }) => {
                        const fileName = field?.value?.name ?? (t('chooseFile') as string)

                        return (
                          <VStack alignItems="end" spacing="0px">
                            <Box>
                              <ChooseFileField
                                name={field.name}
                                value={fileName}
                                isRequired={
                                  !watchResubmissions?.[index]?.uploadedInvoice && !watchResubmissions?.[index].docUrl
                                }
                                disabled={!!watchResubmissions?.[index].id || isReadOnly}
                                isError={!!fieldState.error?.message}
                                onChange={(file: any) => {
                                  field.onChange(file)
                                }}
                              />
                              <Box minH="20px" mt="3px">
                                <Box display="flex" justifyContent={'flex-end'}>
                                  {!!watchResubmissions?.[index].docUrl && (
                                    <Link
                                      href={watchResubmissions?.[index].docUrl || ''}
                                      download
                                      display="flex"
                                      target="_blank"
                                      color="#4E87F8"
                                      fontSize="xs"
                                      alignItems={'flex-end'}
                                      position={'absolute'}
                                      top={'76px'}
                                    >
                                      <Icon as={BiDownload} fontSize="14px" />
                                      <Text ml="1">{t(`project.projectDetails.invoice`)}</Text>
                                    </Link>
                                  )}
                                </Box>
                                <FormErrorMessage whiteSpace="nowrap">
                                  {errors.resubmittedInvoice?.[index]?.dueDate?.message}
                                </FormErrorMessage>
                              </Box>
                            </Box>
                          </VStack>
                        )
                      }}
                    />
                  </FormControl>
                </HStack>
              </VStack>
            </VStack>
          )
        })}
      </VStack>
    </Box>
  )
}

export default InvoiceAndPayments
