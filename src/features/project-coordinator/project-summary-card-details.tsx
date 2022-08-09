import React from 'react'
import { Box, Center, CenterProps, Flex, Tooltip, FormLabel } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useAuth } from 'utils/auth-context'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={4} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" color="gray.500" width={'100px'}>
        <Tooltip label={title} color="black" placement="top">
          <FormLabel variant="strong-label" size="md" noOfLines={1}>
            {title}
          </FormLabel>
        </Tooltip>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
    </Center>
  )
}

export const ProjectSummaryCardDetails: React.FC<{
  projectData: Project
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const { data } = useAuth()
  const account = data?.user

  return (
    <>
      <Flex
        py={6}
        h={{ base: 'unset', xl: '197px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
      >
        <InfoStructureCard title={'Project Name'} isLoading={isLoading} w={'250px'}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {projectData?.name}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={'Project Type'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.projectTypeLabel}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={'Client Start Date'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" width="90px">
            {dateFormat(projectData?.clientStartDate as string)}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={'Client End Date'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" width="90px" ml={1}>
            {dateFormat(projectData?.clientDueDate as string)}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={'WOA Start Date'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" width="100px">
            {dateFormat(projectData?.woaStartDate as string)}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={'WOA End Date'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" width="100px" ml={1}>
            {projectData?.woaCompletionDate ? dateFormat(projectData?.woaCompletionDate as string) : '....'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={'Project Coordinator Name'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" width="100px">
            {projectData?.projectCoordinator}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={'Project Coordinator Contact'} isLoading={isLoading} borderRight="1px solid white">
          <FormLabel variant="light-label" size="md" width="100px">
            {account?.telephoneNumber}
          </FormLabel>
        </InfoStructureCard>
      </Flex>
    </>
  )
}
