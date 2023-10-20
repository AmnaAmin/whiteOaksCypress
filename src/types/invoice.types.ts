import { type } from 'os'
import { SelectOption } from './transaction.type'

export interface InvoicingType {
  dateCreated: string | null
  createdBy: string | null
  dateModified: string | null
  modifiedBy: string | null
  invoiceNumber: string | null
  invoiceDate: string | null
  paymentTerms: SelectOption | undefined
  woaExpectedPayDate: string | null
  invoiceItems: InvoiceItemType[]
  status: SelectOption | undefined
}

type InvoiceItemType = {
  id: string | null | number
  transactionId: string | null | number
  type: string | null
  description: string | null
  amount: number | string | null
  checked: boolean
}
