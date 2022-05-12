import { Stack, Box, HStack, Text, Button, ModalFooter, Divider } from '@chakra-ui/react'

import React from 'react'
import { BiDollarCircle, BiFile, BiCalendar } from 'react-icons/bi'
import InputView from 'components/input-view/input-view'
import { currencyFormatter } from 'utils/stringFormatters'
import { dateFormat } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'

type InvoiceAndPaymentData = {
  dateInvoiceSubmitted: string
  paymentTermDate: string
  datePaymentProcessed: string
  expectedPaymentDate: string
  paymentTerm: string
  workOrderPayDateVariance: string
  datePaid: string
  clientOriginalApprovedAmount: number
  invoiceAmount: number
  finalInvoiceAmount: number
  dateLeanWaiverSubmitted: string
  datePermitsPulled: string
}

const InvoicingAndPaymentTab = ({
  invoiceAndPaymentData,
  onClose,
}: {
  invoiceAndPaymentData: InvoiceAndPaymentData
  onClose: () => void
}) => {
  const { t } = useTranslation()
  return (
    <Stack>
      <HStack mt={30} spacing="10px">
        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Payment Term Date"
            InputElem={
              invoiceAndPaymentData.paymentTermDate ? (
                <Text>{dateFormat(invoiceAndPaymentData?.paymentTermDate)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>
        <Box w="25%">
          <InputView
            Icon={<BiFile />}
            label="Pay Date Variance"
            InputElem={
              invoiceAndPaymentData.workOrderPayDateVariance ? (
                <Text>{invoiceAndPaymentData?.workOrderPayDateVariance}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>
        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Payment Terms:"
            InputElem={
              invoiceAndPaymentData?.paymentTerm ? (
                <Text>{invoiceAndPaymentData?.paymentTerm} </Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Paid"
            InputElem={
              invoiceAndPaymentData?.datePaid ? (
                <Text>{dateFormat(invoiceAndPaymentData?.datePaid)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>
      </HStack>
      <HStack spacing="10px">
        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="LW Date"
            InputElem={
              invoiceAndPaymentData.dateLeanWaiverSubmitted ? (
                <Text>{dateFormat(invoiceAndPaymentData?.dateLeanWaiverSubmitted)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Permit Date"
            InputElem={
              invoiceAndPaymentData?.datePermitsPulled ? (
                <Text>{dateFormat(invoiceAndPaymentData?.datePermitsPulled)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Payment Processed"
            InputElem={
              invoiceAndPaymentData?.datePaymentProcessed ? (
                <Text>{dateFormat(invoiceAndPaymentData?.datePaymentProcessed)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Invoice Submitted:"
            InputElem={
              invoiceAndPaymentData.dateInvoiceSubmitted ? (
                <Text>{dateFormat(invoiceAndPaymentData?.dateInvoiceSubmitted)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>
      </HStack>
      <HStack>
        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Expected Pay"
            InputElem={
              invoiceAndPaymentData.expectedPaymentDate ? (
                <Text>{dateFormat(invoiceAndPaymentData?.expectedPaymentDate)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>

        {/* <Box w="25%">
          <InputView
            Icon={<BiDollarCircle />}
            label="Final Invoice:"
            InputElem={<Text>{currencyFormatter(invoiceAndPaymentData?.finalInvoiceAmount)} </Text>}
          />
        </Box> */}
        <Box w="25%">
          <InputView
            label="WO Original Amount:"
            Icon={<BiDollarCircle />}
            InputElem={
              invoiceAndPaymentData.clientOriginalApprovedAmount ? (
                <Text>{currencyFormatter(invoiceAndPaymentData?.clientOriginalApprovedAmount)}</Text>
              ) : (
                <Text>MM/DD/YY</Text>
              )
            }
          />
        </Box>

        {/* <Box w="25%">
          <InputView
            label="Upload Invoice"
            Icon={<BiFile />}
            InputElem={
              <Button h="1.6rem" colorScheme="blue" variant="outline" color="#4E87F8">
                Choose File
              </Button>
            }
          />
        </Box> */}
      </HStack>
      <Divider />
      <ModalFooter pb="15px" pt="15px">
        <Button
          colorScheme="CustomPrimaryColor"
          onClick={onClose}
          _focus={{ outline: 'none' }}
          fontStyle="normal"
          fontSize="14px"
          fontWeight={600}
          h="48px"
          w="130px"
        >
          {t('close')}
        </Button>
      </ModalFooter>
    </Stack>
  )
}

export default InvoicingAndPaymentTab
