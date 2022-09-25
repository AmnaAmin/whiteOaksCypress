import { Box, Flex, FormLabel, HStack } from '@chakra-ui/react'
import { constMonth, constMonthOption } from 'api/performance'
import ReactSelect from 'components/form/react-select'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { months, monthsShort } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'

type GraphData = {
  month: any
  Revenue: any
  Bonus: any
  Profit: any
}[]

const PerformanceGraph: React.FC<{ chartData?: any; isLoading: boolean }> = ({ chartData, isLoading }) => {
  const [monthOption, setMonthOption] = useState(constMonthOption[0])
  const [graphData, setGraphData] = useState<GraphData>()
  const currentMonth = format(new Date(), 'LLL', { locale: enUS })
  const vendors = [chartData?.chart]
  const vendorData = useMemo(
    () =>
      months.map(key => {
        const monthExistsInChart = chartData !== undefined && Object.keys(vendors[0])?.find(months => months === key)
        let nameMonthData
        if (monthExistsInChart) {
          nameMonthData = chartData?.chart[key]
        }
        return {
          month: monthsShort[key],
          Bonus: nameMonthData?.bonus,
          Profit: nameMonthData?.profit,
          Revenue: nameMonthData?.revenue,
        }
      }),
    [chartData],
  )

  useEffect(() => {
    const finalGraphData = vendorData?.filter(a => a.month === currentMonth)
    setGraphData(finalGraphData)
  }, [vendorData])

  const getMonthValue = monthOption => {
    setMonthOption(monthOption)
    filterGraphData(monthOption)
    console.log('month', monthOption)
  }
  const filterGraphData = monthOption => {
    let selectedMonth
    if (monthOption?.label === 'This Month') {
      selectedMonth = format(new Date(), 'LLL', { locale: enUS })
    }

    const finalGraphData = vendorData?.filter(a => !selectedMonth || a.month === selectedMonth)
    setGraphData(finalGraphData)
    console.log('finalGraphData', finalGraphData)
  }

  // const getMonthValue = monthOption => {
  //   setMonthOption(monthOption)
  //   let selectedMonth

  //   if (monthOption?.label === 'This Month') {
  //     selectedMonth = format(new Date(), 'LLL', { locale: enUS })
  //   }
  //   if (monthOption?.label === 'All') {
  //     selectedMonth = 'All'
  //   }
  //   const finalGraphData = selectedMonth === 'All' ? vendorData : vendorData?.filter(a => a.month === selectedMonth)
  //   setGraphData(finalGraphData)
  // }

  return (
    <>
      <Box>
        <Flex mb={5}>
          <Box mt={5} flex={1}>
            <HStack>
              <Flex ml={'200px'} justifyContent={'center'} flex={1}>
                <FormLabel width={'200px'} variant="strong-label" size="lg">
                  Performance Per Month
                </FormLabel>
              </Flex>
              <Box width={'150px'}>
                <ReactSelect
                  name={`monthsDropdown`}
                  options={constMonth}
                  onChange={getMonthValue}
                  defaultValue={monthOption}
                  selected={setMonthOption}
                />
              </Box>
            </HStack>
          </Box>
        </Flex>
        {isLoading ? (
          <BlankSlate size="sm" />
        ) : (
          <OverviewGraph vendorData={graphData} width="98%" height={380} hasUsers={false} />
        )}
      </Box>
    </>
  )
}

export const OverviewGraph = ({ vendorData, width, height, hasUsers }) => {
  const labels = [
    { key: 'Bonus', color: '#FB8832' },
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
              // tick={renderQuarterTick}
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
            data-testid="tooltip-overview"
            cursor={{ fill: '#EBF8FF' }}
          />

          <Bar barSize={30} dataKey="Bonus" fill="#FB8832" radius={[10, 10, 0, 0]} hide={barProps['Bonus'] === true} />
          <Bar
            barSize={30}
            dataKey="Profit"
            fill="#949AC2"
            radius={[10, 10, 0, 0]}
            hide={barProps['Profit'] === true}
          />
          <Bar
            barSize={30}
            dataKey="Revenue"
            fill="#68B8EF"
            radius={[10, 10, 0, 0]}
            hide={barProps['Revenue'] === true}
          />
          {/* { !hasUsers && */}
          <Legend
            onClick={selectBar}
            wrapperStyle={{
              lineHeight: '31px',
              position: 'relative',
              bottom: '20px',
              left: '36px',
            }}
            iconType="circle"
            iconSize={10}
            align="center"
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
          {/* } */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceGraph

// export const PerformanceGraphWithUsers: React.FC<{ chartData?: any; isLoading: boolean }> = ({
//   chartData,
//   isLoading,
// }) => {
//   const [monthOption, setMonthOption] = useState(constMonthOption[0])
//   const [fpmOption, setFpmOption] = useState([])
//   const [graphData, setGraphData] = useState<GraphData>()
//   const currentMonth = format(new Date(), 'LLL', { locale: enUS })

//   const data = useMemo(
//     () =>
//       flatten(
//         months.map((month, monthIndex) => {
//           const monthExistsInChart = Object.keys(chartData?.chart)?.find(months => months === month)
//           let nameMonthData
//           if (monthExistsInChart) {
//             nameMonthData = chartData?.chart?.[month]
//             const graphs = Object.keys(nameMonthData).map((nameKey, index) => {
//               const [firstName, lastName, ...userId] = `${nameKey}`.split('_')
//               return {
//                 username: `${firstName} ${lastName}`,
//                 month: monthsShort[month],
//                 userId: Number(last(userId)),
//                 quater: getQuarterByMonth(monthIndex),
//                 Revenue: nameMonthData[nameKey]?.revenue,
//               }
//             })
//             let newgraphs = graphs.map((n, i) => ({
//               ...n,
//               centerMonth: Math.floor(graphs.length / 2) === i ? n.month : undefined,
//             }))
//             return newgraphs
//           }

//           return {
//             month: monthsShort[month],
//             centerMonth: monthsShort[month],
//             quater: getQuarterByMonth(monthIndex),
//             username: '',
//             userId: 0,
//             Bonus: 0,
//             Profit: 0,
//             Revenue: 0,
//           }
//         }),
//       ),
//     [chartData],
//   )

//   useEffect(() => {
//     const finalGraphData = data?.filter(a => a.month === currentMonth)
//     setGraphData(finalGraphData)
//   }, [data])

//   const getMonthValue = monthOption => {
//     setMonthOption(monthOption)
//     filterGraphData(monthOption)
//   }
//   const filterGraphData = monthOption => {
//     const finalGraphData =
//       monthOption?.label === 'All' ? data?.filter(a => a.month) : data?.filter(a => a.month === monthOption)
//     setGraphData(finalGraphData)
//   }

//   return (
//     <>
//       <Card>
//         <Box mb={15} mt={5}>
//           <Flex>
//             <Box width={'400px'} ml={5}>
//               <HStack>
//                 <FormLabel width={'120px'}>Filter By Month:</FormLabel>
//                 <Box width={'200px'}>
//                   <ReactSelect
//                     name={`monthsDropdown`}
//                     options={constMonthOption}
//                     onChange={getMonthValue}
//                     defaultValue={monthOption}
//                     selected={setMonthOption}
//                   />
//                 </Box>
//               </HStack>
//             </Box>
//           </Flex>
//         </Box>
//         {isLoading ? (
//           <BlankSlate size="sm" />
//         ) : (
//           <OverviewGraph vendorData={graphData} width="98%" height={360} hasUsers />
//         )}
//       </Card>
//     </>
//   )
// }
