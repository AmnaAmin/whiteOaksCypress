import { Box, Center, Spinner } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts'

import { currencyFormatter } from 'utils/string-formatters'
import { PERFORMANCE } from './performance.i18n'

export const OverviewGraph = ({ vendorData, width, height, hasUsers, monthCheck }) => {
  const { t } = useTranslation()
  const labels = [
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

  let {
    Revenue = undefined,
    Profit = undefined,
    Bonus = undefined,
  } = vendorData?.length > 0
    ? vendorData[0]
    : {
        Revenue: undefined,
        Profit: undefined,
        Bonus: undefined,
      }

  const emptyGraph = [Revenue, Profit, Bonus].every(matrix => matrix === undefined)
  const currAndLast = ['This Month', 'Last Month'].includes(monthCheck?.label)

  return (
    <div>
      <ResponsiveContainer width={width} height={height}>
        <BarChart
          data={vendorData}
          barSize={50}
          margin={{
            top: 24,
            right: 30,
            left: 50,
            bottom: 75,
          }}
        >
          <CartesianGrid stroke="#EFF3F9" />
          <XAxis
            dataKey={hasUsers ? 'username' : 'month'}
            axisLine={false}
            tickMargin={30}
            angle={-60}
            interval={Math.floor(vendorData?.length / 60)}
            tick={{
              fill: '#4A5568',
              fontSize: '12px',
              fontWeight: 400,
              fontStyle: 'normal',
              display: 'none',
            }}
            tickLine={false}
            tickFormatter={value => (value?.length > 12 ? `${value.slice(0, 12)}...` : value)}
            label={{
              value: 'Field Project Manager',
              angle: 360,
              position: 'bottom',
              textAnchor: 'middle',
              offset: 40,
              font: 'inter',
              fontWeight: 600,
              fontSize: '12px',
              fontColor: 'gray/600',
            }}
          >
            {/* -- If vendorData does not have any data for the specific month, empty graph message will show -- */}
            {emptyGraph && currAndLast && (
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
              dataKey={'month'}
              axisLine={false}
              interval={0}
              tickLine={false}
              allowDuplicatedCategory={false}
              tick={{
                fill: '#4A5568',
                fontSize: '12px',
                fontWeight: 700,
                fontStyle: 'inter',
              }}
              //tickMargin={50}
              xAxisId="users"
            />
          )}
          <YAxis
            type="number"
            tickSize={75}
            tickCount={10}
            domain={[0, 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: '12px',
              fontStyle: 'inter',
              fontWeight: 400,
              fill: '#4A5568',
              textAnchor: 'left',
            }}
            tickFormatter={value => `$${value}`}
            label={{
              value: '',
              angle: -90,
              position: 'left',
              textAnchor: 'middle',
              offset: 20,
              font: 'inter',
              fontWeight: 600,
              fontSize: '12px',
            }}
          />
          <Tooltip
            formatter={value => currencyFormatter(value)}
            contentStyle={{ borderRadius: '6px' }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar
            barSize={50}
            dataKey="Revenue"
            fill="#68B8EF"
            radius={[5, 5, 0, 0]}
            hide={barProps['Revenue'] === true}
          />
          <Bar barSize={50} dataKey="Profit" fill="#949AC2" radius={[5, 5, 0, 0]} hide={barProps['Profit'] === true} />
          <Legend
            onClick={selectBar}
            wrapperStyle={{
              lineHeight: '31px',
              position: 'relative',
              bottom: '70px',
              left: '100px',
            }}
            iconType="circle"
            iconSize={10}
            align="center"
            formatter={value => {
              const values = value?.toLowerCase()
              return (
                <Box display="inline-flex" marginInlineEnd="30px">
                  <Box as="span" color="gray.600" fontSize="12px" fontStyle="normal" fontWeight={400}>
                    {t(`${PERFORMANCE}.${values}`)}
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

export const PerformanceGraphWithUsers: React.FC<{
  graphData?: any
  isLoading: boolean
  setYearFilter: (value) => void
  yearFilter: string | number | undefined
  isFetching: boolean
  monthOption: any
}> = ({ graphData, isLoading, setYearFilter, yearFilter, isFetching, monthOption }) => {
  return (
    <>
      <Box bg="#F7FAFE" border="1px solid #EAE6E6" rounded={'6px'}>
        {isFetching ? (
          <Center height={500}>
            <Spinner size="xl" />
          </Center>
        ) : (
          <OverviewGraph vendorData={graphData} width="98%" height={500} hasUsers monthCheck={monthOption} />
        )}
      </Box>
    </>
  )
}
