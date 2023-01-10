import { Box, Text } from '@chakra-ui/react'
import { useVendorsPerMonth } from 'api/vendor-dashboard'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { values } from 'lodash'
import { months, monthsFull, monthsShort } from 'utils/date-time-utils'

export enum WORK_ORDER_STATUS {
  Paid = 68,
  Active = 34,
  Completed = 36,
  Cancelled = 35,
  Inactive = 37,
  Invoiced = 110,
  Decline = 111,
  PastDue = 114,
}

const Overview: React.FC<{ vendorId: number }> = ({ vendorId }) => {
  const { data: vendorEntity } = useVendorsPerMonth(vendorId)

  const vendors = values(vendorEntity).reduce((a, v) => ({ ...a, ...v }), {})
  const vendorData = months.map(key => {
    const entityList = vendors[key] || []

    return {
      name: monthsShort[key],
      Active: entityList.find(e => e)?.countActive,
      PastDue: entityList.find(e => e)?.countPastdue,
      Completed: entityList.find(e => e)?.countCompleted,
      Paid: entityList.find(e => e)?.countPaid,
      Canceled: entityList.find(e => e)?.countCancelled,
    }
  })
  return <OverviewGraph vendorData={vendorData} width="98%" height={360} />
}

const OverViewCustomTooltip = ({ payload, label }: any) => {
  return (
    <Box bg="white" p={3} rounded="6px" border="1px solid #CBD5E0" className="recharts-custom-tooltip">
      <Text fontWeight={900}>{monthsFull[label]}</Text>
      {payload?.map(e => {
        return <Text my={1} color={e.fill}>{`${e.name} : ${e.value}`}</Text>
      })}
    </Box>
  )
}

export const OverviewGraph = ({ vendorData, width, height }) => {
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
          <CartesianGrid
            strokeDasharray="3 3"
            //stroke="#EFF3F9"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#718096',
              fontSize: '12px',
              fontWeight: 400,
              fontStyle: 'Poppins',
            }}
            tickMargin={20}
          />

          <YAxis
            tickLine={{ stroke: '#4F4F4F' }}
            type="number"
            tickSize={8}
            tickCount={3}
            axisLine={false}
            tick={{
              fill: '#718096',
              fontSize: '12px',
              fontWeight: 400,
              fontStyle: 'Poppins',
            }}
          />

          <Tooltip content={<OverViewCustomTooltip />} data-testid="tooltip-overview" cursor={{ fill: '#EBF8FF' }} />

          <Bar dataKey="Active" fill="#DEC5FF" radius={[5, 5, 0, 0]} />
          <Bar dataKey="PastDue" fill="#C9C9C9" radius={[5, 5, 0, 0]} />
          <Bar dataKey="Completed" fill="#84ADEF" radius={[5, 5, 0, 0]} />
          <Bar dataKey="Paid" fill="#FDC077" radius={[5, 5, 0, 0]} />
          <Bar dataKey="Canceled" fill="#84DCC6" radius={[5, 5, 0, 0]} />
          <Legend
            wrapperStyle={{
              lineHeight: '31px',
              position: 'relative',
              bottom: 'calc(100% + 35px)',
              left: '20px',
            }}
            iconType="circle"
            iconSize={10}
            align="right"
            formatter={value => {
              return (
                <Box display="inline-flex" marginInlineEnd="10px" data-testid={'legend-' + value}>
                  <Box as="span" color="gray.500" fontSize="12px" fontStyle="Poppins" fontWeight={400}>
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

export default Overview
