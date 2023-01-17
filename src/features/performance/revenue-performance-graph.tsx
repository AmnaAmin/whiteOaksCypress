import { Box, Center, FormLabel, Grid, GridItem, HStack, Spinner } from '@chakra-ui/react'
import { useFPMs } from 'api/pc-projects'
import { MonthOption } from 'api/performance'
import ReactSelect from 'components/form/react-select'
import { subMonths, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { flatten, take, last } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts'
import { SelectOption } from 'types/transaction.type'
import { months, monthsShort, getQuarterByDate, getLastQuarterByDate, getQuarterByMonth } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'

type GraphData = {
  username: string
  month: any
  Revenue: any
  Profit: any
}[]

export const OverviewGraph = ({ vendorData, width, height, hasUsers, monthCheck }) => {
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
            angle={-45}
            interval={Math.floor(vendorData?.length / 60)}
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
              bottom: '50px',
              left: '40px',
            }}
            iconType="circle"
            iconSize={10}
            align="center"
            formatter={value => {
              return (
                <Box display="inline-flex" marginInlineEnd="30px">
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

export const PerformanceGraphWithUsers: React.FC<{
  chartData?: any
  isLoading: boolean
  setYearFilter: (value) => void
  yearFilter: string | number | null
  isFetching: boolean
}> = ({ chartData, isLoading, setYearFilter, yearFilter, isFetching }) => {
  const { fieldProjectManagerOptions } = useFPMs()
  const [monthOption, setMonthOption] = useState(MonthOption[0])
  const [fpmOption, setFpmOption] = useState([])
  const [graphData, setGraphData] = useState<GraphData>()

  const data = useMemo(
    () =>
      flatten(
        months?.map((month, monthIndex) => {
          const monthExistsInChart = Object?.keys(chartData)?.find(months => months === month)
          let nameMonthData

          if (monthExistsInChart) {
            nameMonthData = chartData?.[month]
            const graphs = Object?.keys(nameMonthData)?.map((nameKey, index) => {
              const [firstName, lastName, ...userId] = `${nameKey}`.split('_')
              return {
                username: `${firstName} ${lastName}`,
                month: monthsShort[month],
                userId: Number(last(userId)),
                quarter: getQuarterByMonth(monthIndex),
                Revenue: nameMonthData[nameKey]?.revenue,
                Profit: nameMonthData[nameKey]?.profit,
              }
            })
            let newgraphs = graphs?.map((n, i) => ({
              ...n,
              centerMonth: Math.floor(graphs?.length / 2) === i ? n?.month : undefined,
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
    filterGraphData(fpmOption, monthOption)
  }, [data])

  const onFpmOptionChange = options => {
    if (options?.length < 1) {
      return
    }
    setFpmOption([])

    if (options?.length > 5) {
      return
    }

    // fix fpm names length to keep them within the select bar
    const selectedFpmOption =
      options?.map(fpm => ({
        value: (fpm as SelectOption)?.value,
        label: (fpm as SelectOption)?.label.substring(0, 8) + '..',
      })) || []

    setFpmOption(selectedFpmOption)

    filterGraphData(selectedFpmOption, monthOption)
  }

  const getMonthValue = monthOption => {
    let selectedFpm = [] as any
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const isCurrentYearData = yearFilter === currentYear || !yearFilter
    const isPastYearData = yearFilter === currentYear - 1

    if (!['lastMonth', 'thisMonth'].includes(monthOption?.value)) {
      // fix fpm names length to keep them within the select bar
      const getFpm = take(fieldProjectManagerOptions, 5)
      selectedFpm =
        getFpm?.map(fpm => ({
          value: (fpm as SelectOption)?.value,
          label: (fpm as SelectOption)?.label.substring(0, 8) + '..',
        })) || []
    }

    setFpmOption(selectedFpm)
    setMonthOption(monthOption)

    if (
      ['thisMonth', 'currentQuarter', 'currentYear'].includes(monthOption?.value) ||
      (monthOption?.label === 'Last Month' && currentMonth !== 0) ||
      (monthOption?.label === 'Past Quarter' && ![0, 1, 2].includes(currentMonth))
    ) {
      if (isCurrentYearData) {
        filterGraphData(selectedFpm, monthOption)
      } else {
        setYearFilter(currentYear)
      }
    }

    if (
      monthOption?.label === 'Last Year' ||
      (monthOption?.label === 'Last Month' && currentMonth === 0) ||
      (monthOption?.label === 'Past Quarter' && [0, 1, 2].includes(currentMonth))
    ) {
      if (isPastYearData) {
        filterGraphData(selectedFpm, monthOption)
      } else {
        setYearFilter(currentYear - 1)
      }
    }
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
      selectedQuater = getLastQuarterByDate() !== 0 ? getLastQuarterByDate() : 4
    }

    selectedFpm = selectedFpm?.map(n => n?.value)
    const finalGraphData = data?.filter(
      a =>
        (!selectedMonth || a?.month === selectedMonth) &&
        (!selectedQuater || a?.quarter === selectedQuater) &&
        (!selectedFpm?.length || selectedFpm?.includes(a?.userId)),
    )
    setGraphData(finalGraphData)
  }

  return (
    <>
      <Box bg="#F7FAFE" border="1px solid #EAE6E6" rounded={'6px'}>
        <Grid h="40px" templateColumns="repeat(3, 1fr)" gap={0} m={5}>
          <GridItem rowSpan={2} colSpan={2} colStart={1} colEnd={2}>
            <HStack>
              <FormLabel ml={8} variant="strong-label" size="md">
                Filter By Month:
              </FormLabel>
              <Box width={'50%'}>
                <ReactSelect
                  name={`monthsDropdown`}
                  options={MonthOption.filter(m => m.value !== 'all')}
                  onChange={getMonthValue}
                  defaultValue={monthOption}
                  selected={setMonthOption}
                  variant="light-label"
                  size="md"
                />
              </Box>
            </HStack>
          </GridItem>
          <GridItem colStart={2} colEnd={6}>
            <HStack>
              <FormLabel width={'10%'} variant="strong-label" size="md">
                Filter By:
              </FormLabel>
              <Box width={'90%'} pr={8} minHeight={'40px'}>
                <ReactSelect
                  name={`fpmDropdown`}
                  value={fpmOption}
                  isDisabled={['This Month', 'Last Month'].includes(monthOption?.label)}
                  options={fieldProjectManagerOptions}
                  onChange={onFpmOptionChange}
                  defaultValue={fpmOption}
                  isOptionDisabled={() => fpmOption.length >= 5}
                  isClearable={false}
                  variant="light-label"
                  size="md"
                  isMulti
                />
              </Box>
            </HStack>
          </GridItem>
        </Grid>
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
