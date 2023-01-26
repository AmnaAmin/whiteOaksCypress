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
  userTypes?: []
  manageAlertModal?: boolean
  setManageAlertModal?: string
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
  { value: '6', label: 'Performance' },
]

export const ATTRIBUTE_SELECTION_OPTIONS = [
  { value: '1', label: 'Status' },
  { value: '2', label: 'Project Manager' },
  { value: '3', label: 'Project type' },
]

export const BEHAVIOUR_SELECTION_OPTIONS = [{ value: '1', label: 'Change' }]

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
