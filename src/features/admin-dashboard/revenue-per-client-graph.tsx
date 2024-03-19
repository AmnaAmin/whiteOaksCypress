import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Box, Center, FormLabel, HStack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { filterByMonthOptions } from './admin-dashboard.utils'
import { useRevenuePerClient } from 'api/admin-dashboard'
import { Card } from 'components/card/card'
import _ from 'lodash'

const currentMonth = format(new Date(), 'LLL', { locale: enUS })
const defaultFilterByMonth = filterByMonthOptions?.find(m => m.value === currentMonth) || []

const filterDataByMonth = (filteredRevenueClientData, monthName: any) => {
  return filteredRevenueClientData?.filter(t => format(new Date(t.date), 'LLL', { locale: enUS }) === monthName)
}

export const RevenuePerClient = () => {
  const { revenuePerClient } = useRevenuePerClient()
  const [graphData, setGraphData] = useState<any>([])

  useEffect(() => {
    if (revenuePerClient) {
      const filteredRevenueClientData = filterDataByMonth(revenuePerClient, currentMonth)
      const data = _.values(_.groupBy(filteredRevenueClientData, 'clientName'))?.map(n => _.maxBy(n, 'amount')) || []
      setGraphData(data)
    }
  }, [revenuePerClient])

  const handleFilter = e => {
    const filter = e.value
    let data = [] as any

    if (filter && filter !== 'All') {
      // filter data by selected month
      const filteredRevenueClientData = filterDataByMonth(revenuePerClient, filter)
      // group client and then pick the max value of each to show on graph
      data = _.values(_.groupBy(filteredRevenueClientData, 'clientName'))?.map(n => _.maxBy(n, 'amount')) || []
      setGraphData(data)
    } else {
      // group all clients and then pick the max value of each to show on graph
      data = _.values(_.groupBy(revenuePerClient, 'clientName'))?.map(n => _.maxBy(n, 'amount')) || []
      setGraphData(data)
    }
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

  const CustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <div>
          {payload?.map((item, index) => {
            return (
              <Box key={index} background="white" border="1px solid #CBD5E0" rounded={5} fontSize="14px" p={2}>
                <Box>{`Revenue in ${item?.payload?.clientName}:`} </Box>
                <Center fontWeight={600} color="#F6AD55">{`$${item.value}`}</Center>
              </Box>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <>
      <Box>
        <HStack mb={5}>
          <FormLabel>Filter By Month:</FormLabel>
          <Box width="25%">
            <ReactSelect   classNamePrefix={'filterByMonth'} defaultValue={defaultFilterByMonth} options={filterByMonthOptions} onChange={handleFilter} />
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
              <XAxis dataKey="clientName" interval={0} height={85} tick={<CustomizedAxisTick />} tickMargin={10} />
              <YAxis
                tickFormatter={value => `$${value}`}
                tick={{
                  fill: '#4A5568',
                  fontSize: '12px',
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Legend iconSize={10} iconType="square" />
              <Bar dataKey="amount" name="Amount" fill="#F6AD55" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  )
}

export default RevenuePerClient
