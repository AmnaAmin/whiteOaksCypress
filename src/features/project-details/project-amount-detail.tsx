import React from 'react'
import { Box, Center, CenterProps, Flex, Icon, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useGetProjectFinancialOverview } from 'api/projects'
import { BiCoinStack, BiDollar, BiDollarCircle, BiPaintRoll, BiStats } from 'react-icons/bi'
import { SummaryIconTwelve } from 'icons/pc-project-icons'

const InfoStructureCard: React.FC<{ amount; isLoading: boolean, icon: any} & CenterProps> = ({
  amount,
  children,
  isLoading,
  title,
  icon,
  ...rest
}) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="16px" fontWeight={400} color="gray.500" >
      <Flex alignItems="center">
    <Icon as={icon} boxSize={6} color="#345EA6" marginTop="15px"/>
    <Text color="gray.600" noOfLines={1} marginLeft={3}>
      {title}
    </Text>
  </Flex>
        {isLoading ? (
          <BlankSlate size="sm" />
        ) : (
          <Text color="#4A5568" marginLeft={8} fontSize="18px" fontStyle="normal" fontWeight="600" top="71px">
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
    <Flex py={9} w="100%" bg="white" borderRadius="4px" border="1px solid #E5E5E5" box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)">
      <InfoStructureCard 
       icon={BiDollarCircle}
      data-testid ='final_sow_amount' 
      amount={finalSOWAmount} 
      title={t('projects.projectAmount.finalSOW')} 
      isLoading={isLoading} />
      <InfoStructureCard
      icon={BiDollarCircle}
      data-testid ='account_payable'
        amount={accountPayable}
        isLoading={isLoading}
        title={t('projects.projectAmount.accountPayable')}
      />
      <InfoStructureCard
      icon={BiCoinStack}
      data-testid ='vendor_payment'
        amount={vendorPayment}
        isLoading={isLoading}
        title={t('projects.projectAmount.vendorPayment')}
      />
      <InfoStructureCard
      icon={BiPaintRoll }
       data-testid ='Wo_material'
       amount={material}
       isLoading={isLoading} 
       title={t('projects.projectAmount.materials')} 
       />

      <InfoStructureCard
      icon={SummaryIconTwelve}
      data-testid ='project_total_cost'
        amount={projectTotalCost}
        isLoading={isLoading}
        title={t('projects.projectAmount.projectCost')}
        />
     
      <InfoStructureCard 
       icon={BiDollar} 
       data-testid ='project_profits'  
       amount={profits} 
       isLoading={isLoading} 
       title={t('projects.projectAmount.profits')}
        />

      <InfoStructureCard
       icon={BiStats}
       data-testid ='profit_margin'
        amount={profitMargin}
        isLoading={isLoading}
        title={t('projects.projectAmount.profitMargins')}
        border="none"
      />
    </Flex>
  )
}
