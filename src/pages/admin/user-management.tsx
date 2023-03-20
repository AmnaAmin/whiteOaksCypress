import { Button, HStack, useDisclosure, Text } from '@chakra-ui/react'
import { usePaginationQuery } from 'api'
import { Card } from 'components/card/card'
import { EditUserModal } from 'features/user-management/edit-user-modal'
import { UserManagementTable } from 'features/user-management/user-management-table'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { useQuery } from 'react-query'
import { Project } from 'types/project.type'
import { useClient } from 'utils/auth-context'

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
export const USER_MGT_QUERY_KEY = 'userMgt'
export const useUsrMgt = (filterQueryString?: string, page?: number, size: number = 0) => {
  const queryKey = [USER_MGT_QUERY_KEY, filterQueryString]
  const endpoint = `users/list?${filterQueryString || ''}`

  const { data, ...rest } = usePaginationQuery<Array<any>>(queryKey, endpoint, size || 10, { enabled: size > 0 })

  return {
    userMgt: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
}

export const ALL_USER_MGT_QUERY_KEY = 'all_user_managements'
export const useGetAllUserMgt = (filterQueryString: string) => {
  const client = useClient()

  const { data, ...rest } = useQuery<Array<Project>>(
    ALL_USER_MGT_QUERY_KEY,
    async () => {
      const response = await client(`users/list?${filterQueryString}`, {})

      return response?.data
    },
    {
      enabled: false,
    },
  )

  return {
    allProjects: data,
    ...rest,
  }
}
