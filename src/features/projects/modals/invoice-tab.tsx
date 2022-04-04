import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  Input,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import { BiCalendar, BiDollarCircle, BiFile } from 'react-icons/bi'

const InvoiceReadableInfo: React.FC<{ title: string; date: string; icons: React.ElementType }> = ({
  title,
  date,
  icons,
}) => {
  return (
    <Flex pt={6} pb={8}>
      <Box pr={4}>
        <Icon as={icons} fontSize="23px" color="gray.600" />
      </Box>
      <Box lineHeight="20px">
        <Text fontWeight={500} lineHeight="20px" fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {title}
        </Text>
        <Text color="gray.500" lineHeight="20px" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {date}
        </Text>
      </Box>
    </Flex>
  )
}

export const InvoiceTab = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = data => {
    console.log(data)
    reset()
  }
  return (
    <Box>
      <Box w="95%">
        <Grid gridTemplateColumns="repeat(auto-fit ,minmax(170px,1fr))" gap={2}>
          <InvoiceReadableInfo title={'WO Original Amount'} date={'$40,170.6'} icons={BiDollarCircle} />
          <InvoiceReadableInfo title={'Final Invoice:'} date={'$40,170.6'} icons={BiDollarCircle} />
          <InvoiceReadableInfo title={'PO Number'} date={'xyz'} icons={BiFile} />
          <InvoiceReadableInfo title={'Invoice Date'} date={'10/02/2022'} icons={BiCalendar} />
          <InvoiceReadableInfo title={'Due Date'} date={'12/02/2022'} icons={BiCalendar} />
        </Grid>

        <Divider border="2px solid gray" mb={5} color="gray.200" />

        <Box>
          <TableContainer border="1px solid #E2E8F0">
            <Box h="488px" overflow="auto">
              <Table colorScheme="teal" size="lg">
                <Thead position="sticky" top={0}>
                  <Tr h="72px" bg="gray.50" fontSize="14px" fontWeight={500} color="gray.600">
                    <Td>Item</Td>
                    <Td>Description</Td>
                    <Td>Unit Price </Td>
                    <Td>Quantity</Td>
                    <Td>Amount</Td>
                  </Tr>
                </Thead>
                <Tbody fontWeight={400} fontSize="14px" color="gray.600">
                  <Tr h="72px">
                    <Td>Service 1</Td>
                    <Td>Original Scope</Td>
                    <Td>$300.00</Td>
                    <Td>1</Td>
                    <Td>$570</Td>
                  </Tr>
                </Tbody>
              </Table>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box px={5} borderBottom="1px solid #E2E8F0">
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    my={1}
                    fontSize="14px"
                    fontWeight={600}
                    color="#4E87F8"
                  >
                    +Add New Item
                  </Button>
                  <SimpleGrid columns={5} gap={20} pb={4}>
                    <Input type="text" h="28px" bg="gray.50" id="item" {...register('Item')} />

                    <Input type="text" h="28px" bg="gray.50" id="description" {...register('Description')} />

                    <Input type="text" h="28px" bg="gray.50" id="unitPrice" {...register('UnitPrice')} />

                    <Input type="text" h="28px" bg="gray.50" id="quantity" {...register('Quantity')} />

                    <Input type="text" h="28px" bg="gray.50" id="amount" {...register('Amount')} />
                  </SimpleGrid>
                </Box>
              </form>
            </Box>
          </TableContainer>
        </Box>
      </Box>
      <HStack w="100%" justifyContent="end" h="83px" borderTop="1px solid #CBD5E0" mt={10} pt={5} pr={14}>
        <Button variant="ghost" size={'lg'} onClick={onClose} mr={3}>
          Close
        </Button>
        <Button size={'lg'} _focus={{ outline: 'none' }} colorScheme={'CustomPrimaryColor'} _hover={{ bg: 'blue' }}>
          Save
        </Button>
      </HStack>
    </Box>
  )
}
