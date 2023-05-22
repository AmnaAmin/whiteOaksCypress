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

export const useUserRolesSelector = (): UserRoles => {
  const { data } = useAuth()

  const { userType } = (data?.user as Account) ?? ''

  return {
    isAdmin: userType === UserTypes.admin,
    isVendor: userType === UserTypes.vendor,
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

export const useRoleBasedPermissions = (): Array<string> => {
  const { data } = useAuth()
  const { userTypeLabel } = data?.user as Account
  const permissions = MENU_PERMISSIONS[userTypeLabel] || []
  return permissions
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

const MENU_PERMISSIONS = {
  [ROLE.Vendor]: ['VENDORDASHBOARD.EDIT', 'ESTIMATES.EDIT', 'VENDORPROJECTS.EDIT', 'VENDORPROFILE.EDIT'],
  [ROLE.PC]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'PAYABLE.EDIT', 'RECEIVABLE.EDIT', 'VENDORS.EDIT', 'CLIENTS.READ'],
  [ROLE.VendorManager]: ['VENDORS.EDIT', 'VENDORSKILLS.EDIT', 'MARKETS.EDIT'],
  [ROLE.DOC]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'VENDORS.EDIT', 'CLIENTS.EDIT', 'REPORTS.EDIT', 'PERFORMANCE.EDIT'],
  [ROLE.FPM]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'VENDORS.EDIT'],
  [ROLE.CO]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'VENDORS.EDIT'],
  [ROLE.ClientManager]: ['CLIENTS.EDIT'],
  [ROLE.Operations]: [
    'ESTIMATES.EDIT',
    'PROJECTS.EDIT',
    'PAYABLE.EDIT',
    'RECEIVABLE.EDIT',
    'VENDORS.EDIT',
    'CLIENTS.EDIT',
    'REPORTS.EDIT',
    'PERFORMANCE.EDIT',
  ],
  [ROLE.Accounting]: [
    'ESTIMATES.EDIT',
    'PROJECTS.EDIT',
    'PAYABLE.EDIT',
    'RECEIVABLE.EDIT',
    'VENDORS.EDIT',
    'CLIENTS.EDIT',
    'REPORTS.EDIT',
    'PERFORMANCE.EDIT',
  ],
  [ROLE.Admin]: [
    'ADMINDASHBOARD.EDIT',
    'ESTIMATES.EDIT',
    'PROJECTS.EDIT',
    'PAYABLE.EDIT',
    'RECEIVABLE.EDIT',
    'VENDORS.EDIT',
    'CLIENTS.EDIT',
    'REPORTS.EDIT',
    'PERFORMANCE.EDIT',
    'USERMANAGER.EDIT',
    'MARKETS.EDIT',
    'PROJECTTYPE.EDIT',
    'VENDORSKILLS.EDIT',
    'ALERTS.EDIT',
    'CYPRESSREPORT.EDIT',
    'SUPPORT.EDIT',
  ],
}
