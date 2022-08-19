import { useQuery } from 'react-query'
import { ProjectWorkOrderType } from 'types/project.type'
import { useClient } from './auth-context'
import { orderBy } from 'lodash'
declare global {
  interface Window {
    batchTimer?: any
  }
}

export const useAccountPayable = () => {
  const client = useClient()

  return useQuery('accountPayable', async () => {
    const response = await client(`all_workorders`, {})
    const workOrders = orderBy(response?.data?.workOrders || [], ['id', 'asc'])
    return { ...response?.data, workOrders }
  })
}
