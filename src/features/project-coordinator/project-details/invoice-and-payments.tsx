import { Box, Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
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

const InvoiceAndPayments = () => {
  const [changedDateFields, setChangeDateFields] = useState<string[]>([])

  const {
    control,
    register,
    formState: { errors },
  } = useForm()
  return (
    <Box>
      <form>
        <Box h="50vh">
          <Grid templateColumns="repeat(4,1fr)" rowGap={10} w="60%">
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Original SOW Amount</FormLabel>
                <Input placeholder="$3000.00" bg="gray.100" borderLeft="2px solid #4E87F8" />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Final SOW Amount</FormLabel>
                <Input placeholder="$3000.00" bg="gray.100" borderLeft="2px solid #4E87F8" />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Invoice no</FormLabel>
                <Input />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
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
              <FormControl>
                <FormLabel sx={labelStyle}>Invoice back date</FormLabel>
                <FormDatePicker
                  errorMessage={errors.invoiceBackDate && errors.invoiceBackDate?.message}
                  label={''}
                  name={`invoiceBackDate`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
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
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Payments terms</FormLabel>
                <ReactSelect selectProps={{ isLeftBorder: true }} />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>WOA Expected Pay</FormLabel>
                <FormDatePicker
                  errorMessage={errors.woaExpectedPay && errors.woaExpectedPay?.message}
                  label={''}
                  name={`woaExpectedPay`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
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
              <Box>
                <Button
                  fontSize="14px"
                  fontWeight={500}
                  variant="ghost"
                  colorScheme="CustomPrimaryColor"
                  leftIcon={<BiDownload />}
                  _hover={{ bg: 'gray.100' }}
                  _focus={{ outline: 'none' }}
                >
                  Original SOW
                </Button>
              </Box>
            </GridItem>
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Overpayment</FormLabel>
                <Input placeholder="$0.00" bg="gray.100" borderLeft="2px solid #4E87F8" />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Remaining Payment</FormLabel>
                <Input placeholder="$1200" bg="gray.100" borderLeft="2px solid #4E87F8" />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Payment</FormLabel>
                <Input placeholder="$0" bg="gray.100" borderLeft="2px solid #4E87F8" />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
          </Grid>
        </Box>
      </form>
    </Box>
  )
}

export default InvoiceAndPayments
