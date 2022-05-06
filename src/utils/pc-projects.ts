import { ProjectType } from 'types/project.type'
import { useMutation, useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'

export const usePCProject = (projectId?: string) => {
  const client = useClient()

  const { data: projectData, ...rest } = useQuery<ProjectType>(['project', projectId], async () => {
    const response = await client(`projects/${projectId}`, {})

    return response?.data
  })

  return {
    projectData,
    ...rest,
  }
}

export const useReject = () => {
  const client = useClient()

  return useMutation(entity => {
    return client(`work-orders`, { method: 'PUT', data: entity })
  })
}

export const useProjectCards = () => {
  const client = useClient()

  return useQuery('projectCards', async () => {
    const response = await client(`projectCards`, {})

    return response?.data
  })
}
