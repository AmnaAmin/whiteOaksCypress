import { Box, Text, ModalFooter, Divider, ModalBody, Flex, Grid, GridItem } from '@chakra-ui/react'
import { BiFile, BiCalendar } from 'react-icons/bi'
import InputView from 'components/input-view/input-view'
import { dateFormatNew } from 'utils/date-time-utils'
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
      <ModalBody ml={'0px'} w="95%" h={'calc(100vh - 300px)'} overflow="auto">
        <Grid
          templateColumns={{ base: 'unset', sm: 'repeat(auto-fit ,minmax(170px,1fr))' }}
          gap={5}
          alignItems={'center'}
          my="30px"
          flexWrap="wrap"
          display={{ base: 'flex', sm: 'grid' }}
        >
          <GridItem flex={{ base: '1', sm: 'unset' }}>
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('paymentTermDate')}
              InputElem={
                invoiceAndPaymentData.paymentTermDate &&
                ![STATUS.Rejected]?.includes(invoiceAndPaymentData.status?.toLocaleLowerCase() as STATUS) ? (
                  <Text>{dateFormatNew(invoiceAndPaymentData?.paymentTermDate)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </GridItem>

          <GridItem flex={{ base: '1', sm: 'unset' }}>
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
          </GridItem>

          <GridItem
            flex={{ base: '1', sm: 'unset' }}
            sx={{
              '@media only screen and (max-width: 418px)': {
                mr: 3,
              },
            }}
          >
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
          </GridItem>

          <GridItem flex={{ base: '1', sm: 'unset' }}>
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('paid')}
              InputElem={
                invoiceAndPaymentData?.datePaid ? (
                  <Text>{dateFormatNew(invoiceAndPaymentData?.datePaid)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </GridItem>
        </Grid>
        <Divider borderBottomWidth={1} borderColor="gray.200" orientation="horizontal" />
        <Grid
          templateColumns={{ base: 'unset', sm: 'repeat(auto-fit ,minmax(170px,1fr))' }}
          gap={5}
          alignItems={'center'}
          my="30px"
          flexWrap="wrap"
          display={{ base: 'flex', sm: 'grid' }}
        >
          <GridItem
            flex={{ base: '1', sm: 'unset' }}
            sx={{
              '@media only screen and (max-width: 418px)': {
                mr: 3,
              },
            }}
          >
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('LWDate')}
              InputElem={
                invoiceAndPaymentData.dateLeanWaiverSubmitted  ? (
                  <Text>{dateFormatNew(invoiceAndPaymentData?.dateLeanWaiverSubmitted)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </GridItem>

          <GridItem flex={{ base: '1', sm: 'unset' }}>
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('permitDate')}
              InputElem={
                invoiceAndPaymentData?.datePermitsPulled ? (
                  <Text>{dateFormatNew(invoiceAndPaymentData?.datePermitsPulled)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </GridItem>

          <GridItem flex={{ base: '1', sm: 'unset' }}>
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('paymentProcessed')}
              InputElem={
                invoiceAndPaymentData?.datePaymentProcessed ? (
                  <Text>{dateFormatNew(invoiceAndPaymentData?.datePaymentProcessed)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </GridItem>

          <GridItem flex={{ base: '1', sm: 'unset' }}>
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('invoiceSubmitted')}
              InputElem={
                invoiceAndPaymentData.dateInvoiceSubmitted &&
                ![STATUS.Rejected]?.includes(invoiceAndPaymentData.status?.toLocaleLowerCase() as STATUS) ? (
                  <Text>{dateFormatNew(invoiceAndPaymentData?.dateInvoiceSubmitted)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </GridItem>
        </Grid>
        <Divider borderBottomWidth={1} borderColor="gray.200" orientation="horizontal" />
        <Grid
          templateColumns={{ base: 'unset', sm: 'repeat(auto-fit ,minmax(170px,1fr))' }}
          gap={5}
          alignItems={'center'}
          my="30px"
          flexWrap="wrap"
          display={{ base: 'flex', sm: 'grid' }}
        >
          <GridItem>
            <InputView
              showDivider={false}
              Icon={BiCalendar}
              label={t('expectedPay')}
              InputElem={
                invoiceAndPaymentData.expectedPaymentDate &&
                ![STATUS.Rejected]?.includes(invoiceAndPaymentData.status?.toLocaleLowerCase() as STATUS) ? (
                  <Text>{dateFormatNew(invoiceAndPaymentData?.expectedPaymentDate)}</Text>
                ) : (
                  <Text>mm/dd/yy</Text>
                )
              }
            />
          </GridItem>
        </Grid>
      </ModalBody>
      <ModalFooter borderTop="1px solid #E2E8F0" p={5}>
        <Flex w="100%" justifyContent="end">
          <Button variant="outline" colorScheme="darkPrimary" onClick={onClose}>
            {t('cancel')}
          </Button>
        </Flex>
      </ModalFooter>
    </Box>
  )
}

export default InvoicingAndPaymentTab
