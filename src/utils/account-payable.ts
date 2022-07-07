import { useQuery } from 'react-query'
import { useClient } from './auth-context'

declare global {
  interface Window {
    batchTimer?: any
  }
}

export const useAccountPayable = () => {
  const client = useClient()

  return useQuery('accountPayable', async () => {
    const response = await client(`all_workorders`, {})

    return response?.data
  })
}
