import { useToast } from '@chakra-ui/react'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useStates } from './pc-projects'
import { languageOptions } from './vendor-details'

export const useVendorUsers = (vendorId: any, adminVendorLogin: any, userLoginId: any) => {
  const client = useClient()

  const { isAdmin, isDoc, isAccounting, isProjectCoordinator, isOperations } = useUserRolesSelector()

  const isAppAdmin = isAdmin || isDoc || isAccounting || isProjectCoordinator || isOperations

  if (!isAppAdmin) {
    //vendorId = 0
  }

  return useQuery(
    ['vendor-users-list', vendorId, adminVendorLogin, userLoginId],
    async () => {
      const response = await client(
        `vendor/users/portal?vendorId=${vendorId}&adminVendorLogin=${adminVendorLogin}&parentId=${userLoginId}`,
        {},
      )

      return response?.data
    },
    { enabled: !!vendorId },
  )
}

export const useAddVendorUser = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation(
    userPayload => {
      return client('vendor/user/portal', {
        data: userPayload,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        queryClient.resetQueries('vendor-users-list')
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

export const useUpdateVendorUser = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation(
    userPayload => {
      return client('vendor/user/portal', {
        data: userPayload,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        queryClient.resetQueries('vendor-users-list')
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

export const useToggleVendorActivation = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation(
    (payload: any) => {
      const apiUrl = `vendor/${payload.vendorId}/users/${payload.action}/portal?adminVendorLogin=1`

      return client(apiUrl, {
        data: [],
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.resetQueries('vendor-users-list')
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

export const useVendorUserDetails = (form, vendorUserInfo) => {
  const { setValue, reset } = form
  const { stateSelectOptions: stateOptions } = useStates()
  //console.log( vendorUserInfo );
  //console.log(stateOptions?.find(s => s.id === vendorUserInfo?.state));
  useEffect(() => {
    if (!!(vendorUserInfo && vendorUserInfo.id)) {
      reset({
        email: vendorUserInfo.email,
        firstName: vendorUserInfo.firstName,
        lastName: vendorUserInfo.lastName,
        telephoneNumber: vendorUserInfo.telephoneNumber,
        vendorAdmin: vendorUserInfo.vendorAdmin,
        langKey: languageOptions?.find(l => l.value === vendorUserInfo?.langKey),
        city: vendorUserInfo.city,
        streetAddress: vendorUserInfo.streetAddress,
        state: stateOptions?.find(s => s.id === vendorUserInfo?.stateId),
        zipCode: vendorUserInfo.zipCode,
        id: vendorUserInfo.id,
        primaryAdmin: vendorUserInfo.primaryAdmin,
        activated: vendorUserInfo.activated,
      })
    } else {
      reset({
        email: '',
        firstName: '',
        lastName: '',
        telephoneNumber: '',
        vendorAdmin: false,
        primaryAdmin: false,
        city: '',
        streetAddress: '',
        state: '',
        zipCode: '',
        activated: false,
      })
      setValue('telephoneNumber', '')
      setValue('langKey', languageOptions[0])
    }
  }, [vendorUserInfo])
}
