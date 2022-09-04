import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from '../utils/auth-context'

declare global {
  interface Window {
    batchTimer?: any
  }
}

export const ACCONT_RECEIVABLE_API_KEY = 'account-receivable'

export const usePCRecievable = () => {
  const client = useClient()

  const { data: receivableData, ...rest } = useQuery(ACCONT_RECEIVABLE_API_KEY, async () => {
    const response = await client(`account_receivable`, {})

    return response?.data
  })

  return {
    receivableData,
    ...rest,
  }
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

export const useCheckBatch = (apiNumber, setLoading, loading) => {
  const [isAPIEnabled, setAPIEnabled] = useState(false)
  const client = useClient()
  const queryClient = useQueryClient()

  return useQuery(
    ['batchCheck'],
    async data => {
      setAPIEnabled(true)
      const response = await client(`batches/progress/${apiNumber}`, {})
      return response?.data
    },
    {
      onSuccess(isBatchProcessingInProgress) {
        if (!isBatchProcessingInProgress) {
          setLoading(false)
          setAPIEnabled(false)
          queryClient.invalidateQueries(ACCONT_RECEIVABLE_API_KEY)
        }
      },
      enabled: loading && isAPIEnabled,
      refetchInterval: 10000,
    },
  )
}
