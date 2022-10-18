type ReceivableType = {
  id: string
  projectId: number
  projectCoordinatorId: number
  woaInvoiceDate: string | null
  status: string | null
  marketName: string | null
  changeOrderId: number | null
  clientName: string | null
  propertyAddress: string | null
  paymentTerm: number
  transactionType: number | null
  type: string | null
  expectedPaymentDate: string | null
  amount: number | null
  finalInvoice: number
  changeOrderPaidDate: string | null
  woaPaidDate: string | null
  famount: string | null
  durationCategory: string | null
  invoiceNumber: string | null
  poNumber: string | null
  woNumber: string | null
  projectStatus: string | null
}

export type ReceivableTableData = {
  arList: Array<ReceivableType>
  totalCount: number
}
