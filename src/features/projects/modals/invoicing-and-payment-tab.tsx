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
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.paymentTermDate)}</Text>}
          />
        </Box>
        <Box w="25%">
          <InputView
            Icon={<BiFile />}
            label="Pay Date Variance"
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.workOrderPayDateVariance)}</Text>}
          />
        </Box>
        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Payment Terms:"
            InputElem={<Text>{invoiceAndPaymentData?.paymentTerm} </Text>}
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Paid"
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.datePaid)}</Text>}
          />
        </Box>
      </HStack>
      <HStack spacing="10px">
        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="LW Date"
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.dateLeanWaiverSubmitted)}</Text>}
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Permit Date"
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.datePermitsPulled)}</Text>}
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Payment Processed"
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.datePaymentProcessed)}</Text>}
          />
        </Box>

        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Invoice Submitted:"
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.dateInvoiceSubmitted)}</Text>}
          />
        </Box>
      </HStack>
      <HStack>
        <Box w="25%">
          <InputView
            Icon={<BiCalendar />}
            label="Expected Pay"
            InputElem={<Text>{dateFormat(invoiceAndPaymentData?.expectedPaymentDate)}</Text>}
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
            InputElem={<Text>{currencyFormatter(invoiceAndPaymentData?.clientOriginalApprovedAmount)}</Text>}
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
          _hover={{ bg: 'blue' }}
          colorScheme="CustomPrimaryColor"
          onClick={onClose}
          size="lg"
          fontStyle="normal"
          fontSize="18px"
          fontWeight={600}
          _focus={{ outline: 'none' }}
        >
          {t('close')}
        </Button>
      </ModalFooter>
    </Stack>
  )
}

export default InvoicingAndPaymentTab
