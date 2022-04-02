import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
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

import React from 'react'
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

export const InvoiceTab = () => {
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = data => {
    console.log(data)
    reset()
  }
  return (
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
                  {/* {data.map(e => {
                    return (
                      <>
                        <Td>Service 1</Td>
                        <Td>Original Scope</Td>
                        <Td>$300.00</Td>
                        <Td>1</Td>
                        <Td>$570</Td>
                      </>
                    )
                  })} */}
                </Tr>
              </Tbody>
            </Table>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={5} gap={20} spacing={5} p={5} py={6} borderBottom="1px solid #E2E8F0">
                <Input h="28px" bg="gray.50" {...register('Item')} />

                <Input h="28px" bg="gray.50" {...register('Description')} />

                <Input h="28px" bg="gray.50" {...register('Unit Price')} />

                <Input h="28px" bg="gray.50" {...register('Quantity')} />

                <Input h="28px" bg="gray.50" {...register('Amount')} />
              </SimpleGrid>
              <Button type="submit">Creat row</Button>
            </form>
          </Box>
        </TableContainer>
      </Box>
    </Box>
  )
}
