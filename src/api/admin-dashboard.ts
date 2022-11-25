import { useQuery } from 'react-query'
import { AdminCards } from 'types/admin-dashboard.types'
import { useClient } from 'utils/auth-context'

export const useAdminCards = () => {
  const client = useClient()

  const { data: adminCards, ...rest } = useQuery<AdminCards>(['AdminCards'], async () => {
    const response = await client(`adminCards`, {})

    return response?.data
  })

  return {
    adminCards,
    ...rest,
  }
}

export const useSalesPerMonth = () => {
  const client = useClient()

  const { data: salesPerMonth, ...rest } = useQuery(['salesPerMonth'], async () => {
    const response = await client(`salesGraph`, {})
    return response?.data
  })

  return {
    salesPerMonth,
    ...rest,
  }
}

export const mapRevenueVsProfitToGraphData = revenueVsProfit => {
  const graphData = [] as any
  /* group data by project managers */
  const groupByProjectManager = revenueVsProfit?.reduce((r, a) => {
    r[a.projectManager] = [...(r[a.projectManager] || []), a]
    return r
  }, {})
  for (const [key] of Object?.entries(groupByProjectManager)) {
    const graphValue = {}
    /* Aggregate Revenue and Profit */
    graphValue['revenue'] = [
      ...groupByProjectManager[key]?.map(function (o) {
        return o.revenue
      }),
    ].reduce((a, b) => a + b, 0)
    graphValue['profit'] = [
      ...groupByProjectManager[key]?.map(function (o) {
        return o.profit
      }),
    ].reduce((a, b) => a + b, 0)
    graphValue['projectManager'] = key
    graphData?.push(graphValue)
  }
  return graphData
}

export const useRevenueVsProfit = () => {
  const client = useClient()

  const { data: revenueProfitGraph, ...rest } = useQuery(['revenueVsProfit'], async () => {
    const response = await client(`revenue_vs_profit`, {})

    return response?.data
  })
  return {
    revenueProfitGraph,
    ...rest,
  }
}

export const useRevenuePerClient = () => {
  const client = useClient()

  const { data: revenuePerClient, ...rest } = useQuery(['revenuePerClient'], async () => {
    const response = await client(`revenuePerClient`, {})

    return response?.data
  })
  return {
    revenuePerClient,
    ...rest,
  }
}

export const mapRevenueClientToGraphData = revenuePerClient => {
  const graphData = [] as any
  /* group data by clients */
  const groupByClient = revenuePerClient?.reduce((r, a) => {
    r[a.clientName] = [...(r[a.clientName] || []), a]
    return r
  }, {})
  for (const [key] of Object?.entries(groupByClient)) {
    const graphValue = {}
    /* Aggregate Amount */

    graphValue['amount'] = [
      ...groupByClient[key]?.map(function (o) {
        return o.amount
      }),
    ].reduce((a, b) => a + b, 0)

    graphValue['clientName'] = key
    graphData?.push(graphValue)
  }
  return graphData
}
