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
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { t } from 'i18next'
import React, { useState } from 'react'
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
  const [changedDateFields, setChangeDateFields] = useState<string[]>([])

  const {
    control,
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
        <Box h="39vh">
          <Grid templateColumns="repeat(4,1fr)" rowGap={10} w="60%">
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
                  borderLeft="2px solid #4E87F8"
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
                  borderLeft="2px solid #4E87F8"
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
                  isRequired={changedDateFields.includes('agreementSignedDate')}
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
                <FormDatePicker
                  errorMessage={errors.invoiceBackDate && errors.invoiceBackDate?.message}
                  label={''}
                  name={`invoiceBackDate`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    borderLeft: '2px solid #4E87F8',
                    width: '215px',
                    color: 'gray.500',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    height: '40px',
                  }}
                  onChange={e => {
                    if (!changedDateFields.includes('invoiceBackDate')) {
                      setChangeDateFields([...changedDateFields, 'invoiceBackDate'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle}>Payments terms</FormLabel>
                <ReactSelect selectProps={{ isLeftBorder: true }} />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl sx={inputTextStyle}>
                <FormLabel sx={labelStyle}>WOA Expected Pay</FormLabel>
                <FormDatePicker
                  errorMessage={errors.woaExpectedPay && errors.woaExpectedPay?.message}
                  label={''}
                  name={`woaExpectedPay`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    borderLeft: '2px solid #4E87F8',
                    width: '215px',
                    color: 'gray.500',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    height: '40px',
                  }}
                  onChange={e => {
                    if (!changedDateFields.includes('woaExpectedPay')) {
                      setChangeDateFields([...changedDateFields, 'woaExpectedPay'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem display="grid" alignItems="end">
              <Box mt="1">
                <Button
                  fontSize="14px"
                  fontWeight={500}
                  variant="ghost"
                  colorScheme="CustomPrimaryColor"
                  leftIcon={<BiDownload />}
                  _hover={{ bg: 'gray.100' }}
                  _focus={{ outline: 'none' }}
                  _active={{ bg: 'none' }}
                >
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
        </Box>

        <Stack w="100%">
          <Box pr="8">
            <Divider border="1px solid" />
          </Box>
          <Box w="100%" minH="70px">
            <Button
              mt="8px"
              mr="7"
              float={'right'}
              colorScheme="CustomPrimaryColor"
              _focus={{ outline: 'none' }}
              w="130px"
              h="48px"
              fontSize="14px"
              fontStyle="normal"
              fontWeight={500}
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}

export default InvoiceAndPayments
