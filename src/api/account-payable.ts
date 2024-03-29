import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from '../utils/auth-context'
import { usePaginationQuery } from 'api'
declare global {
  interface Window {
    batchTimer?: any
  }
}

export const ACCONT_PAYABLE_API_KEY = 'account-payable'
export const AP_CARDS = 'ap-cards'

export const useAccountPayableCard = ({ userIds }) => {
  const client = useClient()
  const apiQuery = `ap-cards` + (userIds?.length > 0 ? `?userId=${userIds?.join(',')}` : '')
  return useQuery([AP_CARDS, userIds], async () => {
    const response = await client(apiQuery, {})
    return { ...response?.data }
  })
}

const getPayableQueryString = (filterQueryString: string) => {
  let queryString = filterQueryString
  if (filterQueryString?.search('&sort=expectedPaymentDate') < 0) {
    queryString = queryString + `&sort=expectedPaymentDate,asc`
  }
  return queryString
}
export type PayableResponse = Array<any>
export const usePaginatedAccountPayable = (queryString: string, pageSize: number) => {
  const apiQueryString = getPayableQueryString(queryString)
  const onHoldQuerryFilter = apiQueryString.includes('durationCategory.equals=8')

  const { data, ...rest } = usePaginationQuery<PayableResponse>(
    [ACCONT_PAYABLE_API_KEY, apiQueryString],
    `all-payables?onHold.contains=${onHoldQuerryFilter}&${apiQueryString}`,
    pageSize,
    { enabled: pageSize > 0 },
  )

  return {
    workOrders: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
}

const GET_ALL_WORKORDERS_QUERY_KEY = 'all_payable_api_key'
// This hook of getting workorders from backend is only for export button of payable table
export const useGetAllWorkOrders = (queryString: string) => {
  const client = useClient()
  const apiQueryString = getPayableQueryString(queryString)
  const onHoldQuerryFilter = apiQueryString.includes('durationCategory.equals=8')
  return useQuery(
    [GET_ALL_WORKORDERS_QUERY_KEY, apiQueryString],
    async () => {
      const response = await client(`all-payables?onHold.contains=${onHoldQuerryFilter}&${apiQueryString}`, {})
      return response?.data
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

export const useCheckBatch = (queryString, setLoading, fetchBatchResult, refetchInterval, setRefetchInterval) => {
  const client = useClient()
  const queryClient = useQueryClient()
  const apiQueryString = getPayableQueryString(queryString)

  return useQuery(
    ['accountPayableBatchCheck'],
    async data => {
      const response = await client(`batches/progress/1`, {})
      return response?.data
    },
    {
      onSuccess(isBatchProcessingInProgress) {
        if (!isBatchProcessingInProgress) {
          queryClient.invalidateQueries([ACCONT_PAYABLE_API_KEY, apiQueryString])
          queryClient.invalidateQueries(AP_CARDS)
          setRefetchInterval(0)
          setLoading(false)
          fetchBatchResult()
        }
      },
      enabled: refetchInterval > 0,
      refetchInterval: refetchInterval,
    },
  )
}

export const useBatchRun = batchId => {
  const client = useClient()

  return useQuery(
    ['batchRun'],
    async data => {
      const response = await client(`batch-values/batchType/${batchId}`, {})
      return response?.data
    },
    {
      enabled: false,
    },
  )
}
