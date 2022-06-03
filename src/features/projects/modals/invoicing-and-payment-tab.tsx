import { Box, HStack, Text, ModalFooter, Divider, ModalBody, Flex } from '@chakra-ui/react'
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
    <Box>
      <ModalBody h="400px">
        <HStack pt="30px" spacing="10px" justifyContent={'center'}>
          <Box w="20%">
            <InputView
              showDivider={false}
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
          <Box w="20%">
            <InputView
              showDivider={false}
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
          <Box w="20%">
            <InputView
              showDivider={false}
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

          <Box w="20%">
            <InputView
              showDivider={false}
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
        <Divider borderBottomWidth={2} orientation="horizontal" pt={5} />
        <HStack pt={30} spacing="10px" justifyContent={'center'}>
          <Box w="20%">
            <InputView
              showDivider={false}
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

          <Box w="20%">
            <InputView
              showDivider={false}
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

          <Box w="20%">
            <InputView
              showDivider={false}
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

          <Box w="20%">
            <InputView
              showDivider={false}
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
        <Divider borderBottomWidth={2} orientation="horizontal" pt={5} />
        <HStack py={30} justifyContent="center">
          <Box w="20%">
            <InputView
              showDivider={false}
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
          showDivider={false}
            Icon={<BiDollarCircle />}
            label="Final Invoice:"
            InputElem={<Text>{currencyFormatter(invoiceAndPaymentData?.finalInvoiceAmount)} </Text>}
          />
        </Box> */}
          <Box w="20%">
            <InputView
              showDivider={false}
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
          <Box w="20%"></Box>
          <Box w="20%"></Box>

          {/* <Box w="25%">
          <InputView
          showDivider={false}
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
      </ModalBody>
      <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
        <Flex w="100%" justifyContent="end">
          <Button variant="outline" colorScheme="brand" onClick={onClose}>
            {t('cancel')}
          </Button>
        </Flex>
      </ModalFooter>
    </Box>
  )
}

export default InvoicingAndPaymentTab
