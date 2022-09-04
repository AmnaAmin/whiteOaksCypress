import React from 'react'
import { Box, Center, CenterProps, Flex, HStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { currencyFormatter } from 'utils/string-formatters'
import { useMonthData } from './hooks'
import { format } from 'date-fns'
import { enAU } from 'date-fns/locale'

const InfoStructureCard: React.FC<
  {
    amount
    previousBonus?: number | any
    newBonus?: number | any
    isLoading: boolean
    bonus?: string
    profit?: string
    revenue?: string
    goals?: string
    target?: string
  } & CenterProps
> = ({
  amount,
  newBonus,
  goals,
  previousBonus,
  target,
  children,
  isLoading,
  title,
  bonus,
  profit,
  revenue,
  ...rest
}) => {
  return (
    <Center h="55px" flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box mb={'35px'} fontSize="16px" fontWeight={400} color="gray.600" textAlign={'center'}>
        <Text fontWeight={600} h="40px" color="gray.600">
          {title}
        </Text>
        {isLoading ? (
          <BlankSlate size="sm" />
        ) : (
          <>
            <HStack spacing="54px">
              {!goals && (
                <>
                  <Box h="40px" textAlign={'center'}>
                    <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                      {bonus}
                    </Text>
                    <Text fontWeight={400} color="gray.500">
                      {previousBonus || newBonus ? currencyFormatter(previousBonus || newBonus) : '$0.00'}
                    </Text>
                  </Box>
                  <Box h="40px" textAlign={'center'}>
                    <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                      {profit}
                    </Text>
                    <Text fontWeight={400} color="gray.500">
                      {amount?.profit ? currencyFormatter(amount?.profit) : '$0.00'}
                    </Text>
                  </Box>
                  <Box h="40px" textAlign={'center'}>
                    <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                      {revenue}
                    </Text>
                    <Text fontWeight={400} color="gray.500">
                      {amount?.revenue ? currencyFormatter(amount?.revenue) : '$0.00'}
                    </Text>
                  </Box>
                </>
              )}
              {goals && (
                <>
                  <Box h="40px" textAlign={'center'}>
                    <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                      {target}
                    </Text>
                    <Text fontWeight={400} color="gray.500">
                      {amount ? currencyFormatter(amount?.target) : '$0.00'}
                    </Text>
                  </Box>
                  <Box h="40px" textAlign={'center'}>
                    <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                      {bonus}
                    </Text>
                    <Text fontWeight={400} color="gray.500">
                      {amount?.newBonus ? `${amount?.newBonus}%` : '0%'}
                    </Text>
                  </Box>
                </>
              )}
            </HStack>
          </>
        )}
      </Box>
    </Center>
  )
}

export const InformationCardFPM: React.FC<{ projectId?: string; chartData: any; isLoading: boolean }> = ({
  projectId,
  chartData,
  isLoading,
}) => {
  const { t } = useTranslation()

  const currentMonth = format(new Date(), 'LLLL', { locale: enAU })
  const current = new Date()
  current.setMonth(current.getMonth() - 1)
  const previousMonth = current.toLocaleString('default', { month: 'long' })
  const { nameMonthData: currentMonthData } = useMonthData(currentMonth, chartData)
  const { nameMonthData: previousMonthData } = useMonthData(previousMonth, chartData)

  return (
    <Flex py={9} w="100%" bg="white" borderRadius="4px" box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)">
      <InfoStructureCard
        bonus="Bonus"
        newBonus={chartData?.currentBonus}
        profit="Profit"
        revenue={'revenue'}
        amount={currentMonthData}
        title={t('Current Month')}
        isLoading={isLoading}
      />
      <InfoStructureCard
        bonus="Bonus"
        previousBonus={chartData?.previousBonus}
        profit="Profit"
        revenue={'Revenue'}
        amount={previousMonthData}
        isLoading={isLoading}
        title={t('Previous Month')}
      />
      <InfoStructureCard
        bonus="Bonus%"
        goals="Goals"
        target="Target"
        amount={chartData}
        isLoading={isLoading}
        title={t('Goals')}
      />
    </Flex>
  )
}
