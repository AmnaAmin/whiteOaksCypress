import { Account } from 'types/account.types'
import { useAuth } from './auth-context'

type UserRoles = {
  isVendor: boolean
  isAdmin: boolean
  isGeneralLabor: boolean
  isProjectCoordinator: boolean
  isVendorManager: boolean
}

export const useUserRolesSelector = (): UserRoles => {
  const { data } = useAuth()
  const { userTypeLabel = '' } = data?.user as Account

  return {
    isAdmin: userTypeLabel?.includes('Admin'),
    isGeneralLabor: userTypeLabel?.includes('General Labor'),
    isVendor: userTypeLabel === 'Vendor',
    isProjectCoordinator: userTypeLabel?.includes('Project Coordinator'),
    isVendorManager: userTypeLabel?.includes('Vendor Manager'),
  }
}

export const useUserProfile = (): Account | undefined => {
  const { data } = useAuth()
  return data?.user
}
