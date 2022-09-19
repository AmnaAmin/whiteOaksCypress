import { useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'

export const useRevenuePerformance = () => {
  const client = useClient()

  return useQuery('performance', async () => {
    const response = await client(`fpm-quota-chart/revenue-profit`, {})
    return response?.data
  })
}

  export const usePerformance = () => {
    const client = useClient()

    return useQuery(
      'performance-list',
      async () => {
        const response = await client(`fpm-quota`, {})
        return response?.data
      },
    )
  }
