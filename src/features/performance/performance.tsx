import { Box } from '@chakra-ui/react'
import { useRevenuePerformance } from 'api/performance'
import { useEffect, useState } from 'react'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import { PerformanceGraphWithUsers } from './revenue-performance-graph'

export const PerformanceTab = () => {
  const [yearFilter, setYearFilter] = useState(null)
  const { data: performanceChart, isLoading, refetch, isFetching } = useRevenuePerformance(yearFilter)

  useEffect(() => {
    if (yearFilter) {
      refetch()
    }
  }, [yearFilter])

  return (
    <>
      <Box mt={10} p={0} rounded="13px" flex={1}>
        <PerformanceGraphWithUsers
          isFetching={isFetching}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          isLoading={isLoading}
          chartData={performanceChart || []}
        />
      </Box>
      <PerformanceInfoCards isLoading={isLoading} yearFilter={yearFilter} />
      <PerformanceTable yearFilter={yearFilter} />
    </>
  )
}
