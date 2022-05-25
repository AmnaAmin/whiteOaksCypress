import { Table, Box, Thead, Tr, Td, Tbody } from '@chakra-ui/react'

export default {
  title: 'UI/Table',
  component: Table,
}

export const TableSimple = () => (
  <Box h={340} overflow="auto">
    <Table variant="simple" size="md">
      <Thead>
        <Tr>
          <Td>SKU</Td>
          <Td>Product Name</Td>
          <Td>Details</Td>
          <Td>Quantity</Td>
          <Td>Price</Td>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{1234}</Td>
          <Td>{'Product A'}</Td>
          <Td>{'Description 1'}</Td>
          <Td>{2}</Td>
          <Td>{28}</Td>
        </Tr>
      </Tbody>
    </Table>
  </Box>
)
