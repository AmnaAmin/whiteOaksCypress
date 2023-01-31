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
import { dateFormatNew, dateISOFormatWithZeroTime } from 'utils/date-time-utils'

import { BiCalendar, BiDollarCircle, BiDownload, BiFile, BiSpreadsheet } from 'react-icons/bi'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionType, TransactionStatusValues as TSV } from 'types/transaction.type' // TransactionTypeValues
import { orderBy } from 'lodash'
import { downloadFile } from 'utils/file-utils'
import { STATUS, STATUS_CODE, STATUS as WOstatus } from 'features/common/status'
import jsPDF from 'jspdf'
import { addDays, nextFriday, nextWednesday } from 'date-fns'
import { createInvoice } from 'api/vendor-projects'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import { ConfirmationBox } from 'components/Confirmation'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

export const InvoiceInfo: React.FC<{ title: string; value: string; icons: React.ElementType }> = ({
  title,
  value,
  icons,
}) => {
  return (
    <Flex>
      <Box pr={4}>
        <Icon as={icons} fontSize="23px" color="#4A5568" />
      </Box>
      <Box lineHeight="20px">
        <Text
          fontWeight={500}
          lineHeight="20px"
          fontSize="14px"
          fontStyle="normal"
          color="#2D3748"
          mb="1"
          title={title}
          whiteSpace="nowrap"
          w="100px"
        >
          {title}
        </Text>
        <Text
          data-testid={title}
          color="#4A5568"
          lineHeight="20px"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
          noOfLines={[0, 1]}
          title={value}
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
  isWorkOrderUpdating,
  vendorAddress,
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
      setSubTotal(workOrder.subTotal)
      setAmountPaid(workOrder.totalAmountPaid)

      // Change Orders And Original Amount
      // const changeOrders = transactionItems.filter(
      //   it =>
      //     ![TransactionTypeValues.draw, TransactionTypeValues.material, TransactionTypeValues.woPaid].includes(
      //       it.transactionType,
      //     ),
      // )
      // // Draws and maetrials
      // const drawTransactions = transactionItems?.filter(it =>
      //   [TransactionTypeValues.draw, TransactionTypeValues.material].includes(it.transactionType),
      // )

      // Sum of all approved (:not paid) transactions (Change Orders & Original Amount)
      // if (changeOrders && changeOrders.length > 0) {
      //   setSubTotal(changeOrders.map(t => parseFloat(t.changeOrderAmount))?.reduce((sum, x) => sum + x))
      // }

      // WO Paid Transaction
      // const paidTransactionAmount =
      //   transactionItems?.find(it => it.transactionType === TransactionTypeValues.woPaid)?.changeOrderAmount ?? 0

      // let sumOfDrawTransaction = 0

      // if (drawTransactions && drawTransactions.length > 0) {
      //   sumOfDrawTransaction = drawTransactions?.map(t => parseFloat(t.changeOrderAmount))?.reduce((sum, x) => sum + x)
      // }

      // Sum of all Draws (Material (+Refund), Draws and WOPaid)
      // const amountPaid = Math.abs(sumOfDrawTransaction) + paidTransactionAmount
      // setAmountPaid(amountPaid)
    }
  }, [transactions])

  const rejectInvoice = () => {
    if (onSave) {
      onSave({
        status: STATUS_CODE.DECLINED,
        declineDate: new Date(),
        lienWaiverAccepted: false,
      })
    }
  }
  const prepareInvoicePayload = () => {
    const invoiceSubmittedDate = new Date()
    const paymentTermDate = addDays(invoiceSubmittedDate, workOrder.paymentTerm || 20)
    const paymentProcessedDate = nextWednesday( paymentTermDate );
    const updatedWorkOrder = {
      ...workOrder,
      dateInvoiceSubmitted: dateISOFormatWithZeroTime(invoiceSubmittedDate),
      expectedPaymentDate: dateISOFormatWithZeroTime(nextFriday(paymentTermDate)),
      paymentTermDate: dateISOFormatWithZeroTime(paymentTermDate),
      datePaymentProcessed: dateISOFormatWithZeroTime(paymentProcessedDate)
    }
    if (workOrder.statusLabel?.toLowerCase()?.includes(STATUS.Declined)) {
      updatedWorkOrder.status = STATUS_CODE.INVOICED
    }
    return updatedWorkOrder
  }

  const generateInvoice = async () => {
    let form = new jsPDF()
    const updatedWorkOrder = prepareInvoicePayload()
    form = await createInvoice(form, updatedWorkOrder, projectData, items, { subTotal, amountPaid }, vendorAddress)
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
      position: 'top-left',
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
  }, [items, workOrder, projectData, vendorAddress])

  return (
    <Box>
      <ModalBody mx={{ base: 0, lg: '25px' }}>
        <Grid
          templateColumns={{ base: 'unset', sm: 'repeat(auto-fit ,minmax(150px,1fr))' }}
          gap={5}
          alignItems={'center'}
          py="24px"
          display={{ base: 'flex', sm: 'grid' }}
          flexWrap="wrap"
        >
          <Box flex={{ base: '1', sm: 'unset' }}>
            <InvoiceInfo title={t('invoiceNo')} value={workOrder?.invoiceNumber} icons={BiFile} />
          </Box>
          <Box flex={{ base: '1', sm: 'unset' }}>
            <InvoiceInfo
              title={t('finalInvoice')}
              value={currencyFormatter(workOrder?.finalInvoiceAmount)}
              icons={BiDollarCircle}
            />
          </Box>
          <Box flex={{ base: '1', sm: 'unset' }}>
            <InvoiceInfo
              title={t('PONumber')}
              value={workOrder.propertyAddress ? workOrder.propertyAddress : ''}
              icons={BiFile}
            />
          </Box>

          <Box flex={{ base: '1', sm: 'unset' }}>
            <InvoiceInfo
              title={t('invoiceDate')}
              value={
                workOrder.dateInvoiceSubmitted &&
                ![STATUS.Declined]?.includes(workOrder.statusLabel?.toLocaleLowerCase())
                  ? (dateFormatNew(workOrder?.dateInvoiceSubmitted) as any)
                  : 'mm/dd/yy'
              } 
              icons={BiCalendar}
            />
          </Box>
          <Box flex={{ base: '1', sm: 'unset' }}>
            <InvoiceInfo
              title={t('dueDate')}
              value={
                workOrder.paymentTermDate && ![STATUS.Declined]?.includes(workOrder.statusLabel?.toLocaleLowerCase())
                  ? (dateFormatNew(workOrder?.paymentTermDate) as any)
                  : 'mm/dd/yy'
              }
              icons={BiCalendar}
            />
          </Box>
        </Grid>

        <Divider borderColor="1px solid #CBD5E0" mb="16px" color="gray.300" w="99.8%" />

        <Box
          h="calc(100vh - 409px)"
          overflow="auto"
          borderRadius={7}
          borderBottom="1px solid #CBD5E0"
          border="1px solid #CBD5E0"
          mb="16px"
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr h={'40px'} bg={'#ECEDEE !important'}>
                <Td color={'gray.900'} fontWeight={500} fontSize={'14px'}>
                  {t('item')}
                </Td>
                <Td color={'gray.900'} fontWeight={500} fontSize={'14px'}>
                  {t('description')}
                </Td>
                <Td color={'gray.900'} fontWeight={500} fontSize={'14px'}>
                  {t('type')}
                </Td>
                <Td color={'gray.900'} fontWeight={500} fontSize={'14px'} w={300} pr={12} textAlign={'end'}>
                  {t('total')}
                </Td>
              </Tr>
            </Thead>
            <Tbody outline={'1px solid #CBD5E0'}>
              {items.map((item, index) => {
                return (
                  <Tr h="40px !important" key={index} data-testid={'invoice-items'}>
                    <Td maxWidth={300} w={300}>
                      {item.id}
                    </Td>
                    <Td width={400}>{item.name}</Td>
                    <Td width={400}>{item.transactionTypeLabel}</Td>
                    <Td pr={12} textAlign={'end'}>
                      <Text>{currencyFormatter(item.transactionTotal)}</Text>
                    </Td>
                  </Tr>
                )
              })}
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td pr={12} borderLeft="1px solid #EDF2F7">
                  <VStack alignItems="end" fontSize="14px" fontWeight={500} color="gray.600">
                    <Box>
                      <HStack w={300} height="35px" justifyContent="space-between">
                        <Text fontWeight={500} color={'gray.800'}>
                          {t('subTotal')}:
                        </Text>
                        <Text fontWeight={500} color={'gray.800'} data-testid={'subTotal'}>
                          {currencyFormatter(workOrder.subTotal)}
                        </Text>
                      </HStack>
                      <HStack w={300} height="35px" justifyContent="space-between">
                        <Text fontWeight={500} color={'gray.800'}>
                          {t('totalAmountPaid')}:
                        </Text>
                        <Text fontWeight={500} color={'gray.800'} data-testid={'totalAmountPaid'}>
                          {currencyFormatter(workOrder.totalAmountPaid)}
                        </Text>
                      </HStack>
                      <HStack w={300} height="35px" justifyContent="space-between">
                        <Text fontWeight={500} color={'gray.800'}>
                          {t('balanceDue')}
                        </Text>
                        <Text fontWeight={500} color={'gray.800'} data-testid={'balanceDue'}>
                          {currencyFormatter(workOrder.finalInvoiceAmount)}
                        </Text>
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
              colorScheme="darkPriamry"
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
              colorScheme="darkPrimary"
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
              colorScheme="darkPrimary"
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
              <Button
                disabled={!rejectInvoiceCheck || isWorkOrderUpdating}
                onClick={() => rejectInvoice()}
                colorScheme="darkPrimary"
              >
                {t('save')}
              </Button>
              <Button onClick={onClose} colorScheme="darkPrimary" variant="outline">
                {t('cancel')}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} variant="outline" colorScheme="darkPrimary">
              {t('cancel')}
            </Button>
          )}
        </HStack>
      </ModalFooter>
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
