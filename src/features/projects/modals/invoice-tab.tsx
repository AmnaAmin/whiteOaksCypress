import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  HStack,
  Icon,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Thead,
  Tr,
  VStack,
  FormLabel,
  Link,
} from '@chakra-ui/react'
import { currencyFormatter } from 'utils/stringFormatters'
import { dateFormat } from 'utils/date-time-utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiCalendar, BiDollarCircle, BiFile, BiXCircle } from 'react-icons/bi'
import { jsPDF } from 'jspdf'
import { createInvoice } from 'utils/vendor-projects'

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

export const InvoiceTab = ({ onClose, workOrder, projectData }) => {
  const [items, setItems] = useState([
    {
      item: '1',
      description: 'Product1 Description',
      unitPrice: '$124',
      quantity: 4,
      amount: '$496',
    },
    {
      item: '2',
      description: 'Product2 Description',
      unitPrice: '$120',
      quantity: '$600',
    },
  ] as any)
  const {
    register,
    handleSubmit,
    reset,
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

  const onSubmit = data => {
    // console.log(data)
    setItems(state => [...state, { ...data }])
    reset()
  }

  const DeleteItems = Id => {
    const deleteValue = items.filter((value, id) => id !== Id)
    setItems(deleteValue)
    // console.log('deleteValue', deleteValue)
  }

  const generateInvoice = () => {
    let doc = new jsPDF()
    doc = createInvoice(doc, workOrder, projectData, items)
    doc.save('invoice.pdf')
  }

  return (
    <Box>
      <Box w="100%">
        <Flex justifyContent={'flex-end'} mt="10px">
          <Flex>
            <FormLabel variant="strong-label" size="md" mt="10px">
              Recent INV:
            </FormLabel>
          </Flex>
          <Link href={workOrder?.invoiceLink} target={'_blank'} download _hover={{ textDecoration: 'none' }}>
            <Button variant="ghost" colorScheme="brand" size="md">
              {'invoice.pdf'}
            </Button>
          </Link>
          <Button variant="solid" colorScheme="brand" size="md" ml="10px" onClick={generateInvoice}>
            Generate Invoice
          </Button>
        </Flex>
        <Grid gridTemplateColumns="repeat(auto-fit ,minmax(170px,1fr))" gap={2} minH="110px" alignItems={'center'}>
          <InvoiceInfo
            title={'WO Original Amount'}
            value={currencyFormatter(workOrder?.clientOriginalApprovedAmount)}
            icons={BiDollarCircle}
          />
          <InvoiceInfo
            title={'Final Invoice:'}
            value={currencyFormatter(workOrder?.finalInvoiceAmount)}
            icons={BiDollarCircle}
          />
          <InvoiceInfo
            title={'PO Number'}
            value={workOrder.propertyAddress ? workOrder.propertyAddress : ''}
            icons={BiFile}
          />
          <InvoiceInfo
            title={'Invoice Date'}
            value={workOrder.dateInvoiceSubmitted ? dateFormat(workOrder?.dateInvoiceSubmitted) : 'mm/dd/yyyy'}
            icons={BiCalendar}
          />
          <InvoiceInfo
            title={'Due Date'}
            value={workOrder.expectedPaymentDate ? dateFormat(workOrder?.expectedPaymentDate) : 'mm/dd/yyyy'}
            icons={BiCalendar}
          />
        </Grid>

        <Divider border="1px solid gray" mb={5} color="gray.200" />

        <Box>
          <TableContainer border="1px solid #E2E8F0">
            <Box h="400px" overflow="auto">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Table colorScheme="teal" size="lg">
                  <Thead position="sticky" top={0} zIndex={2}>
                    <Tr h="72px" bg="gray.50" fontSize="14px" fontWeight={500} color="gray.600">
                      <Td>Item</Td>
                      <Td>Description</Td>
                      <Td>Unit Price </Td>
                      <Td>Quantity</Td>
                      <Td>Amount</Td>
                    </Tr>
                  </Thead>
                  <Tbody fontWeight={400} fontSize="14px" color="gray.600" zIndex="1">
                    {items.map((item, index) => {
                      return (
                        <Tr h="72px">
                          <Td>{item.item}</Td>
                          <Td>{item.description}</Td>
                          <Td>{item.unitPrice}</Td>
                          <Td>{item.quantity}</Td>
                          <Td>
                            <Flex justifyContent="space-between" alignItems="center">
                              <Text>{item.amount}</Text>
                              <Text>
                                <BiXCircle fontSize={20} color="#4E87F8" onClick={() => DeleteItems(index)} />
                              </Text>
                            </Flex>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
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
                </Table>
              </form>

              <VStack alignItems="end" w="93%" fontSize="14px" fontWeight={500} color="gray.600">
                <Box>
                  <HStack w={300} height="60px" justifyContent="space-between">
                    <Text>Subtotal:</Text>
                    <Text>$1710.00</Text>
                  </HStack>
                  <HStack w={300} height="60px" justifyContent="space-between">
                    <Text>Total Amount Paid:</Text>
                    <Text>$1710.00</Text>
                  </HStack>
                  <HStack w={300} height="60px" justifyContent="space-between">
                    <Text>Balance Due:</Text>
                    <Text>$0.00</Text>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </TableContainer>
        </Box>
      </Box>
      <HStack w="100%" justifyContent="end" h="83px" borderTop="1px solid #CBD5E0" mt={10} pt={5}>
        <Button
          variant="ghost"
          onClick={onClose}
          mr={3}
          color="gray.700"
          fontStyle="normal"
          fontSize="14px"
          fontWeight={600}
          h="48px"
          w="130px"
        >
          Close
        </Button>
        <Button
          _focus={{ outline: 'none' }}
          colorScheme={'CustomPrimaryColor'}
          fontStyle="normal"
          fontSize="14px"
          fontWeight={600}
          h="48px"
          w="130px"
        >
          Save
        </Button>
      </HStack>
    </Box>
  )
}
