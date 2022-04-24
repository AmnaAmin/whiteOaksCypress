import { ProjectType } from 'types/project.type'
import { useMutation, useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import { useToast } from '@chakra-ui/react'

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

export const useAddressDetails = (projectId?: string) => {
  const client = useClient()

  return useQuery(
    'address-details',
    async () => {
      const response = await client(`projects/${projectId}`, { projectId })

      return response?.data
    },
    // { enabled: false },
  )
}

export const useAddressSettings = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (settings: any) => {
      return client('project', {
        data: settings,
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Settings',
          description: 'Settings have been updated successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      },
    },
  )
}

export const useVerifyAddressApi = (streetAddress?: any, city?: string, state?: string, zipCode?: string) => {
  const client = useClient()

  return useQuery<any>(
    ['address'],
    async () => {
      const response = await client(
        `/addressVerification/?&address=` +
          encodeURI(streetAddress) +
          '&city=' +
          city +
          '&state=' +
          state +
          '&zip=' +
          zipCode,
        {},
      )
      return response
    },
    { enabled: false },
  )
}
