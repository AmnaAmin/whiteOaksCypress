import { Box, HStack, Text, ModalFooter, Divider, ModalBody, Flex } from '@chakra-ui/react'
import { BiFile, BiCalendar } from 'react-icons/bi'
import InputView from 'components/input-view/input-view'
import { dateFormat } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { STATUS } from 'features/common/status'

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
  status: string
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
      <ModalBody ml={30} w="95%" h={'calc(100vh - 300px)'}>
        <HStack mr={100} pt="35px" spacing="60px" justifyContent={'center'}>
          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('paymentTermDate')}
              InputElem={
                invoiceAndPaymentData.paymentTermDate &&
                ![STATUS.Declined]?.includes(invoiceAndPaymentData.status?.toLocaleLowerCase() as STATUS) ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.paymentTermDate)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </Box>
          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={BiFile}
              label={t('payDateVariance')}
              InputElem={
                invoiceAndPaymentData.workOrderPayDateVariance ? (
                  <Text>{invoiceAndPaymentData?.workOrderPayDateVariance}</Text>
                ) : (
                  <Text>0</Text>
                )
              }
            />
          </Box>
          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={BiFile}
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
              Icon={BiCalendar}
              label={t('paid')}
              InputElem={
                invoiceAndPaymentData?.datePaid ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.datePaid)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
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
              Icon={BiCalendar}
              label={t('LWDate')}
              InputElem={
                invoiceAndPaymentData.dateLeanWaiverSubmitted &&
                ![STATUS.Declined]?.includes(invoiceAndPaymentData.status?.toLocaleLowerCase() as STATUS) ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.dateLeanWaiverSubmitted)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </Box>

          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('permitDate')}
              InputElem={
                invoiceAndPaymentData?.datePermitsPulled ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.datePermitsPulled)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </Box>

          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('paymentProcessed')}
              InputElem={
                invoiceAndPaymentData?.datePaymentProcessed ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.datePaymentProcessed)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </Box>

          <Box w="20%">
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('invoiceSubmitted')}
              InputElem={
                invoiceAndPaymentData.dateInvoiceSubmitted &&
                ![STATUS.Declined]?.includes(invoiceAndPaymentData.status?.toLocaleLowerCase() as STATUS) ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.dateInvoiceSubmitted)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
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
              Icon={BiCalendar}
              label={t('expectedPay')}
              InputElem={
                invoiceAndPaymentData.expectedPaymentDate &&
                ![STATUS.Declined]?.includes(invoiceAndPaymentData.status?.toLocaleLowerCase() as STATUS) ? (
                  <Text>{dateFormat(invoiceAndPaymentData?.expectedPaymentDate)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
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
          <Button colorScheme="darkPrimary" onClick={onClose}>
            {t('cancel')}
          </Button>
        </Flex>
      </ModalFooter>
    </Box>
  )
}

export default InvoicingAndPaymentTab
