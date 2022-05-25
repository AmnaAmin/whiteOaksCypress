import { Stack, Box, HStack, Text, ModalFooter, Divider } from '@chakra-ui/react'

import React from 'react'
import { BiDollarCircle, BiFile, BiCalendar } from 'react-icons/bi'
import InputView from 'components/input-view/input-view'
import { currencyFormatter } from 'utils/stringFormatters'
import { dateFormat } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'

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
            label={t('paymentTermDate')}
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
            label={t('payDateVariance')}
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
            label={t('paymentTerm')}
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
            label={t('paid')}
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
            label={t('LWDate')}
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
            label={t('permitDate')}
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
            label={t('paymentProcessed')}
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
            label={t('invoiceSubmitted')}
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
            label={t('expectedPay')}
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
            label={t('WOOriginalAmount')}
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
        <Button colorScheme="brand" onClick={onClose}>
          {t('close')}
        </Button>
      </ModalFooter>
    </Stack>
  )
}

export default InvoicingAndPaymentTab
