import { Box, HStack, Text } from '@chakra-ui/react'
import { AddUserMadal } from 'features/admin/user-manager/add-user-madal'
import { UserManagementTabel } from 'features/admin/user-manager/user-management-tabel'
import { useTranslation } from 'react-i18next'

export const UserManagement = () => {
  const { t } = useTranslation()
  return (
    <Box>
      <HStack h="70px" justifyContent="space-between">
        <Text fontSize="18px" fontWeight={600} color="#4A5568">
          {t('userManagementTranslation.userManagementTable.user')}
        </Text>
        <AddUserMadal />
      </HStack>
      <UserManagementTabel />
    </Box>
  )
}
