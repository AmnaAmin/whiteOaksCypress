import React from 'react'
import { Box, Center, CenterProps, Flex, Tooltip, FormLabel } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useAuth } from 'utils/auth-context'
import { useTranslation } from 'react-i18next'
import { BiCaretLeft } from 'react-icons/bi'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({
  children,
  isLoading,
  title,
  fontSize,
  ...rest
}) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={4} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" color="gray.500">
        <Tooltip label={title} color="black" bg='white' placement="top">
          <FormLabel fontSize='14px' variant="strong-label" size="md" noOfLines={1} mt='3px'>
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
  setSummaryPanel?: any
}> = ({ projectData, isLoading, setSummaryPanel }) => {
  const { data } = useAuth()
  const account = data?.user
  const { t } = useTranslation()

  return (
    <Flex>
      <Flex
        py={6}
        h={{ base: 'unset', xl: '80px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        border="1px solid #E5E5E5"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
      >
        <InfoStructureCard title={t('projects.projectSummary.lockBoxCode')} isLoading={isLoading} fontSize="12px">
          <FormLabel variant="light-label" size="md" noOfLines={1} mt='-9px'>
            {projectData?.lockBoxCode ? projectData?.lockBoxCode : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.projectType')} isLoading={isLoading} fontSize="12px">
          <FormLabel variant="light-label" size="md" mt='-9px'>
            {projectData?.projectTypeLabel}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.clientStart')} isLoading={isLoading} fontSize="12px">
          <FormLabel variant="light-label" size="md" mt='-9px'>
            {projectData?.clientStartDate ? dateFormat(projectData?.clientStartDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.clientEnd')} isLoading={isLoading} fontSize="12px">
          <FormLabel variant="light-label" size="md" mt='-9px'>
            {projectData?.clientDueDate ? dateFormat(projectData?.clientDueDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.woaStart')} isLoading={isLoading} fontSize="12px">
          <FormLabel variant="light-label" size="md" mt='-9px'>
            {projectData?.woaStartDate ? dateFormat(projectData?.woaStartDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.woaEnd')} isLoading={isLoading} fontSize="12px">
          <FormLabel variant="light-label" size="md" mt='-9px'>
            {projectData?.woaCompletionDate ? dateFormat(projectData?.woaCompletionDate as string) : '-------'}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard title={t('projects.projectSummary.pcName')} isLoading={isLoading} fontSize="12px">
          <FormLabel variant="light-label" size="md" noOfLines={1} mt='-9px'>
            {projectData?.projectCoordinator}
          </FormLabel>
        </InfoStructureCard>

        <InfoStructureCard
          title={t('projects.projectSummary.pcContact')}
          isLoading={isLoading}
          borderRight="1px solid white"
          fontSize="12px"
        >
          <FormLabel variant="light-label" size="md" noOfLines={1} mt='-9px'>
            {account?.telephoneNumber}
          </FormLabel>
        </InfoStructureCard>
      </Flex>
      <Box borderRadius="3px" w="25px" bg="#A9D8F6">
        <Box
          color="blue.100"
          border="none"
          bg="none"
          _focus={{ border: 'none', bg: 'none' }}
          _hover={{ border: 'none', bg: 'none' }}
          onClick={() => {
            setSummaryPanel(1)
          }}
        >
          <Box color={'white'} mt="27px">
            <BiCaretLeft size={25} />
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
