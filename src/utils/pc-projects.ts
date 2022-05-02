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

export const useReject = (entity?: ProjectType) => {
  const token = localStorage.getItem('jhi-authenticationToken')

  const requestOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entity),
  }
  const client = useClient()
  return useMutation(id => {
    return client(`work-orders`, requestOptions)
  })
}

export const rejectInvoice = entity => {
  const token = localStorage.getItem('jhi-authenticationToken')
  const requestOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entity),
  }
  fetch('api/work-orders', requestOptions)
}

export const useProjectCards = () => {
  const client = useClient()

  return useQuery('projectCards', async () => {
    const response = await client(`projectCards`, {})

    return response?.data
  })
}
