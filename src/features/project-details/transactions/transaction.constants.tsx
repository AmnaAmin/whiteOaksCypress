import { ColumnDef } from '@tanstack/react-table'
import { SelectOption, TransactionMarkAsValues, TransactionStatusValues, TransactionTypeValues } from 'types/transaction.type'
import Status from 'features/common/status'
import numeral from 'numeral'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { TRANSACTION } from './transactions.i18n'
import { Flex } from '@chakra-ui/react'
import { DownArrow, RightArrow } from 'components/expension-grid-arrows'

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

export const REASON_STATUS_OPTIONS = [
  {  value: 'Unforeseen', label:'Unforeseen' },
  {  value: 'Incorrect Scoping/Scoping', label:'Incorrect Scoping/Scoping' },
  {  value: 'Client Request', label:'Client Request' },
  {  value:'Additional Punch Work Requested', label:'Additional Punch Work Requested' },
  {  value:'Accounting Adjustment', label:'Accounting Adjustment' },
]


export const TRANSACTION_FPM_DM_STATUS_OPTIONS = [
  { value: TransactionStatusValues.pending, label: 'Pending' },
  { value: TransactionStatusValues.approved, label: 'Approved' },
  { value: TransactionStatusValues.cancelled, label: 'Cancelled' },
  { value: TransactionStatusValues.denied, label: 'Denied' },
] as SelectOption[]

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
  modifiedDateStart: 'modifiedDate.greaterThanOrEqual',
  modifiedDateEnd: 'modifiedDate.lessThanOrEqual',
  approvedBy: 'approvedBy.contains',
  paymentSource: 'paymentSource.contains',
}

export const TRANSACTION_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: '',
    id: 'expander',
    size: 40,
    cell: ({ row, getValue }) => {
     

      const transaction = row.original
      // let isPaymentAgainstInvoice = false;
     
      if (!!transaction.invoiceId && transaction.transactionType === TransactionTypeValues.payment && !!transaction.invoiceNumber) {
        // isPaymentAgainstInvoice = true;
      }
     
      return (
        <Flex
          data-testid="expander-cont"
          onClick={e => e.stopPropagation()}
          style={{
            paddingLeft: `${row.depth * 1.5}rem`,
          }}
        >
          {row.getToggleExpandedHandler()}
          <>
            {row.getCanExpand() ? (
              <button
                data-testid="expension-&-compression-btn"
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: 'pointer' },
                }}
              >
                {row.getIsExpanded() ? (
                  <DownArrow
                    style={{
                      marginRight: '8px',
                    }}
                  />
                ) : (
                  <RightArrow
                    style={{
                      marginRight: '8px',
                    }}
                  />
                )}
              </button>
            ) : (
              ''
            )}{' '}
            {getValue()}
          </>
        </Flex>
      )
    },
    accessorFn: cellInfo => {
      return (
        <div style={{ marginTop: '1px' }}>
          {' '}
          {/* {cellInfo.parentWorkOrderId ? cellInfo.parentWorkOrderId?.toString() : '- - -'} */}
        </div>
      )
    },
  },
  {
    header: 'ID',
    accessorKey: 'name',
  },
  {
    header: `${TRANSACTION}.type`,
    accessorKey: 'transactionTypeLabel',
    accessorFn: cellInfo => {
      return cellInfo.isInvoice ? 'Invoice' : cellInfo?.transactionTypeLabel || '- - -'
    },
  },
  {
    header: `${TRANSACTION}.workOrderIdTransTable`,
    accessorKey: 'parentWorkOrderId',
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
    accessorKey: 'vendor',
    accessorFn: cellInfo => {
      return cellInfo.parentWorkOrderId !== null ? cellInfo?.vendor || '' : 'Project SOW'
    },
  },
  {
    header: `${TRANSACTION}.totalAmount`,
    accessorKey: 'transactionTotal',
    accessorFn(cellInfo: any) {
      return cellInfo.transactionTotal?.toString()
    },
    filterFn: 'includesString',
    cell: (row: any) => {
      const value = row.cell.getValue() as string

      return numeral(value).format('$0,0.00')
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
      return datePickerFormat(cellInfo.modifiedDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.modifiedDate
      return dateFormat(value)
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
  {
    header: `${TRANSACTION}.paymentSource`,
    accessorKey: 'paymentSource',
    accessorFn: cellInfo => {
      return cellInfo.paymentSource ? cellInfo?.paymentSource : '- - -'
    },
  },
]

export const mapDataForExpandableRows = (transactions?: any, isVendor?: boolean) => {
  if (transactions && transactions?.length > 0) {
    const data = [] as any
    //putting aside data of transactions whose parentWOid is null
    const dataEmptyID = transactions?.filter(d => !d.parentWorkOrderId)

    // looping transactions
    transactions?.forEach(transaction => {
      if (transaction?.parentWorkOrderId) {
        // filter array with data having same parentWOid
        const checkData = data?.filter(d => d.parentWorkOrderId === transaction.parentWorkOrderId)?.length > 0
        if (checkData) {
          data
            .find(d => d.parentWorkOrderId === transaction.parentWorkOrderId)
            ?.['subRows']?.push({ ...transaction, parentWorkOrderId: transaction.parentWorkOrderId })
        } else {
          data?.push({ ...transaction, subRows: [] })
        }
      }
    })
    const nData = data
    if (!isVendor) {
      nData.push({ ...dataEmptyID[0], subRows: dataEmptyID.filter((v, i) => i !== 0) })
    }
    return nData
  }
}

export const mapDataForDocxExpandableRows = (documents?: any, isVendor?: boolean) => {
  if (documents && documents?.length > 0) {
    const data = [] as any
    const dataEmptyID = documents?.filter(d => !d.workOrderId)
    documents?.forEach(document => {
      if (document?.workOrderId) {
        const checkData = data?.filter(d => d.workOrderId === document.workOrderId)?.length > 0
        if (checkData) {
          data.find(d => d.workOrderId === document.workOrderId)?.['subRows']?.push({ ...document })
        } else {
          data?.push({ ...document, subRows: [] })
        }
      }
    })
    const nData = data
    if (!isVendor) {
      nData.push({ ...dataEmptyID[0], subRows: dataEmptyID.filter((v, i) => i !== 0) })
    }
    return nData
  }
}

export const mapIndexForExpendingTransRow = (newTrans: any, gridTrans: any, setState) => {
  // calculate row index
  const parentOriginalSowIndex = gridTrans?.findIndex(d => !d.parentWorkOrderId)
  // calculate row index
  if (newTrans) {
    if (gridTrans && gridTrans?.length > 0) {
      if (!newTrans?.parentWorkOrderId) {
        setState({
          [parentOriginalSowIndex]: true,
        })
      }
      gridTrans?.filter((v, i: number) => {
        if (newTrans?.parentWorkOrderId === v.parentWorkOrderId) {
          setState({
            [i]: true,
          })
        }
        return i
      })
    }
  }
}
