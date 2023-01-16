import { ColumnDef } from '@tanstack/react-table'
import { TransactionMarkAsValues, TransactionStatusValues } from 'types/transaction.type'
import Status from 'features/common/status'
import numeral from 'numeral'
import { dateFormat } from 'utils/date-time-utils'
import { TRANSACTION } from './transactions.i18n'

export const CHANGE_ORDER_DEFAULT_VALUE = '0'
export const CHANGE_ORDER_DEFAULT_OPTION = {
  label: '$0.00',
  value: CHANGE_ORDER_DEFAULT_VALUE,
}

export const TRANSACTION_FEILD_DEFAULT = {
  id: Date.now(),
  description: '',
  amount: '',
  checked: false,
}

export const LIEN_WAIVER_DEFAULT_VALUES = {
  claimantName: '',
  customerName: '',
  propertyAddress: '',
  owner: '',
  makerOfCheck: '',
  amountOfCheck: '',
  checkPayableTo: '',
  claimantsSignature: '',
  claimantTitle: '',
  dateOfSignature: '',
}

export const TRANSACTION_STATUS_OPTIONS = [
  { value: TransactionStatusValues.pending, label: 'Pending' },
  { value: TransactionStatusValues.approved, label: 'Approved' },
  { value: TransactionStatusValues.cancelled, label: 'Cancelled' },
  { value: TransactionStatusValues.denied, label: 'Denied' },
]

export const TRANSACTION_MARK_AS_OPTIONS = {
  paid: {
    value: TransactionMarkAsValues.paid,
    label: 'Paid Back',
  },
  revenue: {
    value: TransactionMarkAsValues.revenue,
    label: 'Revenue',
  },
}
export const TRANSACTION_MARK_AS_OPTIONS_ARRAY = Object.values(TRANSACTION_MARK_AS_OPTIONS)

export const STATUS_SHOULD_NOT_BE_PENDING_ERROR_MESSAGE = 'Status should not be pending'
export const REQUIRED_FIELD_ERROR_MESSAGE = 'This field is required'

export const TRANSACTION_TABLE_QUERIES_KEY = {
  name: 'name.contains',
  transactionTypeLabel: 'transactionTypeLabel.contains',
  skillName: 'skillName.contains',
  parentWorkOrderId: 'vendor.contains',
  transactionTotal: 'transactionTotal.greaterThanOrEqual',
  status: 'status.equals',
  modifiedDate: 'modifiedDate.lessThanOrEqual',
  approvedBy: 'approvedBy.contains',
}

export const TRANSACTION_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'name',
  },
  {
    header: `${TRANSACTION}.type`,
    accessorKey: 'transactionTypeLabel',
  },
  {
    header: `${TRANSACTION}.workOrderIdTransTable`,
    accessorKey: 'workOrderId',
    accessorFn: cellInfo => {
      return cellInfo.parentWorkOrderId ? cellInfo.parentWorkOrderId?.toString() : '- - -'
    },
  },
  {
    header: `${TRANSACTION}.trade`,
    accessorKey: 'skillName',
    accessorFn: cellInfo => {
      return cellInfo.skillName ? cellInfo.skillName : '- - -'
    },
    filterFn: 'includesString',
  },
  {
    header: `${TRANSACTION}.vendorGL`,
    accessorKey: 'parentWorkOrderId',
    accessorFn: cellInfo => {
      return cellInfo.parentWorkOrderId ? cellInfo?.vendor || '' : 'Project SOW'
    },
  },
  {
    header: `${TRANSACTION}.totalAmount`,
    accessorKey: 'transactionTotal',
    accessorFn: cellInfo => {
      return numeral(cellInfo.transactionTotal).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: `${TRANSACTION}.transactionStatus`,
    accessorKey: 'status',
    cell: row => {
      const value = row.cell.getValue() as string
      return <Status value={value} id={value} />
    },
  },
  {
    header: `${TRANSACTION}.submit`,
    accessorKey: 'modifiedDate',
    accessorFn: cellInfo => {
      return dateFormat(cellInfo.modifiedDate)
    },
    meta: { format: 'date' },
  },
  {
    header: `${TRANSACTION}.approvedBy`,
    accessorKey: 'approvedBy',
    accessorFn: cellInfo => {
      return cellInfo.approvedBy ? cellInfo?.approvedBy : '- - -'
    },
  },
]
