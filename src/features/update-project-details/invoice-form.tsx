import React, { useMemo } from 'react'
import { FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import { useFormContext, useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ReadOnlyInput } from 'components/input-view/input-view'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { TRANSACTION } from '../project-details/transactions/transactions.i18n'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { InvoicingType } from 'types/invoice.types'
import { useAccountData } from 'api/user-account'
import ReactSelect from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'
import { addDays } from 'date-fns'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'

const InvoicingReadOnlyInfo: React.FC<any> = () => {
  const { t } = useTranslation()
  const { data } = useAccountData()
  const { getValues } = useFormContext<InvoicingType>()
  const formValues = getValues()

  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(100px,1fr))"
      gap={{ base: '1rem 20px', sm: '3.5rem' }}
      borderBottom="1px solid #E2E8F0"
      borderColor="gray.200"
      py="5"
    >
      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.dateCreated`)}
          name={'dateCreated'}
          value={formValues?.dateCreated ? (dateFormat(formValues?.dateCreated) as string) : '---'}
          Icon={BiCalendar}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.dateModified`)}
          name={'dateModified'}
          value={formValues?.dateModified ? (dateFormat(formValues?.dateModified) as string) : '---'}
          Icon={BiCalendar}
        />
      </GridItem>
      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.createdBy`)}
          name="createdBy"
          value={formValues?.createdBy ?? (data?.email as string)}
          Icon={BiDetail}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.modifiedBy`)}
          name={'modifiedBy'}
          value={(formValues?.modifiedBy as string) || '----'}
          Icon={BiDetail}
        />
      </GridItem>
    </Grid>
  )
}

export type InvoicingFormProps = {
  invoice?: InvoicingType
}
const invoiceDefaultValues = ({ invoice }) => {
  return {
    dateCreated: invoice?.dateCreated ?? new Date(),
    dateModified: invoice?.dateModified,
    createdBy: invoice?.createdBy,
    modifiedBy: invoice?.modifiedBy,
    invoiceNumber: invoice?.invoiceNumber,
    invoiceDate: invoice?.invoiceDate,
    paymentTerms: invoice?.paymentTerms,
    woaExpectedPayDate: invoice?.woaExpectedPayDate,
  }
}
export const InvoiceForm: React.FC<InvoicingFormProps> = ({ invoice }) => {
  const { t } = useTranslation()
  const defaultValues: InvoicingType = useMemo(() => {
    return invoiceDefaultValues({ invoice })
  }, [invoice])

  const formReturn = useForm<InvoicingType>({
    defaultValues: {
      ...defaultValues,
    },
  })
  const {
    formState: { errors },
    control,
    getValues,
    register,
    setValue,
  } = formReturn

  const onPaymentTermChange = (option: SelectOption) => {
    const { invoiceDate } = getValues()
    const date = new Date(invoiceDate as string)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const paymentTerm = Number(option.value)

    // Do not calculated WOA expect date if payment term is not selected
    if (!date) return
    const woaExpectedDate = addDays(utcDate, paymentTerm)
    setValue('woaExpectedPayDate', datePickerFormat(woaExpectedDate))
  }
  return (
    <form onSubmit={formReturn.handleSubmit(() => {})} onKeyDown={e => {}}>
      <InvoicingReadOnlyInfo invoice={invoice} />
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }} gap={'1.5rem 1rem'} pt="20px" pb="4">
        <GridItem>
          <FormControl isInvalid={!!errors.invoiceNumber} data-testid="invoiceNumber">
            <FormLabel variant="strong-label" size="md" htmlFor="invoiceNumber">
              {t(`project.projectDetails.invoiceNo`)}
            </FormLabel>
            <Controller
              rules={{ required: 'This is required' }}
              control={control}
              name="invoiceNumber"
              render={({ field, fieldState }) => {
                return (
                  <div data-testid="invoice-number">
                    <Input data-testid="invoiceNumber" id="invoiceNumber" size="md" {...register('invoiceNumber')} />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </div>
                )
              }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.invoiceDate} data-testid="invoiceDate">
            <FormLabel variant="strong-label" size="md" htmlFor="invoiceDate">
              {t(`project.projectDetails.woaInvoiceDate`)}
            </FormLabel>
            <Controller
              rules={{ required: 'This is required' }}
              control={control}
              name="invoiceDate"
              render={({ field, fieldState }) => {
                return (
                  <div data-testid="invoiceDate">
                    <Input
                      data-testid="invoiceDate"
                      type="date"
                      id="invoiceDate"
                      size="md"
                      {...register('invoiceDate')}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </div>
                )
              }}
            />
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
              rules={{ required: 'This is required field.' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    {...field}
                    options={PAYMENT_TERMS_OPTIONS}
                    selectProps={{ isBorderLeft: true, menuHeight: '100px' }}
                    onChange={(option: SelectOption) => {
                      onPaymentTermChange(option)
                      field.onChange(option)
                    }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }} gap={'1.5rem 1rem'} pt="20px" pb="4">
        <GridItem>
          <FormControl isInvalid={!!errors.invoiceDate} data-testid="woaExpectedPayDate">
            <FormLabel variant="strong-label" size="md" htmlFor="woaExpectedPayDate">
              {t(`project.projectDetails.woaExpectedPay`)}
            </FormLabel>
            <Controller
              rules={{ required: 'This is required' }}
              control={control}
              name="woaExpectedPayDate"
              render={({ field, fieldState }) => {
                return (
                  <div data-testid="woaExpectedPayDate">
                    <Input
                      data-testid="woaExpectedPayDate"
                      type="date"
                      id="woaExpectedPayDate"
                      size="md"
                      {...register('woaExpectedPayDate')}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </div>
                )
              }}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </form>
  )
}
