import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'
import { dateFormat } from 'utils/date-time-utils'

export const RECEIVABLE_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'id',
    accessorKey: 'displayId',
  },
  {
    header: 'client',
    accessorKey: 'clientName',
  },
  {
    header: 'address',
    accessorKey: 'propertyAddress',
  },
  {
    header: 'terms',
    accessorKey: 'paymentTerm',
  },
  {
    header: 'paymentTypes',
    accessorKey: 'type',
  },
  {
    header: 'vendorWOExpectedPaymentDate',
    accessorKey: 'expectedPaymentDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.expectedPaymentDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'balance',
    accessorKey: 'amount',
    accessorFn(cellInfo) {
      return numeral(cellInfo.amount).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'finalInvoice',
    accessorKey: 'finalInvoice',
    accessorFn(cellInfo) {
      return numeral(cellInfo.finalInvoice).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'markets',
    accessorKey: 'marketName',
  },
  {
    header: 'woInvoiceDate',
    accessorKey: 'woaInvoiceDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.woaInvoiceDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'poNo',
    accessorKey: 'poNumber',
  },
  {
    header: 'woNo',
    accessorKey: 'woNumber',
  },
  {
    header: 'invoiceNo',
    accessorKey: 'invoiceNumber',
  },
]

export const RECEIVABLE_TABLE_QUERY_KEYS = {
  projectId: 'projectId.equals',
  woaInvoiceDate: 'woaInvoiceDate.equals',
  status: 'status.contains',
  clientName: 'clientName.contains',
  paymentTerm: 'paymentTerm.equals',
  expectedPaymentDate: 'expectedPaymentDate.equals',
  amount: 'amount.equals',
  finalInvoice: 'finalInvoice.equals',
  marketName: 'marketName.contains',
  workOrderStartDate: 'workOrderStartDate.equals',
  workOrderDateCompleted: 'workOrderDateCompleted.equals',
  workOrderIssueDate: 'workOrderIssueDate.equals',
  propertyAddress: 'propertyAddress.contains',
  durationCategory: 'durationCategory.equals',
  invoiceNumber: 'invoiceNumber.contains',
  poNumber: 'poNumber.contains',
  woNumber: 'woNumber.contains',
  type: 'type.contains',
  isReceivable: 'isReceivable.equals',
  displayId: 'displayId.contains'
}
