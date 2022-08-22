import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from './auth-context'
import { orderBy } from 'lodash'
declare global {
  interface Window {
    batchTimer?: any
  }
}

const ACCONT_PAYABLE_API_KEY = 'account-payable'

export const useAccountPayable = () => {
  const client = useClient()

  return useQuery(ACCONT_PAYABLE_API_KEY, async () => {
    const response = await client(`all_workorders`, {})
    const workOrders = orderBy(response?.data?.workOrders || [], ['expectedPaymentDate', 'asc'])
    return { ...response?.data, workOrders }
  })
}

export const useBatchProcessingMutation = () => {
  const client = useClient()
  return useMutation(id => {
    return client(`batches/run`, {
      method: 'POST',
      data: id,
    })
  }, {})
}

export const useCheckBatch = setLoading => {
  const client = useClient()
  const queryClient = useQueryClient()

  return useQuery(
    'batchCheck',
    async () => {
      const response = await client(`batches/progress/1`, {})
      return response?.data
    },
    {
      onSuccess(e) {
        setLoading(e)
        if (e) {
          window.batchTimer = setTimeout(() => {
            queryClient.invalidateQueries('batchCheck')
          }, 6000)
        } else {
          clearTimeout(window.batchTimer)
          queryClient.invalidateQueries(ACCONT_PAYABLE_API_KEY)
        }
      },
      enabled: false,
    },
  )
}
