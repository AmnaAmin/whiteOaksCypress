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

export const usePCRecievable = ({ userIds }) => {
  const client = useClient()
  const apiQuery = `account_receivable` + (userIds?.length > 0 ? `?userId=${userIds?.join(',')}` : '')
  const { data: receivableData, ...rest } = useQuery([ACCONT_RECEIVABLE_API_KEY, userIds], async () => {
    const response = await client(apiQuery, {})

    return response?.data
  })

  return {
    receivableData,
    ...rest,
  }
}
export const ACCOUNT_CARDS_RECEIVABLE_API_KEY = 'account-receivable-cards'

export const useRecievableCards = ({ userIds }) => {
  const client = useClient()
  const userIdsStr = userIds?.length > 0 ? `&directReportUserOnly.equals=${userIds?.join(',')}` : ''
  const apiQuery = `account-receivables?page=0&size=0&sort=id,desc` + userIdsStr
  const { data: receivableData, ...rest } = useQuery([ACCOUNT_CARDS_RECEIVABLE_API_KEY, userIds], async () => {
    const response = await client(apiQuery, {})

    return response?.data
  })

  return {
    receivableData,
    ...rest,
  }
}

export const GET_PAGINATED_RECEIVABLE_QUERY_KEY = 'get_paginated_receivable_api_key'
export const usePaginatedAccountReceivables = (queryString: string, pageSize: number) => {
  const { data, ...rest } = usePaginationQuery<ReceivableTableData>(
    [GET_PAGINATED_RECEIVABLE_QUERY_KEY, queryString],
    `account-receivables?${queryString}`,
    pageSize,
    { enabled: pageSize > 0 },
  )

  return {
    receivables: data?.data?.arList,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
}

const GET_ALL_RECEIVABLE_QUERY_KEY = 'get_all_receivable_api_key'
export const useGetAllAccountReceivables = (queryString: string) => {
  const client = useClient()

  return useQuery(
    [GET_ALL_RECEIVABLE_QUERY_KEY, queryString],
    async () => {
      const response = await client(`account-receivables?${queryString}`, {})

      return response?.data?.arList
    },
    {
      enabled: false,
    },
  )
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

export const useCheckBatch = (setLoading, loading, paginatedQueryString) => {
  const [isAPIEnabled, setAPIEnabled] = useState(false)
  const [batchResponse, setBatchResponse] = useState()

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
      async onSuccess(isBatchProcessingInProgress) {
        if (!isBatchProcessingInProgress) {
          setLoading(false)
          setAPIEnabled(false)
          queryClient.invalidateQueries([GET_PAGINATED_RECEIVABLE_QUERY_KEY, paginatedQueryString])
          queryClient.invalidateQueries(ACCONT_RECEIVABLE_API_KEY)
          queryClient.invalidateQueries(ACCOUNT_CARDS_RECEIVABLE_API_KEY)
          

          const response = await client(`batch-values/batchType/940`, {})
          setBatchResponse(response?.data)
          return response?.data
        }
        return batchResponse
      },
      enabled: loading && isAPIEnabled,
      refetchInterval: 10000,
    },
  )
}

export const useBatchRun = (batchId, paginatedQueryString, refetchInterval) => {
  const client = useClient()
  const queryClient = useQueryClient()

  return useQuery(
    ['batchRun'],
    async data => {
      const response = await client(`batch-values/batchType/${batchId}`, {})
      return response?.data
    },
    {
      async onSuccess(isBatchProcessingInProgress) {
        if (!isBatchProcessingInProgress) {
          queryClient.invalidateQueries([GET_PAGINATED_RECEIVABLE_QUERY_KEY, paginatedQueryString])
          queryClient.invalidateQueries(ACCONT_RECEIVABLE_API_KEY)
          queryClient.invalidateQueries(ACCOUNT_CARDS_RECEIVABLE_API_KEY)
        }
      },
      refetchInterval: refetchInterval,
    },
  )
}
