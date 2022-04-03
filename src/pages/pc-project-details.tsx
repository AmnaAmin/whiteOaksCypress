import { Stack } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { useParams } from 'react-router'
import { TransactionInfoCard } from '../features/projects/transactions/pc-transaction-info-card'
import { ProjectType } from 'types/project.type'
import { usePCProject } from 'utils/pc-projects'

export const PCProjectDetails: React.FC = props => {
  const { projectId } = useParams<'projectId'>()
  const { projectData, isLoading } = usePCProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  console.log(projectData)

  return (
    <>
      <Stack w="100%" spacing={8} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <TransactionInfoCard projectData={projectData as ProjectType} isLoading={isLoading} />
      </Stack>
    </>
  )
}
