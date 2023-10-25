import { ColumnDef } from '@tanstack/react-table'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'
import { currencyFormatter } from 'utils/string-formatters'

export const INVOICING_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'invoiceNumber',
    id: 'invoiceNumber',
    accessorKey: 'invoiceNumber',
  },
  {
    id: 'invoicedAmount',
    header: 'invoicedAmount',
    accessorKey: 'invoicedAmount',
    cell: row => {
      const value = row.cell.getValue() as string
      return currencyFormatter(value)
    },
  },
  {
    header: 'invoicedStatus',
    accessorKey: 'status',
    cell: row => {
      const value = row.cell.getValue() as string
      return <Status value={value} id={value}></Status>
    },
  },
  {
    id: 'createdDate',
    header: 'submit',
    accessorKey: 'createdDate',
    meta: { format: 'date' },
    accessorFn: cellInfo => {
      return datePickerFormat(cellInfo.createdDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.createdDate
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
