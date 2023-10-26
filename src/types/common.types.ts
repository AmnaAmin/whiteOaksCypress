import { Market } from './project.type'

export type ErrorType = {
  errorKey: string
  message: string
  params: any
  status: number
  title: string
  type: string
}

export type GenericObjectType = { [key: string]: any }

export type State = {
  id: number
  name: string
  region: string
  code: string
  createdBy: string
  createdDate: string
  modifiedBy: string
  modifiedDate: string
}
export type Region = {
  value: string
  label: string
}

export type User = {
  id: number
  login: string
  firstName: string
  lastName: string
  email: string
  imageUrl: string
  activated: boolean
  langKey: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  authorities: string[]
  streetAddress: string
  city: string
  stateId: number
  zipCode: string
  telephoneNumber: string
  status: string | null
  userType: number
  userTypeLabel: string
  employeeId: string
  vendorId: number | null
  newPassword: string
  firebaseToken: string
  fieldProjectManagerRoleId: number
  parentFieldProjectManagerId: number
  telephoneNumberExtension: string
  reportingFieldManagers: string | null
  markets: Market[]
  newTarget: string | null
  newBonus: string | null
  ignoreQuota: string | null
  removeCards: string | null
  avatar: string | null
  avatarName: string | null
  features: any[]
  hfeWage: string | null
}

export type ProjectType = {
  id: number
  value: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
}

export type Client = {
  id: number
  companyName: string
  dateCreated: string | null
  dateUpdated: string | null
  streetAddress: string | null
  city: string
  state: number
  zipCode: string
  invoiceEmailAddress: string
  createdBy: string | null
  createdDate: string | null
  modifiedBy: string | null
  modifiedDate: string | null
  carrier: Carrier[]
  paymentTerm: string
}

export type Carrier = {
  id: number
  name?: string
  phone?: string
  email?: string
}

export type Language = 'English' | 'Spanish'

export type AuditLogType = {
  id: number
  modifiedBy: string
  modifiedDate: string
  parameter: string
  oldValue: string
  newValue: string
}
