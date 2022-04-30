import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { currencyFormatter } from 'utils/stringFormatters'
import { dateFormat } from 'utils/date-time-utils'

import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { BiCalendar, BiDollarCircle, BiDownload, BiFile, BiXCircle } from 'react-icons/bi'
import { t } from 'i18next'

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

export const InvoiceTabPC = ({ onClose, workOrder }) => {
  const [items, setItems] = useState([] as any)
  const { handleSubmit, reset } = useForm({
    defaultValues: {
      item: '',
      description: '',
      unitPrice: '',
      quantity: '',
      amount: '',
    },
  })
  console.log(workOrder)

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

  return (
    <Box>
      <Box w="100%">
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
            value={workOrder.invoiceNumber ? workOrder.invoiceNumber : ''}
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
        <HStack w="100%" justifyContent={'start'} mb={2} alignItems={'start'}>
          <Flex w="100%" alignContent="space-between" pos="relative">
            <Flex fontSize="14px" fontWeight={500} mr={1}>
              <Button colorScheme="#4E87F8" variant="outline" color="#4E87F8" mr={2}>
                <Text mr={1}>
                  <BiDownload size={14} />
                </Text>
                See Inv 2705_AR
              </Button>
            </Flex>
          </Flex>
        </HStack>
        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          fontStyle="normal"
          fontSize="14px"
          fontWeight={600}
          h="48px"
          w="130px"
        >
          {t('reject')}
        </Button>
        <Button
          ml={3}
          onClick={onClose}
          colorScheme="blue"
          variant="outline"
          fontStyle="normal"
          fontSize="14px"
          fontWeight={600}
          h="48px"
          w="130px"
        >
          {t('cancel')}
        </Button>
      </HStack>
    </Box>
  )
}
