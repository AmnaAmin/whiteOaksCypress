import { Box, HStack, Text, ModalFooter, Divider, ModalBody, Flex } from '@chakra-ui/react'
import { BiFile, BiCalendar } from 'react-icons/bi'
import InputView from 'components/input-view/input-view'
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
      <ModalBody ml={30} w="95%" h="400px">
        <HStack mr={100} pt="35px" spacing="60px" justifyContent={'center'}>
          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={<BiCalendar />}
              label={t('paymentTermDate')}
              InputElem={
                invoiceAndPaymentData.paymentTermDate ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.paymentTermDate)}</Text>
                ) : (
                  <Text>dd/mm/yy</Text>
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
                  <Text>dd/mm/yy</Text>
                )
              }
            />
          </Box>
          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={<BiFile />}
              label={t('paymentTerm')}
              InputElem={
                invoiceAndPaymentData?.paymentTerm ? (
                  <Text>{invoiceAndPaymentData?.paymentTerm} </Text>
                ) : (
                  <Text>20</Text>
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
                  <Text>dd/mm/yy</Text>
                )
              }
            />
          </Box>
        </HStack>
        <Divider borderBottomWidth={1} borderColor="gray.200" orientation="horizontal" pt={8} />
        <HStack mr={100} pt={30} spacing="60px" justifyContent={'center'}>
          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={<BiCalendar />}
              label={t('LWDate')}
              InputElem={
                invoiceAndPaymentData.dateLeanWaiverSubmitted ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.dateLeanWaiverSubmitted)}</Text>
                ) : (
                  <Text>dd/mm/yy</Text>
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
                  <Text>dd/mm/yy</Text>
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
                  <Text>dd/mm/yy</Text>
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
                  <Text>dd/mm/yy</Text>
                )
              }
            />
          </Box>
        </HStack>
        <Divider borderBottomWidth={1} borderColor="gray.200" orientation="horizontal" pt={8} />
        <HStack py={30} spacing="44px" justifyContent="center">
          <Box w="50%">
            <InputView
              showDivider={false}
              Icon={<BiCalendar />}
              label={t('expectedPay')}
              InputElem={
                invoiceAndPaymentData.expectedPaymentDate ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.expectedPaymentDate)}</Text>
                ) : (
                  <Text>dd/mm/yy</Text>
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

          {/* Is it required?! */}

          {/* <Box w="20%">
            <InputView
              showDivider={false}
              label={t('WOOriginalAmount')}
              Icon={<BiDollarCircle />}
              InputElem={
                invoiceAndPaymentData.clientOriginalApprovedAmount ? (
                  <Text>{currencyFormatter(invoiceAndPaymentData?.clientOriginalApprovedAmount)}</Text>
                ) : (
                  <Text>dd/mm/yy</Text>
                )
              }
            />
          </Box> */}
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
      <ModalFooter borderTop="1px solid #E2E8F0" p={5}>
        <Flex w="100%" justifyContent="end">
          <Button colorScheme="brand" onClick={onClose}>
            {t('cancel')}
          </Button>
        </Flex>
      </ModalFooter>
    </Box>
  )
}

export default InvoicingAndPaymentTab
