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

export const useVendorCards = () => {
  const client = useClient()

  return useQuery('vendorsCards', async () => {
    const response = await client(`vendorsCards`, {})

    return response?.data
  })
}

const VENDOR_QUERY_KEY = 'vendor'
export const useVendor = () => {
  const client = useClient()

  const { data, ...rest } = useQuery<Array<ProjectType>>(VENDOR_QUERY_KEY, async () => {
    const response = await client(`view-vendors`, {})

    return response?.data
  })

  return {
    projects: data,
    ...rest,
  }
}
