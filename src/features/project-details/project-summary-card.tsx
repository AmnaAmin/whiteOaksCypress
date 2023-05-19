import React from 'react'
import { Box, Center, CenterProps, Flex, FormLabel, Tooltip } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { BiCaretRight } from 'react-icons/bi'
import { useState } from 'react'
import { ProjectSummaryCardDetails } from './project-summary-card-details'
import { useTranslation } from 'react-i18next'

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
        <Tooltip label={title} color="black" placement="top" bg='white'>
          <FormLabel fontSize={fontSize} variant="strong-label" size="md" noOfLines={1}>
            {title}
          </FormLabel>
        </Tooltip>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
    </Center>
  )
}

export const ProjectSummaryCard: React.FC<{
  projectData: Project
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const [summaryPanelShow, setSummaryPanel] = useState(1)
  const { t } = useTranslation()

  return (
    <>
      {summaryPanelShow === 1 ? (
        <Flex>
          <Flex
            py={6}
            h={{ base: 'unset', xl: '97px' }}
            w="100%"
            bg="white"
            border="1px solid #E5E5E5"
            borderRadius="4px"
            box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
          >
            <InfoStructureCard title={t('projects.projectSummary.projectID')} isLoading={isLoading} fontSize="12px">
              <FormLabel variant="light-label" size="md">
                {projectData?.id}{' '}
              </FormLabel>
            </InfoStructureCard>
            <InfoStructureCard title={t('projects.projectSummary.status')} isLoading={isLoading} fontSize="12px">
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
            <InfoStructureCard title={t('projects.projectSummary.client')} isLoading={isLoading} fontSize="12px">
              <FormLabel variant="light-label" size="md" noOfLines={1} title={`${projectData?.clientName}`}>
                {projectData?.clientName}
              </FormLabel>
            </InfoStructureCard>
            <InfoStructureCard title={t('projects.projectSummary.projectDue')} isLoading={isLoading} fontSize="12px">
              <FormLabel variant="light-label" size="md" noOfLines={1}>
                {dateFormat(projectData?.clientDueDate as string)}
              </FormLabel>
            </InfoStructureCard>
            <InfoStructureCard title={t('projects.projectSummary.fpmName')} isLoading={isLoading} fontSize="12px">
              <FormLabel variant="light-label" size="md" noOfLines={1} title={`${projectData?.projectManager}`}>
                {projectData?.projectManager}
              </FormLabel>
            </InfoStructureCard>
            <InfoStructureCard title={t('projects.projectSummary.fpmContact')} isLoading={isLoading} fontSize="12px">
              <FormLabel
                variant="light-label"
                size="md"
                noOfLines={1}
                title={`${projectData?.projectManagerPhoneNumber}`}
              >
                {projectData?.projectManagerPhoneNumber}
              </FormLabel>
            </InfoStructureCard>
            <InfoStructureCard
              borderRight="1px solid white"
              title={t('projects.projectSummary.address')}
              isLoading={isLoading}
              fontSize="12px"
            >
              <FormLabel
                variant="light-label"
                size="md"
                noOfLines={1}
                title={`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.state}/${projectData?.zipCode}`}
              >
                {`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.state}/${projectData?.zipCode}`}
              </FormLabel>
            </InfoStructureCard>
          </Flex>
          {!isLoading && (
            <Box borderRadius="3px" w="25px" bg="#A9D8F6">
              <Box
                color="blue.100"
                border="none"
                _focus={{ border: 'none', bg: 'none' }}
                _hover={{ border: 'none', bg: 'none' }}
                onClick={() => {
                  setSummaryPanel(2)
                }}
              >
                <Box mt="35px">
                  <BiCaretRight color="white" size={25} />
                </Box>
              </Box>
            </Box>
          )}
        </Flex>
      ) : (
        <ProjectSummaryCardDetails
          setSummaryPanel={setSummaryPanel}
          projectData={projectData as Project}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
