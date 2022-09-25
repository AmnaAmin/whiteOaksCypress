import { Box } from '@chakra-ui/react'
import { useRevenuePerformance } from 'api/performance'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import { PerformanceGraphWithUsers } from './revenue-performance-graph'

export const PerformanceTab = () => {
  const { data: performanceChart, isLoading } = useRevenuePerformance()
  console.log('performanceChart', performanceChart)

  return (
    <>
      <Box mt={10} p={0} rounded="13px" flex={1} bg='#F7FAFE' border='1px solid #EAE6E6'>
        <PerformanceGraphWithUsers isLoading={isLoading} chartData={performanceChart || []} />
      </Box>
      <PerformanceInfoCards isLoading={false} />
      <PerformanceTable />
    </>
  )
}
