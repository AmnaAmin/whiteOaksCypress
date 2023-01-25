import React from 'react'
import { Box, Center, CenterProps, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useGetProjectFinancialOverview } from 'api/projects'

const InfoStructureCard: React.FC<{ amount; isLoading: boolean } & CenterProps> = ({
  amount,
  children,
  isLoading,
  title,
  ...rest
}) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="16px" fontWeight={400} color="gray.500">
        <Text color="gray.600" noOfLines={1}>
          {title}
        </Text>
        {isLoading ? (
          <BlankSlate size="sm" />
        ) : (
          <Text color="#4A5568" fontSize="18px" fontStyle="normal" fontWeight="600" top="71px">
            {amount}
          </Text>
        )}
      </Box>
    </Center>
  )
}

export const AmountDetailsCard: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const { t } = useTranslation()

  const {
    isLoading,
    finalSOWAmount,
    accountPayable,
    projectTotalCost,
    profits,
    profitMargin,
    material,
    vendorPayment,
  } = useGetProjectFinancialOverview(projectId) // revenue

  return (
    <Flex py={9} w="100%" bg="white" borderRadius="4px" box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)">
      <InfoStructureCard amount={finalSOWAmount} title={t('projects.projectAmount.finalSOW')} isLoading={isLoading} />
      <InfoStructureCard
        amount={accountPayable}
        isLoading={isLoading}
        title={t('projects.projectAmount.accountPayable')}
      />
      <InfoStructureCard
        amount={vendorPayment}
        isLoading={isLoading}
        title={t('projects.projectAmount.vendorPayment')}
      />
      <InfoStructureCard amount={material} isLoading={isLoading} title={t('projects.projectAmount.materials')} />
      <InfoStructureCard
        amount={projectTotalCost}
        isLoading={isLoading}
        title={t('projects.projectAmount.projectCost')}
      />
      {/* <InfoStructureCard amount={revenue} isLoading={isLoading} title={t('projects.projectAmount.revenue')} /> */}
      <InfoStructureCard amount={profits} isLoading={isLoading} title={t('projects.projectAmount.profits')} />
      <InfoStructureCard
        amount={profitMargin}
        isLoading={isLoading}
        title={t('projects.projectAmount.profitMargins')}
        border="none"
      />
    </Flex>
  )
}
