import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from './auth-context'

declare global {
  interface Window {
    batchTimer?: any
  }
}

export const usePCRecievable = () => {
  const client = useClient()

  const { data: receivableData, ...rest } = useQuery(['receivable'], async () => {
    const response = await client(`account_receivable`, {})

    return response?.data
  })

  return {
    receivableData,
    ...rest,
  }
}

export const useReveviableRowData = () => {
  const client = useClient()

  return useMutation(id => {
    return client(`projects/${id}`, {
      method: 'GET',
    })
  })
}

export const useBatchProcessing = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation(
    id => {
      return client(`batches/run`, {
        method: 'POST',
        data: id,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('batchCheck')
      },
    },
  )
}

export const useCheckBatch = (setLoading, apiNumber) => {
  const client = useClient()
  const queryClient = useQueryClient()

  const { isLoading } = useQuery(
    'batchCheck',
    async () => {
      const response = await client(`batches/progress/${apiNumber}`, {})
      return response?.data
    },
    {
      onSuccess(e) {
        setLoading(e)
        if (e) {
          window.batchTimer = setTimeout(() => {
            queryClient.invalidateQueries('batchCheck')
          }, 60000)
        } else {
          clearTimeout(window.batchTimer)
          queryClient.invalidateQueries('receivable')
          queryClient.invalidateQueries('accountPayable')
        }
      },
    },
  )

  return {
    isLoading,
  }
}
