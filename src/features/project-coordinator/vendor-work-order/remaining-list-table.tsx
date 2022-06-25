import { Box, Table, Thead, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react'
import React from 'react'

const RemainingListTable = () => {
  return (
    <Box border="1px solid" borderColor="gray.100" borderRadius="md">
      <TableContainer>
        <Box overflow="auto" h="300px">
          <Table>
            <Thead h="72px" position="sticky" top="0">
              <Tr>
                <Td>SKU</Td>
                <Td>Product Name</Td>
                <Td>Details</Td>
                <Td>Quantity</Td>
                <Td>Price</Td>
                <Td>Total</Td>
              </Tr>
            </Thead>
            <Tbody></Tbody>
          </Table>
        </Box>
      </TableContainer>
    </Box>
  )
}

export default RemainingListTable
