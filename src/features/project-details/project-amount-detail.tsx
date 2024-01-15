import React from 'react'
import { Box, Center, CenterProps, Flex, Icon, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useGetProjectFinancialOverview } from 'api/projects'
import { IconType } from 'react-icons'
import { VendorPaymentIcon, MaterialIcon, ProjectCostIcon, ProfitIcon, FinalSowIcon, AccountPayableIcon, ProfitMarginIcon } from 'icons/quicklookup-icons'

const InfoStructureCard: React.FC<{ amount; isLoading: boolean, icon: IconType, testId: string, iconColor?: string, bg?: string} & CenterProps> = ({
  amount,
  children,
  isLoading,
  title,
  testId,
  icon,
  iconColor,
  bg,
  ...rest
}) => {
  return (
    <Center flexDir="column" borderRight="1px solid  #E5E5E5" px={4} flex={rest.flex || 1} {...rest}>
      <Box fontSize="16px" fontWeight={500} color="#4A5568" >
      <Flex alignItems="center" mt='17px'>
    <Icon as={icon} boxSize={6} marginLeft={2} color={iconColor}/>
    <Text fontSize="14px" marginLeft={2}>
      {title}
    </Text>
  </Flex>
        {isLoading ? (
          <BlankSlate size="sm" />
        ) : (
          <Text data-testid={testId} color="#4A5568" marginLeft={7} fontSize="20px" fontStyle="medium" fontWeight="500" marginBottom={4}>
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
    <Flex
      marginTop="9px !important"
      py={5}
      h={{ base: 'unset', xl: '80px' }}
      w="100%"
      bg="white"
      borderRadius="4px"
      border="1px solid #E5E5E5"
      box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
    >
     <InfoStructureCard
     bg='42CA7E'
  icon={FinalSowIcon}
  iconColor="#42CA7E"
  amount={finalSOWAmount} 
  title={t('projects.projectAmount.finalSOW')} 
  testId={'final_sow_quicklookup'}
  isLoading={isLoading}
/>
      <InfoStructureCard
      icon={AccountPayableIcon} 
      iconColor="#43A9E3"
      //data-testid ='account_payable'
        amount={accountPayable}
        testId={'acc_payable_quicklookup'}
        isLoading={isLoading}
        title={t('projects.projectAmount.accountPayable')}
      />
      <InfoStructureCard
      icon={VendorPaymentIcon}
      iconColor="#F86060"
      //data-testid ='vendor_payment'
        amount={vendorPayment}
        isLoading={isLoading}
        testId={'vendor_payment_quicklookup'}
        title={t('projects.projectAmount.vendorPayment')}
      />
      <InfoStructureCard
      icon={MaterialIcon}
      iconColor="#9869D4"
       //data-testid ='Wo_material'
       amount={material}
       isLoading={isLoading} 
       testId={'material_quicklookup'}
       title={t('projects.projectAmount.materials')} 
       />

      <InfoStructureCard
      icon={ProjectCostIcon}
      iconColor="#D79526"
      //data-testid ='project_total_cost'
        amount={projectTotalCost}
        isLoading={isLoading}
        testId={'cost_quicklookup'}
        title={t('projects.projectAmount.projectCost')}
        />
     
      <InfoStructureCard 
       icon={ProfitIcon}
       iconColor="#345EA6" 
       //data-testid ='project_profits'  
       amount={profits} 
       isLoading={isLoading}
       testId={'profit_quicklookup'}
       title={t('projects.projectAmount.profits')}
        />

      <InfoStructureCard
       icon={ProfitMarginIcon}
       iconColor="#0BC5EA"
       //data-testid ='profit_margin'
        amount={profitMargin}
        isLoading={isLoading}
        testId={'profit_margin_quicklookup'}
        title={t('projects.projectAmount.profitMargins')}
        border="none"
      />
    </Flex>
  )
}
