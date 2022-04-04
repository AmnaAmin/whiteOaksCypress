import React from 'react'
import { Box, Center, CenterProps, Flex, Text } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from '../status'
import { useTranslation } from 'react-i18next'
import { ProjectType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" fontWeight={500} color="gray.500">
        <Text color="gray.600">{title}</Text>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
    </Center>
  )
}

export const TransactionInfoCard: React.FC<{
  projectData: ProjectType
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
      box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
    >
      <InfoStructureCard title={t('projectID')} isLoading={isLoading}>
        <Text>{projectData?.id}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('Status')}>
        <Box>
          {projectData?.projectStatus ? (
            <Status value={projectData?.projectStatus} id={projectData?.projectStatus} />
          ) : (
            <Text>--</Text>
          )}
        </Box>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('WODueDate')}>
        <Text>{dateFormat(projectData?.clientDueDate as string)}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('contactName')}>
        <Text>{projectData?.clientName}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('contactNo')}>
        <Text>{projectData?.projectManagerPhoneNumber}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t('address')} flex={2} border="none">
        {`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.region}/${projectData?.zipCode}`}
      </InfoStructureCard>
    </Flex>
  )
}
