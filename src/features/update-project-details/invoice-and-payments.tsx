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
  Stack,
  VStack,
  Text,
} from '@chakra-ui/react'
import { NumberFormatValues } from 'react-number-format'
import addDays from 'date-fns/addDays'
import ChooseFileField from 'components/choose-file/choose-file'
import ReactSelect from 'components/form/react-select'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import React, { ChangeEvent, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import { datePickerFormat } from 'utils/date-time-utils'
import { SelectOption } from 'types/transaction.type'
import { NumberInput } from 'components/input/input'
import { useTranslation } from 'react-i18next'
import { Project } from 'types/project.type'
import { PROJECT_STATUS } from 'features/common/status'

type invoiceAndPaymentProps = {
  projectData: Project
}
const InvoiceAndPayments: React.FC<invoiceAndPaymentProps> = ({ projectData }) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<ProjectDetailsFormValues>()

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

  const { t } = useTranslation()

  return (
    <Stack>
      <Grid templateColumns="repeat(4,1fr)" rowGap="32px" w="908px" columnGap="16px">
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
                    {...field}
                    isDisabled={isPaymentTermsDisabled}
                    options={PAYMENT_TERMS_OPTIONS}
                    selectProps={{ isBorderLeft: !isPaymentTermsDisabled }}
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
                    datatest-id="remaining-Payment"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    disabled={isRemainingPaymentDisabled}
                    customInput={Input}
                    thousandSeparator={true}
                    prefix={'$'}
                    data-testid="RemainingPayment-field"
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
    </Stack>
  )
}

export default InvoiceAndPayments
