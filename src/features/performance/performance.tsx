import { Card } from 'components/card/card'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import RevenuePerformanceGraph from './revenue-performance-graph'

export const PerformanceTab = () => {
  return (
    <>
      <Card mt={5} p={0} rounded="13px" flex={1} bg="#FDFDFF">
        <RevenuePerformanceGraph />
      </Card>
      <PerformanceInfoCards isLoading={false}  />
      <PerformanceTable />
    </>
  )
}
