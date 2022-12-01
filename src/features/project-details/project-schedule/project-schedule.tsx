import React from 'react'
import { Task } from './task-types.ds'
import { Flex } from '@chakra-ui/react'
import ProjectScheduleDetails from './project-schedule-details'

export const ProjectSchedule: React.FC<{
  data: Task[]
  isLoading: boolean
}> = ({ data, isLoading }) => {
  return (
    <Flex
      direction={'column'}
      px="0px"
      py={0}
      gap={4}
      w="100%"
      minH={'270px'}
      h={{ base: 'unset', xl: 'auto' }}
      bg="white"
      borderRadius="4px"
      box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
    >
      {!isLoading ? <ProjectScheduleDetails data={data} /> : null}
    </Flex>
  )
}

export default ProjectSchedule
