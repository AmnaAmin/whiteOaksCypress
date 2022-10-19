import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from '../utils/auth-context'
import { orderBy } from 'lodash'
import { useState } from 'react'
import { usePaginationQuery } from 'api'
declare global {
  interface Window {
    batchTimer?: any
  }
}

export const ACCONT_PAYABLE_API_KEY = 'account-payable'

export const useAccountPayable = () => {
  const client = useClient()

  return useQuery(ACCONT_PAYABLE_API_KEY, async () => {
    const response = await client(`all_workorders`, {})
    const workOrders = orderBy(response?.data?.workOrders || [], ['expectedPaymentDate', 'asc'])
    return { ...response?.data, workOrders }
  })
}

const getPayableQueryString = (filterQueryString: string) => {
  return filterQueryString ? filterQueryString + `&sort=expectedPaymentDate,asc` : 'sort=expectedPaymentDate,asc'
}
type PayableResponse = { workOrders: Array<any> }
export const usePaginatedAccountPayable = (queryString: string, pageSize: number) => {
  const apiQueryString = getPayableQueryString(queryString)

  const { data, ...rest } = usePaginationQuery<PayableResponse>(
    [ACCONT_PAYABLE_API_KEY, apiQueryString],
    `all-payables?${apiQueryString}`,
    pageSize,
  )

  return {
    workOrders: data?.data?.workOrders,
    totalPages: data?.totalCount,
    ...rest,
  }
}

const GET_ALL_WORKORDERS_QUERY_KEY = 'all_payable_api_key'
// This hook of getting workorders from backend is only for export button of payable table
export const useGetAllWorkOrders = (queryString: string) => {
  const client = useClient()
  const apiQueryString = getPayableQueryString(queryString)

  return useQuery(
    [GET_ALL_WORKORDERS_QUERY_KEY, apiQueryString],
    async () => {
      const response = await client(`all-payables?${apiQueryString}`, {})
      return response?.data?.workOrders
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

export const useCheckBatch = (setLoading, loading, queryString) => {
  const [isAPIEnabled, setAPIEnabled] = useState(false)
  const client = useClient()
  const queryClient = useQueryClient()
  const apiQueryString = getPayableQueryString(queryString)

  return useQuery(
    ['accountPayableBatchCheck'],
    async data => {
      setAPIEnabled(true)
      const response = await client(`batches/progress/1`, {})
      return response?.data
    },
    {
      onSuccess(isBatchProcessingInProgress) {
        if (!isBatchProcessingInProgress) {
          setLoading(false)
          setAPIEnabled(false)

          queryClient.invalidateQueries([ACCONT_PAYABLE_API_KEY, apiQueryString])
          queryClient.invalidateQueries([GET_ALL_WORKORDERS_QUERY_KEY, apiQueryString])
          queryClient.invalidateQueries(ACCONT_PAYABLE_API_KEY)
        }
      },
      enabled: loading && isAPIEnabled,
      refetchInterval: 10000,
    },
  )
}
