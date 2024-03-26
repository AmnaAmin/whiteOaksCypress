import { AddressInfo, Project, ProjectExtraAttributesType } from 'types/project.type'
import { useMutation, useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import { Vendors } from 'types/vendor.types'
import { useQueryClient } from 'react-query'
import xml2js from 'xml2js'
import { ProjectType } from 'types/common.types'
import { useEffect, useRef, useState } from 'react'
import round from 'lodash/round'
import { PROJECTS_QUERY_KEY } from './projects'
import { usePaginationQuery } from 'api'

export const usePCProject = (projectId?: string) => {
  const client = useClient()
  const { data: projectData, ...rest } = useQuery<Project>(
    ['project', projectId],
    async () => {
      const response = await client(`projects/${projectId}?cacheBuster=${new Date().valueOf()}`, {})

      return response?.data
    },
    { enabled: !!projectId && projectId !== 'undefined' },
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

export const PROJECT_ALLOW_DELETE = 'projectAllowedDelete'
export const useProjectAllowDelete = (projectId?: number) => {
  const client = useClient()

  return useQuery(
    [PROJECT_ALLOW_DELETE, projectId],
    async () => {
      const response = await client(`projects/allowedDelete/${projectId}`, {})

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
  const apiUrl = 'projectCards' + (!!id ? `?userId=${id ?? ''}` : '')
  return useQuery(['projectCards', id], async () => {
    const response = await client(apiUrl, {})

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
export const useDirectReports = (email: string) => {
  const client = useClient()

  const { data: directReports, ...rest } = useQuery(
    'direct-reports',
    async () => {
      const response = await client(`users/${email}`, { email })

      return response?.data
    },
    { enabled: !!email },
  )

  const directReportOptions =
    directReports?.directChild?.map(dr => ({
      label: dr?.firstName + ' ' + dr?.lastName,
      value: dr?.id,
    })) || []

  return {
    directReportOptions: [{ label: 'ALL', value: 'ALL' }, ...directReportOptions],
    ...rest,
  }
}

export const useDeleteProjectMutation = () => {
  const client = useClient()
  return useMutation((projectId?: number) => {
    return client(`projects/${projectId}`, {
      method: 'DELETE',
    })
  })
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
      fpmTypes
        ?.map((type, i) => {
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
        })
        .sort(fpm => fpm?.id === 60 && -1) || []
    setFilterFpm(fpmUserOptions)
  }, [fpmTypes, fpmUsers])

  return { fpmUsers: filterFpm, userIds, selectedFPM, setSelectedFPM, ...rest }
}

export const usePaymentUserOptions = () => {
  const client = useClient()
 
  const { data: paymentSource } = useQuery('lookupType', async () => {
    const response = await client(`lk_value/lookupType/25`, {})
    return response?.data
  })
   return paymentSource
        ?.map((type, i) => {
          return {
            label: type.value,
            value: type.id,      
          }
        })  
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
  const addressAccordingly = address.__isNew__ ? address.value : address

  const client = useClient()

  return useQuery(
    ['addressVerification', address, city, state, zipCode],
    async () => {
      const response = await client(
        `addressVerification?address=${addressAccordingly}&city=${city}&state=${state}&zipCode=${zipCode}`,
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
    projectTypes,
    projectTypeSelectOptions,
    ...rest,
  }
}

const getLocationBasedFiltersForCards = (location, account) => {
  let locationBasedFilter = ''
  switch (location) {
    case 'STATE': {
      const states = account?.fpmStates?.map(m => m.code)?.join(',')
      locationBasedFilter = 'states=' + states
      break
    }
    case 'REGION': {
      const regions = account?.regions?.join(',')
      locationBasedFilter = 'regions=' + regions
      break
    }
    case 'MARKET': {
      const marketIds = account?.markets?.map(m => m.id)?.join(',')
      locationBasedFilter = 'marketIds=' + marketIds
      break
    }
  }
  return locationBasedFilter
}

export const useVendorCards = ({ user }) => {
  const client = useClient()
  const location = user?.authorityList?.[0].location

  const locationBasedFilters = getLocationBasedFiltersForCards(location, user)
  const vendorCardsApi = locationBasedFilters !== '' ? `vendorsCards/v1?` + locationBasedFilters : 'vendorsCards'
  return useQuery<Vendors>(
    ['vendorsCards', locationBasedFilters],
    async () => {
      const response = await client(vendorCardsApi, {})

      return response?.data
    },
    {
      enabled: !!user,
    },
  )
}

export const useFetchUserDetails = (email: string) => {
  const client = useClient()

  const { data: user, ...rest } = useQuery(
    'user-details',
    async () => {
      const response = await client(`users/${email}`, { email })

      return response?.data
    },
    { enabled: !!email },
  )

  return {
    user,
    ...rest,
  }
}

export const useFPMVendorCards = fpmBasedFilters => {
  const client = useClient()
  const vendorCardsApi = `vendorsCards/v1?` + fpmBasedFilters
  return useQuery<Vendors>(
    ['vendorsCards', fpmBasedFilters],
    async () => {
      const response = await client(vendorCardsApi, {})

      return response?.data
    },
    {
      enabled: !!fpmBasedFilters,
    },
  )
}

export const useProperties = () => {
  const client = useClient()

  const { data: properties, ...rest } = useQuery('properties', async () => {
    const response = await client(`properties/all`, {})

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

//TODO - move to common apis folder
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
      lienDue: state?.lienDue,
    })) || []

  return {
    stateSelectOptions,
    states,
    ...rest,
  }
}

export const useMarketStateWise = id => {
  const client = useClient()
  const { data: markets, ...rest } = useQuery(
    ['states-markets', id],
    async () => {
      const response = await client(`markets/state/${id}`, {})
      return response?.data
    },
    {
      enabled: !!id,
    },
  )

  const marketSelectOptionsStateWise =
    markets?.map(market => ({
      value: market?.id,
      label: market?.metropolitanServiceArea,
    })) || []

  return {
    marketSelectOptionsStateWise,
    markets,
    ...rest,
  }
}

export const useMarkets = () => {
  const client = useClient()

  const { data: markets, ...rest } = useQuery('markets', async () => {
    const response = await client(`markets`, {})

    return response?.data
  })

  const marketSelectOptions = [
    { value: '', label: 'Select' },
    ...(markets?.map(market => ({
      value: market?.id,
      label: market?.metropolitanServiceArea,
    })) || []),
  ]

  return {
    marketSelectOptions,
    markets,
    ...rest,
  }
}

export const useRegions = () => {
  const client = useClient()

  const { data: regions, ...rest } = useQuery('regions', async () => {
    const response = await client(`regions`, {})

    return response?.data
  })
  const regionSelectOptions =
    regions?.map(region => ({
      value: region,
      label: region,
    })) || []

  return {
    regionSelectOptions,
    regions,
    ...rest,
  }
}

export const useFPMs = () => {
  const client = useClient()

  const { data: fieldProjectMangers, ...rest } = useQuery('FPM', async () => {
    const response = await client(`users/v2/usertype/5?sort=firstName,asc`, {})

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
    const response = await client(`users/v2/usertype/112?sort=firstName,asc`, {})

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
    const response = await client(`clients?activated.equals=true&page=&size=&sort=companyName,asc`, {})

    return response?.data
  })

  const clientSelectOptions =
    clients?.map(client => ({
      value: client.id,
      label: client.companyName,
      carrier: client.carrier,
    })) || []

  return {
    clientSelectOptions,
    clients,
    ...rest,
  }
}

export const VENDORS_SELECTED_CARD_MAP_URL = {
  active: 'status.equals=12',
  inActive: 'status.equals=13',
  doNotUse: 'status.equals=14',
  expired: 'status.equals=15',
}

const VENDOR_QUERY_KEY = 'vendor'
type vendors = Array<any>

const getVendorsQueryString = (filterQueryString: string) => {
  let queryString = filterQueryString
  if (filterQueryString?.search('&sort=coiWcExpirationDate.equals') < 0) {
    queryString = queryString + `&sort=createdDate,asc`
  }
  return queryString
}

const getLocationBasedFiltersForTable = (location, account) => {
  let locationBasedFilter = ''
  switch (location) {
    case 'STATE': {
      const states = account?.fpmStates?.map(m => m.code)?.join(',')
      locationBasedFilter = 'state.in=' + states
      break
    }
    case 'REGION': {
      const regions = account?.regions?.join(',')
      locationBasedFilter = 'region.in=' + regions
      break
    }
    case 'MARKET': {
      const marketIds = account?.markets?.map(m => m.id)?.join(',')
      locationBasedFilter = 'marketId.in=' + marketIds
      break
    }
  }
  return locationBasedFilter
}

export const useVendor = (user, queryString: string, pageSize: number) => {
  const userLocation = user?.authorityList?.[0].location
  const locationBasedFilters = getLocationBasedFiltersForTable(userLocation, user)

  const apiQueryString =
    getVendorsQueryString(queryString) + (locationBasedFilters !== '' ? `&${locationBasedFilters}` : '')

  const { data, ...rest } = usePaginationQuery<vendors>(
    [VENDOR_QUERY_KEY, apiQueryString],
    `view-vendors/v1?${apiQueryString}`,
    pageSize,
    { enabled: !!user },
  )

  return {
    vendors: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
}

export const ALL_VENDORS_QUERY_KEY = 'all_vendors'
export const useGetAllVendors = (user, filterQueryString: string) => {
  const client = useClient()
  const userLocation = user?.authorityList?.[0].location
  const locationBasedFilters = getLocationBasedFiltersForTable(userLocation, user)

  const { data, ...rest } = useQuery<Array<Project>>(
    ALL_VENDORS_QUERY_KEY,
    async () => {
      const response = await client(
        `view-vendors/v1?${filterQueryString}` + (locationBasedFilters !== '' ? `&${locationBasedFilters}` : ''),
        {},
      )

      return response?.data
    },
    {
      enabled: false,
    },
  )

  return {
    allVendors: data,
    ...rest,
  }
}

export const useGetAllFPMVendors = (fpmBasedQueryParams, queryStringWithOutPagination: string) => {
  const client = useClient()
  const query = fpmBasedQueryParams + '&' + queryStringWithOutPagination
  const { data, ...rest } = useQuery<Array<Project>>(
    ['all_fpm_vendors'],
    async () => {
      const response = await client(`view-vendors/v1?${query}`, {})

      return response?.data
    },
    {
      enabled: false,
    },
  )

  return {
    allVendors: data,
    ...rest,
  }
}
export const useFPMVendor = (fpmBasedQueryParams, queryStringWithPagination, pageSize) => {
  const query = fpmBasedQueryParams + '&' + queryStringWithPagination
  const apiQueryString = getVendorsQueryString(query)
  const { data, ...rest } = usePaginationQuery<vendors>(
    ['fpm-vendors', apiQueryString],
    `view-vendors/v1?${apiQueryString}`,
    pageSize,
    { enabled: !!fpmBasedQueryParams },
  )

  return {
    vendors: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
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

export const useFilteredVendors = ({ vendorSkillId, projectId, showExpired, currentVendorId }) => {
  const currVendID = currentVendorId !== null ? currentVendorId : 0

  const status_active = 12
  const status_expired = 15
  const capacity = 1 // sfor new workorder capacity is fixed
  const statusAttrib = '&status.in=' + status_active + (showExpired ? `,${status_expired}` : '')
  const client = useClient()
  const requestUrl =
    'view-vendors?generalLabor.equals=' +
    false +
    '&vendorSkillId.equals=' +
    vendorSkillId +
    '&capacity.greaterThanOrEqual=' +
    capacity +
    statusAttrib +
    '&projectsId.equals=' +
    projectId +
    '&currentVendorId.equals=' +
    currVendID
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
  const [percentageField, setPercentageField] = useState<number | null>(45)
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

  const onInvoiceAmountChange = invoiceAmount => {
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
  return { onPercentageChange, onApprovedAmountChange, onInvoiceAmountChange }
}
