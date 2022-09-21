import { Box, Flex, FormLabel, HStack} from '@chakra-ui/react'
import { useFPMs } from 'api/pc-projects'
import { constMonthOption } from 'api/performance'
import { Card } from 'components/card/card'
import ReactSelect from 'components/form/react-select'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { subMonths, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { flatten } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { months, monthsShort } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'

const PerformanceGraph: React.FC<{ chartData?: any; isLoading: boolean }> = ({ chartData, isLoading }) => {
  const vendors = [chartData?.chart]
  const vendorData = months.map(key => {
    const monthExistsInChart = chartData !== undefined && Object.keys(vendors[0])?.find(months => months === key)
    let nameMonthData
    if (monthExistsInChart) {
      nameMonthData = chartData?.chart[key]
    }
    return {
      month: monthsShort[key],
      Bonus: nameMonthData?.bonus,
      Profit: nameMonthData?.profit,
      Revenue: nameMonthData?.revenue,
    }
  })

  return (
    <>
      {isLoading ? (
        <BlankSlate size="sm" />
      ) : (
        <OverviewGraph vendorData={vendorData} width="98%" height={360} hasUsers={false} />
      )}
    </>
  )
}

export const OverviewGraph = ({ vendorData, width, height, hasUsers }) => {
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
            left: 0,
            bottom: 0,
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
          />

          {hasUsers && (
            <XAxis
              dataKey={'month'}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#4A5568',
                fontSize: '12px',
                fontWeight: 400,
                fontStyle: 'normal',
              }}
              // tick={renderQuarterTick}
              tickMargin={20}
              xAxisId="users"
            />
          )}
          <YAxis
            tickLine={{ stroke: '#4F4F4F' }}
            type="number"
            tickSize={8}
            tickCount={7}
            domain={[0]}
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
            cursor={{ fill: '#EBF8FF' }}
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
          {/* { !hasUsers && */}
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
              return (
                <Box display="inline-flex" marginInlineEnd="30px" data-testid={'legend-' + value}>
                  <Box as="span" color="gray.600" fontSize="12px" fontStyle="normal" fontWeight={400}>
                    {value}
                  </Box>
                </Box>
              )
            }}
          />
          {/* } */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceGraph

export const PerformanceGraphWithUsers: React.FC<{ chartData?: any; isLoading: boolean }> = ({
  chartData,
  isLoading,
}) => {
   
  const { fieldProjectManagerOptions } = useFPMs()
  const [monthOption, setMonthOption] = useState(constMonthOption[0])
  const [fpmOption, setFpmOption] = useState(fieldProjectManagerOptions[0])
  const [graphData, setGraphData] = useState({ username: '', month: 0, Revenue: 0 }[0])
  const currentMonth = format(new Date(), 'LLL', { locale: enUS })
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  useEffect(() => {
    const finalGraphData = data?.filter(a => a.month === currentMonth)
    setSelectedMonth(currentMonth)
    setGraphData(finalGraphData)
  }, [])

  // Formatted Data
  const data = flatten(
    months.map(month => {
      const monthExistsInChart = Object.keys(chartData)?.find(months => months === month) 
      let nameMonthData
      if (monthExistsInChart) {
        nameMonthData = chartData?.[month] 
        return Object.keys(nameMonthData).map(nameKey => {
          const [firstName, lastName] = `${nameKey}`.split('_')
          return {
            username: `${firstName} ${lastName}`,
            month: monthsShort[month], 
            // Bonus: nameMonthData[nameKey]?.bonus,
            // Profit: nameMonthData[nameKey]?.profit,
            Revenue: nameMonthData[nameKey]?.revenue,
          }
        })
      }

      return {
        month: monthsShort[month],
        username: '',
        Bonus: 0,
        Profit: 0,
        Revenue: 0,
      }
    }),
  )

  const getMonthValue = monthOption => {
    if (monthOption?.label === 'This Month') {
      const currentMonth = format(new Date(), 'LLL', { locale: enUS })
      setSelectedMonth(currentMonth)
    }
    if (monthOption?.label === 'Last Month') {
      const lastMonth = format(subMonths(new Date(), 1), 'LLL', { locale: enUS })
      setSelectedMonth(lastMonth)
    }
    if (monthOption?.label === 'Current Quarter') {
      var currQuarter = format(subMonths(new Date(), 6), 'LLL', { locale: enUS })
      setSelectedMonth(currQuarter)
    }
    if (monthOption?.label === 'Past Quarter') {
      var pastQuarter = format(subMonths(new Date(), 3), 'LLL', { locale: enUS })
      console.log(pastQuarter)
      setSelectedMonth(pastQuarter)
    }  
    if (monthOption?.label === 'All') {
      setSelectedMonth('')
    }

    const finalGraphData = selectedMonth ? data?.filter(a => a.month === selectedMonth) : data
    setGraphData(finalGraphData)
  }

  return (
    <>
      <Card>
        <Box mb={15} mt={5} height="50px">
          <Flex>
            <Box width={'400px'} ml={5}>
              <HStack>
                <FormLabel width={'120px'}>Filter By Month:</FormLabel>
                <Box width={'200px'}>
                  <ReactSelect
                    name={`monthsDropdown`}
                    options={constMonthOption}
                    onChange={getMonthValue}
                    defaultValue={monthOption}
                    selected={setMonthOption}
                  />
                </Box>
              </HStack>
            </Box>
            <Box width={'550px'} ml={3}>
              <HStack>
                <FormLabel width={'70px'}>Filter By:</FormLabel>
                <Box width={'400px'}>
                  <ReactSelect
                    name={`fpmDropdown`}
                    options={fieldProjectManagerOptions}
                    onChange={setFpmOption}
                    defaultValue={fpmOption}
                    isMulti
                  />
                </Box>
              </HStack>
            </Box>
          </Flex>
        </Box>
        {isLoading ? (
          <BlankSlate size="sm" />
        ) : (
          <OverviewGraph vendorData={graphData} width="98%" height={360} hasUsers />
        )}
      </Card>
    </>
  )
}
