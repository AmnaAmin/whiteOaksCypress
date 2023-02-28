import { useClient } from 'utils/auth-context'
import { useQuery } from 'react-query'
import { VendorEntity } from 'types/vendor.types'
import { usePaginationQuery } from 'api'

export const useVendorCards = () => {
  const client = useClient()

  return useQuery('vendorCards', async () => {
    const response = await client(`vendor-wo-Cards`, {})

    return response?.data
  })
}

export const useWoByVendorsPerMonth = (vendorId: number) => {
  const client = useClient()

  return useQuery('WoByVendorsPerMonth', async () => {
    const response = await client(`getWoByVendorsPerMonth/${vendorId}`, {})

    return response?.data
  })
}

export const usePaidWOAmountByYearAndMonth = (year: string, month: string) => {
  const client = useClient()
  return useQuery(`paidChart-${month}-${year}`, async () => {
    const response = await client(`project/getPaidWOAmountByYearAndMonth/${year}/${month}`, {})
    return response?.data
  })
}

export const usePaidWOAmountByYearAndMonthTotal = (year: string, month: string) => {
  const client = useClient()
  return useQuery(`paidChartTotal-${month}-${year}`, async () => {
    const response = await client(`project/getPaidWOAmountByYearAndMonthTotal/${year}/${month}`, {})
    return response?.data
  })
}

export const useVendorEntity = (vendorId: number, tabIndex?: number) => {
  const client = useClient()

  return useQuery<VendorEntity>(['vendorEntity', tabIndex], async () => {
    const response = await client(`vendors/${vendorId}`, {})

    return response?.data
  })
}

export const useVendorsPerMonth = (vendorId: number) => {
  const client = useClient()

  return useQuery<any>('vendorsPerMonth', async () => {
    const response = await client(`getWoByVendorsPerMonth/${vendorId}`, {})

    return response?.data
  })
}

export const useVendorSettings = () => {
  const client = useClient()

  return useQuery('account', async () => {
    const response = await client(`account`, {})

    return response?.data
  })
}

export const UPCOMING_PAYMENT_TABLE_QUERY_KEYS = {
  projectId: 'projectId.equals',
  statusLabel: 'statusLabel.contains',
  id: 'id.equals',
  marketName: 'marketName.contains',
  vendorAddress: 'vendorAddress.contains',
  workOrderExpectedCompletionDate: 'workOrderExpectedCompletionDate.equals',
  expectedPaymentDate: 'expectedPaymentDate.equals',
}

export const UPCOMING_PAYMENT_API_KEY = 'upcoming-payment'

const getUpcomingPaymentQueryString = (filterQueryString: string) => {
  return filterQueryString
    ? filterQueryString + '&status.equals=110&paymentType.equals=WO Payment&sort=expectedPaymentDate,asc'
    : 'sort=expectedPaymentDate,asc'
}
type UpcomingPaymentResponse = Array<any>
export const usePaginatedUpcomingPayment = (queryString: string, pageSize: number) => {
  const apiQueryString = getUpcomingPaymentQueryString(queryString)

  const { data, ...rest } = usePaginationQuery<UpcomingPaymentResponse>(
    [UPCOMING_PAYMENT_API_KEY, apiQueryString],
    `all-payables?${apiQueryString}`,
    pageSize,
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
export const useGetAllUpcomingPaymentWorkOrders = (queryString: string) => {
  const client = useClient()
  const apiQueryString = getUpcomingPaymentQueryString(queryString)

  return useQuery(
    [GET_ALL_WORKORDERS_QUERY_KEY, apiQueryString],
    async () => {
      const response = await client(`all-payables?${apiQueryString}`, {})
      return response?.data
    },
    {
      enabled: false,
    },
  )
}
