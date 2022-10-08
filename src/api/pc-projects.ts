import { AddressInfo, Project, ProjectExtraAttributesType } from 'types/project.type'
import { useMutation, useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import { Vendors } from 'types/vendor.types'
import { useQueryClient } from 'react-query'
import orderBy from 'lodash/orderBy'
import xml2js from 'xml2js'
import { ProjectType } from 'types/common.types'
import { useEffect, useRef, useState } from 'react'
import round from 'lodash/round'
import { PROJECTS_QUERY_KEY } from './projects'

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

export const PROJECT_EXTRA_ATTRIBUTES = 'projectExtraAttributes'
// fetch project extra attributes
export const useProjectExtraAttributes = (projectId?: number) => {
  const client = useClient()

  return useQuery<ProjectExtraAttributesType>(
    [PROJECT_EXTRA_ATTRIBUTES, projectId],
    async () => {
      const response = await client(`projects/${projectId}/attribute`, {})

      return response?.data
    },
    { enabled: !!projectId },
  )
}

export const useCall = () => {
  const client = useClient()

  return useMutation(entity => {
    return client(`work-orders`, { method: 'PUT', data: entity })
  })
}

export const useProjectCards = (id?: string) => {
  const client = useClient()

  return useQuery(['projectCards', id], async () => {
    const response = await client(`projectCards/${id ?? ''}`, {})

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

export const useCreateProjectMutation = () => {
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
        queryClient.invalidateQueries(PROJECTS_QUERY_KEY)
        queryClient.invalidateQueries('project-details')
      },
    },
  )
}

export const useFPMUsers = () => {
  const client = useClient()
  const [selectedFPM, setSelectedFPM] = useState<any>(null)
  const [filterFpm, setFilterFpm] = useState<any>(null)
  const { data: fpmUsers, ...rest } = useQuery('fpm-users', async () => {
    const response = await client(`users/fpmByRoleType`, {})
    return response?.data
  })
  const { data: fpmTypes } = useQuery('lookupType', async () => {
    const response = await client(`lk_value/lookupType/9`, {})
    return response?.data
  })

  const { data: userIds } = useQuery(
    ['fpm-users', selectedFPM?.id],
    async () => {
      const response = await client(`users/fpmByRoleType/${selectedFPM?.id}`, {})
      return response?.data
    },
    { enabled: !!selectedFPM?.id },
  )
  const handleToggleUser = type => {
    setFilterFpm(users => {
      return users.map(userType => ({
        ...userType,
        isHidden: userType.id === type.id ? !userType.isHidden : userType.isHidden,
        options: userType.options.map(option => ({
          ...option,
          isHidden: userType.id === type.id ? !option.isHidden : option.isHidden,
        })),
      }))
    })
  }
  useEffect(() => {
    const fpmUserOptions =
      fpmTypes?.map((type, i) => {
        return {
          label: type.value,
          id: type.id,
          isHidden: i > 0,
          onClick: () => handleToggleUser(type),
          options:
            fpmUsers
              ?.filter(fpm => fpm.fieldProjectManagerRoleId === type.id)
              .map(user => ({
                ...user,
                isHidden: i > 0,
                label: `${user?.firstName} ${user?.lastName}`,
                value: user?.id,
              })) || [],
        }
      }) || []
    setFilterFpm(fpmUserOptions)
  }, [fpmTypes, fpmUsers])

  return { fpmUsers: filterFpm, userIds, selectedFPM, setSelectedFPM, ...rest }
}

const parseXmlResponse = async (response: any) => {
  const parser = new xml2js.Parser()

  return parser
    .parseStringPromise(response?.data)
    .then(function (result) {
      return !result?.AddressValidateResponse?.Address?.[0]?.Error
    })
    .catch(() => {
      // Failed
      return false
    })
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
      const parsed = await parseXmlResponse(response)

      return parsed
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
      id: state?.id,
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

export const useFPMsByMarket = marketId => {
  const client = useClient()

  const { data: fieldProjectMangersByMarket, ...rest } = useQuery(
    ['FPMByMarket', marketId],
    async () => {
      const response = await client(`users/usertype/5/market/` + marketId, {})

      return response?.data
    },
    {
      enabled: !!marketId,
    },
  )

  const fieldProjectManagerByMarketOptions =
    fieldProjectMangersByMarket?.map(fpm => ({
      value: fpm.id,
      label: `${fpm.firstName} ${fpm.lastName}`,
    })) || []

  return {
    fieldProjectManagerByMarketOptions,
    fieldProjectMangersByMarket,
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

export const usePercentageCalculation = ({ clientApprovedAmount, vendorWOAmount }) => {
  let percentage = 0
  if (clientApprovedAmount && vendorWOAmount) {
    percentage = ((clientApprovedAmount - vendorWOAmount) / clientApprovedAmount) * 100
    percentage = round(percentage, 2)
  }
  return { percentage }
}

export const usePercentageAndInoviceChange = ({ setValue }) => {
  const [approvedAmount, setApprovedAmount] = useState<number | null>(0)
  const [percentageField, setPercentageField] = useState<number | null>(0)
  const fieldUpdating = useRef<string | null>(null)

  const updatePercentageAndApprovedAmount = (approvedAmount, percentageField) => {
    if (approvedAmount && percentageField) {
      const amount = approvedAmount
      const percentage = percentageField
      const vendorWoAmountResult = amount - amount * (percentage / 100)
      setValue('invoiceAmount', round(vendorWoAmountResult, 2))
    } else if (approvedAmount === 0) {
      setValue('invoiceAmount', 0)
    } else if (approvedAmount && percentageField === 0) {
      setValue('invoiceAmount', round(approvedAmount, 2))
    } else {
      setValue('invoiceAmount', '')
    }
  }

  const onPercentageChange = percentageField => {
    if (fieldUpdating.current && fieldUpdating.current !== 'percentageField') {
      fieldUpdating.current = null
      return
    }
    setPercentageField(percentageField)
    updatePercentageAndApprovedAmount(approvedAmount, percentageField)
    fieldUpdating.current = 'percentageField'
  }

  const onApprovedAmountChange = approvedAmount => {
    setApprovedAmount(approvedAmount)
    updatePercentageAndApprovedAmount(approvedAmount, percentageField)
    if (fieldUpdating.current) return
  }

  const onInoviceAmountChange = invoiceAmount => {
    if (fieldUpdating.current && fieldUpdating.current !== 'invoiceAmount') {
      fieldUpdating.current = null
      return
    }
    if (!approvedAmount) return
    const approve = approvedAmount as number
    const percentageField = round(((approve - invoiceAmount) * 100) / approve, 2)
    setPercentageField(percentageField)
    setValue('percentage', percentageField)
    fieldUpdating.current = 'invoiceAmount'
  }
  return { onPercentageChange, onApprovedAmountChange, onInoviceAmountChange }
}
