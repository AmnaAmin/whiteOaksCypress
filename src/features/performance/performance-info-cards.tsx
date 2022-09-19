import React from 'react'
import { Box, Center, CenterProps, Flex, FormLabel, Icon } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { usePerformance } from 'api/performance'
import { currencyFormatter } from 'utils/string-formatters'
import RevenueIcon from 'icons/revenue-icon'
import ProfitIcon from 'icons/profit-icon'
import { Card } from 'components/card/card'

type InfoProps = {
  isLoading: boolean
}

const IconElement: React.FC<{ Icon: React.ElementType }> = ({ Icon }) => {
  return (
    <Center rounded="50%" w={{ base: '40px', md: '48px' }} h={{ base: '40px', md: '48px' }}>
      <Flex dir="flex-end">
        <Icon />
      </Flex>
    </Center>
  )
}

const InfoStructureCard: React.FC<InfoProps & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={4} {...rest}>
      <Box fontSize="14px" color="gray.500">
        <FormLabel variant="strong-label" size="md">
          {title}
        </FormLabel>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
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
  //   const total = revenue + profit + disqualifiedRevenue

  return (
    <>
      <Flex
        py={6}
        h={{ base: 'unset', xl: '97px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
        mt={'5'}
        mb={'5'}
      >
        <Center width={'33%'} borderRight="1px solid #E5E5E5" px={4} flexWrap={'wrap'}>
          <IconElement Icon={ProfitIcon} />
          <FormLabel variant="light-label" size="md">
              <Box>{'Revenue'}</Box>
            </FormLabel>
            <FormLabel variant="strong-label" size="md" flexDir={'column'}>
              {currencyFormatter(revenue)}
            </FormLabel>
        </Center>
        <Center width={'33%'} borderRight="1px solid #E5E5E5" px={4}>
          <IconElement Icon={ProfitIcon} />
          <FormLabel variant="light-label" size="md">
              <Box>{'Disqualified Revenue'}</Box>
            </FormLabel>
            <FormLabel variant="strong-label" size="md">
              {currencyFormatter(disqualifiedRevenue)}
            </FormLabel>
        </Center>
        <Center width={'33%'}>
          <IconElement Icon={RevenueIcon} />
          <FormLabel variant="light-label" size="md">
              <Box>{'Profit'}</Box>
            </FormLabel>
            <FormLabel variant="strong-label" size="md">
              <Box>{currencyFormatter(profit)}</Box>
            </FormLabel>
        </Center>
      </Flex>
    </>
  )
}
