import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from './auth-context'

export const usePCReveviable = () => {
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
      console.log('checking in muatiaon', id)

      return client(`batches/run`, {
        method: 'POST',
        data: id,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('receivable')
      },
    },
  )
}

export const useCheckBatch = () => {
  const client = useClient()

  const { isLoading } = useQuery('batchCheck', async () => {
    const response = await client(`batches/progress/2`, {})

    return response?.data
  })

  return {
    isLoading,
  }
}
