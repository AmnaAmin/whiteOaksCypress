import { SelectOption } from './transaction.type'

export interface InvoicingType {
  id?: string | number | null
  invoiceLineItems?: any
  isPartialPayment?: boolean
  invoiceAmount?: number | null
  createdDate?: string | null
  createdBy?: string | null
  modifiedDate?: string | null
  modifiedBy?: string | null
  invoiceNumber: string | null
  invoiceDate: string | null
  paymentTerm: SelectOption | undefined
  woaExpectedPayDate: string | null
  receivedLineItems?: InvoiceItemType[]
  status: SelectOption | undefined | string
  paymentReceivedDate: string | null
  finalSowLineItems: InvoiceItemType[]
  documents?: InvoiceDocumentType[]
  attachments?: any
  sowAmount?: number | string | null
  remainingPayment?: number | string | null
  payment?: number | string | null
  projectId?: string | null | number
  invoiceName?: string | null
  paymentSource?: any
}
type InvoiceDocumentType = {
  documentType: number
  projectId?: string | null
  fileObject?: any
  fileObjectContentType?: string
  fileType?: string
  s3Url?: string
}

type InvoiceItemType = {
  id: string | null | number
  transactionId: string | null | number
  type: string | null
  name: string | null
  description: string | null
  amount: number | string | null
  checked: boolean
  createdDate?: string | null
}

export enum InvoiceStatusValues {
  pendingPayment = 'PENDING_PAYMENT',
  paid = 'PAID',
  partialPaid = 'PARTIAL_PAID',
  cancelled = 'CANCELLED',
}
export const INVOICE_STATUS_OPTIONS = [
  { value: InvoiceStatusValues.pendingPayment, label: 'Pending payment' },
  { value: InvoiceStatusValues.paid, label: 'Paid' },
  { value: InvoiceStatusValues.partialPaid, label: 'Partial paid' },
  { value: InvoiceStatusValues.cancelled, label: 'Cancelled' }
] as SelectOption[]
