import { useToast } from '@chakra-ui/react'
import { BONUS, DURATION } from 'features/user-management/constants'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { isDefined } from 'utils'
import { useClient } from 'utils/auth-context'
import { parseMarketAPIDataToFormValues } from 'utils/markets'
import { UserTypes } from 'utils/redux-common-selectors'
import { UserTypes as UserTypeLabel } from 'types/account.types'
import { parseRegionsAPIDataToFormValues } from 'utils/regions'
import { parseStatesAPIDataToFormValues } from 'utils/states'
import { useMarkets, useRegions, useStates } from './pc-projects'
import { languageOptions } from './vendor-details'

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
        toast({
          title: t(`${USER_MANAGEMENT}.modal.updateUser`),
          description: (error.title as string) ?? t(`${USER_MANAGEMENT}.modal.userUpdateFailed`),
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
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
        queryClient.invalidateQueries('users')
        toast({
          title: t(`${USER_MANAGEMENT}.modal.deleteUserModal`),
          description: t(`${USER_MANAGEMENT}.modal.deleteUserSuccess`),
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
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

export const userMangtPayload = (user: any) => {
  const getFpmStateId = () => {
    return user.accountType?.label === 'Field Project Manager' &&
      user.fieldProjectManagerRoleId.value === FPMManagerTypes.District //Area Manager
      ? user.states?.find(state => state.checked === true)?.state?.id
      : ''
  }

  const directReports = user.directReports;

  directReports?.forEach( (v) => {
    delete v["value"];
    delete v["label"];
    delete v["title"];
  } );
  

  console.log("🚀 ~ file: user-management.ts:169 ~ userMangtPayload ~ directReports:", directReports)
  
  const userObj = {
    ...user,
    newPassword: user.newPassword || '',
    langKey: user.langKey?.value || '',
    vendorId: user.vendorId?.value || '',
    managerRoleId: user.managerRoleId?.value || '',
    fieldProjectManagerRoleId: user.fieldProjectManagerRoleId?.value || '',
    parentFieldProjectManagerId: user.parentFieldProjectManagerId?.value || '',
    markets: user.markets?.filter(market => market.checked) || [],
    regions: user.regions?.filter(region => region.checked).map(region => region.region.label) || [],
    stateId: user.state?.id || '',
    fpmStateId: getFpmStateId(),
    userType: user.accountType?.value,
    ignoreQuota: isDefined(user.ignoreQuota?.value) ? user.ignoreQuota?.value : 0,
    newBonus: user.newBonus?.label ? user.newBonus?.value : '',
    vendorAdmin: user.vendorAdmin,
    primaryAdmin: user.primaryAdmin,
    directChild: directReports
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
}

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
  allManagersOptions,
  accountTypeOptions,
  viewVendorsOptions,
  languageOptions,
  fpmManagerRoleOptions,
}) => {
  return {
    ...userInfo,
    markets: markets || [],
    states: states || [],
    regions: regions || [],
    state: stateOptions?.find(s => s.id === userInfo?.stateId),
    accountType: accountTypeOptions?.find(a => a.value === userInfo?.userType),
    vendorId: viewVendorsOptions?.find(vendor => vendor.value === userInfo?.vendorId),
    langKey: languageOptions?.find(l => l.value === userInfo?.langKey),
    newBonus: BONUS.find(bonus => bonus.value === userInfo?.newBonus),
    ignoreQuota: DURATION.find(quotaDuration => quotaDuration.value === userInfo?.ignoreQuota),
    fieldProjectManagerRoleId: fpmManagerRoleOptions?.find(
      fpmManager => fpmManager.value === userInfo?.fieldProjectManagerRoleId,
    ),
    managerRoleId: fpmManagerRoleOptions?.find(fpmManager => fpmManager.value === userInfo?.managerRoleId),
    parentFieldProjectManagerId: allManagersOptions?.find(
      manager => manager.value === userInfo?.parentFieldProjectManagerId,
    ),
    vendorAdmin: userInfo.vendorAdmin,
    primaryAdmin: userInfo.primaryAdmin
  }
}


export const USER_DIRECT_REPORTS_KEY = "userDirectReports";

export const useUserDirectReports = () => {
  const client = useClient()

  const roleId = 60;
  const regions = "South";
  const data = "";
  const endPoint = `users/downstream/${roleId}/?regions=${regions}&data=${data}`;

  const { data: directReports, ...rest } = useQuery(USER_DIRECT_REPORTS_KEY, async () => {
    const response = await client( endPoint , {})

    return response?.data
  })

  

  const directReportOptions =
    directReports?.map(user => ({
      value: user?.id,
      label: user?.firstName + " " + user?.lastName,
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      login: user?.login,
      email: user?.email

    })) || []

    

  return {
    directReportOptions,
    directReports,
    ...rest,
  }
}

export const useUserDetails = ({ form, userInfo }) => {
  const { setValue, reset } = form
  const { stateSelectOptions: stateOptions } = useStates()
  const { markets } = useMarkets()
  const { regionSelectOptions } = useRegions()
  const { options: allManagersOptions } = useAllManagers()
  const { options: accountTypeOptions } = useActiveAccountTypes()
  const { options: viewVendorsOptions } = useViewVendor()
  const { options: fpmManagerRoleOptions } = useFPMManagerRoles()

  const formattedMarkets = parseMarketAPIDataToFormValues(markets, userInfo?.markets || [])
  const formattedRegions = parseRegionsAPIDataToFormValues(regionSelectOptions, userInfo?.regions || [])
  const formattedStates = parseStatesAPIDataToFormValues(stateOptions, userInfo?.fpmStateId || [])

  const directReportOptions =
    userInfo?.directChild?.map(user => ({
      value: user?.id,
      label: user?.firstName + " " + user?.lastName,
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      login: user?.login,
      email: user?.email
    })) || []

  useEffect(() => {
    if (!userInfo) {
      setValue('markets', formattedMarkets)
      setValue('states', formattedStates)
      setValue('regions', formattedRegions)
      setValue('activated', true)
      setValue('langKey', languageOptions[0])
      setValue( "directReports", directReportOptions )
    } else {
      reset(
        parseUserFormData({
          userInfo,
          stateOptions,
          markets: formattedMarkets,
          states: formattedStates,
          regions: formattedRegions,
          allManagersOptions,
          accountTypeOptions,
          viewVendorsOptions,
          languageOptions,
          fpmManagerRoleOptions,
        }),
      )
    }
  }, [
    reset,
    userInfo,
    stateOptions?.length,
    markets?.length,
    regionSelectOptions?.length,
    allManagersOptions?.length,
    accountTypeOptions?.length,
    viewVendorsOptions?.length,
  ])
}
