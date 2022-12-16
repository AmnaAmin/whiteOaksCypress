import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ProjectWorkOrderType } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'

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
