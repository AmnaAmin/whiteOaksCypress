import React, { useState } from 'react'
import { Box, FormLabel, Grid, GridItem, HStack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { monthNamesOptions, MonthOption, MonthOptionTypes } from 'api/performance'
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
  filterGraphData: (selectedFpms, selectedMonth, isMonthNameDropdownSelected?) => void
  fieldProjectManagerOptions: SelectOption[]
  setDefaultToTopFive: (val: boolean) => void
  setFpmFilter: (val) => void
  monthNameOption: SelectOption[]
  setMonthNameOption: (val) => void
  isRevenuePerformanceLoading?: boolean;
  isUsePerformanceLoading?: boolean
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
  monthNameOption,
  setMonthNameOption,
  isRevenuePerformanceLoading,
  isUsePerformanceLoading
}) => {
  const { t } = useTranslation()
  const [disableMonthNamesDropdown, setDisableMonthNamesDropdown] = useState<Boolean>(true);

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
    filterGraphData(selectedFpmOption, monthOption, false)
  }

  const getMonthValue = monthOption => {
    let selectedFpm = [] as any
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const isCurrentYearData = yearFilter === currentYear || !yearFilter
    const isPastYearData = yearFilter === currentYear - 1

    if ([MonthOptionTypes.lastYear, MonthOptionTypes.currentYear].includes(monthOption?.value)) setDisableMonthNamesDropdown(false);
    else {
      setDisableMonthNamesDropdown(true);
      setMonthNameOption([]);
    }

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
        filterGraphData(selectedFpm, monthOption, false)
      } else {
        setYearFilter(currentYear - 1)
      }
    }
  }

  const onMonthNameChange = (monthOption) => {
    setMonthNameOption(monthOption)
  }

  return (
    <Box mt={3} mb={3} bg="white" border="1px solid #EAE6E6" rounded={'6px'}>
      <Grid templateColumns="repeat(3, 1fr)" gap={0} m={5}>
        <GridItem rowSpan={2} colSpan={2} colStart={1} colEnd={2} mr={10}>
          <HStack>
            <FormLabel ml={8} variant="strong-label" size="md" w={"120px"}>
              {t(`${PERFORMANCE}.filterBy`)}
            </FormLabel>
            <Box width={'80%'}>
            <div data-testid="filter_by_time">
              <ReactSelect
              classNamePrefix={'filterByTime'}
                  name={`monthsDropdown`}
                  options={MonthOption.filter(m => m.value !== 'all')}
                  onChange={getMonthValue}
                  isDisabled={isRevenuePerformanceLoading || isUsePerformanceLoading}
                  defaultValue={monthOption}
                  selected={setMonthOption}
                  variant="light-label"
                  size="md"
                />
            </div>
            </Box>
          </HStack>
          <HStack mt={6}>
            <FormLabel ml={8} variant="strong-label" size="md" w={"120px"}>
              {t(`${PERFORMANCE}.filterByMonth`)}
            </FormLabel>
            <Box width={'80%'}>
              <div data-testid="filter_by_month">
                <ReactSelect
                classNamePrefix={'filterByMonth'}
                  name={`monthsNamesDropdown`}
                  options={monthNamesOptions}
                  isDisabled={disableMonthNamesDropdown || isRevenuePerformanceLoading || isUsePerformanceLoading}
                  onChange={onMonthNameChange}
                  value={monthNameOption}
                  selected={setMonthOption}
                  variant="light-label"
                  size="md"
                  isMulti
                />
              </div>
            </Box>
          </HStack>
        </GridItem>
        <GridItem colStart={2} colEnd={6}>
          <HStack>
            <FormLabel width={'10%'} variant="strong-label" size="md">
              {t(`${PERFORMANCE}.filterBy`)}
            </FormLabel>
            <Box width={'90%'} pr={8} minHeight={'40px'}>
              <div data-testid="filter_by_fpm">
                <ReactSelect
                classNamePrefix={'filterByFpm'}
                  name={`fpmDropdown`}
                  value={fpmOption}
                  options={fieldProjectManagerOptions}
                  onChange={onFpmOptionChange}
                  isDisabled={isRevenuePerformanceLoading || isUsePerformanceLoading}
                  defaultValue={fpmOption}
                  isOptionDisabled={() => fpmOption.length >= 5}
                  isClearable={false}
                  variant="light-label"
                  size="md"
                  isMulti
                />
              </div>
            </Box>
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  )
}
