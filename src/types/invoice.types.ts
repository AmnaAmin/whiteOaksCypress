import { SelectOption } from './transaction.type'

export interface InvoicingType {
  dateCreated: string | null
  createdBy: string | null
  dateModified: string | null
  modifiedBy: string | null
  invoiceNumber: string | null
  invoiceDate: string | null
  paymentTerms: SelectOption | null
  woaExpectedPayDate: string | null
}
