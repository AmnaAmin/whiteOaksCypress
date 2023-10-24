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
  receivedLineItems: InvoiceItemType[]
  status: SelectOption | undefined
  paymentReceivedDate: string | null
  finalSowLineItems: InvoiceItemType[]
}

type InvoiceItemType = {
  id: string | null | number
  transactionId: string | null | number
  type: string | null
  name: string | null
  description: string | null
  amount: number | string | null
  checked: boolean
}

export enum InvoiceStatusValues {
  pendingPayment = 'PENDING_PAYMENT',
  paid = 'PAID',
}
export const INVOICE_STATUS_OPTIONS = [
  { value: InvoiceStatusValues.pendingPayment, label: 'Pending payment' },
  { value: InvoiceStatusValues.paid, label: 'Paid' },
] as SelectOption[]
