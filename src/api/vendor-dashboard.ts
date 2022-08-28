import { useClient } from 'utils/auth-context'
import { useQuery } from 'react-query'
import { VendorEntity } from 'types/vendor.types'

export const useVendorCards = () => {
  const client = useClient()

  return useQuery('vendorCards', async () => {
    const response = await client(`vendorCards`, {})

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
