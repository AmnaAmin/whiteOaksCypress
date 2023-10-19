import { useDisclosure } from '@chakra-ui/react'
import { usePaginationQuery } from 'api'
import { Card } from 'components/card/card'
import { EditUserModal } from 'features/user-management/edit-user-modal'
import { UserManagementTabs } from 'features/user-management/user-management-tabs'
import { useQuery } from 'react-query'
import { Project } from 'types/project.type'
import { useClient } from 'utils/auth-context'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const UserManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('USERMANAGER.READ')
  return (
    <Card px="12px" py="16px">
      <UserManagementTabs onOpenUserModal={onOpen} isReadOnly={isReadOnly} />
      {isOpen && <EditUserModal isOpen={isOpen} onClose={onClose} />}
    </Card>
  )
}
export const USER_MGT_QUERY_KEY = 'userMgt'
export const useUsrMgt = (filterQueryString?: string, page?: number, size: number = 0) => {
  const queryKey = [USER_MGT_QUERY_KEY, filterQueryString]
  const endpoint = `users/list?${filterQueryString || ''}`

  const { data, ...rest } = usePaginationQuery<Array<any>>(queryKey, endpoint, size || 10, { enabled: size > 0 })

  const options =
    data?.data?.map(res => ({
      value: res?.id,
      label: res?.firstName + ' ' + res?.lastName,
      parentId: res?.parentFieldProjectManagerId,
    })) || []
    options.sort((a, b) => a.label.localeCompare(b.label));

  return {
    userMgt: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    options,
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
