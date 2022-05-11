import { Market, ProjectType } from 'types/project.type'
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

export const useProjectDetails = (projectId?: string) => {
  const client = useClient()

  return useQuery(
    'project-details',
    async () => {
      const response = await client(`projects/${projectId}`, { projectId })

      return response?.data
    },
    { enabled: false },
  )
}

export const useSaveProjectDetails = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (projectDetails: any) => {
      return client('projects', {
        data: projectDetails,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Project Details',
          description: 'New Project Details have been updated successfully.',
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

export const useProjectTypes = () => {
  const client = useClient()

  return useQuery('lk_value', async () => {
    const response = await client(`lk_value`, {})

    return response?.data
  })
}

export const useStates = () => {
  const client = useClient()

  return useQuery('states', async () => {
    const response = await client(`states`, {})

    return response?.data
  })
}

export const useMarkets = () => {
  const client = useClient()

  return useQuery('markets', async () => {
    const response = await client(`markets`, {})

    return response?.data
  })
}

// export const useMarkets = () => {
//   const client = useClient()

//   const { data: markets, ...rest } = useQuery<Array<Market>>('markets', async () => {
//     const response = await client(`markets`, {})
//     return response?.data
//   })

//   return {
//     markets,
//     ...rest,
//   }
// }
