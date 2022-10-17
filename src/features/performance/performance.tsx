import { Box } from '@chakra-ui/react'
import { useRevenuePerformance } from 'api/performance'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import { PerformanceGraphWithUsers } from './revenue-performance-graph'

export const PerformanceTab = () => {
  const { data: performanceChart, isLoading } = useRevenuePerformance()

  return (
    <>
      <Box mt={10} p={0} rounded="13px" flex={1}>
        <PerformanceGraphWithUsers isLoading={isLoading} chartData={performanceChart || []} />
      </Box>
      <PerformanceInfoCards isLoading={false} />
      <PerformanceTable />
    </>
  )
}
