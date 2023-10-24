import React, { useContext, useMemo } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ReadOnlyInput } from 'components/input-view/input-view'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { TRANSACTION } from '../project-details/transactions/transactions.i18n'
import { dateFormat, dateISOFormatWithZeroTime, datePickerFormat } from 'utils/date-time-utils'
import { INVOICE_STATUS_OPTIONS, InvoicingType } from 'types/invoice.types'
import { useAccountData } from 'api/user-account'
import ReactSelect from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'
import { addDays } from 'date-fns'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { FinalSowLineItems } from './final-sow-line-items'
import { InvoicingContext } from './invoicing'
import { getInvoiceInitials } from './add-invoice-modal'
import { useCreateInvoiceMutation, useUpdateInvoiceMutation } from 'api/invoicing'
import { ReceivedLineItems } from './received-line-items'

const InvoicingReadOnlyInfo: React.FC<any> = ({ invoice, account }) => {
  const { t } = useTranslation()
  const createdBy = invoice?.createdBy ?? account?.email
  const modifiedBy = invoice?.modifiedBy
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
          value={dateFormat(invoice?.createdDate ?? new Date()) as string}
          Icon={BiCalendar}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.dateModified`)}
          name={'dateModified'}
          value={invoice?.modifiedDate ? (dateFormat(invoice?.modifiedDate) as string) : '---'}
          Icon={BiCalendar}
        />
      </GridItem>
      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.createdBy`)}
          name="createdBy"
          value={(createdBy as string) || '---'}
          Icon={BiDetail}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.modifiedBy`)}
          name={'modifiedBy'}
          value={(modifiedBy as string) || '----'}
          Icon={BiDetail}
        />
      </GridItem>
    </Grid>
  )
}

export type InvoicingFormProps = {
  invoice?: InvoicingType
  onClose?: () => void
}
const invoiceDefaultValues = ({ invoice, projectData, invoiceCount }) => {
  const invoiceInitials = getInvoiceInitials(projectData, invoiceCount)
  const invoicedDate = new Date()
  const utcDate = new Date(invoicedDate.getUTCFullYear(), invoicedDate.getUTCMonth(), invoicedDate.getUTCDate())
  const paymentTerm = Number(projectData?.paymentTerm)
  const woaExpectedDate = addDays(utcDate, paymentTerm)

  return {
    invoiceNumber: invoice?.invoiceNumber ?? invoiceInitials,
    invoiceDate: datePickerFormat(invoice?.invoiceDate ?? invoicedDate),
    paymentTerm: PAYMENT_TERMS_OPTIONS?.find(p => p.value === (invoice?.paymentTerm ?? projectData?.paymentTerm)),
    woaExpectedPayDate: datePickerFormat(invoice?.woaExpectedPayDate ?? woaExpectedDate),
    finalSowLineItems: invoice?.finalInvoiceLineItems,
    receivedLineItems: invoice?.receivedLineItems,
    status: INVOICE_STATUS_OPTIONS?.find(p => p.value === invoice?.status) ?? INVOICE_STATUS_OPTIONS[0],
    paymentReceivedDate: datePickerFormat(invoice?.paymentReceivedDate),
  }
}
export const InvoiceForm: React.FC<InvoicingFormProps> = ({ invoice, onClose }) => {
  const { t } = useTranslation()
  const { projectData, invoiceCount } = useContext(InvoicingContext)
  const { mutate: createInvoiceMutate } = useCreateInvoiceMutation({ projId: projectData?.id })
  const { mutate: updateInvoiceMutate } = useUpdateInvoiceMutation({ projId: projectData?.id })
  const { data } = useAccountData()

  const defaultValues: InvoicingType = useMemo(() => {
    return invoiceDefaultValues({ invoice, invoiceCount, projectData })
  }, [invoice, projectData, invoiceCount])

  const [totalReceived, setTotalReceived] = React.useState(0)
  const [finalSow, setFinalSow] = React.useState(0)
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
    watch,
  } = formReturn
  const watchStatus = watch('status')
  const toast = useToast()
  const balanceDue = finalSow - totalReceived

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

  const onInvoiceDateChange = e => {
    const { paymentTerm } = getValues()
    const date = new Date(e.target.value)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

    // Do not calculated WOA expect date if payment term is not selected
    if (!paymentTerm?.value) return
    const woaExpectedDate = addDays(utcDate, paymentTerm?.value)
    setValue('woaExpectedPayDate', datePickerFormat(woaExpectedDate))
  }

  const onSubmit = values => {
    if (balanceDue < 0) {
      toast({
        title: 'Error',
        description: t(`project.projectDetails.balanceDueError`),
        status: 'error',
        isClosable: true,
        position: 'top-left',
      })
      return
    }

    if (!invoice) {
      const payload = {
        paymentTerm: values.paymentTerm?.value,
        projectId: projectData?.id,
        status: null,
        createdBy: data?.email,
        createdDate: dateISOFormatWithZeroTime(new Date()),
        modifiedDate: dateISOFormatWithZeroTime(new Date()),
        modifiedBy: data?.email,
        invoiceAmount: finalSow - totalReceived,
        invoiceLineItems: [...values.finalSowLineItems, ...values.receivedLineItems]?.map(item => {
          return {
            id: item.id,
            transactionId: item.transactionid,
            name: item.name,
            type: item.type,
            description: item.description,
            amount: item.amount,
          }
        }),
        woaExpectedPayDate: values.woaExpectedPayDate,
        invoiceNumber: values.invoiceNumber,
        invoiceDate: values.invoiceDate,
        paymentReceivedDate: values.paymentReceivedDate,
      }
      createInvoiceMutate(payload, {
        onSuccess: () => {
          onClose?.()
        },
        onError: error => {
          console.log(error)
        },
      })
    } else {
      const payload = {
        id: invoice?.id,
        paymentTerm: values.paymentTerm?.value,
        projectId: projectData?.id,
        status: values.status?.value,
        createdBy: invoice?.createdBy,
        createdDate: invoice?.createdDate,
        modifiedDate: dateISOFormatWithZeroTime(new Date()),
        modifiedBy: data?.email,
        invoiceAmount: finalSow - totalReceived,
        invoiceLineItems: [...values.finalSowLineItems, ...values.receivedLineItems]?.map(item => {
          return {
            id: item.id,
            transactionId: item.transactionid,
            name: item.name,
            type: item.type,
            description: item.description,
            amount: item.amount,
          }
        }),
        woaExpectedPayDate: values.woaExpectedPayDate,
        invoiceNumber: values.invoiceNumber,
        invoiceDate: values.invoiceDate,
        paymentReceivedDate: values.paymentReceivedDate,
      }
      updateInvoiceMutate(payload, {
        onSuccess: () => {
          onClose?.()
        },
        onError: error => {
          console.log(error)
        },
      })
    }
  }
  return (
    <form id="invoice-form" onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => {}}>
      <InvoicingReadOnlyInfo invoice={invoice} account={data} />
      <Flex direction="column">
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
                        onChange={onInvoiceDateChange}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl data-testid="payment-term" w="215px" isInvalid={!!errors.paymentTerm}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.paymentTerms`)}
              </FormLabel>
              <Controller
                control={control}
                name="paymentTerm"
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
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }} gap={'1.5rem 1rem'} pb="4">
          <GridItem>
            <FormControl isInvalid={!!errors.woaExpectedPayDate} data-testid="woaExpectedPayDate">
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
          {invoice && (
            <>
              <GridItem>
                <FormControl data-testid="status" w="215px" isInvalid={!!errors.status}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`project.projectDetails.status`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="status"
                    rules={{ required: 'This is required field.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <ReactSelect
                          {...field}
                          options={INVOICE_STATUS_OPTIONS}
                          selectProps={{ isBorderLeft: true, menuHeight: '100px' }}
                          onChange={statusOption => {
                            field.onChange(statusOption)
                          }}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors.paymentReceivedDate} data-testid="woaExpectedPayDate">
                  <FormLabel variant="strong-label" size="md" htmlFor="woaExpectedPayDate">
                    {t(`project.projectDetails.paymentReceived`)}
                  </FormLabel>
                  <Controller
                    rules={{ required: watchStatus?.value === 'APPROVED' ? 'This is required' : false }}
                    control={control}
                    name="paymentReceivedDate"
                    render={({ field, fieldState }) => {
                      return (
                        <div data-testid="paymentReceivedDate">
                          <Input
                            disabled={watchStatus?.value !== 'APPROVED'}
                            data-testid="paymentReceivedDate"
                            type="date"
                            id="paymentReceivedDate"
                            variant={watchStatus?.value !== 'APPROVED' ? 'outline' : 'required-field'}
                            size="md"
                            {...register('paymentReceivedDate')}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </div>
                      )
                    }}
                  />
                </FormControl>
              </GridItem>
            </>
          )}
        </Grid>
        <Box color="gray.500" fontWeight={'500'} mt="20px">
          {t(`project.projectDetails.finalSow`)}
        </Box>
        <FinalSowLineItems
          setTotalAmount={setFinalSow}
          totalAmount={finalSow}
          formReturn={formReturn}
          invoice={invoice}
        />
        <Box color="gray.500" fontWeight={'500'} mt="20px">
          {t(`project.projectDetails.received`)}
        </Box>
        <ReceivedLineItems
          setTotalAmount={setTotalReceived}
          totalAmount={totalReceived}
          formReturn={formReturn}
          invoice={invoice}
        />
      </Flex>
      <Divider mt={3}></Divider>
      <HStack alignItems="center" justifyContent="end" mt="16px" spacing="16px">
        <Button onClick={onClose} variant={'outline'} colorScheme="darkPrimary" data-testid="close-transaction-form">
          {t(`project.projectDetails.cancel`)}
        </Button>
        <Button
          onClick={() => {
            formReturn.handleSubmit(onSubmit)()
          }}
          form="invoice-form"
          data-testid="save-transaction"
          colorScheme="darkPrimary"
          variant="solid"
        >
          {t(`project.projectDetails.save`)}
        </Button>
      </HStack>
    </form>
  )
}
