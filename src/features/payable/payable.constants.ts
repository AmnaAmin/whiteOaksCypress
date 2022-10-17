import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'
import { dateFormat } from 'utils/date-time-utils'

export const PAYABLE_TABLE_QUERY_KEYS = {
  projectId: 'projectId.equals',
  claimantName: 'claimantName.contains',
  propertyAddress: 'propertyAddress.contains',
  vendorAddress: 'vendorAddress.contains',
  paymentTerm: 'paymentTerm.equals',
  expectedPaymentDate: 'expectedPaymentDate.equals',
  finalInvoiceAmount: 'finalInvoiceAmount.greaterThanOrEqual',
  marketName: 'marketName.contains',
  workOrderStartDate: 'workOrderStartDate.equals',
  workOrderDateCompleted: 'workOrderDateCompleted.equals',
  workOrderIssueDate: 'workOrderIssueDate.equals',
  durationCategory: 'durationCategory.equals',
}

export const PAYABLE_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'id',
    accessorKey: 'projectId',
  },
  {
    header: 'vendorName',
    accessorKey: 'claimantName',
  },
  {
    header: 'propertyAddress',
    accessorKey: 'propertyAddress',
  },
  {
    header: 'vendorAddress',
    accessorKey: 'vendorAddress',
  },
  {
    header: 'paymentTerms',
    accessorKey: 'paymentTerm',
  },
  {
    header: 'expectedPayDate',
    accessorKey: 'expectedPaymentDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.expectedPaymentDate)
    },
  },
  {
    header: 'finalInvoice',
    accessorKey: 'finalInvoiceAmount',
    accessorFn: cellInfo => {
      return numeral(cellInfo.finalInvoiceAmount).format('$0,0.00')
    },
  },
  {
    header: 'markets',
    accessorKey: 'marketName',
  },
  {
    header: 'woStartDate',
    accessorKey: 'workOrderStartDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.workOrderStartDate)
    },
  },
  {
    header: 'wOCompletedDate',
    accessorKey: 'workOrderDateCompleted',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.workOrderDateCompleted)
    },
  },
  {
    header: 'wOIssueDate',
    accessorKey: 'workOrderIssueDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.workOrderIssueDate)
    },
  },
]
