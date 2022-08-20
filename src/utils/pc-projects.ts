import { AddressInfo, Project } from 'types/project.type'
import { useMutation, useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import { Vendors } from 'types/vendor.types'
import { useQueryClient } from 'react-query'
import orderBy from 'lodash/orderBy'
import xml2js from 'xml2js'
import { ProjectType } from 'types/common.types'

export const usePCProject = (projectId?: string) => {
  const client = useClient()

  const { data: projectData, ...rest } = useQuery<Project>(
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
  const queryClient = useQueryClient()
  // const toast = useToast()

  return useMutation(
    (projectDetails: any) => {
      return client('projects', {
        data: projectDetails,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('projects')
      },
    },
  )
}

export const useGetAddressVerification = (addressInfo: AddressInfo) => {
  const { address, city, state, zipCode } = addressInfo || { address: '', city: '', state: '', zipCode: '' }
  const client = useClient()

  return useQuery(
    ['addressVerification', address, city, state, zipCode],
    async () => {
      const response = await client(
        `addressVerification?address=${address}&city=${city}&state=${state}&zipCode=${zipCode}`,
        {},
      )

      const parser = new xml2js.Parser()

      return parser
        .parseStringPromise(response?.data)
        .then(function (result) {
          result.AddressValidateResponse.Address.forEach(record => {
            if (record.Error !== undefined) {
              return false
            } else {
              return true
            }
          })
        })
        .catch(function (err) {
          // Failed
          return false
        })
    },
    {
      enabled: false,
    },
  )
}

export const useProjectTypeSelectOptions = () => {
  const client = useClient()

  const { data: projectTypes, ...rest } = useQuery('projectTypes', async () => {
    const response = await client(`project_type?page=&size=&sort=value,asc`, {})

    return response?.data
  })

  const projectTypeSelectOptions =
    projectTypes?.map(projectType => ({
      value: projectType.id,
      label: projectType.value,
    })) || []

  return {
    projectTypeSelectOptions,
    ...rest,
  }
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

  const { data: properties, ...rest } = useQuery('properties', async () => {
    const response = await client(`properties`, {})

    return response?.data
  })

  const propertySelectOptions =
    properties?.map(property => ({
      label: property?.streetAddress,
      value: property?.id,
      property: property,
    })) || []

  return {
    propertySelectOptions,
    ...rest,
  }
}

export const useStates = () => {
  const client = useClient()

  const { data: states, ...rest } = useQuery('states', async () => {
    const response = await client(`states`, {})

    return response?.data
  })

  const stateSelectOptions =
    states?.map(state => ({
      value: state?.code,
      label: state?.name,
    })) || []

  return {
    stateSelectOptions,
    states,
    ...rest,
  }
}

export const useMarkets = () => {
  const client = useClient()

  const { data: markets, ...rest } = useQuery('markets', async () => {
    const response = await client(`markets`, {})

    return response?.data
  })

  const marketSelectOptions =
    markets?.map(market => ({
      value: market?.id,
      label: market?.metropolitanServiceArea,
    })) || []

  return {
    marketSelectOptions,
    markets,
    ...rest,
  }
}

export const useFPMs = () => {
  const client = useClient()

  const { data: fieldProjectMangers, ...rest } = useQuery('FPM', async () => {
    const response = await client(`users/usertype/5?sort=firstName,asc`, {})

    return response?.data
  })

  const fieldProjectManagerOptions =
    fieldProjectMangers?.map(fpm => ({
      value: fpm.id,
      label: `${fpm.firstName} ${fpm.lastName}`,
    })) || []

  return {
    fieldProjectManagerOptions,
    fieldProjectMangers,
    ...rest,
  }
}

export const useProjectCoordinators = () => {
  const client = useClient()

  const { data: projectCoordinators, ...rest } = useQuery('PC', async () => {
    const response = await client(`users/usertype/112?sort=firstName,asc`, {})

    return response?.data
  })

  const projectCoordinatorSelectOptions =
    projectCoordinators?.map(fpm => ({
      value: fpm.id,
      label: `${fpm.firstName} ${fpm.lastName}`,
    })) || []

  return {
    projectCoordinatorSelectOptions,
    projectCoordinators,
    ...rest,
  }
}

export const useClients = () => {
  const client = useClient()

  const { data: clients, ...rest } = useQuery('clients', async () => {
    const response = await client(`clients?page=&size=&sort=companyName,asc`, {})

    return response?.data
  })

  const clientSelectOptions =
    clients?.map(client => ({
      value: client.id,
      label: client.companyName,
    })) || []

  return {
    clientSelectOptions,
    clients,
    ...rest,
  }
}

const VENDOR_QUERY_KEY = 'vendor'
export const useVendor = () => {
  const client = useClient()

  const { data, ...rest } = useQuery<Array<Vendors>>(VENDOR_QUERY_KEY, async () => {
    const response = await client(`view-vendors`, {})

    return orderBy(response?.data || [], ['id', 'desc'])
  })

  return {
    vendors: data,
    ...rest,
  }
}

export const useGanttChart = (projectId?: string): any => {
  const client = useClient()

  const { data: ganttChartData, ...rest } = useQuery<ProjectType>(
    ['projectSchedule', projectId],
    async () => {
      const response = await client(`ganChartElastic/${projectId}`, {})

      return response?.data
    },
    { enabled: !!projectId },
  )

  return {
    ganttChartData,
    ...rest,
  }
}

export const useFilteredVendors = vendorSkillId => {
  const status_active = 12
  const capacity = 1 // sfor new workorder capacity is fixed
  const client = useClient()
  const requestUrl =
    'view-vendors?generalLabor.equals=' +
    false +
    '&vendorSkillId.equals=' +
    vendorSkillId +
    '&capacity.greaterThanOrEqual=' +
    capacity +
    '&status.equals=' +
    status_active
  const { data, ...rest } = useQuery<Array<Vendors>>(
    ['FETCH_FILTERED_VENDORS', vendorSkillId],
    async () => {
      const response = await client(requestUrl, {})

      return response?.data
    },
    { enabled: !!vendorSkillId },
  )
  return {
    vendors: data,
    ...rest,
  }
}
