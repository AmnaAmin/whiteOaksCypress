import { SelectOption } from './transaction.type'

export type Project = {
  accountRecievable: number | null
  accountPayable: number | null
  changeordersTotal: string | null
  city: string | null
  clientDueDate: string | null
  clientName: string | null
  clientPaidDate: string | null
  clientSignoffDate: string | null
  clientStartDate: string | null
  clientWalkthroughDate: string | null
  code: string | null
  createdBy: string | null
  createdDate: string | null
  dueDateVariance: number | null
  expectedPaymentDate: string | null
  finalInvoiceAmount: number | null
  firstWorkOrderDate: string | null
  gateCode: string | null
  gatedCommunity: string | null
  generalLabourName: string | null
  hoaEmailAddress: string | null
  hoaPhone: string | null
  hoaPhoneNumberExtension: string | null
  id: number | null
  invoiceNumber: string | null
  invoiceLink: string | null
  lastCompletedWorkOrder: string | null
  lockBoxCode: string | null
  market: string | null
  materialCost: number | null
  drawAmount: number | null
  modifiedBy: string | null
  modifiedDate: string | null
  name: string | null
  numberOfCompletedWorkOrders: number | null
  numberOfPaidWorkOrders: number | null
  numberOfWorkOrders: number | null
  numberOfActiveWorkOrders: number | null
  paid: string | null
  partialPayment: number | null
  pastDue: boolean | null
  paymentTerm: string | null
  pendingTransactions: number | null
  poNumber: string | null
  pcPhoneNumber: string | null
  pcPhoneNumberExtension: string | null
  pmPhoneNumberExtension: string | null
  profitPercentage: number | null
  profitTotal: number | null
  projectClosedDate: string | null
  projectManager: string | null
  projectCoordinator: string | null
  projectCoordinatorId: number | null
  projectManagerId: number | null
  projectManagerPhoneNumber: string | null
  projectManagerPhoneNumberExtension: string | null
  projectRelatedCost: number | null
  projectStatus: string | null
  projectStatusId: number | null
  previousStatus: number | null
  projectType: number | null
  projectTypeLabel: string | null
  propertyId: number | null
  region: string | null
  revenue: number | null
  signoffDateVariance: string | null
  sowLink: string | null
  sowNewAmount: number | null
  sowOriginalContractAmount: number | null
  state: string | null
  streetAddress: string | null
  superEmailAddress: string | null
  superFirstName: string | null
  superLastName: string | null
  superPhoneNumber: string | null
  superPhoneNumberExtension: string
  vendorId: number | null
  vendorWODateCompleted: string | null
  vendorWODateInvoiceSubmitted: string | null
  vendorWOId: number | null
  vendorWOStatus: string | null
  vendorWOStatusValue: string | null
  woNumber: string | null
  woaBackdatedInvoiceDate: string | null
  woaCompletionDate: string | null
  woaInvoiceDate: string | null
  woaPaidDate: string | null
  woaPayVariance: string | null
  woaStartDate: string | null
  workOrderInvoiceTotal: number | null
  zipCode: string | null
  upcomingInvoiceTotal: number | null
  numberOfChangeOrders: number | null
  overPayment: number | null
  newPartialPayment: number | null
  overrideProjectStatus: string | null
  projectStartDate: string | null
  punchDate?: string | null
  closedDate?: string | null
  disputedDate?: string | null
  payDateVariance?: number | null
  payVariance?: number | null
  collectionDate?: string | null
  documents: any[] | null
  vendorWODueDate?: string
}

export type ProjectExtraAttributesType = {
  id: number
  projectId: number
  punchDate: string | null
  collectionDate: string | null
  disputedDate: string | null
  activeDate: string | null
  createdDate: string | null
  createdBy: string | null
  lastModifiedBy: string | null
  lastModifiedDate: string | null
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
  awardPlanId: number
  id: number
  displayAwardPlan: boolean
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
  cancel: string
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
  projectType?: SelectOption | null
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
  state?: SelectOption | null
  zipCode?: any
  newMarket?: SelectOption | null
  gateCode?: string
  lockBoxCode?: string
  hoaEmailAddress?: string | null
  hoaPhone?: string | null
  hoaPhoneNumberExtension?: string
  projectManager?: SelectOption | null
  projectCoordinator?: SelectOption | null
  clientName?: string
  client?: SelectOption | null
  superLastName?: string | null
  superFirstName?: string | null
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

export type ProjectFinancialOverview = {
  changeOrderId: number
  vendorPayment: number
  workOrderId: number | null
  projectId: number
  vendorId: number
  vendorName: string | null
  projectManagerId: number
  projectCoordinatorId: number
  skillName: string
  originalAmount: number
  newAmount: number
  partialPayment: number
  workOrderOriginalAmount: number
  workOrderNewAmount: number
  profit: number
  changeOrder: number
  draw: number
  material: number
  adjustment: number
  accountPayable: number
  noCoAdjustment: number
  coAdjustment: number
  revisedVendorWorkOrder: number
  revisedChangeOrder: number
  finalVendorWorkOrder: number
}

export type AddressInfo = { address: string; city: string; state: string; zipCode: string }
