import React from 'react'
import { Task } from 'gantt-task-react'
import { Flex } from '@chakra-ui/react'
import ProjectScheduleDetails from './project-schedule-details'

export const ProjectSchedule: React.FC<{
  data: Task[]
  isLoading: boolean
}> = ({ data, isLoading }) => {
  return (
    <Flex
      direction={'column'}
      px="30px"
      py={4}
      gap={4}
      w="100%"
      h={{ base: 'unset', xl: '500px' }}
      bg="white"
      borderRadius="4px"
      box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
    >
      {!isLoading && data && <ProjectScheduleDetails data={data} />}
    </Flex>
  )
}

export default ProjectSchedule
