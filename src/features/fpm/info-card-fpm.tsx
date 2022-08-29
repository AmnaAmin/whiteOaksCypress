import React from 'react'
import { Box, Center, CenterProps, Flex, HStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useGetProjectFinancialOverview } from 'api/projects'

const InfoStructureCard: React.FC<
  { amount; isLoading: boolean; bonus: string; profit: string; revenue?: string } & CenterProps
> = ({ amount, children, isLoading, title, bonus, profit, revenue, ...rest }) => {
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
              <Box h="40px" textAlign={'center'}>
                <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                  {bonus}
                </Text>
                <Text fontWeight={400} color="gray.500">
                  $ 200.00
                </Text>
              </Box>
              <Box h="40px" textAlign={'center'}>
                <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                  {profit}
                </Text>
                <Text fontWeight={400} color="gray.500">
                  $ 200.00
                </Text>
              </Box>
              {revenue && (
                <Box h="40px" textAlign={'center'}>
                  <Text color="gray.600" fontSize={'16px'} fontWeight={500}>
                    {revenue}
                  </Text>
                  <Text fontWeight={400} color="gray.500">
                    {revenue}
                  </Text>
                </Box>
              )}
            </HStack>
          </>
        )}
      </Box>
    </Center>
  )
}

export const InformationCardFPM: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const { t } = useTranslation()

  const { isLoading, finalSOWAmount, accountPayable, projectTotalCost } = useGetProjectFinancialOverview(projectId)

  return (
    <Flex py={9} w="100%" bg="white" borderRadius="4px" box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)">
      <InfoStructureCard
        bonus="Bonus"
        profit="Profit"
        revenue={'revenue'}
        amount={finalSOWAmount}
        title={t('Current Month')}
        isLoading={isLoading}
      />
      <InfoStructureCard
        bonus="Bonus"
        profit="Profit"
        revenue={'Revenue'}
        amount={accountPayable}
        isLoading={isLoading}
        title={t('Previous Month')}
      />
      <InfoStructureCard
        bonus="Target"
        profit="Bonus%"
        amount={projectTotalCost}
        isLoading={isLoading}
        title={t('Goals')}
      />
    </Flex>
  )
}
