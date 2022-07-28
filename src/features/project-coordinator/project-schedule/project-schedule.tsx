import React from 'react'
import { Box, Center, CenterProps, Flex, FormLabel } from '@chakra-ui/react'
import { ProjectType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { BiCaretDown, BiCaretUp } from 'react-icons/bi'
import { useState } from 'react'
import { Button } from 'components/button/button'
import { Card } from 'components/card/card'
import ProjectScheduleDetails from './project-schedule-details'

export const ProjectSchedule: React.FC<{
  // projectData: ProjectType
  isLoading: boolean
}> = ({
  // projectData,
  isLoading,
}) => {
  const [isSeeMore, setSeeMore] = useState(true)
  const [isSeeLess, setSeeLess] = useState(false)
  const [isShowMoreDetails, setShowMoreDetails] = useState(false)

  const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({
    children,
    isLoading,
    title,
    ...rest
  }) => {
    return (
      <Center flexDir="row" borderRight="1px solid #E5E5E5" px={4} flex={rest.flex || 1} {...rest}>
        <Box color="black" fontWeight={500}>
          <FormLabel variant="strong-label">{title}</FormLabel>
          {isLoading ? <BlankSlate size="sm" /> : children}
        </Box>
      </Center>
    )
  }

  return (
    <>
      <Flex
        py={3}
        h={{ base: 'unset', xl: '97px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
        marginBottom={isShowMoreDetails ? '-32px' : ''}
        borderBottom={isShowMoreDetails ? '1px solid #E5E5E5' : 'none'}
      >
        <InfoStructureCard isLoading={isLoading} fontSize={'18px'}>
          Project Details Schedule
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
        <Card>
          <ProjectScheduleDetails />
        </Card>
      )}
    </>
  )
}

export default ProjectSchedule
