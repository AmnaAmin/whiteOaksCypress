import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { currencyFormatter } from 'utils/stringFormatters'
import { dateFormat } from 'utils/date-time-utils'

import { BiCalendar, BiDollarCircle, BiDownload, BiFile } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import { TransactionType, TransactionTypeValues, TransactionStatusValues as TSV } from 'types/transaction.type'
import { orderBy } from 'lodash'
import { downloadFile } from 'utils/file-utils'
import { STATUS } from 'features/projects/status'

const InvoiceInfo: React.FC<{ title: string; value: string; icons: React.ElementType }> = ({ title, value, icons }) => {
  return (
    <Flex justifyContent="center">
      <Box pr={4}>
        <Icon as={icons} fontSize="23px" color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <Text fontWeight={500} lineHeight="20px" fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {title}
        </Text>
        <Text color="gray.500" lineHeight="20px" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {value}
        </Text>
      </Box>
    </Flex>
  )
}

export const InvoiceTabPC = ({ onClose, workOrder, transactions, documentsData, rejectInvoiceCheck }) => {
  const [recentInvoice, setRecentInvoice] = useState<any>(null)
  const { t } = useTranslation()
  const [items, setItems] = useState<Array<TransactionType>>([])
  const [subTotal, setSubTotal] = useState(0)
  const [amountPaid, setAmountPaid] = useState(0)
  const { mutate: rejectInvocie } = useUpdateWorkOrderMutation()

  const entity = {
    ...workOrder,
    ...{ status: 111 },
  }

  useEffect(() => {
    if (documentsData && documentsData.length > 0) {
      let invoices = documentsData.filter(d => d.documentType === 48 && d.workOrderId === workOrder.id)
      if (invoices.length > 0) {
        /* sorting invoices by created datetime to fetch latest */
        invoices = orderBy(
          invoices,
          [
            item => {
              const createdDate = new Date(item.createdDate)
              return createdDate
            },
          ],
          ['desc'],
        )
        const recentInvoice = invoices[0]
        setRecentInvoice({ s3Url: recentInvoice.s3Url, fileType: recentInvoice.fileType })
      }
    }
  }, [documentsData])

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // only show approved or paid transactions.
      const transactionItems = transactions.filter(
        co => co.status === TSV.approved && co.parentWorkOrderId === workOrder.id,
      )
      setItems(transactionItems)

      // Draw Transaction Type = 30
      const changeOrders = transactionItems.filter(it => it.transactionType !== TransactionTypeValues.draw)
      const drawTransactions = transactionItems.filter(it => it.transactionType === TransactionTypeValues.draw)

      // Sum of all approved (:not paid) transactions (Change Orders)
      if (changeOrders && changeOrders.length > 0) {
        setSubTotal(
          changeOrders
            .filter(co => co.transactionType !== TransactionTypeValues.woPaid)
            .map(t => parseFloat(t.changeOrderAmount))
            .reduce((sum, x) => sum + x),
        )
      }
      // Sum of all Draws
      if (drawTransactions && drawTransactions.length > 0) {
        setAmountPaid(drawTransactions.map(t => parseFloat(t.changeOrderAmount)).reduce((sum, x) => sum + x))
      }
    }
  }, [transactions])
  const rejectInvoice = () => {
    rejectInvocie({
      ...entity,
    })
  }
  return (
    <Box>
      <Box w="100%">
        <Grid gridTemplateColumns="repeat(auto-fit ,minmax(170px,1fr))" gap={2} minH="110px" alignItems={'center'}>
          <InvoiceInfo title={t('invoiceNo')} value={workOrder?.invoiceNumber} icons={BiFile} />
          <InvoiceInfo
            title={t('finalInvoice')}
            value={currencyFormatter(workOrder?.finalInvoiceAmount)}
            icons={BiDollarCircle}
          />
          <InvoiceInfo
            title={t('PONumber')}
            value={workOrder.propertyAddress ? workOrder.propertyAddress : ''}
            icons={BiFile}
          />
          <InvoiceInfo
            title={t('invoiceDate')}
            value={workOrder.dateInvoiceSubmitted ? dateFormat(workOrder?.dateInvoiceSubmitted) : 'mm/dd/yyyy'}
            icons={BiCalendar}
          />
          <InvoiceInfo
            title={t('dueDate')}
            value={workOrder.paymentTermDate ? dateFormat(workOrder?.paymentTermDate) : 'mm/dd/yyyy'}
            icons={BiCalendar}
          />
        </Grid>

        <Divider border="1px solid gray" mb={5} color="gray.200" />
        <Box>
          <Box h="250px" overflow="auto" border="1px solid #E2E8F0">
            <Table variant="simple" size="md">
              <Thead pos="sticky" top={0}>
                <Tr>
                  <Td>{t('item')}</Td>
                  <Td>{t('description')}</Td>
                  <Td>Total</Td>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item, index) => {
                  return (
                    <Tr h="72px">
                      <Td>{item.id}</Td>
                      <Td>{item.name}</Td>
                      <Td>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Text>{currencyFormatter(item.changeOrderAmount)}</Text>
                        </Flex>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
            <VStack alignItems="end" w="93%" fontSize="14px" fontWeight={500} color="gray.600">
              <Box>
                <HStack w={300} height="60px" justifyContent="space-between">
                  <Text>{t('subTotal')}:</Text>
                  <Text>{currencyFormatter(subTotal)}</Text>
                </HStack>
                <HStack w={300} height="60px" justifyContent="space-between">
                  <Text>{t('totalAmountPaid')}:</Text>
                  <Text>{currencyFormatter(Math.abs(amountPaid))}</Text>
                </HStack>
                <HStack w={300} height="60px" justifyContent="space-between">
                  <Text>{t('balanceDue')}</Text>
                  <Text>{currencyFormatter(subTotal + amountPaid)}</Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>
      <HStack w="100%" justifyContent="end" h="83px" borderTop="1px solid #CBD5E0" mt={10} pt={5}>
        <HStack w="100%" justifyContent={'start'} mb={2} alignItems={'start'}>
          <Flex w="100%" alignContent="space-between" pos="relative">
            <Flex fontSize="14px" fontWeight={500} mr={1}>
              {recentInvoice && (
                <Button
                  variant="outline"
                  colorScheme="brand"
                  size="md"
                  onClick={() => downloadFile(recentInvoice?.s3Url)}
                  leftIcon={<BiDownload />}
                >
                  {t('see')} {t('invoice')}
                </Button>
              )}
            </Flex>
          </Flex>
        </HStack>
        <Flex>
          {workOrder?.statusLabel?.toLocaleLowerCase() === STATUS.Invoiced && (
            <Button disabled={!rejectInvoiceCheck} onClick={() => rejectInvoice()} colorScheme="brand" mr={3}>
              {t('save')}
            </Button>
          )}
          <Button onClick={onClose} colorScheme="brand" variant="outline">
            {t('cancel')}
          </Button>
        </Flex>
      </HStack>
    </Box>
  )
}
