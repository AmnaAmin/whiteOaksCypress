import { Box, HStack, Text } from '@chakra-ui/react'
import { EditUserModal } from 'features/user-management/edit-user-modal'
import { UserManagementTable } from 'features/user-management/user-management-table'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useTranslation } from 'react-i18next'

export const UserManagement = () => {
  const { t } = useTranslation()
  return (
    <Box>
      <HStack h="70px" justifyContent="space-between">
        <Text fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${USER_MANAGEMENT}.table.user`)}
        </Text>
        <EditUserModal />
      </HStack>
      <UserManagementTable />
    </Box>
  )
}
