import React from 'react'
import { Box, Center, CenterProps, Flex, Text, Tooltip } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'
import { useTranslation } from 'react-i18next'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { boxShadow } from 'theme/common-style'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" fontWeight={500} color="gray.500">
        <Tooltip label={title} color="black" placement="top">
          <Text color="gray.600" noOfLines={1}>
            {title}
          </Text>
        </Tooltip>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
    </Center>
  )
}

export const TransactionInfoCard: React.FC<{
  projectData: Project
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const { t } = useTranslation()

  return (
    <Flex
      py={6}
      h={{ base: 'unset', xl: '97px' }}
      w="100%"
      bg="white"
      borderRadius="4px"
      style={boxShadow}
    >
      <InfoStructureCard title={t('projectID')} isLoading={isLoading}>
        <Text>{projectData?.id}</Text>
      </InfoStructureCard>

      <InfoStructureCard isLoading={isLoading} title={t('WOstatus')}>
        <Box>
          {projectData?.vendorWOStatusValue ? (
            <Status value={projectData?.vendorWOStatusValue} id={projectData?.vendorWOStatusValue} />
          ) : (
            <Text>--</Text>
          )}
        </Box>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('WODueDate')}>
        <Text>{projectData?.vendorWODueDate ? dateFormat(projectData?.vendorWODueDate as string) : 'mm/dd/yyyy'}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('contactName')}>
        <Text>{projectData?.projectManager}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('contactNo')}>
        <Text>{projectData?.projectManagerPhoneNumber}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('address')} flex={2} border="none">
        {`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.state}/${projectData?.zipCode}`}
      </InfoStructureCard>
    </Flex>
  )
}
