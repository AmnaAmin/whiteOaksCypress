import { Box } from '@chakra-ui/react'
import { useVendorsPerMonth } from 'utils/vendor-dashboard'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GenericObjectType } from 'types/common.types'

const months = [
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
const monthsShort: GenericObjectType = {
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
  const vendorData = months.map(key => ({
    name: monthsShort[key],
    Active: vendorEntity?.[key]?.Active || 0,
    Closed: vendorEntity?.[key]?.Completed || 0,
    Paid: vendorEntity?.[key]?.Paid || 0,
    Canceled: vendorEntity?.[key]?.Cancelled || 0,
  }))

  return (
    <ResponsiveContainer width="98%" height={335}>
      <BarChart data={vendorData} barSize={50}>
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
          type="number"
          // domain={[0, (dataMax: number) => 40]}
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

        <Tooltip />

        <Bar dataKey="Active" fill="#68B8EF" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Closed" fill="#FB8832" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Paid" fill="#949AC2" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Canceled" fill="#F7685B" radius={[4, 4, 0, 0]} />
        <Legend
          wrapperStyle={{
            lineHeight: '31px',
            position: 'relative',
            bottom: 'calc(100% + 73px)',
            left: '80px',
          }}
          height={40}
          iconType="circle"
          iconSize={10}
          align="center"
          formatter={value => {
            return (
              <Box display="inline-flex" marginInlineEnd="40px">
                <Box as="span" color="#4A5568" fontSize="12px" fontStyle="normal" fontWeight={400}>
                  {value}
                </Box>
              </Box>
            )
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Overview
