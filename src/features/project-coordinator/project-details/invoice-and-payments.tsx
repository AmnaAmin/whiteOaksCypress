import { Box, Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { t } from 'i18next'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'

const InvoiceAndPayments = () => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = formValues => {
    console.log('FormValues', formValues)
    reset()
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} id="invoice">
        <Stack minH="32vh">
          <Grid templateColumns="repeat(4,1fr)" rowGap="32px" w="908px" columnGap="16px">
            <GridItem>
              <FormControl w="215px" isInvalid={errors.originSowAmount}>
                <FormLabel htmlFor="originSowAmount" variant="strong-label" size="md">
                  {t('originalSowAmount')}
                </FormLabel>
                <Input
                  id="originSowAmount"
                  {...register('originSowAmount', {
                    required: 'This is required',
                  })}
                  placeholder="$3000.00"
                  isDisabled={true}
                />
                <FormErrorMessage>{errors.originSowAmount && errors.originSowAmount.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.finalSowAmount}>
                <FormLabel variant="strong-label" size="md" htmlFor="finalSowAmount">
                  {t('finalSowAmount')}
                </FormLabel>
                <Input
                  id="finalSowAmount"
                  {...register('finalSowAmount', {
                    required: 'This is required',
                  })}
                  placeholder="$3000.00"
                  isDisabled={true}
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
                <FormLabel mb="0" variant="strong-label" size="md">
                  {t('uploadInvoice')}
                </FormLabel>
                <FormFileInput
                  errorMessage={errors.agreement && errors.agreement?.message}
                  label={''}
                  name={`uploadInvoice`}
                  register={register}
                  testId="fileInputAgreement"
                  style={{ w: '215px', h: '40px' }}
                >
                  <Button
                    _focus={{ outline: 'none' }}
                    rounded="none"
                    roundedLeft={5}
                    fontSize="14px"
                    fontWeight={500}
                    color="gray.600"
                    bg="gray.100"
                    h="38px"
                    w={120}
                  >
                    {t('chooseFile')}
                  </Button>
                </FormFileInput>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('invoiceBackDate')}
                </FormLabel>
                <Input w="215px" variant="reguired-field" size="md" placeholder="mm/dd/yyyy" />

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
                      <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('woaExpectedPay')}
                </FormLabel>
                <Input w="215px" variant="reguired-field" size="md" type="date" />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem display="grid" alignItems="end" h="67.3px">
              <Box mt="1">
                <Button variant="outline" colorScheme="brand" leftIcon={<BiDownload />} w="215px">
                  {t('downloadOriginalSow')}
                </Button>
              </Box>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.overPayment}>
                <FormLabel htmlFor="overPayment" variant="strong-label" size="md">
                  {t('overpayment')}
                </FormLabel>
                <Input
                  id="overPayment"
                  {...register('overPayment', {
                    required: 'This is required',
                  })}
                  placeholder="$0.00"
                  isDisabled={true}
                  w="215px"
                  variant="reguired-field"
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
                  id="remainingPayment"
                  {...register('remainingPayment', {
                    required: 'This is required',
                  })}
                  placeholder="$1200"
                  isDisabled={true}
                  w="215px"
                  variant="reguired-field"
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
                  id="payment"
                  {...register('payment', {
                    required: 'This is required',
                  })}
                  placeholder="$0"
                  isDisabled={true}
                  w="215px"
                  variant="reguired-field"
                  size="md"
                />
                <FormErrorMessage>{errors.payment && errors.payment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
          </Grid>
        </Stack>
      </form>
    </Box>
  )
}

export default InvoiceAndPayments
