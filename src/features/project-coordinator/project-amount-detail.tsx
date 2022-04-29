import React from 'react'
import { Box, Center, CenterProps, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ProjectType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

const InfoStructureCard: React.FC<{ amount: string; isLoading: boolean } & CenterProps> = ({
  amount,
  children,
  isLoading,
  title,
  ...rest
}) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="16px" fontWeight={400} color="gray.500">
        <Text color="gray.600">{title}</Text>
        {isLoading ? <BlankSlate size="sm" /> : children}
        <Text color="#4A5568" fontSize="18px" fontStyle="normal" fontWeight="600" top="71px">
          {amount}
        </Text>
      </Box>
    </Center>
  )
}

export const AmountDetailsCard: React.FC<{
  projectData: ProjectType
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const { t } = useTranslation()

  return (
    <Flex py={9} w="100%" bg="white" borderRadius="4px" box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)">
      <InfoStructureCard amount="$47,800.56" title={t('finalSOW')} isLoading={isLoading} />
      <InfoStructureCard amount="$16,800.56" isLoading={isLoading} title={t('accountpayable')} />
      <InfoStructureCard amount="$17,800.56" isLoading={isLoading} title={t('projectcost')} />
      <InfoStructureCard amount="$27,800.56" isLoading={isLoading} title={t('revenue')} />
      <InfoStructureCard amount="$97,800.56" isLoading={isLoading} title={t('profits')} />
      <InfoStructureCard amount="70.21%" isLoading={isLoading} title={t('profitmargins')} border="none" />
    </Flex>
  )
}
