import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Box, FormLabel, HStack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { filterByMonthOptions } from './admin-dashboard.utils'
import { mapRevenueVsProfitToGraphData, useRevenueVsProfit } from 'api/admin-dashboard'
import { Card } from 'components/card/card'
import { ADMIN_DASHBOARD } from './admin-dashboard.i18n'
import { useTranslation } from 'react-i18next'

const currentMonth = format(new Date(), 'LLL', { locale: enUS })
const defaultFilterByMonth = filterByMonthOptions?.find(m => m.value === currentMonth) || []

const filterDataByMonth = (profitVsRevenueData, monthName: any) => {
  return profitVsRevenueData?.filter(t => format(new Date(t.date), 'LLL', { locale: enUS }) === monthName)
}

export const RevenueVsProfit = () => {
  const { revenueProfitGraph } = useRevenueVsProfit()
  const [graphData, setGraphData] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    if (revenueProfitGraph) {
      const filteredProfitVsRevenueData = filterDataByMonth(revenueProfitGraph, currentMonth)
      const data = mapRevenueVsProfitToGraphData(filteredProfitVsRevenueData)
      setGraphData(data)
    }
  }, [revenueProfitGraph])

  const handleFilter = e => {
    const filter = e.value
    let data = []

    if (filter && filter !== 'All') {
      const filteredProfitVsRevenueData = filterDataByMonth(revenueProfitGraph, filter)
      data = mapRevenueVsProfitToGraphData(filteredProfitVsRevenueData)
    } else {
      data = mapRevenueVsProfitToGraphData(revenueProfitGraph)
    }
    setGraphData(data)
  }

  const CustomizedAxisTick = props => {
    const { x, y, payload } = props
    const renderText = (text = '') => (text.length > 9 ? `${text.slice(0, 9)}...` : text)
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} textAnchor="end" fill="#4A5568" transform="rotate(-45)" fontSize={'12px'}>
          {renderText(payload.value)}
        </text>
      </g>
    )
  }

  return (
    <>
      <Box>
        <HStack mb={5}>
          <FormLabel>{t(`${ADMIN_DASHBOARD}.filterByMonth`)}</FormLabel>
          <Box width="25%">
            <ReactSelect classNamePrefix={'filterByMonthrevenueProfit'} defaultValue={defaultFilterByMonth} options={filterByMonthOptions} onChange={handleFilter} />
          </Box>
        </HStack>
      </Box>
      <Card>
        <div id="fp" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              barSize={30}
              data={graphData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="projectManager" interval={0} height={85} tick={<CustomizedAxisTick />} tickMargin={10} />
              <YAxis
                tick={{
                  fill: '#4A5568',
                  fontSize: '12px',
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
                tickFormatter={value => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  fontSize: '14px',
                }}
                itemStyle={{ fontSize: '14px' }}
                cursor={{ fill: 'transparent' }}
                formatter={value => `$${value}`}
              />
              <Legend iconSize={10} iconType="square" />
              <Bar dataKey="profit" name="Profit" fill="#F6AD55" radius={[5, 5, 0, 0]} />
              <Bar dataKey="revenue" name="Revenue" fill="#68B8EF" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  )
}

export default RevenueVsProfit
