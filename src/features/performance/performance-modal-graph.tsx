import { Box, Flex, FormLabel, HStack } from '@chakra-ui/react'
import { MonthOption } from 'api/performance'
import ReactSelect from 'components/form/react-select'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { format, subMonths } from 'date-fns'
import { enUS } from 'date-fns/locale'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import { getLastQuarterByDate, getQuarterByDate, getQuarterByMonth, months, monthsShort } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'

type GraphData = {
  month: any
  Revenue: any
  Bonus: any
  Profit: any
}[]

const PerformanceGraph: React.FC<{ chartData?: any; isLoading: boolean }> = ({ chartData, isLoading }) => {
  const [monthOption, setMonthOption] = useState(MonthOption[0])
  const [graphData, setGraphData] = useState<GraphData>()
  const currentMonth = format(new Date(), 'LLL', { locale: enUS })
  const vendors = [chartData?.chart]

  const vendorData = useMemo(
    () =>
      months.map((key, monthIndex) => {
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
          quarter: getQuarterByMonth(monthIndex),
        }
      }),
    [chartData],
  )

  useEffect(() => {
    const finalGraphData = vendorData?.filter(a => a.month === currentMonth)
    setGraphData(finalGraphData)
  }, [vendorData])

  const getMonthValue = monthOption => {
    setMonthOption(monthOption)
    filterGraphData(monthOption)
  }
  const filterGraphData = monthOption => {
    let selectedMonth, selectedQuater
    if (monthOption?.label === 'This Month') {
      selectedMonth = format(new Date(), 'LLL', { locale: enUS })
    }

    if (monthOption?.label === 'Last Month') {
      selectedMonth = format(subMonths(new Date(), 1), 'LLL', { locale: enUS })
    }
    if (monthOption?.label === 'Current Quarter') {
      selectedQuater = getQuarterByDate()
    }
    if (monthOption?.label === 'Past Quarter') {
      selectedQuater = getLastQuarterByDate()
    }

    // const finalGraphData = vendorData?.filter(a => !selectedMonth || a.month === selectedMonth)
    const finalGraphData = vendorData?.filter(
      a => (!selectedMonth || a.month === selectedMonth) && (!selectedQuater || a.quarter === selectedQuater),
    )
    setGraphData(finalGraphData)
  }

  return (
    <>
      <Box bg="#F7FAFE" border="1px solid #EAE6E6" rounded={'13px'}>
        <Flex mb={5}>
          <Box mt={5} flex={1} mb={5}>
            <HStack>
              <Flex ml={'230px'} justifyContent={'center'} width="300px">
                <FormLabel width={'200px'} variant="strong-label" size="lg">
                  Performance Per Month
                </FormLabel>
              </Flex>
              <Box width={'150px'}>
                <ReactSelect
                  name={`monthsDropdown`}
                  options={MonthOption}
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
            <BlankSlate size="sm" />
          ) : (
            <OverviewGraph vendorData={graphData} width="98%" height={380} hasUsers={false} />
          )}
        </Box>
      </Box>
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
            {vendorData &&
              vendorData[0]?.Revenue === undefined &&
              vendorData[0]?.Profit === undefined &&
              vendorData[0]?.Bonus === undefined && (
                <Label
                  value="There is currently no data available for the month selected"
                  offset={180}
                  position="insideBottom"
                  fill="#A0AEC0"
                  fontStyle="italic"
                />
              )}
          </XAxis>
          {hasUsers && (
            <XAxis
              dataKey={'centerMonth'}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#4A5568',
                fontSize: '14px',
                fontWeight: 400,
                fontStyle: 'normal',
              }}
              tickMargin={20}
              interval={0}
              xAxisId="users"
            ></XAxis>
          )}
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
            // cursor={{ fill: 'transparent' }}
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
              return (
                <Box display="inline-flex" marginInlineEnd="30px" data-testid={'legend-' + value}>
                  <Box as="span" color="gray.600" fontSize="12px" fontStyle="normal" fontWeight={400}>
                    {value}
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
