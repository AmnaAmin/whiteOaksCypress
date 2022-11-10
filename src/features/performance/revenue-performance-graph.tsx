import { Box, Flex, FormLabel, HStack } from '@chakra-ui/react'
import { useFPMs } from 'api/pc-projects'
import { MonthOption } from 'api/performance'
import ReactSelect from 'components/form/react-select'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { subMonths, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { flatten, take, last } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts'
import { months, monthsShort, getQuarterByDate, getLastQuarterByDate, getQuarterByMonth } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'

type GraphData = {
  username: string
  month: any
  Revenue: any
}[]

export const OverviewGraph = ({ vendorData, width, height, hasUsers, monthCheck }) => {
  const barColors = [
    '#F6AD55',
    '#68B8EF',
    '#F7685B',
    '#949AC2',
    '#F6AD55',
    '#68B8EF',
    '#F7685B',
    '#949AC2',
    '#F6AD55',
    '#68B8EF',
    '#F7685B',
    '#949AC2',
    '#F6AD55',
    '#68B8EF',
    '#F7685B',
    '#949AC2',
    '#F6AD55',
    '#68B8EF',
    '#F7685B',
    '#949AC2',
  ]

  let { Revenue, Profit, Bonus } = vendorData[0]
  const emptyGraph = [Revenue, Profit, Bonus].every(matrix => matrix === 0)

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
            angle={-45}
            interval={Math.floor(vendorData.length / 60)}
            tick={
              ['This Month', 'Last Month'].includes(monthCheck?.label)
                ? {
                    fill: '#4A5568',
                    fontSize: '12px',
                    fontWeight: 400,
                    fontStyle: 'normal',
                  }
                : false
            }
            tickLine={false}
            tickFormatter={value => (value?.length > 12 ? `${value.slice(0, 12)}...` : value)}
            label={{
              value: 'Field Project Manager',
              angle: 360,
              position: 'bottom',
              textAnchor: 'middle',
              offset: ['This Month', 'Last Month'].includes(monthCheck?.label) ? 80 : 50,
              font: 'inter',
              fontWeight: 600,
              fontSize: '12px',
              fontColor: 'gray/600',
            }}
          >
            {/* -- If vendorData does not have any data for the specific month, empty graph message will show -- */}
            {emptyGraph && (
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
              dataKey={['This Month', 'Last Month'].includes(monthCheck?.label) ? 'centerMonth' : 'month'}
              axisLine={false}
              interval={['This Month', 'Last Month'].includes(monthCheck?.label) ? 0 : 5}
              tickLine={false}
              tick={{
                fill: '#4A5568',
                fontSize: '12px',
                fontWeight: 700,
                fontStyle: 'inter',
              }}
              tickMargin={['This Month', 'Last Month'].includes(monthCheck?.label) ? 50 : 5}
              xAxisId="users"
            />
          )}
          <YAxis
            type="number"
            tickSize={55}
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
              value: 'Revenue',
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
          <Bar barSize={50} dataKey="Revenue" fill="#68B8EF" radius={[10, 10, 0, 0]}>
            {vendorData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
            ))}
          </Bar>
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
          const monthExistsInChart = chartData !== undefined && Object.keys(chartData)?.find(months => months === month)
          let nameMonthData

          if (monthExistsInChart) {
            nameMonthData = chartData?.[month]
            const graphs = Object.keys(nameMonthData).map((nameKey, index) => {
              const [firstName, lastName, ...userId] = `${nameKey}`.split('_')
              return {
                username: `${firstName} ${lastName}`,
                month: monthsShort[month],
                userId: Number(last(userId)),
                quarter: getQuarterByMonth(monthIndex),
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
            quarter: getQuarterByMonth(monthIndex),
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
    if (options?.length < 1) {
      return
    }
    setFpmOption([])

    if (options?.length > 5) {
      return
    }
    setFpmOption(options)

    filterGraphData(options, monthOption)
  }

  const getMonthValue = monthOption => {
    let selectedFpm = [] as any

    if (['Past Quarter', 'Current Quarter', 'All'].includes(monthOption?.label)) {
      selectedFpm = take(fieldProjectManagerOptions, 5)
    }

    setFpmOption(selectedFpm)

    setMonthOption(monthOption)
    filterGraphData(selectedFpm, monthOption)
  }
  const filterGraphData = (selectedFpm, monthOption) => {
    let selectedMonth, selectedQuater

    // Checks if this month is selected, then returns month in the short form like Jan, Feb
    if (monthOption?.label === 'This Month') {
      selectedMonth = format(new Date(), 'LLL', { locale: enUS })
    }
    // Checks if last month is selected, then returns month in the short form like Jan, Feb
    if (monthOption?.label === 'Last Month') {
      selectedMonth = format(subMonths(new Date(), 1), 'LLL', { locale: enUS })
    }
    // Checks if current quarter is selected, then returns months for that quarter
    if (monthOption?.label === 'Current Quarter') {
      selectedQuater = getQuarterByDate()
    }
    // Checks if past quarter is selected, then returns months for that quarter
    if (monthOption?.label === 'Past Quarter') {
      selectedQuater = getLastQuarterByDate()
    }

    selectedFpm = selectedFpm.map(n => n.value)
    const finalGraphData = data?.filter(
      a =>
        (!selectedMonth || a.month === selectedMonth) &&
        (!selectedQuater || a.quarter === selectedQuater) &&
        (!selectedFpm.length || selectedFpm.includes(a.userId)),
    )
    setGraphData(finalGraphData)
  }

  return (
    <>
      <Box bg="#F7FAFE" border="1px solid #EAE6E6" rounded={'13px'} width={'100%'}>
        <Box mb={15} mt={5} m={2}>
          <Flex>
            <Box width={'45%'} ml={5} mt={5}>
              <HStack>
                <FormLabel width={'120px'} ml={6} variant="strong-label" size="md">
                  Filter By Month:
                </FormLabel>
                <Box width={'250px'}>
                  <ReactSelect
                    name={`monthsDropdown`}
                    options={MonthOption}
                    onChange={getMonthValue}
                    defaultValue={monthOption}
                    selected={setMonthOption}
                    variant="light-label"
                    size="md"
                  />
                </Box>
              </HStack>
            </Box>
            <Box width={'55%'} mt={5}>
              <HStack>
                <FormLabel width={'60px'} variant="strong-label" size="md">
                  Filter By:
                </FormLabel>
                <Box width={'530px'}>
                  <ReactSelect
                    name={`fpmDropdown`}
                    value={fpmOption}
                    isDisabled={['This Month', 'Last Month'].includes(monthOption?.label)}
                    options={fieldProjectManagerOptions}
                    onChange={onFpmOptionChange}
                    defaultValue={fpmOption}
                    isOptionDisabled={() => fpmOption.length >= 5}
                    isClearable={false}
                    multiValueRemove={fpmOption.length === 1 ? { display: 'none' } : ''}
                    filterOptions={fpmOption.length === 1}
                    variant="light-label"
                    size="md"
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
          <OverviewGraph vendorData={graphData} width="98%" height={500} hasUsers monthCheck={monthOption} />
        )}
      </Box>
    </>
  )
}
