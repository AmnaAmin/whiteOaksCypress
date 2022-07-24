import { useQuery } from 'react-query'
import { useClient } from './auth-context'
// import { Clients } from 'types/client.type'

export const useClients = () => {
  const client = useClient()

  return useQuery('client', async () => {
    const response = await client(`clients?page=0&size=10000000&sort=id,asc`, {})

    return response?.data
  })
}
