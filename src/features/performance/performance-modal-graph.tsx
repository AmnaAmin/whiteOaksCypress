import { Box, Center, Flex, FormLabel, HStack, Spinner } from '@chakra-ui/react'
import { MonthOption } from 'api/performance'
import ReactSelect from 'components/form/react-select'
import { format, subMonths } from 'date-fns'
import { enUS } from 'date-fns/locale'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import { getLastQuarterByDate, getQuarterByDate, getQuarterByMonth, months, monthsShort } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'
import { PERFORMANCE } from './performance.i18n'

type GraphData = {
  month: any
  Revenue: any
  Bonus: any
  Profit: any
}[]

const PerformanceGraph: React.FC<{ chartData?: any; isLoading: boolean; yearFilter: number | null; setYearFilter }> = ({
  chartData = [],
  isLoading,
  yearFilter,
  setYearFilter,
}) => {
  const [monthOption, setMonthOption] = useState(MonthOption[0])
  const [graphData, setGraphData] = useState<GraphData>()
  const vendors = [chartData?.chart]
  const { t } = useTranslation()

  const vendorData = useMemo(
    () =>
      months.map((key, monthIndex) => {
        const monthExistsInChart =
          chartData !== undefined && vendors?.[0] && Object.keys(vendors[0])?.find(months => months === key)
        let nameMonthData
        if (monthExistsInChart) {
          nameMonthData = chartData?.chart[key]
        }
        return {
          month: monthsShort[key],
          Bonus: nameMonthData?.bonus,
          Profit: nameMonthData?.profit,
          Revenue: nameMonthData?.revenue,
          quarter: getQuarterByMonth(monthIndex),
        }
      }),
    [chartData],
  )

  useEffect(() => {
    filterGraphData(monthOption)
  }, [vendorData])

  const getMonthValue = monthOption => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const isCurrentYearData = yearFilter === currentYear || !yearFilter
    const isPastYearData = yearFilter === currentYear - 1

    setMonthOption(monthOption)

    if (
      ['thisMonth', 'currentQuarter', 'currentYear'].includes(monthOption?.value) ||
      (monthOption?.label === 'Last Month' && currentMonth !== 0) ||
      (monthOption?.label === 'Past Quarter' && ![0, 1, 2].includes(currentMonth))
    ) {
      if (isCurrentYearData) {
        filterGraphData(monthOption)
      } else {
        setYearFilter(currentYear)
      }
    }

    if (
      monthOption?.label === 'Last Year' ||
      (monthOption?.label === 'Last Month' && currentMonth === 0) ||
      (monthOption?.label === 'Past Quarter' && [0, 1, 2].includes(currentMonth))
    ) {
      if (isPastYearData) {
        filterGraphData(monthOption)
      } else {
        setYearFilter(currentYear - 1)
      }
    }

    setMonthOption(monthOption)
    filterGraphData(monthOption)
  }

  const filterGraphData = monthOption => {
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

    const finalGraphData = vendorData?.filter(
      a => (!selectedMonth || a.month === selectedMonth) && (!selectedQuater || a.quarter === selectedQuater),
    )
    setGraphData(finalGraphData)
  }

  return (
    <>
      <Box bg="#F7FAFE" border="1px solid #EAE6E6" rounded={'13px'}>
        <Flex mb={5}>
          <Box mt={5} flex={1}>
            <HStack>
              <Flex ml={'230px'} justifyContent={'center'} width="300px">
                <FormLabel width={'200px'} variant="strong-label" size="lg">
                  {t(`${PERFORMANCE}.performancePerMonth`)}
                </FormLabel>
              </Flex>
              <Box width={'150px'}>
                <ReactSelect
                classNamePrefix={'performancePerMonth'}
                  name={`monthsDropdown`}
                  options={MonthOption.filter(m => m.value !== 'all')}
                  onChange={getMonthValue}
                  defaultValue={monthOption}
                  selected={setMonthOption}
                />
              </Box>
            </HStack>
          </Box>
        </Flex>
        <Box mb={5}>
          {isLoading ? (
            <Center height={350}>
              <Spinner size="lg" />
            </Center>
          ) : (
            <OverviewGraph vendorData={graphData} width="98%" height={350} hasUsers={false} monthOption={monthOption} />
          )}
        </Box>
      </Box>
    </>
  )
}

export const OverviewGraph = ({ vendorData, width, height, hasUsers, monthOption }) => {
  const { t } = useTranslation()
  const labels = [
    { key: 'Bonus', color: '#FB8832' },
    { key: 'Profit', color: '#949AC2' },
    { key: 'Revenue', color: '#68B8EF' },
  ]

  const [barProps, setBarProps] = useState(
    labels.reduce(
      (a, { key }) => {
        a[key] = false
        return a
      },
      { hover: null },
    ),
  )

  const selectBar = useCallback(
    e => {
      setBarProps({
        ...barProps,
        [e.dataKey]: !barProps[e.dataKey],
        hover: null,
      })
    },
    [barProps],
  )

  let {
    Revenue = undefined,
    Profit = undefined,
    Bonus = undefined,
  } = vendorData?.length > 0
    ? vendorData[0]
    : {
        Revenue: undefined,
        Profit: undefined,
        Bonus: undefined,
      }

  const emptyGraph = [Revenue, Profit, Bonus].every(matrix => matrix === undefined)
  const currAndLast = ['This Month', 'Last Month'].includes(monthOption?.label)

  return (
    <div>
      <ResponsiveContainer width={width} height={height}>
        <BarChart
          data-testid="overview-chart"
          data={vendorData}
          barSize={50}
          margin={{
            top: 14,
            right: 30,
            left: 5,
            bottom: 10,
          }}
        >
          <CartesianGrid stroke="#EFF3F9" />
          <XAxis
            dataKey={hasUsers ? 'username' : 'month'}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#4A5568',
              fontSize: '12px',
              fontWeight: 400,
              fontStyle: 'normal',
            }}
            tickMargin={20}
          >
            {/* -- If vendorData does not have any data for the specific month, empty graph message will show -- */}
            {emptyGraph && currAndLast && (
              <Label
                value={t(`${PERFORMANCE}.noDateMessage`)}
                offset={180}
                position="insideBottom"
                fill="#A0AEC0"
                fontStyle="italic"
              />
            )}
          </XAxis>
          <YAxis
            tickLine={{ stroke: '#4F4F4F' }}
            type="number"
            tickSize={8}
            tickCount={8}
            domain={[0, 'auto']}
            axisLine={false}
            tick={{
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              fill: '#4A5568',
            }}
            tickFormatter={value => `$${value}`}
          />

          <Tooltip
            formatter={value => currencyFormatter(value)}
            contentStyle={{ borderRadius: '6px' }}
            data-testid="tooltip-overview"
            cursor={{ fill: 'transparent' }}
          />

          <Bar barSize={30} dataKey="Bonus" fill="#FB8832" radius={[10, 10, 0, 0]} hide={barProps['Bonus'] === true} />
          <Bar
            barSize={30}
            dataKey="Profit"
            fill="#949AC2"
            radius={[10, 10, 0, 0]}
            hide={barProps['Profit'] === true}
          />
          <Bar
            barSize={30}
            dataKey="Revenue"
            fill="#68B8EF"
            radius={[10, 10, 0, 0]}
            hide={barProps['Revenue'] === true}
          />
          <Legend
            onClick={selectBar}
            wrapperStyle={{
              lineHeight: '31px',
              position: 'relative',
              bottom: '20px',
              left: '36px',
            }}
            iconType="circle"
            iconSize={10}
            align="center"
            formatter={value => {
              const values = value?.toLowerCase()
              return (
                <Box display="inline-flex" marginInlineEnd="30px" data-testid={'legend-' + value}>
                  <Box as="span" color="gray.600" fontSize="12px" fontStyle="normal" fontWeight={400}>
                    {t(`${PERFORMANCE}.${values}`)}
                  </Box>
                </Box>
              )
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceGraph
