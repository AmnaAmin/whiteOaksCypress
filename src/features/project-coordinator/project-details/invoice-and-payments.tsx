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
import addDays from 'date-fns/addDays'
import ChooseFileField from 'components/choose-file/choose-file'
import ReactSelect from 'components/form/react-select'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { t } from 'i18next'
import React, { ChangeEvent } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import { datePickerFormat } from 'utils/date-time-utils'

const InvoiceAndPayments: React.FC = () => {
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
  } = useFieldsDisabled(control)

  const formValues = getValues()

  const onInvoiceBackDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    const paymentTerm = getValues().paymentTerms?.value
    const woaExpectedDate = addDays(new Date(date), paymentTerm)

    setValue('woaExpectedPayDate', datePickerFormat(woaExpectedDate))
  }

  const onPaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const payment = Number(e.target.value)
    const overyPayment = payment - getValues().finalSOWAmount

    setValue('overPayment', overyPayment < 0 ? 0 : overyPayment)
  }

  return (
    <Stack>
      <Grid templateColumns="repeat(4,1fr)" rowGap="32px" w="908px" columnGap="16px">
        <GridItem>
          <VStack alignItems="end" spacing="0px" position="relative">
            <FormControl w="215px" isInvalid={!!errors.originalSOWAmount}>
              <FormLabel htmlFor="originSowAmount" variant="strong-label" size="md">
                {t('originalSowAmount')}
              </FormLabel>
              <Input
                isDisabled={isOriginalSOWAmountDisabled}
                id="originSowAmount"
                {...register('originalSOWAmount', {
                  required: 'This is required',
                })}
                placeholder="$3000.00"
              />
              <FormErrorMessage>{errors?.originalSOWAmount?.message}</FormErrorMessage>
            </FormControl>
            <Link
              download
              href={formValues.sowLink || ''}
              target="_blank"
              color="#4E87F8"
              display={'flex'}
              fontSize="xs"
              alignItems={'center'}
              mt="2"
            >
              <Icon as={BiDownload} fontSize="14px" />
              <Text ml="1">Original SOW</Text>
            </Link>
          </VStack>
        </GridItem>
        <GridItem>
          <FormControl w="215px" isInvalid={!!errors.finalSOWAmount}>
            <FormLabel variant="strong-label" size="md" htmlFor="finalSowAmount">
              {t('finalSowAmount')}
            </FormLabel>
            <Input
              isDisabled={isFinalSOWAmountDisabled}
              id="finalSowAmount"
              {...register('finalSOWAmount', {
                required: 'This is required',
              })}
              placeholder="$3000.00"
            />
            <FormErrorMessage>{errors?.finalSOWAmount?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px" isInvalid={!!errors.invoiceNumber}>
            <FormLabel htmlFor="invoiceNo" variant="strong-label" size="md">
              {t('invoiceNo')}
            </FormLabel>
            <Input
              id="invoiceNo"
              placeholder="1212"
              variant={isStatusInvoiced ? 'required-field' : 'outline'}
              {...register('invoiceNumber', {
                required: isStatusInvoiced ? 'This is required' : false,
              })}
            />
            <FormErrorMessage>{errors?.invoiceNumber?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t('uploadInvoice')}
            </FormLabel>
            <Controller
              name="invoiceAttachment"
              control={control}
              rules={{ required: isStatusInvoiced ? 'This is required field' : false }}
              render={({ field, fieldState }) => {
                const fileName = field?.value?.name ?? (t('chooseFile') as string)

                return (
                  <VStack alignItems="baseline">
                    <Box h="0px">
                      <ChooseFileField
                        name={field.name}
                        value={fileName}
                        isError={!!fieldState.error?.message}
                        onChange={(file: any) => {
                          // onFileChange(file)
                          field.onChange(file)
                        }}
                        // onClear={() => setValue(field.name, null)}
                      ></ChooseFileField>

                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </Box>
                    {/* {field.value && (
                      // <Box>{downloadDocument(document, field.value ? field.value?.name : 'doc.png')}</Box>
                    )} */}
                  </VStack>
                )
              }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t('invoiceBackDate')}
            </FormLabel>

            <Input
              w="215px"
              size="md"
              type="date"
              id="invoiceBackDate"
              variant={isStatusInvoiced ? 'required-field' : 'outline'}
              {...register('invoiceBackDate', {
                required: isStatusInvoiced ? 'This is required' : false,
                onChange: onInvoiceBackDateChange,
              })}
            />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px" isInvalid={!!errors.paymentTerms}>
            <FormLabel variant="strong-label" size="md">
              {t('paymentsTerms')}
            </FormLabel>
            <Controller
              control={control}
              name="paymentTerms"
              rules={{ required: isStatusInvoiced ? 'This is required' : false }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    {...field}
                    isDisabled={isPaymentTermsDisabled}
                    options={PAYMENT_TERMS_OPTIONS}
                    selectProps={{ isBorderLeft: isStatusInvoiced }}
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
              {t('woaInvoiceDate')}
            </FormLabel>
            <Input
              isDisabled={isWOAInvoiceDateDisabled}
              id="woaInvoiceDate"
              {...register('woaInvoiceDate', {
                required: isWOAInvoiceDateDisabled ? false : 'This is required',
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
              {t('woaExpectedPay')}
            </FormLabel>

            <Input
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
              {t('overpayment')}
            </FormLabel>
            <Input
              isDisabled={isOverPaymentDisalbed}
              id="overPayment"
              {...register('overPayment')}
              type="text"
              w="215px"
              size="md"
            />
            <FormErrorMessage>{errors.overPayment && errors.overPayment.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.remainingPayment}>
            <FormLabel htmlFor="remainingPayment" variant="strong-label" size="md">
              {t('remainingPayment')}
            </FormLabel>
            <Input
              isDisabled={isRemainingPaymentDisabled}
              id="remainingPayment"
              // value={currencyFormatter(accountRecievable)}
              {...register('remainingPayment')}
              placeholder="$1200"
              w="215px"
              size="md"
            />
            <FormErrorMessage>{errors.remainingPayment && errors.remainingPayment.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.payment}>
            <FormLabel htmlFor="payment" variant="strong-label" size="md">
              {t('payment')}
            </FormLabel>
            <Input
              isDisabled={isPaymentDisabled}
              id="payment"
              type="number"
              {...register('payment', {
                required: isPaymentDisabled ? false : 'This is required',
                onChange: onPaymentChange,
              })}
              placeholder="$0"
              w="215px"
              size="md"
            />
            <FormErrorMessage>{errors.payment && errors.payment.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
    </Stack>
  )
}

export default InvoiceAndPayments
