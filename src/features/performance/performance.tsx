import { useRevenuePerformance } from 'api/performance'
import { Card } from 'components/card/card'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import { PerformanceGraphWithUsers } from './revenue-performance-graph'

export const PerformanceTab = () => {
  const { data: performanceChart} = useRevenuePerformance()
  console.log('performanceChart', performanceChart)

  return (
    <>
      <Card mt={5} p={0} rounded="13px" flex={1} bg="#FDFDFF">
        <PerformanceGraphWithUsers isLoading={false} chartData={performanceChart || []}/>
      </Card>
      <PerformanceInfoCards isLoading={false}  />
      <PerformanceTable />
    </>
  )
}
