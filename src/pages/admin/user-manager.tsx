import { Box, HStack, Text } from '@chakra-ui/react'
import { AddUserMadal } from 'features/admin/user-manager/add-user-madal'
import { UserManagerTabel } from 'features/admin/user-manager/user-manager-tabel'

export const UserManager = () => {
  return (
    <Box>
      <HStack h="70px" justifyContent="space-between">
        <Text fontSize="18px" fontWeight={600} color="#4A5568">
          User
        </Text>
        <AddUserMadal />
      </HStack>
      <UserManagerTabel />
    </Box>
  )
}
