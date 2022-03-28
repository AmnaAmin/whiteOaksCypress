import { useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'

export const useProjectCards = () => {
  const client = useClient()

  return useQuery('projectCards', async () => {
    const response = await client(`projectCards`, {})

    return response?.data
  })
}
