import { SelectOption } from './transaction.type'

export type AlertFormValues = {
  id?: number
  title?: string
  message?: string
  status?: string
  subject?: string
  body?: string
  triggerType?: string
  notify?: boolean
  category?: SelectOption
  dateCreated?: string
  dateUpdated?: string
  schedular?: string
  statement?: string
  triggeredAlerts?: []
  userTypes?: any
  manageAlertModal?: boolean
  setManageAlertModal?: string
  alertRuleQuery?: string
  recipientEmailAddress?: string
  recipientPhoneNumber?: string
  typeSelection?: { label: string; value: string; type: string } | null
  attributeSelection?: { label: string; value: string; type: string } | null
  behaviourSelection?: { label: string; value: string; type: string } | null
  customAttributeSelection?: string
  fromDate?: string
  toDate?: string
  conditionSelection?: string
}

export type AlertType = {
  id?: number
  title?: string
  message?: string
  status?: string
  subject?: string
  body?: string
  triggerType?: TriggerType
  notify?: boolean
  category?: SelectOption
  dateCreated?: string
  dateUpdated?: string
  schedular?: Schedular
  statement?: Statement
  triggeredAlerts?: TriggeredAlert[]
  userTypes?: UserType[]
  manageAlertModal?: boolean
  setManageAlertModal?: Function
  alertRuleQuery?: string
  recipientEmailAddress?: string
  recipientPhoneNumber?: string
  typeSelection?: string
  attributeSelection?: string
  behaviourSelection?: string
  customAttributeSelection?: string
  fromDate?: string
  toDate?: string
  conditionSelection?: string
}

export const enum TriggerType {
  IMMEDIATE,
  SCHEDULE,
}

export const CATEGORY_OPTIONS = [
  { value: '1', label: 'WARNING' },
  { value: '2', label: 'INFO' },
  { value: '3', label: 'ERROR' },
]

export const NOTIFY_OPTIONS = [
  { value: true, label: 'Enable' },
  { value: false, label: 'Disable' },
]

export const TYPE_SELECTION_OPTIONS = [
  { value: '1', label: 'Project' },
  { value: '2', label: 'Work Order' },
  { value: '3', label: 'Vendor' },
  { value: '4', label: 'Transaction' },
  { value: '5', label: 'Client' },
  { value: '6', label: 'Quota' },
]

export const ATTRIBUTE_SELECTION_OPTIONS = [
  { value: '1', label: 'Status' },
  { value: '2', label: 'Project Manager' },
  { value: '3', label: 'Project type' },
]

export enum ProjectStatus {
  Active = 'active',
  Punch = 'punch',
  New = 'new',
  Closed = 'closed',
  Invoiced = 'Invoiced',
  Cancelled = 'Cancelled',
  Paid = 'paid',
}

export const vendorAttributes = [
  { value: 'score', label: 'Score', type: 'number' },
  { label: 'Status', value: 'ProjectStatus', type: 'enum' },
  { label: 'Agreement signed date', value: 'Agreement signed date', type: 'string' },
  { label: 'Ein number', value: 'Ein number', type: 'string' },
  { label: 'Ssn number', value: 'Ssn number', type: 'string' },
  { label: 'Owner Name', value: 'Owner Name', type: 'string' },
]

export const projectAttributes = [
  { value: 'Status', label: 'Status' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'Project Type', value: 'Project Type' },
]

export const workOrderAttributes = [
  { value: 'Status', label: 'Status' },
  { label: 'Final Invoice Amount', value: 'Final Invoice Amount' },
]

export const transactionAttributes = [
  { value: 'Amount', label: 'Amount' },
  { value: 'Type', label: 'Type' },
  { value: 'Status', label: 'Status' },
]

export const clientAttributes = [
  { value: 'Company Name', label: 'Company Name' },
  { value: 'Email Address', label: 'Email Address' },
  { value: 'Phone number', label: 'Phone number' },
  { value: 'Contact', label: 'Contact' },
  { value: 'Invoice Email Address', label: 'Invoice Email Address' },
]
export const quotaAttributes = [{ value: 'Quota Target %', label: 'Quota Target %' }]

export const BEHAVIOUR_SELECTION_OPTIONS = [
  { value: '1', label: 'Change' },
  { value: '2', label: 'Equal To' },
]

export type Schedular = {
  id?: number
  startTime?: string
  endTime?: string
  triggeredTime?: string
  dateCreated?: string
  createdBy?: string
  alertDefinition?: AlertType
}

export type TriggeredAlert = {
  id?: number
  status?: TriggeredStatus
  dateCreated?: string
  dateUpdated?: string
  targetUrl?: string
  alertHistories?: AlertHistory[]
  comments?: Comment[]
  alertDefinition?: AlertType
}

export const enum TriggeredStatus {
  ACTIVE,
  INACTIVE,
  RESOLVED,
}

export type AlertHistory = {
  id?: number
  subject?: string
  message?: string
  emailStatus?: boolean
  webSocketStatus?: boolean
  smsStatus?: boolean
  webSockectRead?: boolean
  retryAttempts?: number
  errorLog?: string
  receipientEmail?: string
  userId?: number
  triggeredAlert?: TriggeredAlert
  category?: SelectOption
  dateCreated?: string
  dateModified?: string
  login?: string
  projectId?: string
}

export type UserType = {
  id?: number
  userTypeId?: number
  alertDefinition?: AlertType
}

export type Statement = {
  id?: number
  operand?: Operand
  operator?: Operator
  binary?: Binary
  alertDefinition?: AlertType
}

export type Operand = {
  id?: number
  type?: string
  statement?: Statement
}

export type Operator = {
  id?: number
  type?: string
  binary?: Binary
  unary?: Unary
  statement?: Statement
}

export type Binary = {
  id?: number
  statement?: Statement
  operator?: Operator
}

export type Unary = {
  id?: number
  operator?: Operator
}
