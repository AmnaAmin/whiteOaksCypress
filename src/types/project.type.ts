export type ProjectType = {
  accountRecievable: number
  changeordersTotal: string
  city: string
  clientDueDate: string | null
  clientName: string
  clientPaidDate: null
  clientSignoffDate: null
  clientStartDate: string | null
  clientWalkthroughDate: null
  code: string
  createdBy: string
  createdDate: string | null
  dueDateVariance: string | null
  expectedPaymentDate: string | null
  finalInvoiceAmount: string | null
  firstWorkOrderDate: string | null
  gateCode: string
  gatedCommunity: string | null
  generalLabourName: string | null
  hoaEmailAddress: string | null
  hoaPhone: string | null
  hoaPhoneNumberExtension: string
  id: number
  invoiceNumber: string | null
  lastCompletedWorkOrder: string | null
  lockBoxCode: string
  market: string
  modifiedBy: string
  modifiedDate: string | null
  name: string
  numberOfCompletedWorkOrders: 0
  numberOfPaidWorkOrders: 0
  numberOfWorkOrders: 2
  paid: string
  partialPayment: 0
  pastDue: false
  paymentTerm: string | null
  pendingTransactions: 0
  poNumber: string
  profitPercentage: number
  profitTotal: number
  projectClosedDate: string | null
  projectManager: string
  projectManagerId: number
  projectManagerPhoneNumber: string
  projectRelatedCost: number
  projectStatus: string
  projectStatusId: number
  projectType: number
  projectTypeLabel: string
  propertyId: number
  region: string
  revenue: number
  signoffDateVariance: string | null
  sowLink: string
  sowNewAmount: number
  sowOriginalContractAmount: number
  state: string
  streetAddress: string
  superEmailAddress: string
  superFirstName: string | null
  superLastName: string
  superPhoneNumber: string
  superPhoneNumberExtension: string
  vendorId: number
  vendorWODateCompleted: string | null
  vendorWODateInvoiceSubmitted: string | null
  vendorWOId: number
  vendorWOStatus: string
  vendorWOStatusValue: string
  woNumber: string
  woaBackdatedInvoiceDate: string | null
  woaCompletionDate: string | null
  woaInvoiceDate: string | null
  woaPaidDate: string | null
  woaPayVariance: string | null
  woaStartDate: string | null
  workOrderInvoiceTotal: number
  zipCode: string
  upcomingInvoiceTotal: number
}

export type ProjectColumnType = {
  id: number
  flex?: number
  hide: boolean
  sort?: string
  sortIndex?: number
  colId: string
  aggFunc?: string
  pivot?: boolean
  pivotIndex?: string
  pinned?: string
  rowGroup?: boolean
  rowGroupIndex?: string
  type?: string
  field?: string
  cellRenderer?: string
  contentKey?: string
  order: number
  minWidth: number
  userId: string
}

export type ProjectWorkOrderType = {
  id: number
  workOrderCompletionDateVariance: string
  workOrderPayDateVariance?: string
  clientApprovedAmount: number
  clientOriginalApprovedAmount: number
  paymentTerm: string
  vendorId: number
  projectId: number
  capacity: number
  status: number
  statusLabel: string
  createdBy: string
  createdDate: string
  datePermitsPulled?: string
  vendorSkillId: number
  skillName: string
  companyName: string
  businessPhoneNumber: string
  businessEmailAddress: string
  workOrderIssueDate: string
  workOrderExpectedCompletionDate: string
  workOrderDateCompleted: string
  workOrderStartDate: string
  permitsPulled?: string
  invoiceAmount: number
  finalInvoiceAmount: number
  leanWaiverSubmitted?: string
  dateInvoiceSubmitted: string
  dateLeanWaiverSubmitted?: string
  datePaymentProcessed?: string
  expectedPaymentDate: string
  paymentTermDate: string
  datePaid?: string
  paid: boolean
  marketName: string
  propertyAddress: string
  vendorAddress: string
  durationCategory: string
}

export type ProjectAlertType = {
  subject: string
  triggeredType: string
  attribute: string
  category: string
  dateCreated: string
}

export type PropertyType = {
  id?: number
  name?: string
  lockBoxCode?: string
  hoaEmailAddress?: string
  hoaPhone?: string
  gatedCommunity?: boolean
  gateCode?: string
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  squareFeet?: number
  status?: Status
  streetAddress?: string
  city?: string
  state?: string
  zipCode?: string
  documents?: IDocument[]
  projects?: IProject[]
  //  clientId?: number;
  client?: IUser
  marketId?: number
  market?: IMarket
  clientName?: string
}

export const enum Status {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',

  EXPIRED = 'EXPIRED',

  DONOTUSE = 'DONOTUSE',
}

export type IDocument = {
  id?: number
  fileObjectContentType?: string
  fileObject?: any
  fileType?: string
  documentType?: number
  documentTypelabel?: string
  s3Url?: string
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  propertyId?: number
  projectId?: number
  vendorId?: number
  workOrderId?: number
  changeOrderId?: number
  vendorName?: string
  workOrderName?: string
  dispatch?: boolean
}

export type IProject = {
  id?: number
  clientName?: string
  region?: string
  paid?: string
  numberOfWorkOrders?: number
  numberOfPaidWorkOrders?: number
  numberOfActiveWorkOrders?: number
  workOrderInvoiceTotal?: number
  firstWorkOrderDate?: string
  lastCompletedWorkOrder?: string
  profitTotal?: number
  profitPercentage?: string
  name?: string
  projectStatus?: Status
  projectStatusId?: number
  superFirstName?: string
  superLastName?: string
  superPhoneNumber?: string
  superEmailAddress?: string
  clientStartDate?: string
  clientDueDate?: string
  clientSignoffDate?: string
  woaStartDate?: string
  woaCompletionDate?: string
  clientWalkthroughDate?: string
  dueDateVariance?: string
  projectStartDate?: string
  projectClosedDate?: string
  // projectExpectedCloseDate?: string;
  projectSignoffDate?: string
  finalDateVariance?: string
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  sowOriginalContractAmount?: number
  sowCreatedBy?: string
  sowCreatedDate?: string
  sowModifiedBy?: string
  sowModifiedDate?: string
  scheduleId?: number
  documents?: IDocument[]
  workOrders?: IMarket[]
  clientId?: number
  client?: IUser
  projectManager?: IUser
  projectManagerId?: number
  propertyId?: number
  property?: PropertyType
  vendors?: IMarket[]
  acknowledgeCheck?: boolean
  streetAddress?: string
  city?: string
  state?: string
  zipCode?: string
  hoaPhone?: string
  // these attributes do not exist on project table, these added here for views
  // it was easier to reuse existing project react objects
  dueDate?: string
  day?: string
  dayName?: string
  count?: number
  quantity?: number
  finalInvoiceAmount?: number
  sowNewAmount?: number
  partialPayment?: number
  newPartialPayment?: number
  projectType?: string
  projectTypeLabel?: string
  accountRecievable?: string
  paymentTerm?: number
  pastDue?: string
  pendingTransactions?: number
  overrideProjectStatusId?: number
  woaBackdatedInvoiceDate?: string
}

export type IUser = {
  id?: any
  login?: string
  firstName?: string
  lastName?: string
  email?: string
  activated?: boolean
  langKey?: string
  authorities?: any[]
  createdBy?: string
  createdDate?: Date | null
  lastModifiedBy?: string
  lastModifiedDate?: Date | null
  password?: string
  newPassword?: string
  streetAddress?: string
  telephoneNumber?: string
  city?: string
  state?: number
  userType?: number
  zipCode?: string
  vendorId?: number
  stateId?: number
  employeeId?: string
  userTypeLabel?: string
  avatar?: any
  avatarName?: any
  features?: string[]
  fieldProjectManagerRoleId?: number
  parentFieldProjectManagerId?: number
  markets?: IMarket[]
  telephoneNumberExtension?: string
  newTarget?: number
  newBonus?: number
  ignoreQuota?: number
  hfeWage?: number
}

export type IMarket = {
  id?: number
  metropolitanServiceArea?: string
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  properties?: PropertyType[]
  stateId?: number
  stateName?: string
  vendors?: IMarket[]
  value?: string
}

export const defaultValue: Readonly<PropertyType> = {}
