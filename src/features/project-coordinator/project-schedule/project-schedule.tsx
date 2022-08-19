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
    >
      {!isLoading && data && (
        <ProjectScheduleDetails data={data}/>
      )}
    </Flex>
  )
}

export default ProjectSchedule
