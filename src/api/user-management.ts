import { useToast } from '@chakra-ui/react'
import { BONUS, DURATION } from 'features/user-management/constants'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { isDefined } from 'utils'
import { useClient } from 'utils/auth-context'
import { parseMarketAPIDataToFormValues } from 'utils/markets'
import { parseRegionsAPIDataToFormValues } from 'utils/regions'
import { parseStatesAPIDataToFormValues } from 'utils/states'
import { useMarkets, useRegions, useStates } from './pc-projects'
import { languageOptions } from './vendor-details'
import { USER_MGT_QUERY_KEY, useUsrMgt } from 'pages/admin/user-management'
import { useFetchRoles } from './access-control'

export enum FPMManagerTypes {
  District = 59,
  Regular = 61,
  SrFPM = 221,
  Regional = 60,
}

export const useUserManagement = () => {
  const client = useClient()

  return useQuery('users', async () => {
    const response = await client(`users?page=0&size=10000000&sort=id,asc`, {})

    return response?.data
  })
}

export const useUser = (email?: string) => {
  const client = useClient()

  return useQuery(
    ['user', email],
    async () => {
      const response = await client(`users/${email}`, {})
      return response?.data
    },
    { enabled: !!email },
  )
}

export const useCreateUserMutation = () => {
  const client = useClient()
  const toast = useToast()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: any) => {
      return client('users', {
        data: {
          login: payload.email, //TODO - Check why need login and email with backend
          ...payload,
        },
        method: 'POST',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(USER_MGT_QUERY_KEY)
        queryClient.invalidateQueries('users')
        toast({
          title: t(`${USER_MANAGEMENT}.modal.addUser`),
          description: t(`${USER_MANAGEMENT}.modal.addUserSuccess`),
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        toast({
          title: t(`${USER_MANAGEMENT}.modal.addUser`),
          description: (error.title as string) ?? t(`${USER_MANAGEMENT}.modal.userAddFailed`),
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useSaveUserDetails = () => {
  const client = useClient()
  const toast = useToast()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: any) => {
      return client('users', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(USER_MGT_QUERY_KEY)
        queryClient.invalidateQueries('users')
        toast({
          title: t(`${USER_MANAGEMENT}.modal.updateUser`),
          description: t(`${USER_MANAGEMENT}.modal.updateUserSuccess`),
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
      },
    },
  )
}

export const useDeleteUserDetails = () => {
  const client = useClient()
  const toast = useToast()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation(
    (email: any) => {
      return client(`users/${email}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        toast({
          title: t(`${USER_MANAGEMENT}.modal.deleteUserModal`),
          description: t(`${USER_MANAGEMENT}.modal.deleteUserSuccess`),
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries(USER_MGT_QUERY_KEY)
        queryClient.invalidateQueries('users')
      },
      onError(error: any) {
        toast({
          title: t(`${USER_MANAGEMENT}.modal.deleteUserModal`),
          description: (error.title as string) ?? t(`${USER_MANAGEMENT}.modal.deleteUserFailed`),
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const userMangtPayload = (user: any, statesDTO?: any, usersData?: any) => {
  const getFpmStateId = () => {
    return user.states?.find(state => state.checked === true)?.state?.id
  }

  const getFpmStates = () => {
    return user.states?.filter(state => state.checked === true)?.map(s => s?.state)
  }

  const directReportIds = user?.directReports?.filter(d => !d.orphanChild).map(d => d.value)
  const userObj = {
    ...user,
    newPassword: user.newPassword || '',
    langKey: user.langKey?.value || '',
    vendorId: user.vendorId?.value || '',
    markets: user.markets?.filter(market => market.checked) || [],
    regions: user.regions?.filter(region => region.checked).map(region => region.region.label) || [],
    stateId: user.state?.id || '',
    fpmStateId: getFpmStateId(),
    fpmStates: statesDTO?.filter(s => getFpmStates().find(fs => fs.id === s.id)) || [],
    ignoreQuota: isDefined(user.ignoreQuota?.value) ? user.ignoreQuota?.value : 0,
    newBonus: user.newBonus?.label ? user.newBonus?.value : '',
    vendorAdmin: user.vendorAdmin,
    primaryAdmin: user.primaryAdmin,
    directChild: usersData
      ?.filter(u => directReportIds.includes(u.id))
      ?.map(u => {
        return {
          id: u?.id,
          email: u?.email,
          firstName: u?.firstName,
          lastName: u?.lastName,
          login: u?.login,
        }
      }),
    parentFieldProjectManagerId: user?.parentFieldProjectManagerId?.value,
    userType: user?.accountType.userTypeId,
    authorities: [user.accountType?.label],
  }

  delete userObj.states
  delete userObj.state
  delete userObj.accountType
  delete userObj.directReports

  return userObj
}

export const useViewVendor = () => {
  const client = useClient()

  const { data, ...rest } = useQuery('view-vendors', async () => {
    const response = await client(`view-vendors`, {})
    return response?.data
  })

  const options =
    data?.map(res => ({
      value: res?.id,
      label: res?.companyName,
    })) || []

  return {
    options,
    data,
    ...rest,
  }
}

export const useUsersAuthorities = () => {
  const client = useClient()
  const { data, ...rest } = useQuery('users-authorities', async () => {
    const response = await client(`users/authorities`, {})
    return response?.data
  })

  return {
    data,
    ...rest,
  }
}

export const useActiveAccountTypes = () => {
  const client = useClient()
  const { data, ...rest } = useQuery('account-types', async () => {
    const response = await client(`lk_value/lookupType/accountType/active`, {})
    return response?.data
  })
  const options =
    data?.map(res => ({
      value: res?.id,
      label: res?.value,
    })) || []

  return {
    data,
    options,
    ...rest,
  }
}

/* obsolete after Access Control 
export const useFPMManagerRoles = () => {
  const client = useClient()
  const { data, ...rest } = useQuery('fpm-manager-roles', async () => {
    const response = await client(`lk_value/lookupType/9`, {})
    return response?.data
  })
  const options =
    data?.map(res => ({
      value: res?.id,
      label: res?.value,
    })) || []
  options.push({ value: UserTypes.directorOfConstruction, label: UserTypeLabel.doc })
  options.push({ value: UserTypes.operations, label: UserTypeLabel.operations })
  return {
    data,
    options,
    ...rest,
  }
}*/

export const useAllManagers = () => {
  const client = useClient()
  const { data, ...rest } = useQuery('users-allAvailableManagers', async () => {
    const response = await client(`users/allAvailableManagers`, {})
    return response?.data
  })

  const options =
    data?.map(res => ({
      value: res?.id,
      label: `${res?.firstName} ${res?.lastName}`,
    })) || []

  return {
    data,
    options,
    ...rest,
  }
}

export const useFilteredAvailabelManager = (fieldProjectManagerRoleId, managerRoleId, marketIds?: string) => {
  var managerRoleIdQueryKey = ''
  if ([FPMManagerTypes.SrFPM, FPMManagerTypes.Regular].includes(Number(fieldProjectManagerRoleId?.value))) {
    managerRoleIdQueryKey = 'marketIds'
  } else if (Number(fieldProjectManagerRoleId?.value) === FPMManagerTypes.District) {
    managerRoleIdQueryKey = 'fpmStateId'
  } else {
    managerRoleIdQueryKey = 'region'
  }
  const client = useClient()
  const { data, ...rest } = useQuery(
    ['useFilteredAvailableManager', managerRoleId, marketIds],
    async () => {
      const response = await client(`users/upstream/${managerRoleId?.value}?${managerRoleIdQueryKey}=${marketIds}`, {})
      return response?.data
    },
    {
      enabled: !!(fieldProjectManagerRoleId && managerRoleId && marketIds),
    },
  )
  const options =
    data?.map(res => ({
      value: res?.id,
      label: `${res?.firstName} ${res?.lastName}`,
    })) || []

  return {
    data,
    options,
    ...rest,
  }
}

const parseUserFormData = ({
  userInfo,
  stateOptions,
  markets,
  states,
  regions,
  userData,
  roles,
  viewVendorsOptions,
  languageOptions,
}) => {
  let _accountType = roles?.find(r => r.label === userInfo?.authorities?.[0])
  const managerUser = userData?.find(us => userInfo?.parentFieldProjectManagerId === us.id)
  return {
    ...userInfo,
    markets: markets || [],
    states: states || [],
    regions: regions || [],
    state: stateOptions?.find(s => s.id === userInfo?.stateId),
    directReports:
      userInfo?.directChild?.map(u => {
        return {
          label: u.firstName + ' ' + u.lastName,
          value: u.id,
          orphanChild: u.orphanChild,
        }
      }) || [],
    parentFieldProjectManagerId: managerUser
      ? {
          label: managerUser?.firstName + ' ' + managerUser?.lastName,
          value: managerUser?.id,
        }
      : null,
    accountType: _accountType,
    vendorId: viewVendorsOptions?.find(vendor => vendor.value === userInfo?.vendorId),
    langKey: languageOptions?.find(l => l.value === userInfo?.langKey),
    newBonus: BONUS.find(bonus => bonus.value === userInfo?.newBonus),
    ignoreQuota: DURATION.find(quotaDuration => quotaDuration.value === userInfo?.ignoreQuota),
    vendorAdmin: userInfo.vendorAdmin,
    primaryAdmin: userInfo.primaryAdmin,
    directStates:
      states
        ?.filter(o => o.checked)
        ?.map(fo => {
          return { value: fo.state.id, label: fo.state.label }
        }) || [],
    directRegions: regions?.filter(o => o.checked)?.map(fo => fo?.region) || [],
    directMarkets:
      markets
        ?.filter(o => o.checked)
        ?.map(fo => {
          return {
            value: fo.market.id,
            label: fo.market.metropolitanServiceArea,
          }
        }) || [],
  }
}

export const USER_DIRECT_REPORTS_KEY = 'userDirectReports'

export const useUserDirectReports = (
  enabled: boolean,
  fpmRole: number,
  regions: Array<string>,
  markets: Array<string>,
  states: Array<string>,
) => {
  const client = useClient()

  const roleId = fpmRole

  const endPoint = new URL('users/downstream/', window.location.origin)

  endPoint.searchParams.set('regions', '')
  endPoint.searchParams.set('data', '')

  if (regions && regions.length >= 1) endPoint.searchParams.set('regions', regions.toString())

  if (markets && markets.length >= 1) endPoint.searchParams.set('data', markets.toString())

  if (states && states.length >= 1) endPoint.searchParams.set('data', states.toString())

  const apiUrl = `users/downstream/${roleId}?regions=${endPoint.searchParams.get(
    'regions',
  )}&data=${endPoint.searchParams.get('data')}`

  const { data: directReports, ...rest } = useQuery(
    [USER_DIRECT_REPORTS_KEY, roleId, regions, markets, states],
    async () => {
      const response = await client(apiUrl, {})

      if (response?.data) {
        ;(window as any)._filteringDone = false
      }
      return response?.data
    },
    {
      enabled: enabled,
    },
  )

  const directReportOptions =
    directReports?.map(user => ({
      value: user?.id,
      label: user?.firstName + ' ' + user?.lastName,
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      login: user?.login,
      email: user?.email,
    })) || []

  return {
    directReportOptions,
    directReports,
    ...rest,
  }
}

export const useUserDetails = ({ form, userInfo, queryString }) => {
  const { setValue, reset } = form
  const { stateSelectOptions: stateOptions } = useStates()
  const { markets } = useMarkets()
  const { regionSelectOptions } = useRegions()
  const { options: roles } = useFetchRoles()
  const { options: viewVendorsOptions } = useViewVendor()
  const { userMgt: userData } = useUsrMgt(queryString, 0, 100000000)

  const formattedMarkets = parseMarketAPIDataToFormValues(markets, userInfo?.markets || [])
  const formattedRegions = parseRegionsAPIDataToFormValues(regionSelectOptions, userInfo?.regions || [])

  const formattedStates = parseStatesAPIDataToFormValues(stateOptions, userInfo?.fpmStates || [])

  const directStates = formattedStates?.filter(o => o.checked)?.map(fo => fo?.state) || []

  const directRegions = formattedRegions?.filter(o => o.checked)?.map(fo => fo?.region) || []

  const directMarkets =
    formattedMarkets
      ?.filter(o => o.checked)
      ?.map(fo => {
        return {
          value: fo.market.id,
          label: fo.market.metropolitanServiceArea,
        }
      }) || []

  useEffect(() => {
    if (!userInfo) {
      setValue('markets', formattedMarkets)
      setValue('states', formattedStates)
      setValue('regions', formattedRegions)
      setValue('activated', true)
      setValue('langKey', languageOptions[0])
      setValue('directReports', [])
      setValue('managers', [])
      setValue('directStates', directStates)
      setValue('directRegions', directRegions)
      setValue('directMarkets', directMarkets)
    } else {
      reset(
        parseUserFormData({
          userInfo,
          stateOptions,
          markets: formattedMarkets,
          states: formattedStates,
          regions: formattedRegions,
          userData,
          roles,
          viewVendorsOptions,
          languageOptions,
        }),
      )
    }
  }, [
    reset,
    userInfo,
    stateOptions?.length,
    markets?.length,
    regionSelectOptions?.length,
    userData?.length,
    roles?.length,
    viewVendorsOptions?.length,
    directStates?.length,
  ])
}

interface DirectReportsUser {
  id: number,
  firstName: string,
  lastName: string;
  parentFieldProjectManagerId: number;
  login: string

}
export const useUserDirectReportsAllList = () => {
  const client = useClient();
  const {data, ...rest} = useQuery<Array<DirectReportsUser>>(["all_user_managements"], async () => {
    const response = await client("users/list/directUsers", {});
    return response?.data
  });

  const options =
    data?.map(res => ({
      value: res?.id,
      label: res?.firstName + ' ' + res?.lastName,
      parentId: res?.parentFieldProjectManagerId,
    })) || []
    options.sort((a, b) => a.label.localeCompare(b.label));

    return {
      userMgt: data,
      options,
      ...rest
    }
}