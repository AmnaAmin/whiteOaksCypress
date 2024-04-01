import { ColumnDef } from '@tanstack/react-table'
import { PopoverTooltip } from 'constants/projects.constants'
import Status from 'features/common/status'
import numeral from 'numeral'
import { dateFormat } from 'utils/date-time-utils'

export const PAYABLE_TABLE_QUERY_KEYS = {
  projectId: 'projectId.equals',
  projectManager: 'projectManager.contains',
  woDisplayId: 'woDisplayId.contains',
  claimantName: 'claimantName.contains',
  propertyAddress: 'propertyAddress.contains',
  vendorAddress: 'vendorAddress.contains',
  paymentTerm: 'paymentTerm.equals',
  paymentType: 'paymentType.contains',
  expectedPaymentDateStart: 'expectedPaymentDate.greaterThanOrEqual',
  expectedPaymentDateEnd: 'expectedPaymentDate.lessThanOrEqual',
  finalInvoiceAmount: 'displayFinalInvoiceAmount.contains',
  marketName: 'marketName.contains',
  projectStatus: 'projectStatus.contains',
  workOrderStartDateStart: 'workOrderStartDate.greaterThanOrEqual',
  workOrderStartDateEnd: 'workOrderStartDate.lessThanOrEqual',
  workOrderDateCompletedStart: 'workOrderDateCompleted.greaterThanOrEqual',
  workOrderDateCompletedEnd: 'workOrderDateCompleted.lessThanOrEqual',
  workOrderIssueDateStart: 'workOrderIssueDate.greaterThanOrEqual',
  workOrderIssueDateEnd: 'workOrderIssueDate.lessThanOrEqual',
  durationCategory: 'durationCategory.equals',
  type: 'type.contains',
  displayId: 'displayId.contains',
  clientName: 'clientName.contains',
  paymentMethods: 'paymentMethods.contains',
  pcOrFpmUserId: 'directReportUserOnly.equals',
}

export const PAYABLE_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'id',
    accessorKey: 'displayId',
  },
  {
    header: 'WO ID',
    accessorKey: 'woDisplayId',
  },
  {
    header: 'projectStatusAp',
    accessorKey: 'projectStatus',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <Status value={value} id={value} />
    },
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
    header: 'projects.projectTable.client',
    accessorKey: 'clientName',
  },
  {
    header: 'paymentTerms',
    accessorKey: 'paymentTerm',
  },
  {
    header: 'paymentType',
    accessorKey: 'paymentType',
  },
  {
    header: 'paymentMethod',
    accessorKey: 'paymentMethods',
    meta: { hideTitle: true },
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <PopoverTooltip value={value} title={'paymentMethod'} />
    },
  },

  {
    header: 'expectedPayDate',
    accessorKey: 'expectedPaymentDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.expectedPaymentDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'finalInvoice',
    accessorKey: 'finalInvoiceAmount',
    accessorFn: cellInfo => {
      return numeral(cellInfo.finalInvoiceAmount).format('$0,0.00')
    },
    meta: { format: 'currency' },
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
    meta: { format: 'date' },
  },
  {
    header: 'projectManager',
    accessorKey: 'projectManager',
  },
  {
    header: 'wOCompletedDate',
    accessorKey: 'workOrderDateCompleted',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.workOrderDateCompleted)
    },
    meta: { format: 'date' },
  },
  {
    header: 'wOIssueDate',
    accessorKey: 'workOrderIssueDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.workOrderIssueDate)
    },
    meta: { format: 'date' },
  },
]

export const PAYABLE_OVERPAYMENT_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'name',
  },
  {
    header: 'Project ID' as string,
    accessorKey: 'projectId',
  },
  {
    header: 'Type' as string,
    accessorKey: 'transactionTypeLabel',
  },
  {
    header: 'Trade' as string,
    accessorKey: 'skillName',
  },
  {
    header: 'Total Amount' as string,
    accessorKey: 'transactionTotal',
    accessorFn(cellInfo) {
      return numeral(cellInfo.transactionTotal).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'Transaction Status' as string,
    accessorKey: 'status',
    cell: cellInfo => {
      const value = cellInfo.getValue() as string

      return <Status value={value} id={value} />
    },
  },
  {
    header: 'Submit' as string,
    accessorKey: 'modifiedDate',
    accessorFn(cellInfo) {
      return dateFormat(cellInfo.modifiedDate)
    },
    meta: { format: 'date' },
  },
  {
    header: 'Approved By' as string,
    accessorKey: 'approvedBy',
  },
]
