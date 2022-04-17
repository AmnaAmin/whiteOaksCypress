export type ProjectWorkOrder = {
  businessEmailAddress: string
  businessPhoneNumber: string
  capacity: number
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
}

export enum TransactionTypeValues {
  changeOrder = 29,
  draw = 30,
  material = 31,
  payment = 49,
}

export enum TransactionStatusValues {
  pending = 'PENDING',
  cancelled = 'CANCELLED',
  approved = 'APPROVED',
  denied = 'DENIED',
}

export type SelectOption = {
  label: string
  value: any
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
}

export interface FormValues {
  transactionType: SelectOption | null
  against: SelectOption | null
  dateCreated: string | null
  createdBy: string | null
  workOrder: SelectOption | null
  changeOrder: SelectOption | null
  transaction: TransactionFormValues[]
  status: SelectOption | null
  expectedCompletionDate: string
  newExpectedCompletionDate: string
  lienWaiver?: LienWaiverFormValues
  attachment: any
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
  sowRelatedWorkOrderId?: string | null
  sowRelatedChangeOrderId?: string | null
  newExpectedCompletionDate: string | null
  expectedCompletionDate: string | null
  clientApprovedDate: string | null
  paidDate: string | null
  lineItems: ChangeTransaction[]
  projectId: string
  documents?: Array<any>
}

export type ChangeOrderUpdatePayload = {
  id: number
  name: string
  transactionTypeLabel: string
  // skillName: string;
  vendor?: string
  // changeOrderAmount: number;
  status: string
  createdDate: string | null
  approvedBy: string | null
  transactionType: number
  parentWorkOrderId: number | null
  createdDate1: string | null
  createdBy: string
  modifiedDate1: string | null
  modifiedBy: string
  expectedCompletionDate: string | null
  newExpectedCompletionDate: string | null
  clientApprovedDate: string | null
  paidDate: string | null
  projectId: number
  vendorId: number | null
  lineItems: Array<ChangeTransaction & { id: string | number }>
  documents?: Array<any>
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
  changeOrderAmount: number
  quantity: number | null
  totalVendorCost: number | null
  transactionType: number
  sowRelatedWorkOrderId: number | null
  sowRelatedChangeOrderId: number | null
  transactionTypeLabel: string
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
  parentWorkOrderId: number
  projectId: number
  vendorId: number | null
  paymentTerm: string | null
  clientApprovedDate: string | null
  paidDate: string | null
  lineItems: Array<LineItem> | null
  paymentReceived: null
  documents: any[]
}
