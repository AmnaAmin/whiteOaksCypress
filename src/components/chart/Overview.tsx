import { Box } from '@chakra-ui/react'
import { useVendorsPerMonth } from 'utils/vendor-dashboard'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GenericObjectType } from 'types/common.types'
import { values } from 'lodash'
import { WORK_ORDER_STATUS } from 'features/projects/work-order-status'

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export const monthsShort: GenericObjectType = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
}

const Overview: React.FC<{ vendorId: number }> = ({ vendorId }) => {
  const { data: vendorEntity } = useVendorsPerMonth(vendorId)

  const vendors = values(vendorEntity).reduce((a, v) => ({ ...a, ...v }), {})
  const vendorData = months.map(key => {
    const entityList = vendors[key] || []
    return {
      name: monthsShort[key],
      Active: entityList.find(entity => entity.status === WORK_ORDER_STATUS.Active)?.statuscount ?? 0,
      Completed: entityList.find(entity => entity.status === WORK_ORDER_STATUS.Completed)?.statuscount ?? 0,
      Paid: entityList.find(entity => entity.status === WORK_ORDER_STATUS.Paid)?.statuscount ?? 0,
      Cancelled: entityList.find(entity => entity.status === WORK_ORDER_STATUS.Cancelled)?.statuscount ?? 0,
    }
  })
  return <OverviewGraph vendorData={vendorData} width="98%" height={360} />
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
            tickCount={3}
            axisLine={false}
            tick={{
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              fill: '#4A5568',
            }}
          />

          <Tooltip contentStyle={{ borderRadius: '6px' }} data-testid="tooltip-overview" cursor={{ fill: '#EBF8FF' }} />

          <Bar dataKey="Active" fill="#68B8EF" radius={[10, 10, 0, 0]} />
          <Bar dataKey="Completed" fill="#FB8832" radius={[10, 10, 0, 0]} />
          <Bar dataKey="Paid" fill="#949AC2" radius={[10, 10, 0, 0]} />
          <Bar dataKey="Cancelled" fill="#F7685B" radius={[10, 10, 0, 0]} />
          <Legend
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

export default Overview
