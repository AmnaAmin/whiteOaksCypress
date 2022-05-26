import { usePaidWOAmountByYearAndMonth } from 'utils/vendor-dashboard'
import { round } from 'lodash'
import React from 'react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

type FilterChart = {
  month: string
  label: string
  year: string
}

type PaidChartProps = {
  filterChart: FilterChart
}

const PaidChart: React.FC<PaidChartProps> = ({ filterChart }) => {
  const { data } = usePaidWOAmountByYearAndMonth(filterChart.year, filterChart.month)
  return <PaidChartGraph data={data} width="90%" height={313} />
}

export const PaidChartGraph = ({ data, width, height }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        width={630}
        height={250}
        data={data}
        barSize={21}
        margin={{
          top: 0,
          right: 0,
          left: 15,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="40%" y1="40%" x2="40%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor=" #F6AD55" />
            <stop offset="1" stopColor="#FF8B00" />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tickFormatter={tick => {
            return `ID${tick}`
          }}
          axisLine={{ stroke: '#EBEBEB' }}
          tickLine={false}
          tick={{
            fill: ' #4A5568',
            fontSize: '12px',
            fontWeight: 400,
            fontStyle: 'normal',
          }}
          tickMargin={20}
        />
        <YAxis
          hide={false}
          type="number"
          axisLine={{ stroke: '#EBEBEB' }}
          tickLine={false}
          tickCount={5}
          dx={-15}
          tick={{
            fill: '#4A5568',
            fontWeight: 400,
            fontSize: '12px',
            fontStyle: 'normal',
          }}
          tickFormatter={tick => {
            return ` ${'$' + round(tick / 1000, 2) + 'k'} `
          }}
        />
        <Tooltip contentStyle={{ borderRadius: '6px' }} />

        <Bar dataKey="count" fill="url(#colorUv)" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default PaidChart
