import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'
import { dateFormat } from 'utils/date-time-utils'

export const RECEIVABLE_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'id',
    accessorKey: 'projectId',
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
  },
  {
    header: 'balance',
    accessorKey: 'amount',
    accessorFn(cellInfo) {
      return numeral(cellInfo.amount).format('$0,0.00')
    },
  },
  {
    header: 'finalInvoice',
    accessorKey: 'finalInvoice',
    accessorFn(cellInfo) {
      return numeral(cellInfo.finalInvoice).format('$0,0.00')
    },
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
