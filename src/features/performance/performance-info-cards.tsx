import React from 'react'
import { Box, Center, Flex, FormLabel } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { usePerformance } from 'api/performance'
import { currencyFormatter } from 'utils/string-formatters'
import RevenueIcon from 'icons/revenue-icon'
import ProfitIcon from 'icons/profit-icon'
import DisqualifiedRevenueIcon from 'icons/disqualified-revenue-icon'

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
  isLoading: boolean
}> = ({ isLoading }) => {
  const { data: performance } = usePerformance()
  const revenue = performance?.map(p => p?.revenue).reduce((partialSum, a) => partialSum + a, 0)
  const profit = performance?.map(p => p?.profit).reduce((partialSum, a) => partialSum + a, 0)
  const disqualifiedRevenue = performance?.map(p => p?.disqualifiedRevenue).reduce((partialSum, a) => partialSum + a, 0)

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
        {isLoading ? (
          <BlankSlate width="100%" />
        ) : (
          <>
            <Center width={'33%'} borderRight="1px solid #E5E5E5" px={4} flexWrap={'wrap'}>
              <IconElement Icon={RevenueIcon} isLoading={isLoading} />
              <Flex flexDir={'column'} ml={3}>
                <FormLabel variant="light-label" size="md">
                  <Box>{'Revenue'}</Box>
                </FormLabel>
                <FormLabel variant="strong-label" size="md">
                  {currencyFormatter(revenue)}
                </FormLabel>
              </Flex>
            </Center>
            <Center width={'33%'} borderRight="1px solid #E5E5E5" px={4}>
              <IconElement Icon={DisqualifiedRevenueIcon} isLoading={isLoading} />
              <Flex flexDir={'column'} ml={3}>
                <FormLabel variant="light-label" size="md">
                  <Box>{'Disqualified Revenue'}</Box>
                </FormLabel>
                <FormLabel variant="strong-label" size="md">
                  {currencyFormatter(disqualifiedRevenue)}
                </FormLabel>
              </Flex>
            </Center>
            <Center width={'33%'}>
              <IconElement Icon={ProfitIcon} isLoading={isLoading} />
              <Flex flexDir={'column'} ml={3}>
                <FormLabel variant="light-label" size="md">
                  <Box>{'Profit'}</Box>
                </FormLabel>
                <FormLabel variant="strong-label" size="md">
                  <Box>{currencyFormatter(profit)}</Box>
                </FormLabel>
              </Flex>
            </Center>
          </>
        )}
      </Flex>
    </>
  )
}
