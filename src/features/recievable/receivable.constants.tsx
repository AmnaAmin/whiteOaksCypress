import { ColumnDef } from '@tanstack/react-table'
import Status from 'features/common/status'
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
    header: 'ticketStatus',
    accessorKey: 'projectStatus',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <Status value={value} id={value} />
    },
  },
  {
    header: 'address',
    accessorKey: 'propertyAddress',
  },
  {
    header: 'terms',
    accessorKey: 'paymentTerm',
    accessorFn(cellInfo) {
      return cellInfo?.gridPaymentTerm ? cellInfo.gridPaymentTerm : cellInfo.paymentTerm
    },
  },
  {
    header: 'paymentTypes',
    accessorKey: 'type',
  },
  {
    header: 'vendorWOExpectedPaymentDate',
    accessorKey: 'gridExpectedPaymentDate',
    accessorFn(cellInfo) {
      return cellInfo.gridExpectedPaymentDate
        ? dateFormat(cellInfo.gridExpectedPaymentDate)
        : dateFormat(cellInfo.expectedPaymentDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'balance',
    accessorKey: 'amount',
    accessorFn(cellInfo) {
      const formattedAmount = numeral(Math.abs(cellInfo.amount)).format('$0,0.00')
      return cellInfo.amount < 0 ? formattedAmount : formattedAmount
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
    accessorKey: 'resubmissionInvoiceNumber',
  },
]

export const RECEIVABLE_TABLE_QUERY_KEYS = {
  projectId: 'projectId.equals',
  woaInvoiceDateStart: 'woaInvoiceDate.greaterThanOrEqual',
  woaInvoiceDateEnd: 'woaInvoiceDate.lessThanOrEqual',
  status: 'status.contains',
  clientName: 'clientName.contains',
  projectStatus: 'projectStatus.contains',
  gridPaymentTerm: 'gridPaymentTerm.equals',
  gridExpectedPaymentDateStart: 'gridExpectedPaymentDate.greaterThanOrEqual',
  gridExpectedPaymentDateEnd: 'gridExpectedPaymentDate.lessThanOrEqual',
  amount: 'amount.equals',
  finalInvoice: 'finalInvoice.equals',
  marketName: 'marketName.contains',
  workOrderStartDateStart: 'workOrderStartDate.greaterThanOrEqual',
  workOrderStartDateEnd: 'workOrderStartDate.lessThanOrEqual',
  workOrderDateCompletedStart: 'workOrderDateCompleted.greaterThanOrEqual',
  workOrderDateCompletedEnd: 'workOrderDateCompleted.lessThanOrEqual',
  workOrderIssueDateStart: 'workOrderIssueDate.greaterThanOrEqual',
  workOrderIssueDateEnd: 'workOrderIssueDate.lessThanOrEqual',
  propertyAddress: 'propertyAddress.contains',
  durationCategory: 'durationCategory.equals',
  invoiceNumber: 'invoiceNumber.contains',
  poNumber: 'poNumber.contains',
  woNumber: 'woNumber.contains',
  type: 'type.contains',
  isReceivable: 'isReceivable.equals',
  displayId: 'displayId.contains',
  paymentTerm: 'paymentTerm.equals',
  resubmissionInvoiceNumber: 'resubmissionInvoiceNumber.contains',
  pcOrFpmUserId: 'directReportUserOnly.equals',
}
