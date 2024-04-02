import { SelectOption } from './transaction.type'

export enum StringProjectStatus {
  New = 'new',
  Active = 'active',
  Punch = 'punch',
  Closed = 'closed',
  Reconcile = 'reconcile',


}

export enum ProjectStatus {
  New = 7,
  Active = 8,
  Punch = 9,
  Closed = 10,
  Invoiced = 11,
  Cancelled = 33,
  Paid = 41,
  ClientPaid = 72,
  Overpayment = 109,
  Disputed = 220,
  Reconcile = 120,
  Awaitingpunch = 190,
}

type ProjectManagementValues = {
  status: SelectOption | null
  type: SelectOption | null
  woNumber: string | null
  poNumber: string | null
  projectName: string | null
  woaStartDate: string | null
  woaCompletionDate: string | null
  clientStartDate: string | null
  clientDueDate: string | null
  clientWalkthroughDate: string | null
  clientSignOffDate: string | null
  overrideProjectStatus: SelectOption | null
  previousStatus: number | null
  isReconciled?: boolean | false
  reconciledBy: string | null
  verifiedBy: string | null
  verifiedbyDesc: string | null
  reconciledbyDesc: string | null
  projectClosedDueDate: string | null
  lienExpiryDate: string | null
  lienFiled: Date | string | null
  claimNumber: string | null
  reoNumber: string | null
  preInvoiced: boolean | false
  paymentSource: any
}

type ProjectInvoicingAndPaymentFormValues = {
  originalSOWAmount: number
  sowLink: string | null
  invoiceLink: string | null
  finalSOWAmount: number
  invoiceNumber: string | null
  invoiceAttachment: File | null
  invoiceBackDate: string | null
  paymentTerms: SelectOption | null
  woaInvoiceDate: string | null
  woaExpectedPayDate: string | null
  overPayment: number | null
  remainingPayment: number | null
  payment: number | null
  depreciation: number | null
  resubmittedInvoice: Array<ResubmissionInvoice>
}
type ResubmissionInvoice = {
  notificationDate: string | null
  resubmissionDate: string | null
  paymentTerms: SelectOption | null
  dueDate: string | null
  invoiceNumber: string | null
  uploadedInvoice: File
  id: number | string | null
  docUrl: string | null
  docId: number | null
}
type ContactsFormValues = {
  projectCoordinator: SelectOption | null
  projectCoordinatorPhoneNumber: string | null
  projectCoordinatorExtension: string | null
  fieldProjectManager: SelectOption | null
  fieldProjectManagerPhoneNumber: string | null
  fieldProjectManagerExtension: string | null
  superName: string | null
  superPhoneNumber: string | null
  superPhoneNumberExtension: string | null
  superEmail: string | null
  client: SelectOption | null
  clientType: SelectOption | null
  homeOwnerName: string
  homeOwnerPhone: string
  homeOwnerEmail: string
  carrier: SelectOption | null
  agentName: string
  agentPhone: string
  agentEmail: string
  carrierName: any
}

type ProjectDetailsLocationFormValues = {
  address: SelectOption | null
  city: string | null
  state: SelectOption | null
  zip: string | null
  market: SelectOption | null
  gateCode: string | null
  lockBoxCode: string | null
  claimNumber?: string | null
  hoaContactPhoneNumber: string | null
  hoaContactExtension: string | null
  hoaContactEmail: string | null
  acknowledgeCheck: boolean | null
  property: PropertyAddress | null
  newMarket: SelectOption
}

type PropertyAddress = {
  address: string
  city: string
  zip?: string
  market?: SelectOption
  state?: SelectOption
}
type ProjectDetailsMiscFormValues = {
  dateCreated: string | null
  activeDate: string | null
  awaitingPunchDate: string | null
  punchDate: string | null
  closedDate: string | null
  clientPaidDate: string | null
  collectionDate: string | null
  disputedDate: string | null
  woaPaidDate: string | null
  dueDateVariance: number | null
  payDateVariance: number | null
  payVariance: number | null
  reconcileDate: string | null
  verifiedDate: string | null
  disqualifiedRevenueDate?: string | null
  emailNotificationDate?: string | null
  disqualifiedRevenueFlag?: boolean | null
}

// Project Details form values types
export type ProjectDetailsFormValues = ProjectManagementValues &
  ProjectInvoicingAndPaymentFormValues &
  ContactsFormValues &
  ProjectDetailsLocationFormValues &
  ProjectDetailsMiscFormValues

export type DocumentPayload = {
  fileType: string
  fileObjectContentType: string
  fileObject: string
  documentType: number
}
export type ProjectDetailsAPIPayload = {
  id: number | null

  // Project Management payload
  projectStatus: string | null
  reoNumber: string | null
  newMarketId: number | null
  projectType: string | null
  woNumber: string | null
  poNumber: string | null
  name: string | null
  woaStartDate: string | null
  woaCompletionDate: string | null
  clientStartDate: string | null
  clientDueDate: string | null
  clientWalkthroughDate: string | null
  overrideProjectStatus: SelectOption | null
  isReconciled?: boolean | false
  projectClosedDueDate: string | null
  lienRightFileDate: string | null
  lienRightExpireDate: string | null
  preInvoiced: boolean | false
  paymentSource: any

  // invoicing and payment payload
  sowOriginalContractAmount: number | null
  sowNewAmount: number | null
  invoiceNumber: string | null
  documents?: DocumentPayload[] | null
  woaBackdatedInvoiceDate: string | null
  paymentTerm: string | null
  woaInvoiceDate: string | null
  expectedPaymentDate: string | null
  overPayment: number | null
  remainingPayment: number | null
  newDepreciationPayment: number | null
  resubmissionList: ResubmissionListItem[]

  // Contacts payload
  projectCordinatorId: number | null
  pcPhoneNumber: string | null
  pcPhoneNumberExtension: string | null
  projectManagerId: number | null
  projectManagerPhoneNumber: string | null
  pmPhoneNumberExtension: string | null
  superFirstName: string | null
  superLastName: string | null
  superPhoneNumber: string | null
  superPhoneNumberExtension: string | null
  superEmailAddress: string | null
  clientName: string | null
  homeOwnerName: string | null
  homeOwnerPhone: string | null
  homeOwnerEmail: string | null
  carrierId: string | number | null
  carrierName: any
  agentName: string | null
  agentPhone: string | null
  agentEmail: string | null
  clientType: number

  // Location
  streetAddress: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  market: string | null
  gateCode: string | null
  lockBoxCode: string | null
  claimNumber?: string | null
  hoaPhone: string | null
  hoaPhoneNumberExtension: string | null
  hoaEmailAddress: string | null
  woaPayVariance: number | null
  newProperty: any

  // Misc payload
  createdDate: string | null
  activeDate?: string | null
  awaitingPunchDate?: string | null
  punchDate?: string | null
  closedDate?: string | null
  clientPaidDate?: string | null
  collectionDate?: string | null
  woaPaidDate?: string | null
  dueDateVariance?: number | null
  payDateVariance?: number | null
  payVariance?: number | null
  disqualifiedRevenueDate?: string | null
  disqualifiedRevenueFlag?: boolean | null

  // Other project Details payload
  signoffDateVariance: string | null
  sowLink: string | null
  paid: string | null
  region: string | null
  changeordersTotal: string | null
  numberOfWorkOrders: number | null
  numberOfCompletedWorkOrders: number | null
  numberOfPaidWorkOrders: number | null
  numberOfActiveWorkOrders: number | null
  workOrderInvoiceTotal: number | null
  firstWorkOrderDate: string | null
  lastCompletedWorkOrder: string | null
  projectStatusId: number | null
  previousStatus: number | null
  projectClosedDate: string | null
  finalInvoiceAmount: number | null
  accountRecievable: number | null
  materialCost: number | null
  drawAmount: number | null
  accountPayable: number | null
  generalLabourName: string | null
  gatedCommunity: string | null
  clientSignoffDate: string | null
  createdBy: string | null
  modifiedBy: string | null
  disputedDate?: string | null
  modifiedDate: string | null
  partialPayment: number | null
  projectTypeLabel: string | null
  propertyId: number | null
  pastDue: boolean | null
  pendingTransactions: number | null
  projectRelatedCost: number | null
  profitTotal: number | null
  profitPercentage: number | null
  revenue: number | null
  newPartialPayment: number | null
  property: {
    streetAddress: string | null
    city: string | null
    state: string | null
    zipCode: string | null
  }
  projectStartDate: string | null
}

export type ResubmissionListItem = {
  resubmissionNotificationDate: string | null
  resubmissionDate: string | null
  resubmissionPaymentTerm: number
  resubmissionDueDate: string | null
  resubmissionInvoiceNumber: string
  documentDTO: any
  id: number | string | null
  docId?: number | null
  docUrl?: string | null
  projectId?: string | number | null
}

export type OverPaymentType = {
  id: number
  count: number
  sum: number
}
export const verifyProject = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]
