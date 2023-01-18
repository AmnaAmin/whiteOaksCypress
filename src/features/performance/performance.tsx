import { Box } from '@chakra-ui/react'
import { MonthOption, usePerformance, useRevenuePerformance } from 'api/performance'
import { format, subMonths } from 'date-fns'
import { flatten, last } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { getLastQuarterByDate, getQuarterByDate, getQuarterByMonth, months, monthsShort } from 'utils/date-time-utils'
import { PerformanceFilters } from './performance-filters'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import { PerformanceGraphWithUsers } from './revenue-performance-graph'
import { enUS } from 'date-fns/locale'

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

export const PerformanceTab = () => {
  const [yearFilter, setYearFilter] = useState(undefined)
  const [graphData, setGraphData] = useState<GraphData>()
  const [monthOption, setMonthOption] = useState(MonthOption[0])
  const [fpmOption, setFpmOption] = useState<any>([])
  const {
    data: performanceChart = [],
    isLoading,
    refetch: refetchGraph,
    isFetching,
  } = useRevenuePerformance(yearFilter)
  const { monthFilter } = useMapMonths(monthOption)
  const {
    data: performance,
    isLoading: isPerformanceTableLoading,
    refetch: refetchFpmQuota,
  } = usePerformance({ yearFilter, months: monthFilter, fpmIds: fpmOption?.map(f => f?.value)?.join(',') })

  useEffect(() => {
    if (yearFilter) {
      refetchGraph()
    }
  }, [yearFilter])

  useEffect(() => {
    if (!!yearFilter || !!monthOption || !!fpmOption) {
      refetchFpmQuota()
    }
  }, [yearFilter, monthOption, fpmOption])

  const data = useMemo(
    () =>
      flatten(
        months?.map((month, monthIndex) => {
          const monthExistsInChart = Object?.keys(performanceChart)?.find(months => months === month)
          let nameMonthData

          if (monthExistsInChart) {
            nameMonthData = performanceChart?.[month]
            const graphs = Object?.keys(nameMonthData)?.map((nameKey, index) => {
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
            let newgraphs = graphs?.map((n, i) => ({
              ...n,
              centerMonth: Math.floor(graphs?.length / 2) === i ? n?.month : undefined,
            }))
            return newgraphs
          }

          return {
            month: monthsShort[month],
            centerMonth: monthsShort[month],
            quarter: getQuarterByMonth(monthIndex),
            username: '',
            userId: 0,
            Bonus: 0,
            Profit: 0,
            Revenue: 0,
          }
        }),
      ),
    [performanceChart],
  )

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
  }, [data])

  return (
    <>
      <PerformanceFilters
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        monthOption={monthOption}
        setMonthOption={setMonthOption}
        filterGraphData={filterGraphData}
        fpmOption={fpmOption}
        setFpmOption={setFpmOption}
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
      <PerformanceInfoCards isPerformanceLoading={isPerformanceTableLoading} performance={performance} />
      <PerformanceTable performance={performance} isPerformanceTableLoading={isPerformanceTableLoading} />
    </>
  )
}
