import { Carrier } from './common.types'
import { Document } from './vendor.types'

export type ProjectWorkOrder = {
  largeWorkOrder: boolean
  onHold?: boolean
  visibleToVendor?: boolean
  validForAwardPlan: boolean
  assignAwardPlan: boolean
  businessEmailAddress: string
  businessPhoneNumber: string
  capacity: number
  name: string
  changeOrderAmount: number
  clientApprovedAmount: number
  clientOriginalApprovedAmount: number
  companyName: string
  claimantName: string
  customerName: string
  owner: string
  makerOfCheck: string
  amountOfCheck: number
  checkPayableTo: string
  claimantsSignature: string
  claimantTitle: string
  dateOfSignature: string
  createdBy: string
  createdDate: string
  dateInvoiceSubmitted: string | null
  dateLeanWaiverSubmitted: string | null
  datePaid: string | null
  datePaymentProcessed: string | null
  datePermitsPulled: string | null
  durationCategory: string
  expectedPaymentDate: string | null
  finalInvoiceAmount: number
  id: number
  invoiceAmount: number
  leanWaiverSubmitted: string | null
  marketName: string
  paid: boolean
  paymentTerm: string | null
  paymentTermDate: string | null
  permitsPulled: string | null
  projectId: number
  propertyAddress: string
  skillName: string
  status: number
  statusLabel: string
  vendorAddress: string
  vendorId: number
  vendorSkillId: number
  workOrderCompletionDateVariance: string | null
  workOrderDateCompleted: string | null
  workOrderExpectedCompletionDate: string
  workOrderIssueDate: string
  workOrderPayDateVariance: string | null
  workOrderStartDate: string
  awardPlanPayTerm: string
  vendorStatusId?: number
  reason: string | null
  applyNewAwardPlan: boolean
}

export type WorkOrderAwardStats = {
  statusLabel: string
  workOrderId: number
  drawConsume: number
  drawRemaining: null | number
  materialConsume: number
  materialRemaining: null | number
  drawAmountConsume: number
  materialAmountConsume: number
  totalAmountConsume: number
  totalAmountRemaining: null | number
  allowedDrawAmount: number | null
}

export type TransactionType = {
  approvedBy: string
  approvedDate: string | null
  changeOrderAmount: number
  clientApprovedDate: null
  createdBy: string
  createdDate: string | null
  id: number
  modifiedBy: string
  modifiedDate: string | null
  name: string
  paidDate: null
  parentWorkOrderId: number
  payDateVariance: null
  projectId: number
  projectName: string
  quantity: null
  skillName: string
  sowRelatedChangeOrderAmount: number
  sowRelatedChangeOrderId: number | null
  sowRelatedChangeOrderName: string | null
  sowRelatedWorkOrderId: number | null
  status: string
  totalVendorCost: number
  totalWhiteoaksCost: number
  transactionTotal: number
  transactionType: number
  transactionTypeLabel: string
  vendor: string
  vendorId: number
  invoiceId: number
}

export enum TransactionTypeValues {
  changeOrder = 29,
  draw = 30,
  material = 31,
  payment = 49,
  woPaid = 62,
  overpayment = 113,
  lateFee = 1014,
  factoring = 1013,
  shippingFee = 1015,
  carrierFee = 1016,
  permitFee = 1017,
  deductible = 1018,
  depreciation = 1019,
  legalFee = 1024,
  originalSOW = 28,
  invoice = 1027,
}

export enum TransactionMarkAsValues {
  paid = 'paid',
  revenue = 'revenue',
}

export enum TransactionStatusValues {
  pending = 'PENDING',
  cancelled = 'CANCELLED',
  approved = 'APPROVED',
  denied = 'DENIED',
}

export type SelectOption = {
  label: string | undefined
  value: any
  id?: number
  awardStatus?: any
  isValidForAwardPlan?: any
  carrier?: Carrier[]
  paymentTerm?: string | number | null | undefined
  lienDue?: number | undefined
  __isNew__?: boolean
  property?: any
  onHoldWO?: boolean
}

export type TransactionFormValues = {
  id: number | string
  description: string
  amount: string
  checked: boolean
}

export interface LienWaiverFormValues {
  claimantName: string
  customerName: string
  propertyAddress: string
  owner: string
  makerOfCheck: string
  amountOfCheck: string
  checkPayableTo: string
  claimantsSignature: string | null | undefined
  claimantTitle: string
  dateOfSignature: string | Date | null
  signatureWidth?: number
  signatureHeight?: number
}

export interface FormValues {
  transactionType: SelectOption | null
  against: SelectOption | null
  dateCreated: string | null
  createdBy: string | null
  modifiedDate: string | null
  modifiedBy: string | null
  workOrder: SelectOption | null
  changeOrder: SelectOption | null
  markAs: SelectOption | null
  paidBackDate: string | null
  transaction: TransactionFormValues[]
  status: SelectOption | null
  expectedCompletionDate: string
  drawOnHold: boolean | null | any //for defaultResetPayload as undefined error being occuring
  newExpectedCompletionDate: string | null
  reason: SelectOption | null
  attachment: any
  lienWaiverDocument: any
  invoicedDate: string | null
  paymentTerm: SelectOption | null
  paymentTermDate: string | null
  paidDate: string | null
  payDateVariance: string
  paymentRecievedDate: string | null
  refund: boolean | null
  lienWaiver?: LienWaiverFormValues
  paymentProcessed: string | null
  payAfterDate: string | null
  verifiedByFpm: SelectOption | null
  verifiedByManager: SelectOption | null
}

export type ChangeTransaction = {
  description: string
  whiteoaksCost: string
  unitCost: string
  quantity: string
  vendorCost: string
}

export type ChangeOrderPayload = {
  transactionType: string
  parentWorkOrderId?: string | null
  createdDate1: string | null
  createdBy: string | null
  markAsRevenue: boolean | null
  sowRelatedWorkOrderId?: string | null
  sowRelatedChangeOrderId?: string | null
  newExpectedCompletionDate: string | null
  expectedCompletionDate: string | null
  clientApprovedDate: string | null
  paymentReceived: string | null
  paidDate: string | null
  lineItems: ChangeTransaction[]
  projectId: string
  paymentTerm: string | null
  paymentTermDate: string | null
  payDateVariance: string | null
  documents?: Array<any>
  paymentProcessed: string | null
  payAfterDate: string | null
  verifiedByFpm: SelectOption | null
  verifiedByManager: SelectOption | null
  reason: string | null
  drawOnHold: boolean | null
}

export type ChangeOrderUpdatePayload = ChangeOrderPayload & {
  id: number
  name: string
  transactionTypeLabel: string
  // skillName: string;
  vendor?: string
  // changeOrderAmount: number;
  status: string
  createdDate: string | null
  approvedBy: string | null
  paymentTerm: string | null
  modifiedDate1: string | null
  modifiedBy: string
  vendorId: number | null
  reason?: SelectOption | null
  // systemGenerated: boolean | null
  paymentProcessed: string | null
  paymentTermDate: string | null
  payAfterDate: string | null
  verifiedByFpm: SelectOption | null
  verifiedByManager: SelectOption | null
  invoiceId: number | string | null
  invoiceNumber?: number | string | null
  drawOnHold: boolean | null
}

type LineItem = {
  id: number
  description: string
  unitCost: number
  quantity: number
  vendorCost: number
  whiteoaksCost: number
  notes: number | null
}

export type ChangeOrderType = {
  id: number
  drawOnHold: boolean | null
  changeOrderAmount: number
  quantity: number | null
  totalVendorCost: number | null
  transactionType: number
  sowRelatedWorkOrderId: number | null
  sowRelatedChangeOrderId: number | null
  transactionTypeLabel: string
  markAsRevenue: boolean | null
  approvedBy: string | null
  totalWhiteoaksCost: number | null
  name: string
  status: string
  createdBy: string | null
  createdDate: string | null
  modifiedBy: string | null
  modifiedDate: string | null
  parentWorkOrderExpectedCompletionDate: string | null
  newExpectedCompletionDate: string | null
  reason: string | null
  parentWorkOrderId: number
  projectId: number
  vendorId: number | null
  paymentTerm: string | null
  paymentTermDate: string | null
  clientApprovedDate: string | null
  paidDate: string | null
  lineItems: Array<LineItem> | null
  paymentReceived: string | null
  documents: Document[]
  // systemGenerated: boolean
  verifiedByFpm: SelectOption | null
  verifiedByManager: SelectOption | null
  paymentProcessed: null
  payAfterDate: null
  invoiceId: number | string | null
  invoiceNumber?: number | string | null
}

export type TransactionsWithRefundType = {
  isVisible?: boolean
  id?: string
  name?: string
  label?: string
}
