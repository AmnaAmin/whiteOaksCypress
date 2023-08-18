import { SelectOption } from './transaction.type'

export type UserForm = {
  email: string
  firstName: string
  lastName: string
  accountType: string
  newPassword?: null
  activated: boolean
  address: string
  city: string
  state: string
  zipCode: string
  telephone: string | number
  ext: string
  employeeID: string
  langKey?: null

  authorities?: string[]
  avatar?: string | null
  avatarName?: string | null
  createdBy?: string
  createdDate?: string
  employeeId?: string
  features?: [string]
  fieldProjectManagerRoleId?: number | null
  managerRoleId: number | null
  firebaseToken?: null
  hfeWage?: number | null
  id?: number
  ignoreQuota?: null
  imageUrl?: string | null
  lastModifiedBy?: string
  lastModifiedDate?: string
  login?: string
  markets?: any[] //TODO - fix type def
  states?: any[]
  regions?: any[]
  // managerRoleId?: string
  newBonus?: number | null
  newTarget?: number | null
  parentFieldProjectManagerId?: SelectOption | null
  removeCards?: null
  reportingFieldManagers?: any[] | null
  stateId?: number
  status?: null
  streetAddress?: string
  telephoneNumber?: string
  telephoneNumberExtension?: string
  userType?: number
  userTypeLabel?: string
  vendorId?: number | null
  vendorAdmin?: boolean | undefined
  primaryAdmin?: boolean | undefined

  directReports?: SelectOption[]
}
