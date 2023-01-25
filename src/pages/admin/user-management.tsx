import { Button, HStack, useDisclosure, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { EditUserModal } from 'features/user-management/edit-user-modal'
import { UserManagementTable } from 'features/user-management/user-management-table'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'

export const UserManagement = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Card px="12px" py="16px">
      <HStack justifyContent="space-between" mb="16px">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${USER_MANAGEMENT}.table.users`)}
        </Text>
        <Button data-testid="add-user" colorScheme="brand" onClick={onOpen} leftIcon={<BiAddToQueue />}>
          {t(`${USER_MANAGEMENT}.modal.addUser`)}
        </Button>
      </HStack>
      <UserManagementTable />
      {isOpen && <EditUserModal isOpen={isOpen} onClose={onClose} />}
    </Card>
  )
}
