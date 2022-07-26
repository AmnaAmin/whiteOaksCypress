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
  projectCoordinator: string
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
  lienWaiverAccepted: boolean
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
  claimantTitle: string
  claimantsSignature: string
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
  invoiceNumber: string
}

export type ProjectAlertType = {
  subject: string
  triggeredType: string
  attribute: string
  category: string
  dateCreated: string
}

export type ProjectFormValues = {
  acknowledgeCheck?: boolean
  name?: string
  projectType?: number
  projectTypeLabel: string
  woNumber?: string
  poNumber?: string
  clientStartDate?: string
  clientDueDate?: string
  clientSignoffDate?: string
  clientWalkthroughDate?: string
  woaStartDate?: string
  sowOriginalContractAmount?: string
  sowDocumentFile?: any
  documents?: any
  sowLink: string
  streetAddress?: string
  city?: string
  state?: string
  zipCode?: any
  newMarketId?: string
  gateCode?: string
  lockBoxCode?: string
  hoaEmailAddress?: string | null
  hoaPhone?: string | null
  hoaPhoneNumberExtension?: string
  projectManagerId?: number
  projectCoordinator?: string
  projectCoordinatorId?: number
  clientName?: string
  clientId?: number
  superLastName?: string | null
  superPhoneNumber?: string
  superPhoneNumberExtension?: string
  superEmailAddress?: string
  projectClosedDate?: string
  projectExpectedCloseDate?: string
  projectStartDate?: string
  woaCompletionDate?: string
  propertyId?: number
  property?: any
}

export type Market = {
  createdBy: string
  createdDate: string | null
  id: number
  metropolitanServiceArea: string
  modifiedBy: string
  modifiedDate: string | null
  stateId: number
  stateName: string
}
