import React from 'react'
import { Box, Center, CenterProps, Flex, Text, Tooltip } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'
import { useTranslation } from 'react-i18next'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import "@fontsource/poppins"

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" fontWeight={400} fontFamily="poppins">
        <Tooltip label={title} color="gray.700" placement="top">
          <Text color="gray.700" noOfLines={1}>
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
      h="74px" 
      w="100%"
      bg="white"
      borderRadius="4px"
      rounded={6}
      boxShadow=" 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
    >
      <InfoStructureCard title={t('projectID')} isLoading={isLoading}>
        <Text color="gray.500">{projectData?.id}</Text>
      </InfoStructureCard>

      <InfoStructureCard isLoading={isLoading} title={t('WOstatus')}>
        <Box>
          {projectData?.vendorWOStatusValue ? (
            <Status value={projectData?.vendorWOStatusValue} id={projectData?.vendorWOStatusValue} />
          ) : (
            <Text color="gray.500">--</Text>
          )}
        </Box>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('WODueDate')}>
        <Text color="gray.500">
          {projectData?.clientDueDate ? dateFormat(projectData?.clientDueDate as string) : 'mm/dd/yyyy'}
        </Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('contactName')}>
        <Text color="gray.500">{projectData?.projectManager}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('contactNo')}>
        <Text color="gray.500">{projectData?.projectManagerPhoneNumber}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('address')} flex={2} border="none">
        <Text color="gray.500" noOfLines={1}>{`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.state}/${projectData?.zipCode}`}</Text>
      </InfoStructureCard>
    </Flex>
  )
}
