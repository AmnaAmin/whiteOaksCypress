import { ColumnDef } from '@tanstack/react-table'
import { AuditLogType } from 'types/common.types'
import { dateFormat } from 'utils/date-time-utils'
import { AUDIT_LOGS } from './auditLogs.i18n'

export const AUDIT_LOGS_COLUMNS: ColumnDef<AuditLogType>[] = [
  {
    header: `${AUDIT_LOGS}.modifiedBy`,
    accessorKey: 'modifiedBy',
  },
  {
    header: `${AUDIT_LOGS}.modifiedDate`,
    accessorKey: 'modifiedDate',
    accessorFn: value => dateFormat(value.modifiedDate),
      meta: { format: 'date' },
  },
  {
    header: `${AUDIT_LOGS}.parameter`,
    accessorKey: 'parameter',
  },
  {
    header: `${AUDIT_LOGS}.oldValue`,
    accessorKey: 'oldValue',
  },
  {
    header: `${AUDIT_LOGS}.newValue`,
    accessorKey: 'newValue',
  },
]
