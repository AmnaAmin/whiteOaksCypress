import { HStack, Table, Tbody, Td, TableContainer, Thead, Tr, Text, Flex, useDisclosure } from '@chakra-ui/react'
import { ACCESS_CONTROL } from 'features/access-control/access-control.i18n'
import { useTranslation } from 'react-i18next'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { useDeleteRole, useFetchRoles } from 'api/access-control'
import { ConfirmationBox } from 'components/Confirmation'

export const RolesList = ({ setSelectedRole, selectedRole, allowEdit }) => {
  const { t } = useTranslation()
  const { data: roles } = useFetchRoles()
  const { isOpen: isOpenDeleteModal, onClose: onCloseDeleteModal, onOpen: onOpenDeleteModal } = useDisclosure()
  const { mutate: deleteRole } = useDeleteRole()

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
                <Tr minH="45px" {...(selectedRole === role.name && { bg: '#F3F8FF !important' })}>
                  <Td lineHeight="28px" w="50%" borderRight="1px solid #CBD5E0">
                    {role.name}
                  </Td>
                  <Td>
                    <HStack gap="20px">
                      <Flex
                        gap="5px"
                        _hover={{ color: 'brand.600', cursor: 'pointer' }}
                        fontSize={'14px'}
                        data-testid={'edit-' + role.name}
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
                      {allowEdit && (
                        <Flex
                          gap="5px"
                          _hover={{ color: 'brand.600', cursor: 'pointer' }}
                          fontSize={'14px'}
                          data-testid={'remove-' + role.name}
                          color="gray.500"
                          fontWeight={'400'}
                          fontStyle={'normal'}
                          onClick={() => {
                            setSelectedRole(role.name)
                            onOpenDeleteModal()
                          }}
                        >
                          <BiTrash></BiTrash>
                          <Text>{t(`${ACCESS_CONTROL}.remove`)}</Text>
                        </Flex>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              </>
            )
          })}
        </Tbody>
        <ConfirmationBox
          title={t(`${ACCESS_CONTROL}.deleteModal`)}
          content={t(`${ACCESS_CONTROL}.deleteRoleContent`)}
          isOpen={!!selectedRole && isOpenDeleteModal}
          onClose={onCloseDeleteModal}
          isLoading={false}
          onConfirm={() => {
            deleteRole(selectedRole)
            onCloseDeleteModal()
          }}
          showNoButton={true}
        />
      </Table>
    </TableContainer>
  )
}
