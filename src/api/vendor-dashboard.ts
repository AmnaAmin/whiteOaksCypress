import { useClient } from 'utils/auth-context'
import { useQuery } from 'react-query'
import { VendorEntity } from 'types/vendor.types'
import { usePaginationQuery } from 'api'
import { format, sub } from 'date-fns'

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
  return filterQueryString ? filterQueryString + `&sort=expectedPaymentDate,asc` : 'sort=expectedPaymentDate,asc'
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

export const year = format(sub(new Date(), { months: 0 }), 'yyyy')
console.log('year', year)

export const monthOptionsPaidGraph = [
  { value: 13, label: 'All', year: '-1', month: '-1' },
  { value: 1, label: 'January', year: year, month: '1' },
  { value: 2, label: 'February', year: year, month: '2' },
  { value: 3, label: 'March', year: year, month: '3' },
  { value: 4, label: 'April', year: year, month: '4' },
  { value: 5, label: 'May', year: year, month: '5' },
  { value: 6, label: 'June', year: year, month: '6' },
  { value: 7, label: 'July', year: year, month: '7' },
  { value: 8, label: 'August', year: year, month: '8' },
  { value: 9, label: 'September', year: year, month: '9' },
  { value: 10, label: 'October', year: year, month: '10' },
  { value: 11, label: 'November', year: year, month: '11' },
  { value: 13, label: 'December', year: year, month: '12' },
]
