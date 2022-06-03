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

import { BiCalendar, BiDollarCircle, BiDownload, BiFile } from 'react-icons/bi'
import { t } from 'i18next'
import { useCall } from 'utils/pc-projects'

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
  const dummyData = [
    {
      item: '1',
      description: 'abx',
      unitPrice: '12',
      quantity: '5',
      amount: '100',
    },
  ]

  const entity = {
    ...workOrder,
    ...{ status: 111 },
  }
  const { mutate: rejectInvocie } = useCall()

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
                  {dummyData.map((item, index) => {
                    return (
                      <Tr h="72px">
                        <Td>{item.item}</Td>
                        <Td>{item.description}</Td>
                        <Td>{item.unitPrice}</Td>
                        <Td>{item.quantity}</Td>
                        <Td>
                          <Text>{item.amount}</Text>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>

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
              <Button colorScheme="brand" variant="outline">
                <Text mr={1}>
                  <BiDownload size={14} />
                </Text>
                See Inv 2705_AR
              </Button>
            </Flex>
          </Flex>
        </HStack>
        <Flex>
          <Button onClick={() => rejectInvocie(entity)} colorScheme="brand" mr={3}>
            {t('reject')}
          </Button>
          <Button onClick={onClose} colorScheme="brand" variant="outline">
            {t('cancel')}
          </Button>
        </Flex>
      </HStack>
    </Box>
  )
}
