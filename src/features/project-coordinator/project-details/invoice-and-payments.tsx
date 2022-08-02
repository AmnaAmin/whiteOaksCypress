import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Input,
  Stack,
  VStack,
} from '@chakra-ui/react'
import ChooseFileField from 'components/choose-file/choose-file'
import ReactSelect from 'components/form/react-select'
import { STATUS } from 'features/projects/status'
import { t } from 'i18next'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'
import { ProjectType } from 'types/project.type'
import { currencyFormatter } from 'utils/stringFormatters'

const InvoiceAndPayments: React.FC<{ projectData: ProjectType; dataInvoiceandpayment?: any }> = props => {
  const { projectData, dataInvoiceandpayment } = props
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const statusArray = [
    STATUS.New.valueOf(),
    STATUS.Active.valueOf(),
    STATUS.Punch.valueOf(),
    STATUS.Closed.valueOf(),
    STATUS.Paid.valueOf(),
    STATUS.Overpayment.valueOf(),
    STATUS.PastDue.valueOf(),
    STATUS.Cancelled.valueOf(),
  ]

  const projectStatus = statusArray.includes((projectData?.projectStatus || '').toLocaleLowerCase())

  const statusInvoice = [STATUS.Invoiced.valueOf()].includes((projectData?.projectStatus || '').toLocaleLowerCase())

  const statusClientPaid = [STATUS.ClientPaid.valueOf()].includes(
    (projectData?.projectStatus || '').toLocaleLowerCase(),
  )

  const onSubmit = formValues => {
    console.log('FormValues', formValues)
    reset()
  }

  // const sowLink = dataInvoiceandpayment?.dataInvoiceandpayment?.sowLink
  const sowOriginalContractAmount = dataInvoiceandpayment?.dataInvoiceandpayment?.sowOriginalContractAmount
  const sowNewAmount = dataInvoiceandpayment?.dataInvoiceandpayment?.sowNewAmount
  const paymentTerm = dataInvoiceandpayment?.dataInvoiceandpayment?.paymentTerm
  // const expectedPaymentDate = dataInvoiceandpayment?.dataInvoiceandpayment?.expectedPaymentDate
  const accountRecievable = dataInvoiceandpayment?.dataInvoiceandpayment?.accountRecievable

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} id="invoice">
        <Stack>
          <Grid templateColumns="repeat(4,1fr)" rowGap="32px" w="908px" columnGap="16px">
            <GridItem>
              <VStack alignItems="end" spacing="0px" position="relative">
                <FormControl w="215px" isInvalid={errors.originSowAmount}>
                  <FormLabel htmlFor="originSowAmount" variant="strong-label" size="md">
                    {t('originalSowAmount')}
                  </FormLabel>
                  <Input
                    isDisabled={projectStatus || statusInvoice || statusClientPaid}
                    id="originSowAmount"
                    value={currencyFormatter(sowOriginalContractAmount)}
                    {...register('originSowAmount', {
                      required: 'This is required',
                    })}
                    placeholder="$3000.00"
                  />
                  <FormErrorMessage>{errors.originSowAmount && errors.originSowAmount.message}</FormErrorMessage>
                </FormControl>
                <Button
                  variant="unstyled"
                  color="#4E87F8"
                  leftIcon={<Icon as={BiDownload} />}
                  position="absolute"
                  top="64px"
                  left="103px"
                >
                  Original SOW
                </Button>
              </VStack>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.finalSowAmount}>
                <FormLabel variant="strong-label" size="md" htmlFor="finalSowAmount">
                  {t('finalSowAmount')}
                </FormLabel>
                <Input
                  isDisabled={projectStatus || statusInvoice || statusClientPaid}
                  id="finalSowAmount"
                  value={currencyFormatter(sowNewAmount)}
                  {...register('finalSowAmount', {
                    required: 'This is required',
                  })}
                  placeholder="$3000.00"
                />
                <FormErrorMessage>{errors.finalSowAmount && errors.finalSowAmount.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.invoiceNo}>
                <FormLabel htmlFor="invoiceNo" variant="strong-label" size="md">
                  {t('invoiceNo')}
                </FormLabel>
                <Input
                  id="invoiceNo"
                  {...register('invoiceNo', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.invoiceNo && errors.invoiceNo.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('uploadInvoice')}
                </FormLabel>
                <Controller
                  name="attachment"
                  control={control}
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline">
                        <Box h="0px">
                          <ChooseFileField
                            name={field.name}
                            value={field.value ? field.value?.name : t('chooseFile')}
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

                <Input w="215px" size="md" type="date" id="invoiceBackDate" {...register('invoiceBackDate')} />

                {/* To discuss about datepicker matching figma */}
                {/* <Input
                  type="date"
                  css={css`
                    ::-webkit-calendar-picker-indicator {
                      background: url(https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/calendar-16.png)
                        center/80% no-repeat;
                      color: black;
                    }
                  `}
                /> */}

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.paymentsTerms}>
                <FormLabel variant="strong-label" size="md">
                  {t('paymentsTerms')}
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentsTerms"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        {...field}
                        placeholder={paymentTerm}
                        isDisabled={projectStatus || statusClientPaid}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.overPayment}>
                <FormLabel htmlFor="overPayment" variant="strong-label" size="md">
                  {t('woaInvoiceDate')}
                </FormLabel>
                <Input
                  isDisabled={projectStatus || statusInvoice || statusClientPaid}
                  id="overPayment"
                  {...register('overPayment', {
                    required: 'This is required',
                  })}
                  type="date"
                  w="215px"
                  size="md"
                />
                <FormErrorMessage>{errors.overPayment && errors.overPayment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('woaExpectedPay')}
                </FormLabel>

                <Input
                  isDisabled={projectStatus || statusInvoice || statusClientPaid}
                  id="woaExpectedPay"
                  {...register('woaExpectedPay')}
                  type="date"
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.overPayment}>
                <FormLabel htmlFor="overPayment" variant="strong-label" size="md">
                  {t('overpayment')}
                </FormLabel>
                <Input
                  isDisabled={projectStatus || statusInvoice || statusClientPaid}
                  id="overPayment"
                  {...register('overPayment', {
                    required: 'This is required',
                  })}
                  type="date"
                  w="215px"
                  size="md"
                />
                <FormErrorMessage>{errors.overPayment && errors.overPayment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.remainingPayment}>
                <FormLabel htmlFor="remainingPayment" variant="strong-label" size="md">
                  {t('remainingPayment')}
                </FormLabel>
                <Input
                  isDisabled={projectStatus || statusInvoice || statusClientPaid}
                  id="remainingPayment"
                  value={currencyFormatter(accountRecievable)}
                  {...register('remainingPayment', {
                    required: 'This is required',
                  })}
                  placeholder="$1200"
                  w="215px"
                  size="md"
                />
                <FormErrorMessage>{errors.remainingPayment && errors.remainingPayment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.payment}>
                <FormLabel htmlFor="payment" variant="strong-label" size="md">
                  {t('payment')}
                </FormLabel>
                <Input
                  isDisabled={projectStatus}
                  id="payment"
                  {...register('payment', {
                    required: 'This is required',
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
      </form>
    </Box>
  )
}

export default InvoiceAndPayments
