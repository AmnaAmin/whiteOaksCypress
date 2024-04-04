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
  isOperations: boolean
  isClientManager: boolean
  isConstructionOperations: boolean
  isOpsOrAdmin: boolean
}

export enum UserTypes {
  admin = 1,
  fieldProjectManager = 5,
  vendor = 6,
  projectCoordinator = 112,
  vendorManager = 1007,
  directorOfConstruction = 1001,
  accounting = 2,
  operations = 38,
  clientManager = 1011,
  constructionOperations = 1012,
  regularManager = 61,
}

//Its depricated don't use anywhere
export const useUserRolesSelector = (): UserRoles => {
  const { data } = useAuth()

  const { authorities, userType, authorityList } = (data?.user as Account) ?? ''

  return {
    isAdmin: authorities?.includes('SYSTEM_ROLE'),
    isVendor: authorityList?.[0]?.assignment === 'VENDOR',
    isProjectCoordinator: userType === UserTypes.projectCoordinator,
    isVendorManager: userType === UserTypes.vendorManager,
    isFPM: userType === UserTypes.fieldProjectManager,
    isDoc: userType === UserTypes.directorOfConstruction,
    isAccounting: userType === UserTypes.accounting,
    isOperations: userType === UserTypes.operations,
    isClientManager: userType === UserTypes.clientManager,
    isConstructionOperations: userType === UserTypes.constructionOperations,
    isOpsOrAdmin: userType === UserTypes.admin || userType === UserTypes.operations,
  }
}

export const useUserProfile = (): Account | undefined => {
  const { data } = useAuth()
  return data?.user
}

export const useRoleBasedPermissions = (): { permissions: Array<string> } => {
  const { data } = useAuth()
  const { permissions, authorities } = data?.user as Account
  const isAdmin = authorities.includes('SYSTEM_ROLE')
  return {
    permissions: isAdmin ? ['ALL'] : permissions,
  }
}

export enum ROLE {
  Vendor = 'Vendor',
  PC = 'Project Coordinator',
  VendorManager = 'Vendor Manager',
  DOC = 'Director Of Construction',
  FPM = 'Field Project Manager',
  CO = 'Construction Operations',
  ClientManager = 'Client Manager',
  Accounting = 'Accounting',
  Operations = 'Operational',
  Admin = 'Admin',
}
