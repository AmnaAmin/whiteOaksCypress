import React from 'react'
import { Box, Center, CenterProps, Flex, FormLabel } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from '../projects/status'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { BiCaretDown, BiCaretUp } from 'react-icons/bi'
import { useState } from 'react'
import { ProjectSummaryCardDetails } from './project-summary-card-details'
import { Button } from 'components/button/button'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={4} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" color="gray.500">
        <FormLabel variant="strong-label" size="md">
          {title}
        </FormLabel>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
    </Center>
  )
}

export const ProjectSummaryCard: React.FC<{
  projectData: Project
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const [isSeeMore, setSeeMore] = useState(true)
  const [isSeeLess, setSeeLess] = useState(false)
  const [isShowMoreDetails, setShowMoreDetails] = useState(false)

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
        <InfoStructureCard title={'Project ID'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md">
            {projectData?.id}{' '}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={'Status'} isLoading={isLoading}>
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
        <InfoStructureCard title={'Client'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {projectData?.clientName}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={'Project Due'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {dateFormat(projectData?.clientDueDate as string)}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={'FPM Name'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {projectData?.projectManager}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={'FPM Contact'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {projectData?.projectManagerPhoneNumber}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard title={'Address'} isLoading={isLoading}>
          <FormLabel variant="light-label" size="md" noOfLines={1}>
            {`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.region}/${projectData?.zipCode}`}
          </FormLabel>
        </InfoStructureCard>
        <InfoStructureCard isLoading={isLoading} title="" border="none">
          {isSeeMore && (
            <Button
              color="blue"
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
              See more <BiCaretDown />
            </Button>
          )}
          {isSeeLess && (
            <Button
              color="blue"
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
              See less <BiCaretUp />
            </Button>
          )}
        </InfoStructureCard>
      </Flex>
      {isShowMoreDetails && <ProjectSummaryCardDetails projectData={projectData as Project} isLoading={isLoading} />}
    </>
  )
}
