import { ColumnDef } from '@tanstack/react-table'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'

export const INVOICING_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'invoiceNumber',
    id: 'resubmissionInvoiceNumber',
    accessorKey: 'resubmissionInvoiceNumber',
  },
  {
    id: 'type',
    header: 'type',
    accessorKey: 'type',
  },
  {
    id: 'skill',
    header: 'skill',
    accessorKey: 'skill',
  },
  {
    id: 'invoicedAmount',
    header: 'invoicedAmount',
    accessorKey: 'invoicedAmount',
  },
  {
    header: 'invoicedStatus',
    accessorKey: 'invoicedStatus',
    cell: row => {
      const value = row.cell.getValue() as string
      return <Status value={value} id={value}></Status>
    },
  },
  {
    id: 'resubmissionDate',
    header: 'submit',
    accessorKey: '',
    meta: { format: 'date' },
    accessorFn: cellInfo => {
      return datePickerFormat(cellInfo.resubmissionDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.resubmissionDate
      return dateFormat(value)
    },
  },
  {
    header: 'modifiedBy',
    accessorKey: 'modifiedBy',
    id: 'modifiedBy',
  },
]

export const INVOICE_ITEMS_DEFAULT = {
  id: null,
  transactionId: null,
  type: '',
  description: '',
  amount: '',
  checked: false,
}
