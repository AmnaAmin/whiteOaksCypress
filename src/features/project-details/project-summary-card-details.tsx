import React from 'react'
import { Box, Center, CenterProps, Flex, Tooltip, FormLabel } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useAuth } from 'utils/auth-context'
import { useTranslation } from 'react-i18next'
import { BiCaretLeft } from 'react-icons/bi'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={4} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" color="gray.500">
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
  setShowLogic?: any
}> = ({ projectData, isLoading, setShowLogic }) => {
  const { data } = useAuth()
  const account = data?.user
  const { t } = useTranslation()

  return (
    <Flex>
      <Flex
        py={'16.5px'}
        h={{ base: 'unset', xl: '97px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
      >
        <InfoStructureCard title={t('projects.projectSummary.lockBoxCode')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {projectData?.lockBoxCode ? projectData?.lockBoxCode : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.projectType')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.projectTypeLabel}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.clientStart')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.clientStartDate ? dateFormat(projectData?.clientStartDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.clientEnd')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.clientDueDate ? dateFormat(projectData?.clientDueDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.woaStart')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.woaStartDate ? dateFormat(projectData?.woaStartDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.woaEnd')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.woaCompletionDate ? dateFormat(projectData?.woaCompletionDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.pcName')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {projectData?.projectCoordinator}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard
          title={t('projects.projectSummary.pcContact')}
          isLoading={isLoading}
          borderRight="1px solid white"
        >
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {account?.telephoneNumber}
          </FormLabel>
        </InfoStructureCard>
      </Flex>
      <Box border={'1px solid #E5E5E5'} borderRadius="5px" w="25px" bg="blue.50">
        <Box
          color="blue.100"
          border="none"
          bg="none"
          _focus={{ border: 'none', bg: 'none' }}
          _hover={{ border: 'none', bg: 'none' }}
          onClick={() => {
            setShowLogic(1)
          }}
        >
          <Box mt="35px">
            <BiCaretLeft size={25} />
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
