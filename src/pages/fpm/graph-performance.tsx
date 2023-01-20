import { Box } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React, { useCallback, useState } from 'react'
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
      name: monthsShort[key],
      Bonus: nameMonthData?.bonus,
      Profit: nameMonthData?.profit,
      Revenue: nameMonthData?.revenue,
    }
  })

  return (
    <>{isLoading ? <BlankSlate size="sm" /> : <OverviewGraph vendorData={vendorData} width="98%" height={360} />}</>
  )
}

export const OverviewGraph = ({ vendorData, width, height }) => {
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
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#EFF3F9" />
          <XAxis
            dataKey="name"
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

          <YAxis
            tickLine={{ stroke: '#4F4F4F' }}
            type="number"
            tickSize={8}
            tickCount={10}
            domain={[0, 'auto']}
            axisLine={false}
            tick={{
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              fill: '#4A5568',
            }}
            tickFormatter={value => `$${value}`}
            interval={0}
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
          <Legend
            onClick={selectBar}
            wrapperStyle={{
              lineHeight: '31px',
              position: 'relative',
              bottom: 'calc(100% + 35px)',
              left: '36px',
            }}
            iconType="circle"
            iconSize={10}
            align="right"
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
