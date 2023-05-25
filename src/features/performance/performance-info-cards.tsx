import React from 'react'
import { Box, Center, Flex, FormLabel } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { currencyFormatter } from 'utils/string-formatters'
import RevenueIcon from 'icons/revenue-icon'
import ProfitIcon from 'icons/profit-icon'
import DisqualifiedRevenueIcon from 'icons/disqualified-revenue-icon'
import { PERFORMANCE } from './performance.i18n'
import { useTranslation } from 'react-i18next'
import { ProfitMarginIcon } from 'icons/quicklookup-icons'

const IconElement: React.FC<{ Icon: React.ElementType; isLoading: boolean }> = ({ Icon }) => {
  return (
    <Center rounded="50%" w={{ base: '40px', md: '48px' }} h={{ base: '40px', md: '48px' }}>
      <Flex dir="flex-end">
        <Icon />
      </Flex>
    </Center>
  )
}

export const PerformanceInfoCards: React.FC<{
  performance: any
  isPerformanceLoading: boolean
}> = ({ isPerformanceLoading, performance }) => {
  const { t } = useTranslation()

  const revenue = performance?.map(p => p?.revenue).reduce((partialSum, a) => partialSum + a, 0)
  const profit = performance?.map(p => p?.profit).reduce((partialSum, a) => partialSum + a, 0)
  const disqualifiedRevenue = performance?.map(p => p?.disqualifiedRevenue).reduce((partialSum, a) => partialSum + a, 0)
  const profitMargin = (profit / revenue) * 100

  return (
    <>
      <Flex
        py={6}
        h={{ base: 'unset', xl: '97px' }}
        w="100%"
        bg="white"
        borderRadius="6px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
        mt={'3'}
        mb={'3'}
      >
        {isPerformanceLoading ? (
          <BlankSlate width="100%" />
        ) : (
          <>
            <Center width={'33%'} borderRight="1px solid #E5E5E5" px={4} flexWrap={'wrap'}>
              <IconElement Icon={RevenueIcon} isLoading={isPerformanceLoading} />
              <Flex flexDir={'column'} ml={3}>
                <FormLabel variant="light-label" size="md">
                  <Box>{t(`${PERFORMANCE}.revenue`)}</Box>
                </FormLabel>
                <FormLabel variant="strong-label" size="md">
                  <Box data-testid="revenue_value">{currencyFormatter(revenue)} </Box>
                </FormLabel>
              </Flex>
            </Center>
            <Center width={'33%'} borderRight="1px solid #E5E5E5" px={4}>
              <IconElement Icon={DisqualifiedRevenueIcon} isLoading={isPerformanceLoading} />
              <Flex flexDir={'column'} ml={3}>
                <FormLabel variant="light-label" size="md">
                  <Box>{t(`${PERFORMANCE}.disqualifiedRevenue`)}</Box>
                </FormLabel>
                <FormLabel variant="strong-label" size="md">
                  <Box data-testid="disqualifiedrevenue_value"> {currencyFormatter(disqualifiedRevenue)} </Box>
                </FormLabel>
              </Flex>
            </Center>
            <Center width={'33%'} borderRight="1px solid #E5E5E5">
              <IconElement Icon={ProfitIcon} isLoading={isPerformanceLoading} />
              <Flex flexDir={'column'} ml={3}>
                <FormLabel variant="light-label" size="md">
                  <Box> {t(`${PERFORMANCE}.profit`)}</Box>
                </FormLabel>
                <FormLabel variant="strong-label" size="md">
                  <Box data-testid="profit_value">{currencyFormatter(profit)}</Box>
                </FormLabel>
              </Flex>
            </Center>
            <Center width={'33%'}>
              <IconElement Icon={ProfitMarginIcon} isLoading={isPerformanceLoading} />
              <Flex flexDir={'column'} ml={3}>
                <FormLabel variant="light-label" size="md">
                  <Box> {t(`${PERFORMANCE}.profitMargin`)}</Box>
                </FormLabel>
                <FormLabel variant="strong-label" size="md">
                  <Box data-testid="profit_margins">{profitMargin ? profitMargin?.toFixed(2) : 0}%</Box>
                </FormLabel>
              </Flex>
            </Center>
          </>
        )}
      </Flex>
    </>
  )
}
