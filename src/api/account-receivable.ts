import { usePaginationQuery } from 'api'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ReceivableTableData } from 'types/receivable.types'
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

const GET_PAGINATED_RECEIVABLE_QUERY_KEY = 'get_paginated_receivable_api_key'
export const usePaginatedAccountReceivables = (queryString: string, pageSize: number) => {
  const { data, ...rest } = usePaginationQuery<ReceivableTableData>(
    [GET_PAGINATED_RECEIVABLE_QUERY_KEY, queryString],
    `account_receivable?${queryString}`,
    pageSize,
  )

  return {
    receivables: data?.data?.arList,
    totalPages: data?.totalCount,
    ...rest,
  }
}

const GET_ALL_RECEIVABLE_QUERY_KEY = 'get_all_receivable_api_key'
export const useGetAllAccountReceivables = (queryString: string) => {
  const client = useClient()

  const { data: receivableData, ...rest } = useQuery([GET_ALL_RECEIVABLE_QUERY_KEY, queryString], async () => {
    const response = await client(`account_receivable?${queryString}`, {})

    return response?.data
  })

  return {
    allReceivables: receivableData?.arList,
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

export const useCheckBatch = (setLoading, loading, paginatedQueryString, withoutPaginatedQueryString) => {
  const [isAPIEnabled, setAPIEnabled] = useState(false)
  const client = useClient()
  const queryClient = useQueryClient()

  return useQuery(
    ['batchCheck'],
    async data => {
      setAPIEnabled(true)
      const response = await client(`batches/progress/2`, {})
      return response?.data
    },
    {
      onSuccess(isBatchProcessingInProgress) {
        if (!isBatchProcessingInProgress) {
          setLoading(false)
          setAPIEnabled(false)
          queryClient.invalidateQueries([GET_PAGINATED_RECEIVABLE_QUERY_KEY, paginatedQueryString])
          queryClient.invalidateQueries([GET_ALL_RECEIVABLE_QUERY_KEY, withoutPaginatedQueryString])
          queryClient.invalidateQueries(ACCONT_RECEIVABLE_API_KEY)
        }
      },
      enabled: loading && isAPIEnabled,
      refetchInterval: 10000,
    },
  )
}
