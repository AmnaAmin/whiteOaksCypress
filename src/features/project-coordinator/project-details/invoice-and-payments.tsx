import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Stack,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { t } from 'i18next'
import React from 'react'
import { useForm } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'

const labelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'gray.600',
}

const inputTextStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'blackAlpha.500',
}

const InvoiceAndPayments = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = formValues => {
    console.log('FormValues', formValues)
    reset()
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack minH="39vh" spacing={20}>
          <Grid templateColumns="repeat(4,1fr)" rowGap={10} w="60%" columnGap={4}>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.originSowAmount}>
                <FormLabel htmlFor="originSowAmount" sx={labelStyle}>
                  Original SOW Amount
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  id="originSowAmount"
                  {...register('originSowAmount', {
                    required: 'This is required',
                  })}
                  placeholder="$3000.00"
                  bg="gray.100"
                />
                <FormErrorMessage>{errors.originSowAmount && errors.originSowAmount.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.finalSowAmount}>
                <FormLabel sx={labelStyle} htmlFor="finalSowAmount">
                  Final SOW Amount
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  id="finalSowAmount"
                  {...register('finalSowAmount', {
                    required: 'This is required',
                  })}
                  placeholder="$3000.00"
                  bg="gray.100"
                />
                <FormErrorMessage>{errors.finalSowAmount && errors.finalSowAmount.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.invoiceNo}>
                <FormLabel htmlFor="invoiceNo" sx={labelStyle}>
                  Invoice no
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  id="invoiceNo"
                  {...register('invoiceNo', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.invoiceNo && errors.invoiceNo.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl sx={inputTextStyle}>
                <FormLabel mb="0" sx={labelStyle}>
                  Upload Invoice
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
              <FormControl sx={inputTextStyle}>
                <FormLabel sx={labelStyle}>Invoice back date</FormLabel>
                <Input borderLeft="2px solid #4E87F8" placeholder="mm/dd/yyyy" />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle}>Payments terms</FormLabel>
                <ReactSelect selectProps={{ isBorderLeft: true }} />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl sx={inputTextStyle}>
                <FormLabel sx={labelStyle}>WOA Expected Pay</FormLabel>
                <Input borderLeft="2px solid #4E87F8" placeholder="mm/dd/yyyy" />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem display="grid" alignItems="end">
              <Box mt="1">
                <Button variant="outline" colorScheme="brand" leftIcon={<BiDownload />}>
                  Original SOW
                </Button>
              </Box>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.overPayment}>
                <FormLabel htmlFor="overPayment" sx={labelStyle}>
                  Overpayment
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  id="overPayment"
                  {...register('overPayment', {
                    required: 'This is required',
                  })}
                  placeholder="$0.00"
                  bg="gray.100"
                  borderLeft="2px solid #4E87F8"
                />
                <FormErrorMessage>{errors.overPayment && errors.overPayment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.remainingPayment}>
                <FormLabel htmlFor="remainingPayment" sx={labelStyle}>
                  Remaining Payment
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  id="remainingPayment"
                  {...register('remainingPayment', {
                    required: 'This is required',
                  })}
                  placeholder="$1200"
                  bg="gray.100"
                  borderLeft="2px solid #4E87F8"
                />
                <FormErrorMessage>{errors.remainingPayment && errors.remainingPayment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.payment}>
                <FormLabel htmlFor="payment" sx={labelStyle}>
                  Payment
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  id="payment"
                  {...register('payment', {
                    required: 'This is required',
                  })}
                  placeholder="$0"
                  bg="gray.100"
                  borderLeft="2px solid #4E87F8"
                />
                <FormErrorMessage>{errors.payment && errors.payment.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
          </Grid>

          <Stack>
            <Box pr="8">
              <Divider border="1px solid" />
            </Box>
            <Box w="100%" pb="3">
              <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" size="lg" type="submit">
                Save
              </Button>
            </Box>
          </Stack>
        </Stack>
      </form>
    </Box>
  )
}

export default InvoiceAndPayments
