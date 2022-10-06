import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  ModalBody,
  ModalFooter,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { currencyFormatter } from 'utils/string-formatters'
import { convertDateTimeToServer, dateFormat } from 'utils/date-time-utils'

import { BiCalendar, BiDollarCircle, BiDownload, BiFile, BiSpreadsheet } from 'react-icons/bi'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionType, TransactionTypeValues, TransactionStatusValues as TSV } from 'types/transaction.type'
import { orderBy } from 'lodash'
import { downloadFile } from 'utils/file-utils'
import { STATUS, STATUS_CODE, STATUS as WOstatus } from 'features/common/status'
import jsPDF from 'jspdf'
import { addDays, nextFriday } from 'date-fns'
import { createInvoice } from 'api/vendor-projects'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import { ConfirmationBox } from 'components/Confirmation'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

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
        <Text
          data-testid={title}
          color="gray.500"
          lineHeight="20px"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
        >
          {value}
        </Text>
      </Box>
    </Flex>
  )
}

export const InvoiceTab = ({
  onClose,
  workOrder,
  transactions,
  documentsData,
  rejectInvoiceCheck,
  onSave,
  navigateToProjectDetails,
  setTabIndex,
  projectData,
}) => {
  const [recentInvoice, setRecentInvoice] = useState<any>(null)
  const { t } = useTranslation()
  const [items, setItems] = useState<Array<TransactionType>>([])
  const [subTotal, setSubTotal] = useState(0)
  const [amountPaid, setAmountPaid] = useState(0)
  const { mutate: updateWorkOrder } = useUpdateWorkOrderMutation({})
  const [isWorkOrderUpdated, setWorkOrderUpdating] = useState(false)
  const toast = useToast()
  const { mutate: rejectLW } = useUpdateWorkOrderMutation({ hideToast: true })
  const { isVendor } = useUserRolesSelector()

  const {
    isOpen: isGenerateInvoiceOpen,
    onClose: onGenerateInvoiceClose,
    onOpen: onGenerateInvoiceOpen,
  } = useDisclosure()

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
    if (onSave) {
      onSave({
        status: STATUS_CODE.DECLINED,
        lienWaiverAccepted: false,
      })
    }
  }
  const prepareInvoicePayload = () => {
    const invoiceSubmittedDate = new Date()
    const paymentTermDate = addDays(invoiceSubmittedDate, workOrder.paymentTerm || 20)
    const updatedWorkOrder = {
      ...workOrder,
      dateInvoiceSubmitted: convertDateTimeToServer(invoiceSubmittedDate),
      expectedPaymentDate: convertDateTimeToServer(nextFriday(paymentTermDate)),
      paymentTermDate: convertDateTimeToServer(paymentTermDate),
    }
    if (workOrder.statusLabel?.toLowerCase()?.includes(STATUS.Declined)) {
      updatedWorkOrder.status = STATUS_CODE.INVOICED
    }
    return updatedWorkOrder
  }

  const generateInvoice = async () => {
    let form = new jsPDF()
    const updatedWorkOrder = prepareInvoicePayload()
    form = await createInvoice(form, updatedWorkOrder, projectData, items, { subTotal, amountPaid })
    const pdfUri = form.output('datauristring')
    updateWorkOrder(
      {
        ...updatedWorkOrder,
        documents: [
          {
            documentType: 48,
            workOrderId: workOrder.id,
            fileObject: pdfUri.split(',')[1],
            fileObjectContentType: 'application/pdf',
            fileType: 'Invoice.pdf',
          },
        ],
      },
      {
        onError() {
          setWorkOrderUpdating(false)
        },
        onSuccess() {
          setWorkOrderUpdating(false)
          onGenerateInvoiceClose()
        },
      },
    )
  }

  const redirectToLienWaiver = (description?) => {
    setWorkOrderUpdating(false)
    toast({
      title: 'Work Order',
      description: description ?? t('saveLWError'),
      status: 'error',
      isClosable: true,
    })
    setTabIndex(1)
    onGenerateInvoiceClose()
  }
  const rejectLienWaiver = () => {
    const desc = t('updateLWError')
    rejectLW(
      {
        ...workOrder,
        lienWaiverAccepted: false,
      },
      {
        onError() {
          setWorkOrderUpdating(false)
        },
        onSuccess() {
          redirectToLienWaiver(desc)
        },
      },
    )
  }
  const generatePdf = useCallback(async () => {
    setWorkOrderUpdating(true)
    if (!workOrder.lienWaiverAccepted) {
      redirectToLienWaiver()
    } else if (Math.abs(workOrder?.amountOfCheck - workOrder?.finalInvoiceAmount) !== 0) {
      rejectLienWaiver()
    } else {
      generateInvoice()
    }
  }, [items, workOrder, projectData])

  return (
    <Box>
      <ModalBody h={'calc(100vh - 300px)'}>
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
            value={
              workOrder.dateInvoiceSubmitted && ![STATUS.Declined]?.includes(workOrder.statusLabel?.toLocaleLowerCase())
                ? dateFormat(workOrder?.dateInvoiceSubmitted)
                : 'mm/dd/yy'
            }
            icons={BiCalendar}
          />
          <InvoiceInfo
            title={t('dueDate')}
            value={
              workOrder.paymentTermDate && ![STATUS.Declined]?.includes(workOrder.statusLabel?.toLocaleLowerCase())
                ? dateFormat(workOrder?.paymentTermDate)
                : 'mm/dd/yy'
            }
            icons={BiCalendar}
          />
        </Grid>

        <Divider border="1px solid gray" mb={5} color="gray.200" />

        <Box h="calc(100% - 150px)" overflow="auto" ml="25px" mr="25px" border="1px solid #E2E8F0">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Td>{t('item')}</Td>
                <Td>{t('description')}</Td>
                <Td w={300} pr={14} textAlign={'end'}>
                  {t('total')}
                </Td>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => {
                return (
                  <Tr key={index} h="72px" data-testid={'invoice-items'}>
                    <Td maxWidth={300} w={300}>
                      {item.id}
                    </Td>
                    <Td maxWidth={400}>{item.name}</Td>
                    <Td pr={12} textAlign={'end'}>
                      <Text>{currencyFormatter(item.changeOrderAmount)}</Text>
                    </Td>
                  </Tr>
                )
              })}
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td pr={12}>
                  <VStack alignItems="end" fontSize="14px" fontWeight={500} color="gray.600">
                    <Box>
                      <HStack w={300} height="60px" justifyContent="space-between">
                        <Text>{t('subTotal')}:</Text>
                        <Text data-testid={'subTotal'}>{currencyFormatter(subTotal)}</Text>
                      </HStack>
                      <HStack w={300} height="60px" justifyContent="space-between">
                        <Text>{t('totalAmountPaid')}:</Text>
                        <Text data-testid={'totalAmountPaid'}>{currencyFormatter(Math.abs(amountPaid))}</Text>
                      </HStack>
                      <HStack w={300} height="60px" justifyContent="space-between">
                        <Text>{t('balanceDue')}</Text>
                        <Text data-testid={'balanceDue'}>{currencyFormatter(subTotal + amountPaid)}</Text>
                      </HStack>
                    </Box>
                  </VStack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </ModalBody>
      <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
        <HStack justifyContent="start" w="100%">
          {navigateToProjectDetails && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              onClick={navigateToProjectDetails}
              leftIcon={<BiSpreadsheet />}
            >
              {t('seeProjectDetails')}
            </Button>
          )}
          {[WOstatus.Invoiced, WOstatus.Paid, WOstatus.Completed].includes(
            workOrder?.statusLabel?.toLocaleLowerCase(),
          ) && recentInvoice ? (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              data-testid="seeInvoice"
              onClick={() => downloadFile(recentInvoice?.s3Url)}
              leftIcon={<BiDownload />}
            >
              {t('see')} {t('invoice')}
            </Button>
          ) : (
            <Button
              variant="outline"
              data-testid="generateInvoice"
              disabled={
                !(
                  workOrder?.statusLabel?.toLowerCase() === WOstatus.Declined ||
                  workOrder?.statusLabel?.toLowerCase() === WOstatus.Completed
                )
              }
              colorScheme="brand"
              size="md"
              leftIcon={<BiSpreadsheet />}
              onClick={onGenerateInvoiceOpen}
            >
              {t('generateINV')}
            </Button>
          )}
        </HStack>
        <HStack justifyContent="end">
          {workOrder?.statusLabel?.toLocaleLowerCase() === STATUS.Invoiced && !isVendor ? (
            <>
              <Button disabled={!rejectInvoiceCheck} onClick={() => rejectInvoice()} colorScheme="brand">
                {t('save')}
              </Button>
              <Button onClick={onClose} colorScheme="brand" variant="outline">
                {t('cancel')}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} colorScheme="brand">
              {t('cancel')}
            </Button>
          )}
        </HStack>
      </ModalFooter>{' '}
      <ConfirmationBox
        title="Invoice"
        content="Are you sure you want to generate invoice"
        isOpen={isGenerateInvoiceOpen}
        onClose={onGenerateInvoiceClose}
        onConfirm={generatePdf}
        isLoading={isWorkOrderUpdated}
      />
    </Box>
  )
}
