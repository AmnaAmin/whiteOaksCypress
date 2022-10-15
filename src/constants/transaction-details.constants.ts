import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'

export const FINANCIAL_OVERVIEW_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'client',
    accessorKey: 'skillName',
  },
  {
    header: 'Original SOW Amount',
    accessorKey: 'originalAmount',
    accessorFn(row) {
      return numeral(row.originalAmount).format('$0,0.00')
    },
  },
  {
    header: 'Revised SOW Amount',
    accessorKey: 'revisedSOWAmount',
    accessorFn(row) {
      return numeral(row.revisedSOWAmount).format('$0,0.00')
    },
  },
  {
    header: 'COs',
    accessorKey: 'changeOrder',
    accessorFn(row) {
      return numeral(row.changeOrder).format('$0,0.00')
    },
  },
  {
    header: 'Revised COs',
    accessorKey: 'revisedChangeOrderAmount',
    accessorFn(row) {
      return numeral(row.revisedChangeOrderAmount).format('$0,0.00')
    },
  },
  {
    header: 'Draws',
    accessorKey: 'draw',
    accessorFn(row) {
      return numeral(row.draw).format('$0,0.00')
    },
  },
  {
    header: 'Adjustment for SOW',
    accessorKey: 'adjustment',
    accessorFn(row) {
      return numeral(row.adjustment).format('$0,0.00')
    },
  },
  {
    header: 'Final SOW Amount',
    accessorKey: 'finalSOWAmount',
    accessorFn(row) {
      return numeral(row.finalSOWAmount).format('$0,0.00')
    },
  },
  {
    header: 'Partial Payments',
    accessorKey: 'partialPayment',
    accessorFn(row) {
      return numeral(row.partialPayment).format('$0,0.00')
    },
  },
  {
    header: 'AR',
    accessorKey: 'accountReceivable',
    accessorFn(row) {
      return numeral(row.accountReceivable).format('$0,0.00')
    },
  },
]
