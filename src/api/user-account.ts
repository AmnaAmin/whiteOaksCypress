import { useClient } from 'utils/auth-context'
import { useMutation, useQuery } from 'react-query'

export const usePasswordUpdateMutation = () => {
  const client = useClient()

  return useMutation((payload: { currentPassword: string; newPassword: string }) => {
    return client('account/change-password', {
      data: payload,
    })
  })
}

export const useAccountData = () => {
  const client = useClient()

  const { data, ...rest } = useQuery('acc', async () => {
    const response = await client(`account`, {})

    return response?.data
  })

  return {
    data,
    ...rest,
  }
}
