export type Authorities = ['ROLE_USER', 'ROLE_ADMIN']

export enum UserTypes {
  vendor = 'Vendor',
  pc = 'Project Coordinator',
  vendorManager = 'Vendor Manager',
}

export type Account = {
  id: number
  login: string
  firstName: string
  lastName: string
  email: string
  imageUrl: string | null
  activated: boolean
  langKey: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  authorities: Authorities
  streetAddress: string
  city: string
  stateId: number | null
  zipCode: string
  telephoneNumber: string
  status: string | null
  userType: number
  userTypeLabel: UserTypes
  employeeId: string
  vendorId: number
  newPassword: string | null
  firebaseToken: string | null
  fieldProjectManagerRoleId: number | null
  parentFieldProjectManagerId: number | null
  telephoneNumberExtension: string
  reportingFieldManagers: string | null
  markets: any[] | null
  newTarget: string | null
  newBonus: string | null
  ignoreQuota: string | null
  removeCards: string | null
  avatar: string | null
  avatarName: string | null
  features: string[]
  hfeWage: string | null
}

export type PasswordFormValues = {
  currentPassword: string
  confirmPassword: string
  newPassword: string
}

export type PasswordPayload = Pick<PasswordFormValues, 'currentPassword' | 'newPassword'>
