import { HStack, Table, Tbody, Td, TableContainer, Thead, Tr, Text, Button, VStack, Flex } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { ACCESS_CONTROL } from 'features/access-control/access-control.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue, BiEditAlt, BiTrash } from 'react-icons/bi'

export const AccessControl: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <VStack w="70%">
        <HStack justifyContent="space-between" mb="16px" w="100%">
          <Text data-testid="access-control" fontSize="18px" fontWeight={600} color="#4A5568">
            {t(`${ACCESS_CONTROL}.accessControl`)}
          </Text>

          <Button onClick={() => {}} colorScheme="brand" leftIcon={<BiAddToQueue />}>
            {t(`${ACCESS_CONTROL}.newRole`)}
          </Button>
        </HStack>
        <TableContainer w="100%" borderRadius={'6px'} border="1px solid #CBD5E0">
          <Table variant="striped" size="sm">
            <Thead position="sticky" top={0}>
              <Tr h={'45px'} bg="#F2F3F4">
                <Td borderBottom="1px solid #CBD5E0 !important" borderRight="1px solid #CBD5E0 !important">
                  {t(`${ACCESS_CONTROL}.roles`)}
                </Td>
                <Td borderBottom="1px solid #CBD5E0 !important">{t(`${ACCESS_CONTROL}.actions`)}</Td>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td w="50%" minH="45px" borderRight="1px solid #CBD5E0 !important">
                  Admin
                </Td>
                <Td>
                  <HStack gap="20px">
                    <Flex gap="5px" fontSize={'14px'} color="gray.500" fontWeight={'400'} fontStyle={'normal'}>
                      <BiEditAlt></BiEditAlt>
                      <Text>Edit</Text>
                    </Flex>
                    <Flex gap="5px" fontSize={'14px'} color="gray.500" fontWeight={'400'} fontStyle={'normal'}>
                      <BiTrash></BiTrash>
                      <Text>Remove</Text>
                    </Flex>
                  </HStack>
                </Td>
              </Tr>
              <Tr>
                <Td w="50%" minH="45px" borderRight="1px solid #CBD5E0 !important">
                  Operations
                </Td>
                <Td>
                  <HStack gap="20px">
                    <Flex gap="5px" fontSize={'14px'} color="gray.500" fontWeight={'400'} fontStyle={'normal'}>
                      <BiEditAlt></BiEditAlt>
                      <Text>Edit</Text>
                    </Flex>
                    <Flex gap="5px" fontSize={'14px'} color="gray.500" fontWeight={'400'} fontStyle={'normal'}>
                      <BiTrash></BiTrash>
                      <Text>Remove</Text>
                    </Flex>
                  </HStack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Card>
  )
}
