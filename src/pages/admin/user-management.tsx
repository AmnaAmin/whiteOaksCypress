import { Box, HStack, Text } from '@chakra-ui/react'
import { EditUserModal } from 'features/user-manager/edit-user-modal'
import { UserManagementTable } from 'features/user-manager/user-management-table'
import { useTranslation } from 'react-i18next'

export const UserManagement = () => {
  const { t } = useTranslation()
  return (
    <Box>
      <HStack h="70px" justifyContent="space-between">
        <Text fontSize="18px" fontWeight={600} color="#4A5568">
          {t('userManagement.managementTable.user')}
        </Text>
        <EditUserModal />
      </HStack>
      <UserManagementTable />
    </Box>
  )
}
