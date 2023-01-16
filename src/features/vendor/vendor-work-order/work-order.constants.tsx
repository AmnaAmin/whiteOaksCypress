import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ProjectWorkOrderType } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'
import numeral from 'numeral'

export const WORK_ORDER_TABLE_QUERY_KEYS = {
  statusLabel: 'statusLabel.equals',
  skillName: 'skillName.contains',
  companyName: 'companyName.contains',
  businessEmailAddress: 'businessEmailAddress.contains',
  businessPhoneNumber: 'businessPhoneNumber.contains',
  workOrderIssueDate: 'workOrderIssueDate.equals',
  workOrderExpectedCompletionDate: 'workOrderExpectedCompletionDate.equals',
}

export const WORK_ORDER_TABLE_COLUMNS: ColumnDef<ProjectWorkOrderType>[] = [
  {
    header: 'id',
    accessorKey: 'id',
    accessorFn: cellInfo => {
      return cellInfo.id ? cellInfo.id?.toString() : '- - -'
    },
  },

  {
    header: 'WOstatus',
    accessorKey: 'statusLabel',
    cell: row => {
      const value = row.cell.getValue() as string
      return <Status value={value} id={value} />
    },
  },
  {
    header: 'trade',
    accessorKey: 'skillName',
  },
  {
    header: 'name',
    accessorKey: 'companyName',
  },
  {
    header: 'email',
    accessorKey: 'businessEmailAddress',
  },
  {
    header: 'phone',
    accessorKey: 'businessPhoneNumber',
  },
  {
    header: 'finalInvoice',
    accessorKey: 'finalInvoiceAmount',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.finalInvoiceAmount).format('$0,0.00')
    },
  },
  // {
  //   header: 'finalApproved',
  //   accessorKey: 'clientOriginalApprovedAmount',
  //   accessorFn(cellInfo: any) {
  //     return numeral(cellInfo.clientOriginalApprovedAmount).format('$0,0.00')
  //   },
  // },
  {
    header: 'issue',
    accessorKey: 'workOrderIssueDate',
    accessorFn: row => dateFormat(row.workOrderIssueDate),
    meta: { format: 'date' },
  },
  {
    header: 'expectedCompletion',
    accessorKey: 'workOrderExpectedCompletionDate',
    accessorFn: row => dateFormat(row.workOrderExpectedCompletionDate),
    meta: { format: 'date' },
  },
]
