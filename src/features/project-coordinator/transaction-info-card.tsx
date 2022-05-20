import React from 'react'
import { Box, Center, CenterProps, Flex, Text, Button } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from '../projects/status'
import { useTranslation } from 'react-i18next'
import { ProjectType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { BiCaretDown, BiCaretUp } from 'react-icons/bi'
import { useState } from 'react'
import { TransactionInfoCardDetails } from './transaction-info-card-details'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={4} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" color="gray.500">
        <Text color="gray.600" fontWeight={500}>
          {title}
        </Text>
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
        <InfoStructureCard isLoading={isLoading} title={t('Client')}>
          <Text noOfLines={1}>{projectData?.clientName}</Text>
        </InfoStructureCard>
        <InfoStructureCard isLoading={isLoading} title={t('Project Due')}>
          <Text>{dateFormat(projectData?.clientDueDate as string)}</Text>
        </InfoStructureCard>
        <InfoStructureCard isLoading={isLoading} title={t('FPM Name')}>
          <Text noOfLines={1}>{projectData?.projectManager}</Text>
        </InfoStructureCard>
        <InfoStructureCard isLoading={isLoading} title={t('FPM Contact')}>
          <Text fontSize={13}>{projectData?.projectManagerPhoneNumber}</Text>
        </InfoStructureCard>
        <InfoStructureCard isLoading={isLoading} title={t('address')} flex={1.5}>
          <Text
            noOfLines={1}
          >{`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.region}/${projectData?.zipCode}`}</Text>
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
      {isShowMoreDetails && (
        <TransactionInfoCardDetails projectData={projectData as ProjectType} isLoading={isLoading} />
      )}
    </>
  )
}
