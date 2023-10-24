import { SelectOption } from './transaction.type'

export interface InvoicingType {
  id?: string | number | null
  createdDate?: string | null
  createdBy?: string | null
  modifiedDate?: string | null
  modifiedBy?: string | null
  invoiceNumber: string | null
  invoiceDate: string | null
  paymentTerm: SelectOption | undefined
  woaExpectedPayDate: string | null
  invoiceItems: InvoiceItemType[]
  status: SelectOption | undefined
  paymentReceivedDate: string | null
}

type InvoiceItemType = {
  id: string | null | number
  transactionId: string | null | number
  type: string | null
  description: string | null
  amount: number | string | null
  checked: boolean
}

export enum InvoiceStatusValues {
  pending = 'PENDING',
  cancelled = 'CANCELLED',
  approved = 'APPROVED',
  denied = 'DENIED',
}
export const INVOICE_STATUS_OPTIONS = [
  { value: InvoiceStatusValues.approved, label: 'Approved' },
  { value: InvoiceStatusValues.cancelled, label: 'Cancelled' },
  { value: InvoiceStatusValues.denied, label: 'Denied' },
] as SelectOption[]
