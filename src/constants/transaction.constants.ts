import { TransactionMarkAsValues, TransactionStatusValues } from 'types/transaction.type'

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
