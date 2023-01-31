import React from 'react'
import { Box, FormLabel, Grid, GridItem, HStack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { MonthOption } from 'api/performance'
import { SelectOption } from 'types/transaction.type'
import { PERFORMANCE } from './performance.i18n'
import { useTranslation } from 'react-i18next'

export const PerformanceFilters: React.FC<{
  yearFilter: number | undefined | string
  setYearFilter: (val) => void
  setFpmOption: (val) => void
  fpmOption: (SelectOption | null)[]
  setMonthOption: (val) => void
  monthOption: SelectOption
  filterGraphData: (selectedFpms, selectedMonth) => void
  fieldProjectManagerOptions: SelectOption[]
  setDefaultToTopFive: (val: boolean) => void
  setFpmFilter: (val) => void
}> = ({
  yearFilter,
  setYearFilter,
  setFpmOption,
  fpmOption,
  setMonthOption,
  monthOption,
  filterGraphData,
  fieldProjectManagerOptions,
  setDefaultToTopFive,
  setFpmFilter,
}) => {
  const { t } = useTranslation()

  const onFpmOptionChange = options => {
    if (options?.length < 1) {
      setFpmOption([]) // using FPM option to render Filter By Select
      setFpmFilter([]) // using FPM filter to create query for fetching selected fpm's performance
    }

    if (options?.length > 5) {
      return
    }

    // fix fpm names length to keep them within the select bar
    const selectedFpmOption =
      options?.map(fpm => ({
        value: (fpm as SelectOption)?.value,
        label: (fpm as SelectOption)?.label,
      })) || []

    setFpmOption(selectedFpmOption)
    setFpmFilter(selectedFpmOption)
    filterGraphData(selectedFpmOption, monthOption)
  }

  const getMonthValue = monthOption => {
    let selectedFpm = [] as any
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const isCurrentYearData = yearFilter === currentYear || !yearFilter
    const isPastYearData = yearFilter === currentYear - 1

    setFpmOption(selectedFpm) //empty select
    setFpmFilter(selectedFpm) //empty fpm query data
    setMonthOption(monthOption)
    if (!['lastMonth', 'thisMonth'].includes(monthOption?.value)) {
      setDefaultToTopFive(true) // Indicator to set default Top Five FPMs on options change other than this and last month.
    }
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

  return (
    <Box mt={3} mb={3} bg="white" border="1px solid #EAE6E6" rounded={'6px'}>
      <Grid h="40px" templateColumns="repeat(3, 1fr)" gap={0} m={5}>
        <GridItem rowSpan={2} colSpan={2} colStart={1} colEnd={2}>
          <HStack>
            <FormLabel ml={8} variant="strong-label" size="md">
              {t(`${PERFORMANCE}.filterByMonth`)}
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
              {t(`${PERFORMANCE}.filterBy`)}
            </FormLabel>
            <Box width={'90%'} pr={8} minHeight={'40px'}>
              <ReactSelect
                name={`fpmDropdown`}
                value={fpmOption}
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
    </Box>
  )
}
