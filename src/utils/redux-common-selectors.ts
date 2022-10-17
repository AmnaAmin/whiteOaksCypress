import { Account } from 'types/account.types'
import { useAuth } from './auth-context'

type UserRoles = {
  isVendor: boolean
  isAdmin: boolean
  isProjectCoordinator: boolean
  isVendorManager: boolean
  isFPM: boolean
  isDoc: boolean
  isAccounting: boolean
}

enum UserTypes {
  admin = 1,
  fieldProjectManager = 5,
  vendor = 6,
  projectCoordinator = 112,
  vendorManager = 1007,
  directorOfConstruction = 1001,
  accounting = 2,
}

export const useUserRolesSelector = (): UserRoles => {
  const { data } = useAuth()
  const { userType } = data?.user as Account

  return {
    isAdmin: userType === UserTypes.admin,
    isVendor: userType === UserTypes.vendor,
    isProjectCoordinator: userType === UserTypes.projectCoordinator,
    isVendorManager: userType === UserTypes.vendorManager,
    isFPM: userType === UserTypes.fieldProjectManager,
    isDoc: userType === UserTypes.directorOfConstruction,
    isAccounting: userType === UserTypes.accounting,
  }
}

export const useUserProfile = (): Account | undefined => {
  const { data } = useAuth()
  return data?.user
}
