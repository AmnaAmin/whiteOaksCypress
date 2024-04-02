import { useState, useEffect } from 'react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Label,
} from 'recharts'
import { Box, FormLabel, HStack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { Card } from 'components/card/card'
import { filterByMonthOptions } from './admin-dashboard.utils'
import { ADMIN_DASHBOARD } from './admin-dashboard.i18n'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

export const SalesPerMonth = ({ data, bar, line }) => {
  const { t } = useTranslation()

  const [barProps, setBarProps] = useState(
    bar.reduce(
      (a, { key }) => {
        a[key] = false
        return a
      },
      { hover: null },
    ),
  )

  const [originalData, setOriginalData] = useState<any>([])
  const [filterData, setFilterData] = useState<any>([])

  const handleFilter = e => {
    const filter = e.value
    if (filter !== '' && filter !== 'All') {
      const filteredData = originalData?.filter(t => {
        return moment(t.date).format('MMM') === filter
      })
      setFilterData(filteredData?.length > 0 ? filteredData : [])
    } else {
      setFilterData(originalData)
    }
  }

  useEffect(() => {
    setFilterData(data)
    setOriginalData(data)
  }, [data])

  const handleLegendMouseEnter = (e: { dataKey: string | number }) => {
    if (!barProps[e.dataKey]) {
      setBarProps({ ...barProps, hover: e.dataKey })
    }
  }

  const handleLegendMouseLeave = e => {
    setBarProps({ ...barProps, hover: null })
  }

  const selectBar = e => {
    setBarProps({
      ...barProps,
      [e.dataKey]: !barProps[e.dataKey],
      hover: null,
    })
  }

  const CustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <div>
          {payload?.map((item, index) => {
            return (
              <Box className={item.className} key={index} background={item.fill} color="white" rounded={5} mb={1} p={1}>
                {`${item.name} : $${item.value}`}
              </Box>
            )
          })}
        </div>
      )
    }
    return null
  }

  const dateFormatter = value => {
    const date = moment(value).format('MMM YYYY')
    return date
  }

  const arrEmpty = filterData?.filter(
    filter =>
      filter?.draw &&
      filter?.material &&
      filter?.workInProgress &&
      filter?.revenue &&
      filter?.accountReceivable &&
      filter?.accountPayable,
  )
  const emptyGraph = arrEmpty?.every(element => element === null)

  return (
    <>
      <Box>
        <HStack mb={5}>
          <FormLabel>{t(`${ADMIN_DASHBOARD}.filterByMonth`)}</FormLabel>
          <Box width="25%">
            <ReactSelect
            classNamePrefix={'filterByMonthSalesPerMonth'}
              defaultValue={{ label: 'All', value: 'All' }}
              options={filterByMonthOptions}
              onChange={handleFilter}
            />
          </Box>
        </HStack>
      </Box>
      <Card>
        <div style={{ width: '100%', height: '500px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              width={500}
              height={350}
              data={filterData}
              margin={{
                top: 5,
                right: 10,
                left: 40,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={dateFormatter}
                tick={{
                  fill: '#4A5568',
                  fontSize: '12px',
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
                height={40}
              >
                {/* -- If there is no data for the specific month, empty graph message will show -- */}
                {emptyGraph && (
                  <Label
                    value="There is currently no data available for the selected month"
                    offset={180}
                    position="insideBottom"
                    fill="#A0AEC0"
                    fontStyle="italic"
                  />
                )}
              </XAxis>
              <YAxis
                axisLine={false}
                label={{
                  value: 'Sales amount',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -35,
                  fontSize: '14px',
                  fontWeight: 500,
                  font: 'poppins',
                  style: { color: '#2D3748', fill: '#2D3748' }
                }}
                tickFormatter={value => `$${value}`}
                tick={{
                  fill: '#4A5568',
                  fontSize: '12px',
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                onClick={selectBar}
                onMouseOver={handleLegendMouseEnter}
                onMouseOut={handleLegendMouseLeave}
                iconSize={10}
              />

              {bar?.map((label, index) => (
                <Bar
                  className={label.className}
                  name={label.name}
                  legendType="square"
                  barSize={30}
                  radius={[5, 5, 0, 0]}
                  key={index}
                  dataKey={label.key}
                  fill={label.color}
                  hide={barProps[label.key] === true}
                  fillOpacity={Number(barProps.hover === label.key || !barProps.hover ? 1 : 0.6)}
                />
              ))}

              {
                <Line
                  className={line.className}
                  name={line.name}
                  type="monotone"
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  dot={{ strokeWidth: 7, stroke: '#8d2638', strokeOpacity: 1 }}
                  key={line.key}
                  dataKey={line.key}
                  stroke={line.stroke}
                  fill={line.fill}
                  hide={barProps[line.key] === true}
                  fillOpacity={Number(barProps.hover === line.key || !barProps.hover ? 1 : 0.6)}
                />
              }
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  )
}

export default SalesPerMonth
