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
  customAttributeSelection?: { label: string; value: string; type: string } | null
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

export const vendorAttributes = [
  { value: 'score', label: 'Score', type: 'number' },
  { label: 'Status', value: 'Status', type: 'custom' },
  { label: 'Agreement signed date', value: 'Agreement signed date', type: 'string' },
  { label: 'Ein number', value: 'Ein number', type: 'string' },
  { label: 'Ssn number', value: 'Ssn number', type: 'string' },
  { label: 'Owner Name', value: 'Owner Name', type: 'string' },
]

export const projectAttributes = [
  { value: 'Status', label: 'Status', type: 'custom' },
  { label: 'Project Manager', value: 'Project Manager', type: 'string' },
  { label: 'Project Type', value: 'Project Type', type: 'string' },
]

export const workOrderAttributes = [
  { value: 'Status', label: 'Status', type: 'custom' },
  { label: 'Final Invoice Amount', value: 'Final Invoice Amount', type: 'number' },
]

export const transactionAttributes = [
  { value: 'Amount', label: 'Amount', type: 'number' },
  { value: 'Type', label: 'Type', type: 'string' },
  { value: 'Status', label: 'Status', type: 'custom' },
]

export const clientAttributes = [
  { value: 'Company Name', label: 'Company Name', type: 'string' },
  { value: 'Email Address', label: 'Email Address', type: 'string' },
  { value: 'Phone number', label: 'Phone number', type: 'string' },
  { value: 'Contact', label: 'Contact', type: 'string' },
  { value: 'Invoice Email Address', label: 'Invoice Email Address', type: 'string' },
]

export const quotaAttributes = [{ value: 'Quota Target %', label: 'Quota Target %', type: 'number' }]

export const behaviorOptionsForString = [{ value: '1', label: 'Change' }]

export const behaviorOptionsForNumber = [
  { value: '1', label: 'Change' },
  { value: '2', label: 'Greater Than' },
  { value: '2', label: 'Less Than' },
]

export const customBehaviorOptions = [
  { value: '1', label: 'Change' },
  { value: '2', label: 'Equal To' },
]

export const projectStatus = [
  { label: 'New', value: 7 },
  { label: 'Active', value: 8 },
  { label: 'Punch', value: 9 },
  { label: 'Closed', value: 10 },
  { label: 'Invoiced', value: 11 },
  { label: 'Cancelled', value: 33 },
  { label: 'Paid', value: 41 },
]

export const vendorStatus = [
  { label: 'Active', value: 12 },
  { label: 'InActive', value: 13 },
  { label: 'Do Not Use', value: 14 },
  { label: 'Expired', value: 15 },
]
export const workOrderStatus = [
  { label: 'Active', value: 34 },
  { label: 'InActive', value: 35 },
  { label: 'Do Not Use', value: 36 },
  { label: 'Expired', value: 37 },
]
export const transactionStatus = [
  { label: 'Vendor Work Order', value: 27 },
  { label: 'Original SOW', value: 28 },
  { label: 'Change Order', value: 29 },
  { label: 'Draw', value: 30 },
  { label: 'Material', value: 31 },
  { label: 'Adjustment', value: 32 },
  { label: 'Paid', value: 40 },
  { label: 'WO Paid', value: 52 },
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
