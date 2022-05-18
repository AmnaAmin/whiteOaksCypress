import { useQuery } from 'react-query'
import { useClient } from './auth-context'

export const usePcClients = () => {
  const client = useClient()

  return useQuery('projectCards', async () => {
    const response = await client(`clients?page=0&size=10000000&sort=id,asc`, {})

    return response?.data
  })
}
