import { useQuery } from 'react-query'
import { useClient } from './auth-context'

export const useAccountPayable = () => {
  const client = useClient()

  return useQuery('accountPayable', async () => {
    const response = await client(`all_workorders`, {})

    return response?.data
  })
}
