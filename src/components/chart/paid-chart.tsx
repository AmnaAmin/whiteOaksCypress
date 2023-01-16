import { Box, Text } from '@chakra-ui/react'
import { usePaidWOAmountByYearAndMonth } from 'api/vendor-dashboard'
import React from 'react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Label, CartesianGrid } from 'recharts'
import { monthsShort } from 'utils/date-time-utils'

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
  return <PaidChartGraph data={data} width="90%" height={313} filters={filterChart} />
}

export const PaidChartGraph = ({ data, width, height, filters }) => {
  const selectedOptionAll = filters?.label === 'All'
  const graphData = data?.map(value => ({
    label: selectedOptionAll ? value?.label[0] + value?.label?.slice(1)?.toLowerCase() : value?.label,
    count: value?.count,
    sum: value?.sum,
  }))

  // If the graph has no data we are showing a message on the graph.
  const emptyGraphData = data?.filter(value => value?.count)?.length === 0

  const CustomTooltip = ({ active, payload }: any) => {
    const countValue = payload?.map(e => {
      return e.payload
    })

    if (active && payload) {
      return (
        <Box border="1px solid #CBD5E0" rounded="4px" bg="white" p="6px">
          <Text color="#68D391">{`Count : ${countValue[0].count}`}</Text>
        </Box>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        width={630}
        height={250}
        data={graphData}
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tickFormatter={tick => {
            return selectedOptionAll ? monthsShort[tick] : `ID${tick}`
          }}
          axisLine={{ stroke: '#EBEBEB' }}
          tickLine={false}
          tick={{
            fill: '#718096',
            fontSize: '12px',
            fontWeight: 400,
            fontStyle: 'Poppins',
          }}
          tickMargin={15}
          color="#718096"
        >
          {emptyGraphData && (
            <Label
              value="There is currently no data available for the month selected"
              offset={180}
              position="insideBottom"
              fill="#A0AEC0"
              fontStyle="italic"
              fontSize={'14px'}
            />
          )}
        </XAxis>
        <YAxis
          hide={false}
          type="number"
          axisLine={{ stroke: '#EBEBEB' }}
          tickLine={false}
          tickCount={4}
          dx={-15}
          tick={{
            fill: '#718096',
            fontWeight: 400,
            fontSize: '12px',
            fontStyle: 'Poppins',
          }}
        />
        {!emptyGraphData && <Tooltip content={<CustomTooltip />} cursor={{ fill: '#EBF8FF' }} />}

        <Bar dataKey="sum" fill="#68D391" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default PaidChart
