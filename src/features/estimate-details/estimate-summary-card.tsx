import React from 'react'
import { Box, Center, CenterProps, Flex, FormLabel, Tooltip } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { BiCaretDown, BiCaretUp } from 'react-icons/bi'
import { useState } from 'react'
import { ProjectSummaryCardDetails } from './project-summary-card-details'
import { Button } from 'components/button/button'
import { useTranslation } from 'react-i18next'

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

export const EstimateSummaryCard: React.FC<{
  projectData: Project
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const [isSeeMore, setSeeMore] = useState(true)
  const [isSeeLess, setSeeLess] = useState(false)
  const [isShowMoreDetails, setShowMoreDetails] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <Flex
        py={6}
        h={{ base: 'unset', xl: '97px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
        marginBottom={isShowMoreDetails ? '-32px' : ''}
        borderBottom={isShowMoreDetails ? '1px solid #E5E5E5' : 'none'}
      >
        <InfoStructureCard title={t('estimates.estimateSummary.estimateID')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.id}{' '}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={t('projects.projectSummary.status')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            <Box>
              {projectData?.projectStatus ? (
                <Status value={projectData?.projectStatus} id={projectData?.projectStatus} />
              ) : (
                <FormLabel>--</FormLabel>
              )}
            </Box>
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={t('projects.projectSummary.client')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1} title={`${projectData?.clientName}`}>
            {projectData?.clientName}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={t('estimates.estimateSummary.estimateDue')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {dateFormat(projectData?.clientDueDate as string)}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={t('projects.projectSummary.fpmName')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1} title={`${projectData?.projectManager}`}>
            {projectData?.projectManager}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={t('projects.projectSummary.fpmContact')} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1} title={`${projectData?.projectManagerPhoneNumber}`}>
            {projectData?.projectManagerPhoneNumber}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={t('projects.projectSummary.address')} isLoading={isLoading}>
          <FormLabel
            variant="light-label"
            size="md"
            noOfLines={1}
            title={`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.state}/${projectData?.zipCode}`}
          >
            {`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.state}/${projectData?.zipCode}`}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard isLoading={isLoading} title="" border="none">
          {isSeeMore && (
            <Button
              color="#4E87F8"
              border="none"
              bg="none"
              _focus={{ border: 'none', bg: 'none' }}
              _hover={{ border: 'none', bg: 'none' }}
              onClick={() => {
                setSeeMore(false)
                setSeeLess(true)
                setShowMoreDetails(true)
              }}
            >
              {t('projects.projectSummary.seeMore')} <BiCaretDown />
            </Button>
          )}
          {isSeeLess && (
            <Button
              color="#4E87F8"
              border="none"
              bg="none"
              _focus={{ border: 'none', bg: 'none' }}
              _hover={{ border: 'none', bg: 'none' }}
              onClick={() => {
                setSeeMore(true)
                setSeeLess(false)
                setShowMoreDetails(false)
              }}
            >
              {t('projects.projectSummary.seeLess')} <BiCaretUp />
            </Button>
          )}
        </InfoStructureCard>
      </Flex>
      {isShowMoreDetails && <ProjectSummaryCardDetails projectData={projectData as Project} isLoading={isLoading} />}
    </>
  )
}
