import { ColumnDef } from '@tanstack/react-table'
import { TransactionMarkAsValues, TransactionStatusValues } from 'types/transaction.type'
import Status from 'features/common/status'
import numeral from 'numeral'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { TRANSACTION } from './transactions.i18n'
import { Flex } from '@chakra-ui/react'
import { useEffect, useMemo } from 'react'

const RightArrow = props => (
  <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M13.34 0H2.66C1.2 0 0 1.2 0 2.66v10.68C0 14.8 1.2 16 2.66 16h10.68C14.8 16 16 14.8 16 13.34V2.66C16 1.2 14.8 0 13.34 0Zm1.86 13.34c0 1.02-.84 1.86-1.86 1.86H2.66A1.87 1.87 0 0 1 .8 13.34V2.66C.8 1.64 1.64.8 2.66.8h10.68c1.02 0 1.86.84 1.86 1.86v10.68Z"
      fill="#CBD5E0"
    />
    <path
      d="M10.761 7.685a.836.836 0 0 1-.203.607L7.455 11.86a.836.836 0 1 1-1.262-1.097l3.104-3.57a.836.836 0 0 1 1.464.49Z"
      fill="#718096"
    />
    <path
      d="M10.764 7.686a.836.836 0 0 1-1.383.689L5.812 5.272A.836.836 0 0 1 6.91 4.01l3.569 3.103c.167.146.27.351.286.573Z"
      fill="#718096"
    />
  </svg>
)

const DownArrow = props => (
  <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M13.34 0H2.66C1.2 0 0 1.2 0 2.66v10.68C0 14.8 1.2 16 2.66 16h10.68C14.8 16 16 14.8 16 13.34V2.66C16 1.2 14.8 0 13.34 0Zm1.86 13.34c0 1.02-.84 1.86-1.86 1.86H2.66A1.87 1.87 0 0 1 .8 13.34V2.66C.8 1.64 1.64.8 2.66.8h10.68c1.02 0 1.86.84 1.86 1.86v10.68Z"
      fill="#CBD5E0"
    />
    <path
      d="M7.628 10.373a.836.836 0 0 1-.592-.242l-3.36-3.328a.836.836 0 1 1 1.177-1.188l3.36 3.328a.836.836 0 0 1-.585 1.43Z"
      fill="#718096"
    />
    <path
      d="M7.625 10.374a.836.836 0 0 1-.598-1.424l3.329-3.36a.836.836 0 0 1 1.187 1.177l-3.328 3.36a.836.836 0 0 1-.59.247Z"
      fill="#718096"
    />
  </svg>
)

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
    header: `${TRANSACTION}.workOrderIdTransTable`,
    accessorKey: 'workOrderId',
    cell: ({ row, getValue }) => (
      <Flex
        onClick={e => e.stopPropagation()}
        style={{
          paddingLeft: `${row.depth * 1.5}rem`,
        }}
      >
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
    ),
    accessorFn: cellInfo => {
      return (
        <div style={{ marginTop: '1px' }}>
          {' '}
          {cellInfo.parentWorkOrderId ? cellInfo.parentWorkOrderId?.toString() : '- - -'}
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
]

export const mapDataForExpandableRows = (transactions?: any) => {
  if (transactions && transactions?.length > 0) {
    const data = [] as any
    const dataEmptyID = transactions?.filter(d => !d.parentWorkOrderId)
    transactions?.forEach(transaction => {
      if (transaction?.parentWorkOrderId) {
        const checkData = data?.filter(d => d.parentWorkOrderId === transaction.parentWorkOrderId)?.length > 0
        if (checkData) {
          data
            .find(d => d.parentWorkOrderId === transaction.parentWorkOrderId)
            ?.['subRows']?.push({ ...transaction, parentWorkOrderId: '' })
        } else {
          data?.push({ ...transaction, subRows: [] })
        }
      }
    })
    const nData = data
    nData.push({ ...dataEmptyID[0], subRows: dataEmptyID.filter((v, i) => i !== 0) })
    return nData
  }
}

const handleToggle = (row?: any, transId?: any, dataTrans?: any) => {
  console.log('transId', transId, 'dataTrans', dataTrans)
}

export const useTransColumn = (transId?: any, dataTrans?: any) => {
  let TRANSACTION_TABLE_COLUMNS = useMemo(() => {
    return [
      {
        header: `${TRANSACTION}.workOrderIdTransTable`,
        accessorKey: 'workOrderId',
        cell: ({ table, row, getValue }) => (
          <Flex
            onClick={e => e.stopPropagation()}
            style={{
              paddingLeft: `${row.depth * 1.5}rem`,
            }}
          >
            {table.setExpanded([{ 0: true }])}
            {handleToggle(row, transId, dataTrans)}
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
        ),
        accessorFn: cellInfo => {
          return (
            <div style={{ marginTop: '1px' }}>
              {' '}
              {cellInfo.parentWorkOrderId ? cellInfo.parentWorkOrderId?.toString() : '- - -'}
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
    ]
  }, [transId])
  // columns = setColumnsByConditions(columns, workOrder, isVendor)
  return TRANSACTION_TABLE_COLUMNS
}
