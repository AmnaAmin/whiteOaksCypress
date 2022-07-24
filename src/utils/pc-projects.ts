import { ProjectType } from 'types/project.type'
import { useMutation, useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import { Vendors } from 'types/vendor.types'

export const usePCProject = (projectId?: string) => {
  const client = useClient()

  const { data: projectData, ...rest } = useQuery<ProjectType>(
    ['project', projectId],
    async () => {
      const response = await client(`projects/${projectId}`, {})

      return response?.data
    },
    { enabled: !!projectId },
  )

  return {
    projectData,
    ...rest,
  }
}

export const useCall = () => {
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
  // const toast = useToast()

  return useMutation(
    (projectDetails: any) => {
      return client('projects', {
        data: projectDetails,
        method: 'POST',
      })
    },
    {
      onSuccess() {},
    },
  )
}

export const useVerifyAddressApi = (streetAddress?: any, city?: string, state?: string, zipCode?: string) => {
  const client = useClient()
  return useQuery<any>(
    ['address'],
    async () => {
      const response = await client(
        `addressVerification/?&address=` +
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
    const response = await client(`lk_value?page=&size=&sort=value,asc`, {})

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

export const useProperties = () => {
  const client = useClient()

  return useQuery('properties', async () => {
    const response = await client(`properties`, {})

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

export const useFPM = () => {
  const client = useClient()

  return useQuery('FPM', async () => {
    const response = await client(`users/usertype/5?sort=firstName,asc`, {})

    return response?.data
  })
}

export const usePC = () => {
  const client = useClient()

  return useQuery('PC', async () => {
    const response = await client(`users/usertype/112?sort=firstName,asc`, {})

    return response?.data
  })
}

export const useClients = () => {
  const client = useClient()

  return useQuery('clients', async () => {
    const response = await client(`clients?page=&size=&sort=companyName,asc`, {})

    return response?.data
  })
}

const VENDOR_QUERY_KEY = 'vendor'
export const useVendor = () => {
  const client = useClient()

  const { data, ...rest } = useQuery<Array<Vendors>>(VENDOR_QUERY_KEY, async () => {
    const response = await client(`view-vendors`, {})

    return response?.data
  })

  return {
    vendors: data,
    ...rest,
  }
}
