import { Box } from '@chakra-ui/react'
import { MonthOption, usePerformance, useRevenuePerformance } from 'api/performance'
import { format, subMonths } from 'date-fns'
import _, { last } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { getLastQuarterByDate, getQuarterByDate, getQuarterByMonth, months, monthsShort } from 'utils/date-time-utils'
import { PerformanceFilters } from './performance-filters'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import { PerformanceGraphWithUsers } from './revenue-performance-graph'
import { enUS } from 'date-fns/locale'
import { Card } from 'components/card/card'
import { useFPMs } from 'api/pc-projects'
import { getQueryString } from 'utils/filters-query-utils'
import { SelectOption } from 'types/transaction.type'

type GraphData = {
  username: string
  month: any
  Revenue: any
  Profit: any
}[]

const useMapMonths = monthOption => {
  var monthFilter

  const quarters = [
    {
      key: 1,
      value: '1,2,3',
    },
    {
      key: 2,
      value: '4,5,6',
    },
    { key: 3, value: '7,8,9' },
    { key: 4, value: '10,11,12' },
  ]

  const currentMonth = new Date().getMonth()
  const currentQuarter = getQuarterByDate()
  const lastQuarter = getLastQuarterByDate()

  if (monthOption?.value === 'thisMonth') {
    monthFilter = currentMonth + 1 // first month starts with 1.
  } else if (monthOption?.value === 'lastMonth') {
    monthFilter = currentMonth === 0 ? 12 : currentMonth
  } else if (monthOption?.value === 'currentQuarter') {
    monthFilter = quarters.find(q => q.key === currentQuarter)?.value
  } else if (monthOption?.value === 'pastQuarter') {
    const lq = lastQuarter !== 0 ? lastQuarter : 4
    monthFilter = quarters.find(q => q.key === lq)?.value
  }
  return {
    monthFilter,
  }
}
type FPMMonthlyData = {
  username: string
  month: any
  userId: number
  quarter: number
  Revenue: string | number
  Profit: string | number
}
export const PerformanceTab = () => {
  const [yearFilter, setYearFilter] = useState(undefined)
  const [graphData, setGraphData] = useState<GraphData>()
  const [monthOption, setMonthOption] = useState(MonthOption[0])
  const [fpmOption, setFpmOption] = useState<Array<SelectOption | null>>([])
  const [defaultToTopFive, setDefaultToTopFive] = useState<boolean>(false)
  const [fpmFilter, setFpmFilter] = useState<Array<SelectOption | null>>()
  const {
    data: performanceChart = [],
    isLoading,
    refetch: refetchGraph,
    isFetching,
  } = useRevenuePerformance(yearFilter)
  const { monthFilter } = useMapMonths(monthOption)
  const [fpmPerformanceData, setFPMPerformanceData] = useState<Array<FPMMonthlyData> | null>()
  const { fieldProjectManagerOptions } = useFPMs()

  // create query when year/month or fpms filter change
  const queryString = useMemo(() => {
    const queryParams = {
      year: yearFilter,
      months: monthFilter,
      fpmIds: fpmFilter?.map(f => f?.value)?.join(','),
    }
    return getQueryString(queryParams)
  }, [yearFilter, monthFilter, fpmFilter])

  const {
    data: performance,
    fpmsOrderedByRevenue,
    isLoading: isPerformanceTableLoading,
    isFetching: isPerformanceTableFetching,
    refetch: refetchFpmQuota,
  } = usePerformance(queryString)

  useEffect(() => {
    if (yearFilter) {
      refetchGraph()
    }
  }, [yearFilter])

  useEffect(() => {
    if (queryString) {
      refetchFpmQuota()
    }
  }, [queryString])

  /*
   * When Performance is fetched, we check if top 5 fpm by revenue should be preselelcted in filter by.
   * In all cases other than 'This Month' and 'Last Month' top 5 fpms are preselected.
   * UniqueBy is applied because single FPM can have top revenues in more than one month.
   * Indicator to show default is set to 'false'. So user can further select/unselect FPMs and filter accordingly.
   * In cases when user select/unselect FPM or This Month and Last Month is selected the complete performance list is displayed in Table.
   */

  useEffect(() => {
    if (defaultToTopFive) {
      const topFpmByRevenue = fpmsOrderedByRevenue.slice(0, 5)
      const selectedFpm =
        _.uniqBy(
          topFpmByRevenue?.map(fpm => ({
            value: fpm?.userId,
            label: fpm?.name,
          })),
          'value',
        ) || []

      setFpmOption(selectedFpm)
      setFPMPerformanceData(topFpmByRevenue)
      setDefaultToTopFive(false)
    } else {
      setFPMPerformanceData(performance)
    }
  }, [performance])

  const data = useMemo(() => {
    var graphs = [] as Array<FPMMonthlyData>
    months?.forEach((month, monthIndex) => {
      const monthExistsInChart = Object?.keys(performanceChart)?.find(months => months === month)
      let nameMonthData
      var userMonthData = null as Array<FPMMonthlyData> | null
      if (monthExistsInChart) {
        nameMonthData = performanceChart?.[month]
        userMonthData = Object?.keys(nameMonthData)?.map((nameKey, index) => {
          const [firstName, lastName, ...userId] = `${nameKey}`.split('_')
          return {
            username: `${firstName} ${lastName}`,
            month: monthsShort[month],
            userId: Number(last(userId)),
            quarter: getQuarterByMonth(monthIndex),
            Revenue: nameMonthData[nameKey]?.revenue,
            Profit: nameMonthData[nameKey]?.profit,
          }
        })
        graphs.push(...userMonthData)
      }
    })
    return graphs
  }, [performanceChart])

  const filterGraphData = (selectedFpm, monthOption) => {
    let selectedMonth, selectedQuater

    // Checks if this month is selected, then returns month in the short form like Jan, Feb
    if (monthOption?.label === 'This Month') {
      selectedMonth = format(new Date(), 'LLL', { locale: enUS })
    }
    // Checks if last month is selected, then returns month in the short form like Jan, Feb
    if (monthOption?.label === 'Last Month') {
      selectedMonth = format(subMonths(new Date(), 1), 'LLL', { locale: enUS })
    }
    // Checks if current quarter is selected, then returns months for that quarter
    if (monthOption?.label === 'Current Quarter') {
      selectedQuater = getQuarterByDate()
    }
    // Checks if past quarter is selected, then returns months for that quarter
    if (monthOption?.label === 'Past Quarter') {
      selectedQuater = getLastQuarterByDate() !== 0 ? getLastQuarterByDate() : 4
    }

    selectedFpm = selectedFpm?.map(n => n?.value)
    const finalGraphData = data?.filter(
      a =>
        (!selectedMonth || a?.month === selectedMonth) &&
        (!selectedQuater || a?.quarter === selectedQuater) &&
        (!selectedFpm?.length || selectedFpm?.includes(a?.userId)),
    )
    setGraphData(finalGraphData)
  }

  useEffect(() => {
    filterGraphData(fpmOption, monthOption)
  }, [data, fpmOption])

  return (
    <Box pb="2">
      <PerformanceFilters
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        monthOption={monthOption}
        setMonthOption={setMonthOption}
        filterGraphData={filterGraphData}
        fpmOption={fpmOption}
        setFpmOption={setFpmOption}
        fieldProjectManagerOptions={fieldProjectManagerOptions}
        setDefaultToTopFive={setDefaultToTopFive}
        setFpmFilter={setFpmFilter}
      />
      <Box p={0} rounded="13px" flex={1}>
        <PerformanceGraphWithUsers
          isFetching={isFetching}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          isLoading={isLoading}
          monthOption={monthOption}
          graphData={graphData || []}
        />
      </Box>
      <PerformanceInfoCards
        isPerformanceLoading={isPerformanceTableLoading || isPerformanceTableFetching}
        performance={fpmPerformanceData}
      />
      <Card px="12px" py="16px">
        <PerformanceTable
          performance={fpmPerformanceData}
          isPerformanceTableLoading={isPerformanceTableLoading || isPerformanceTableFetching}
        />
      </Card>
    </Box>
  )
}
