import { HStack, Table, Tbody, Td, TableContainer, Thead, Tr, Text, Flex } from '@chakra-ui/react'
import { ACCESS_CONTROL } from 'features/access-control/access-control.i18n'
import { useTranslation } from 'react-i18next'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { useFetchRoles } from 'api/access-control'

export const RolesList = ({ setSelectedRole, selectedRole }) => {
  const { t } = useTranslation()
  const { data: roles } = useFetchRoles()

  return (
    <TableContainer w="100%" borderRadius={'6px'} maxH="300px" overflowY={'auto'} border="1px solid #CBD5E0">
      <Table variant="striped-list" size="sm">
        <Thead position="sticky" top={0}>
          <Tr h={'45px'} bg="#F2F3F4">
            <Td borderRight="1px solid #CBD5E0">{t(`${ACCESS_CONTROL}.roles`)}</Td>
            <Td>{t(`${ACCESS_CONTROL}.actions`)}</Td>
          </Tr>
        </Thead>
        <Tbody>
          {roles?.map(role => {
            return (
              <>
                <Tr
                  minH="45px"
                  {...(selectedRole === role.name && { bg: '#F3F8FF !important' })}
                  // _odd={{ _hover: { cursor: 'pointer', bg: '#F3F8FF' } }}
                >
                  <Td lineHeight="28px" w="50%" borderRight="1px solid #CBD5E0">
                    {role.name}
                  </Td>
                  <Td>
                    <HStack gap="20px">
                      <Flex
                        gap="5px"
                        _hover={{ color: 'brand.600', cursor: 'pointer' }}
                        fontSize={'14px'}
                        color="gray.500"
                        fontWeight={'400'}
                        fontStyle={'normal'}
                        onClick={() => {
                          setSelectedRole(role.name)
                        }}
                      >
                        <BiEditAlt></BiEditAlt>
                        <Text>{t(`${ACCESS_CONTROL}.edit`)}</Text>
                      </Flex>
                      <Flex
                        gap="5px"
                        _hover={{ color: 'brand.600', cursor: 'pointer' }}
                        fontSize={'14px'}
                        color="gray.500"
                        fontWeight={'400'}
                        fontStyle={'normal'}
                      >
                        <BiTrash></BiTrash>
                        <Text>{t(`${ACCESS_CONTROL}.remove`)}</Text>
                      </Flex>
                    </HStack>
                  </Td>
                </Tr>
              </>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
