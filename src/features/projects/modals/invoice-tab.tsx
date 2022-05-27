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
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { currencyFormatter } from 'utils/stringFormatters'
import { dateFormat } from 'utils/date-time-utils'
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BiCalendar, BiDollarCircle, BiFile, BiXCircle, BiDownload, BiSpreadsheet } from 'react-icons/bi'
import { jsPDF } from 'jspdf'
import { createInvoice } from 'utils/vendor-projects'
import { downloadFile } from 'utils/file-utils'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import { useTranslation } from 'react-i18next'
import { STATUS } from '../status'

const InvoiceInfo: React.FC<{ title: string; value: string; icons: React.ElementType }> = ({ title, value, icons }) => {
  return (
    <Flex justifyContent="left">
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

export const InvoiceTab = ({ onClose, workOrder, projectData, transactions, documentsData }) => {
  const [allowManualEntry] = useState(false) /* change requirement woa-3034 to unallow manual entry for vendor */
  const [recentInvoice, setRecentInvoice] = useState<any>(null)
  const { mutate: updateInvoice } = useUpdateWorkOrderMutation()
  const { t } = useTranslation()
  const [items, setItems] = useState(
    transactions && transactions.length > 0 ? transactions.filter(co => co.parentWorkOrderId === workOrder.id) : [],
  )
  // Sum of all transactions (Change Orders)
  const subTotal =
    items.length > 0 &&
    items.map(it => it.transactionType !== 30 && parseFloat(it.changeOrderAmount))?.reduce((sum, x) => sum + x)

  // Sum of all Draws
  const amountPaid =
    items.length > 0 &&
    items.map(it => it.transactionType === 30 && parseFloat(it.changeOrderAmount))?.reduce((sum, x) => sum + x)

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
      const invoice = documentsData.find(d => d.documentType === 48)
      if (invoice) {
        setRecentInvoice({ s3Url: invoice.s3Url, fileType: invoice.fileType })
      }
    }
  }, [documentsData])

  const generatePdf = useCallback(async () => {
    let form = new jsPDF()
    form = await createInvoice(form, workOrder, projectData, items, { subTotal, amountPaid })
    const pdfUri = form.output('datauristring')

    updateInvoice({
      ...workOrder,
      documents: [
        ...documentsData,
        {
          documentType: 48,
          fileObject: pdfUri.split(',')[1],
          fileObjectContentType: 'application/pdf',
          fileType: 'Invoice.pdf',
        },
      ],
    })
  }, [])

  const DeleteItems = Id => {
    const deleteValue = items.filter((value, id) => id !== Id)
    setItems(deleteValue)
    // console.log('deleteValue', deleteValue)
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
            value={workOrder.expectedPaymentDate ? dateFormat(workOrder?.expectedPaymentDate) : 'mm/dd/yyyy'}
            icons={BiCalendar}
          />
        </Grid>

        <Divider border="1px solid gray" mb={5} color="gray.200" />

        <Box>
          <Box h="400px" overflow="auto">
            <form>
              <Table border="1px solid #E2E8F0" variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Td>Item</Td>
                    <Td>Description</Td>
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
                          +Add New Item
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
              </Table>
            </form>

            <VStack alignItems="end" w="93%" fontSize="14px" fontWeight={500} color="gray.600">
              <Box>
                <HStack w={300} height="60px" justifyContent="space-between">
                  <Text>Subtotal:</Text>
                  <Text>{currencyFormatter(subTotal)}</Text>
                </HStack>
                <HStack w={300} height="60px" justifyContent="space-between">
                  <Text>Total Amount Paid:</Text>
                  <Text>{currencyFormatter(Math.abs(amountPaid))}</Text>
                </HStack>
                <HStack w={300} height="60px" justifyContent="space-between">
                  <Text>Balance Due:</Text>
                  <Text>{currencyFormatter(subTotal + amountPaid)}</Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>
      <Flex h="83px" borderTop="1px solid #CBD5E0" mt={10} pt={5}>
        <HStack justifyContent="start" w="100%">
          {workOrder?.statusLabel !== STATUS.Cancel && recentInvoice && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              onClick={() => downloadFile(recentInvoice.s3Url)}
              leftIcon={<BiDownload />}
            >
              See {'invoice.pdf'}
            </Button>
          )}
          <Button
            variant="outline"
            disabled={workOrder?.statusLabel !== STATUS.Cancel}
            colorScheme="brand"
            size="md"
            leftIcon={<BiSpreadsheet />}
            onClick={generatePdf}
          >
            Generate Invoice
          </Button>
        </HStack>
        <HStack justifyContent="end">
          <Button variant="ghost" colorScheme="brand" onClick={onClose} border="1px solid">
            {t('cancel')}
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}
