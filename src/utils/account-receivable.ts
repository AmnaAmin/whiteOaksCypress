import { useMutation, useQuery } from 'react-query'
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
