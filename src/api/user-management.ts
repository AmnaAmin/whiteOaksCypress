import { useToast } from '@chakra-ui/react'
import { BONUS, DURATION } from 'features/user-management/user-management-form'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { isDefined } from 'utils'
import { useClient } from 'utils/auth-context'
import { parseMarketAPIDataToFormValues } from 'utils/markets'
import { parseStatesAPIDataToFormValues } from 'utils/states'
import { useMarkets, useStates } from './pc-projects'
import { languageOptions } from './vendor-details'

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
        })
      },
      onError(error: any) {
        toast({
          title: t(`${USER_MANAGEMENT}.modal.addUser`),
          description: (error.title as string) ?? t(`${USER_MANAGEMENT}.modal.userAddFailed`),
          status: 'error',
          isClosable: true,
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
        })
      },
      onError(error: any) {
        toast({
          title: t(`${USER_MANAGEMENT}.modal.updateUser`),
          description: (error.title as string) ?? t(`${USER_MANAGEMENT}.modal.userUpdateFailed`),
          status: 'error',
          isClosable: true,
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
        })
      },
      onError(error: any) {
        toast({
          title: t(`${USER_MANAGEMENT}.modal.deleteUserModal`),
          description: (error.title as string) ?? t(`${USER_MANAGEMENT}.modal.deleteUserFailed`),
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const userMangtPayload = (user: any) => {
  const userObj = {
    ...user,
    newPassword: user.newPassword || '',
    langKey: user.langKey?.value || '',
    vendorId: user.vendorId?.value || '',
    fieldProjectManagerRoleId: user.fieldProjectManagerRoleId?.value || '',
    parentFieldProjectManagerId: user.parentFieldProjectManagerId?.value || '',
    markets: user.markets?.filter(market => market.checked) || [],
    states: user.states?.filter(state => state.checked) || [],
    stateId: user.state?.id || '',
    userType: user.accountType?.value,
    ignoreQuota: isDefined(user.ignoreQuota?.value) ? user.ignoreQuota?.value : 0,
    newBonus: user.newBonus?.value || '',
  }
  delete userObj.state
  delete userObj.accountType

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

export const useAccountTypes = () => {
  const client = useClient()
  const { data, ...rest } = useQuery('account-types', async () => {
    const response = await client(`lk_value/lookupType/1`, {})
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

const parseUserFormData = ({
  userInfo,
  stateOptions,
  markets,
  states,
  allManagersOptions,
  accountTypeOptions,
  viewVendorsOptions,
  languageOptions,
  fpmManagerRoleOptions,
  availableManagers,
}) => {
  return {
    ...userInfo,
    markets: markets || [],
    states: states || [],
    state: stateOptions?.find(s => s.id === userInfo?.stateId),
    accountType: accountTypeOptions?.find(a => a.value === userInfo?.userType),
    vendorId: viewVendorsOptions?.find(vendor => vendor.value === userInfo?.vendorId),
    langKey: languageOptions?.find(l => l.value === userInfo?.langKey),
    newBonus: BONUS.find(bonus => bonus.value === userInfo?.newBonus),
    ignoreQuota: DURATION.find(quotaDuration => quotaDuration.value === userInfo?.ignoreQuota),
    fieldProjectManagerRoleId: fpmManagerRoleOptions?.find(
      fpmManager => fpmManager.value === userInfo?.fieldProjectManagerRoleId,
    ),
    parentFieldProjectManagerId: availableManagers?.find(
      manager => manager.value === userInfo?.parentFieldProjectManagerId,
    ),
  }
}

export const useUserDetails = ({ form, userInfo }) => {
  const { setValue, reset } = form
  const { stateSelectOptions: stateOptions } = useStates()
  const { markets } = useMarkets()
  const { options: allManagersOptions } = useAllManagers()
  const { options: accountTypeOptions } = useAccountTypes()
  const { options: viewVendorsOptions } = useViewVendor()
  const { options: fpmManagerRoleOptions } = useFPMManagerRoles()
  const { options: availableManagers } = useAllManagers()

  useEffect(() => {
    if (!userInfo) {
      const formattedMarkets = parseMarketAPIDataToFormValues(markets, [])
      const formattedStates = parseStatesAPIDataToFormValues(stateOptions)
      setValue('markets', formattedMarkets)
      setValue('states', formattedStates)
    } else {
      reset(
        parseUserFormData({
          userInfo,
          stateOptions,
          markets: parseMarketAPIDataToFormValues(markets, userInfo.markets),
          states: parseStatesAPIDataToFormValues(stateOptions, userInfo.states),
          allManagersOptions,
          accountTypeOptions,
          viewVendorsOptions,
          languageOptions,
          fpmManagerRoleOptions,
          availableManagers,
        }),
      )
    }
  }, [
    reset,
    userInfo,
    stateOptions?.length,
    markets?.length,
    allManagersOptions?.length,
    accountTypeOptions?.length,
    viewVendorsOptions?.length,
  ])
}
