import { Box, Flex, FormLabel, HStack } from '@chakra-ui/react'
import { useFPMs } from 'api/pc-projects'
import { MonthOption } from 'api/performance'
import ReactSelect from 'components/form/react-select'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { subMonths, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { flatten, take, last } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { months, monthsShort, getQuarterByDate, getLastQuarterByDate, getQuarterByMonth } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'

type GraphData = {
  username: string
  month: any
  Revenue: any
}[]

export const OverviewGraph = ({ vendorData, width, height, hasUsers }) => {

  return (
    <div>
      <ResponsiveContainer width={width} height={height}>
        <BarChart
          data-testid="overview-chart"
          data={vendorData}
          barSize={50}
          margin={{
            top: 24,
            right: 30,
            left: 30,
            bottom: 30,
          }}
        >
          <CartesianGrid stroke="#EFF3F9" />
          <XAxis
            dataKey={hasUsers ? 'username' : 'month'}
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

          {hasUsers && (
            <XAxis
              dataKey={'centerMonth'}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#4A5568',
                fontSize: '14px',
                fontWeight: 400,
                fontStyle: 'normal',
              }}
              tickMargin={20}
              interval={0}
              xAxisId="users"
            />
          )}
          <YAxis
            tickLine={{ stroke: '#4F4F4F' }}
            type="number"
            tickSize={8}
            tickCount={7}
            domain={[0]}
            axisLine={false}
            tick={{
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              fill: '#4A5568',
            }}
            tickFormatter={value => `$${value}`}
          />
          <Tooltip
            formatter={value => currencyFormatter(value)}
            contentStyle={{ borderRadius: '6px' }}
            cursor={{ fill: '#EBF8FF' }}
          />
          <Bar
            barSize={50}
            dataKey="Revenue"
            fill="#68B8EF"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const PerformanceGraphWithUsers: React.FC<{ chartData?: any; isLoading: boolean }> = ({
  chartData,
  isLoading,
}) => {
  const { fieldProjectManagerOptions } = useFPMs()
  const [monthOption, setMonthOption] = useState(MonthOption[0])
  const [fpmOption, setFpmOption] = useState([])
  const [graphData, setGraphData] = useState<GraphData>()
  const currentMonth = format(new Date(), 'LLL', { locale: enUS })

  const data = useMemo(
    () =>
      flatten(
        months.map((month, monthIndex) => {
          const monthExistsInChart = Object.keys(chartData)?.find(months => months === month)
          let nameMonthData

          if (monthExistsInChart) {
            nameMonthData = chartData?.[month]
            const graphs = Object.keys(nameMonthData).map((nameKey, index) => {
              const [firstName, lastName, ...userId] = `${nameKey}`.split('_')
              return {
                username: `${firstName} ${lastName}`,
                month: monthsShort[month],
                userId: Number(last(userId)),
                quater: getQuarterByMonth(monthIndex),
                Revenue: nameMonthData[nameKey]?.revenue,
              }
            })
            let newgraphs = graphs.map((n, i) => ({
              ...n,
              centerMonth: Math.floor(graphs.length / 2) === i ? n.month : undefined,
            }))
            return newgraphs
          }

          return {
            month: monthsShort[month],
            centerMonth: monthsShort[month],
            quater: getQuarterByMonth(monthIndex),
            username: '',
            userId: 0,
            Bonus: 0,
            Profit: 0,
            Revenue: 0,
          }
        }),
      ),
    [chartData],
  )

  useEffect(() => {
    const finalGraphData = data?.filter(a => a.month === currentMonth)
    setGraphData(finalGraphData)
  }, [data])

  const onFpmOptionChange = options => {
    setFpmOption(options)

    filterGraphData(options, monthOption)
  }

  const getMonthValue = monthOption => {
    let selectedFpm = [] as any

    if (['All'].includes(monthOption?.label)) {
      selectedFpm = take(fieldProjectManagerOptions, 5)
    }

    setFpmOption(selectedFpm)

    setMonthOption(monthOption)
    filterGraphData(selectedFpm, monthOption)
  }
  const filterGraphData = (selectedFpm, monthOption) => {
    let selectedMonth, selectedQuater
    if (monthOption?.label === 'This Month') {
      selectedMonth = format(new Date(), 'LLL', { locale: enUS })
    }
    if (monthOption?.label === 'Last Month') {
      selectedMonth = format(subMonths(new Date(), 1), 'LLL', { locale: enUS })
    }
    if (monthOption?.label === 'Current Quarter') {
      selectedQuater = getQuarterByDate()
    }
    if (monthOption?.label === 'Past Quarter') {
      selectedQuater = getLastQuarterByDate()
    }

    selectedFpm = selectedFpm.map(n => n.value)
    const finalGraphData = data?.filter(
      a =>
        (!selectedMonth || a.month === selectedMonth) &&
        (!selectedQuater || a.quater === selectedQuater) &&
        (!selectedFpm.length || selectedFpm.includes(a.userId)),
    )
    setGraphData(finalGraphData)
  }
  return (
    <>
    <Box bg='#F7FAFE' border='1px solid #EAE6E6' rounded={'13px'}>
        <Box mb={15} mt={5} m={2}>
          <Flex>
            <Box width={'500px'} ml={5} mt={5}>
              <HStack>
                <FormLabel width={'120px'}>Filter By Month:</FormLabel>
                <Box width={'250px'}>
                  <ReactSelect
                    name={`monthsDropdown`}
                    options={MonthOption}
                    onChange={getMonthValue}
                    defaultValue={monthOption}
                    selected={setMonthOption}
                  />
                </Box>
              </HStack>
            </Box>
            <Box width={'650px'} ml={25} mt={5}>
              <HStack>
                <FormLabel width={'70px'}>Filter By:</FormLabel>
                <Box width={'530px'}>
                  <ReactSelect
                    name={`fpmDropdown`}
                    value={fpmOption}
                    isDisabled={!['All'].includes(monthOption?.label)}
                    options={fieldProjectManagerOptions}
                    onChange={onFpmOptionChange}
                    defaultValue={fpmOption}
                    isMulti
                  />
                </Box>
              </HStack>
            </Box>
          </Flex>
        </Box>
        {isLoading ? (
          <BlankSlate size="sm" />
        ) : (
          <OverviewGraph vendorData={graphData} width="98%" height={450} hasUsers />
        )}
        </Box>
    </>
    
  )
}
