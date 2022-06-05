import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Stack,
  VStack,
} from '@chakra-ui/react'
import ChooseFileField from 'components/choose-file/choose-file'
import ReactSelect from 'components/form/react-select'
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
        <Stack>
          <Grid templateColumns="repeat(4,1fr)" rowGap="32px" w="908px" columnGap="16px">
            <GridItem>
              <FormControl w="215px" isInvalid={errors.originSowAmount}>
                <FormLabel htmlFor="originSowAmount" variant="strong-label" size="md">
                  Original SOW Amount
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
                  Final SOW Amount
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
                  Invoice Number
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
                  Upload Invoice
                </FormLabel>
                <Controller
                  name="attachment"
                  control={control}
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline">
                        <Box>
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
                  Invoice Back Date
                </FormLabel>
                <Input w="215px" size="md" placeholder="mm/dd/yyyy" />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.paymentsTerms}>
                <FormLabel variant="strong-label" size="md">
                  Payments Terms
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentsTerms"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} />
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
                  WOA Expected Pay
                </FormLabel>
                <Input w="215px" size="md" type="date" />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem display="grid" alignItems="end" h="67.3px">
              <Box mt="1">
                <Button variant="ghost" colorScheme="brand" leftIcon={<BiDownload />} w="215px">
                  Download Original SOW
                </Button>
              </Box>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.overPayment}>
                <FormLabel htmlFor="overPayment" variant="strong-label" size="md">
                  Overpayment
                </FormLabel>
                <Input
                  id="overPayment"
                  {...register('overPayment', {
                    required: 'This is required',
                  })}
                  placeholder="$0.00"
                  isDisabled={true}
                  w="215px"
                  size="md"
                />
                <FormErrorMessage>{errors.overPayment && errors.overPayment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.remainingPayment}>
                <FormLabel htmlFor="remainingPayment" variant="strong-label" size="md">
                  Remaining Payment
                </FormLabel>
                <Input
                  id="remainingPayment"
                  {...register('remainingPayment', {
                    required: 'This is required',
                  })}
                  placeholder="$1200"
                  isDisabled={true}
                  w="215px"
                  size="md"
                />
                <FormErrorMessage>{errors.remainingPayment && errors.remainingPayment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.payment}>
                <FormLabel htmlFor="payment" variant="strong-label" size="md">
                  Payment
                </FormLabel>
                <Input
                  id="payment"
                  {...register('payment', {
                    required: 'This is required',
                  })}
                  placeholder="$0"
                  isDisabled={true}
                  w="215px"
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
