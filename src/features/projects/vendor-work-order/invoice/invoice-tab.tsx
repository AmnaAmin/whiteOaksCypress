import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  HStack,
  Icon,
  Input,
  ModalBody,
  ModalFooter,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { ConfirmationBox } from 'components/Confirmation'
import { addDays, nextFriday } from 'date-fns'
import { jsPDF } from 'jspdf'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiDollarCircle, BiDownload, BiFile, BiSpreadsheet, BiXCircle } from 'react-icons/bi'
import { TransactionStatusValues as TSV, TransactionType, TransactionTypeValues } from 'types/transaction.type'
import { convertDateTimeToServer, dateFormat } from 'utils/date-time-utils'
import { downloadFile } from 'utils/file-utils'
import { currencyFormatter } from 'utils/stringFormatters'
import { createInvoice } from 'utils/vendor-projects'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import { STATUS, STATUS as WOstatus, STATUS_CODE } from '../../status'

import * as _ from 'lodash'

const InvoiceInfo: React.FC<{ title: string; value: string; icons: React.ElementType }> = ({ title, value, icons }) => {
  return (
    <Flex justifyContent="start">
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

export const InvoiceTab = ({ onClose, workOrder, projectData, transactions, documentsData, setTabIndex }) => {
  const [allowManualEntry] = useState(false) /* change requirement woa-3034 to unallow manual entry for vendor */
  const [recentInvoice, setRecentInvoice] = useState<any>(null)
  const { mutate: updateWorkOrder } = useUpdateWorkOrderMutation({})
  const { mutate: rejectLW } = useUpdateWorkOrderMutation({ hideToast: true })
  const { t } = useTranslation()
  const [items, setItems] = useState<Array<TransactionType>>([])
  const [subTotal, setSubTotal] = useState(0)
  const [amountPaid, setAmountPaid] = useState(0)
  const [isWorkOrderUpdated, setWorkOrderUpdating] = useState(false)
  const toast = useToast()

  const {
    isOpen: isGenerateInvoiceOpen,
    onClose: onGenerateInvoiceClose,
    onOpen: onGenerateInvoiceOpen,
  } = useDisclosure()

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

  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      item: '',
      description: '',
      unitPrice: '',
      quantity: '',
      amount: '',
    },
  })

  useEffect(() => {
    if (documentsData && documentsData.length > 0) {
      let invoices = documentsData.filter(d => d.documentType === 48 && d.workOrderId === workOrder.id)
      if (invoices.length > 0) {
        /* sorting invoices by created datetime to fetch latest */
        invoices = _.orderBy(
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

  const DeleteItems = Id => {
    const deleteValue = items.filter((value, id) => id !== Id)
    setItems(deleteValue)
  }

  return (
    <Box>
      <ModalBody h="400px" pl="25px" pr="25px">
        <Grid gridTemplateColumns="repeat(auto-fit ,minmax(170px,1fr))" gap={2} minH="100px" alignItems={'center'}>
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
            value={workOrder.dateInvoiceSubmitted ? dateFormat(workOrder?.dateInvoiceSubmitted) : 'mm/dd/yy'}
            icons={BiCalendar}
          />
          <InvoiceInfo
            title={t('dueDate')}
            value={workOrder.paymentTermDate ? dateFormat(workOrder?.paymentTermDate) : 'mm/dd/yy'}
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
                  <Td>{t('total')}</Td>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item, index) => {
                  return (
                    <Tr key={index} data-testid={'invoice-items'} h="72px">
                      <Td>{item.id}</Td>
                      <Td>{item.name}</Td>
                      <Td>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Text>{currencyFormatter(item.changeOrderAmount)}</Text>
                          {allowManualEntry && (
                            <Text>
                              <BiXCircle fontSize={20} color="#4E87F8" onClick={() => DeleteItems(index)} />
                            </Text>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
              <form>
                <>
                  {allowManualEntry && (
                    <Tfoot>
                      <Tr>
                        <Td pt="0" pb={6}>
                          <Button
                            type="submit"
                            size="xs"
                            variant="ghost"
                            my={0.5}
                            fontSize="14px"
                            fontWeight={600}
                            color="#4E87F8"
                          >
                            +{t('addNewItem')}
                          </Button>

                          <FormControl isInvalid={!!errors.item?.message}>
                            <Input
                              w={165}
                              type="text"
                              h="28px"
                              bg="gray.50"
                              // id="item"
                              {...register('item', { required: 'This field is required.' })}
                            />
                            <FormErrorMessage position="absolute">{errors.item?.message}</FormErrorMessage>
                          </FormControl>
                        </Td>

                        <Td>
                          <FormControl isInvalid={!!errors.description?.message}>
                            <Input
                              w={149}
                              type="text"
                              h="28px"
                              bg="gray.50"
                              // id="description"
                              {...register('description', { required: 'This field is required.' })}
                            />
                            <FormErrorMessage position="absolute">{errors.description?.message}</FormErrorMessage>
                          </FormControl>
                        </Td>
                        <Td>
                          <FormControl isInvalid={!!errors.unitPrice?.message}>
                            <Input
                              w={149}
                              type="text"
                              h="28px"
                              bg="gray.50"
                              // id="unitPrice"
                              {...register('unitPrice', { required: 'This field is required.' })}
                            />
                            <FormErrorMessage position="absolute">{errors.unitPrice?.message}</FormErrorMessage>
                          </FormControl>
                        </Td>
                        <Td>
                          <FormControl isInvalid={!!errors.quantity?.message}>
                            <Input
                              w={84}
                              type="text"
                              h="28px"
                              bg="gray.50"
                              // id="quantity"
                              {...register('quantity', { required: 'This field is required.' })}
                            />
                            <FormErrorMessage position="absolute">{errors.quantity?.message}</FormErrorMessage>
                          </FormControl>
                        </Td>
                        <Td>
                          <FormControl isInvalid={!!errors.amount?.message}>
                            <Input
                              w={84}
                              type="text"
                              h="28px"
                              bg="gray.50"
                              // id="amount"
                              {...register('amount', { required: 'This field is required.' })}
                            />
                            <FormErrorMessage position="absolute">{errors.amount?.message}</FormErrorMessage>
                          </FormControl>
                        </Td>
                      </Tr>
                    </Tfoot>
                  )}
                </>
              </form>
            </Table>

            <VStack alignItems="end" w="93%" fontSize="14px" fontWeight={500} color="gray.600">
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
          </Box>
        </Box>
      </ModalBody>
      <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
        <HStack justifyContent="start" w="100%">
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
          <Button variant="outline" colorScheme="brand" onClick={onClose}>
            {t('cancel')}
          </Button>
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
