import { ProjectType } from 'types/project.type'
import { useQuery } from 'react-query'
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

export const useProjectCards = () => {
  const client = useClient()

  return useQuery('projectCards', async () => {
    const response = await client(`projectCards`, {})

    return response?.data
  })
}

export const usePcClients = () => {
  const client = useClient()

  return useQuery('projectCards', async () => {
    const response = await client(`clients?page=0&size=10000000&sort=id,asc`, {})
    console.log('Clientsdat', response?.data)

    return response?.data
  })
}
