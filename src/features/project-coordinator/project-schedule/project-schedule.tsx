import React from 'react'
import { Box, Center, CenterProps, Flex, FormLabel } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { BiCaretDown, BiCaretUp } from 'react-icons/bi'
import { useState } from 'react'
import { Button } from 'components/button/button'
import ProjectScheduleDetails from './project-schedule-details'
import { Task } from "gantt-task-react";


export const ProjectSchedule: React.FC<{
  data: Task[]
  isLoading: boolean
}> = ({
  data,
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
    <Flex
      direction={"column"}
      px="30px"
      py={4}
      gap={4}
      w="100%"
      h={{ base: 'unset', xl: '500px' }}
      bg="white"
      borderRadius="4px"
      box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
      marginBottom={isShowMoreDetails ? '-32px' : ''}
      borderBottom={isShowMoreDetails ? '1px solid #E5E5E5' : 'none'}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <InfoStructureCard isLoading={isLoading} justifyContent="start" fontSize={'18px'}>
          Project Details Schedule
        </InfoStructureCard>
        <InfoStructureCard isLoading={isLoading} justifyContent="end" border="none">
          {isSeeMore && (
            <Button
              variant="solid"
              colorScheme="brand"
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
              variant="solid"
              colorScheme="brand"
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
        <ProjectScheduleDetails data={data}/>
      )}
    </Flex>
  )
}

export default ProjectSchedule
