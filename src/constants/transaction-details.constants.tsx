import { ColumnDef } from '@tanstack/react-table'
import { TRANSACTION } from 'features/project-details/transactions/transactions.i18n'
import numeral from 'numeral'

export const FINANCIAL_OVERVIEW_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${TRANSACTION}.client`,
    accessorKey: 'skillName',
  },
  {
    header: `${TRANSACTION}.originalSOWAmount`,
    accessorKey: 'originalAmount',
    accessorFn(row) {
      return numeral(row.originalAmount).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  // {
  //   header: `${TRANSACTION}.revisedSOWAmount`,
  //   accessorKey: 'revisedSOWAmount',
  //   accessorFn(row) {
  //     return numeral(row.revisedSOWAmount).format('$0,0.00')
  //   },
  // },
  {
    header: `${TRANSACTION}.COs`,
    accessorKey: 'changeOrder',
    accessorFn(row) {
      return numeral(row.changeOrder).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  // {
  //   header: `${TRANSACTION}.revisedCOs`,
  //   accessorKey: 'revisedChangeOrderAmount',
  //   accessorFn(row) {
  //     return numeral(row.revisedChangeOrderAmount).format('$0,0.00')
  //   },
  // },
  {
    header: `${TRANSACTION}.draws`,
    accessorKey: 'draw',
    accessorFn(row) {
      return numeral(row.draw).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: `${TRANSACTION}.carrierFee`,
    accessorKey: 'carrierFee',
    accessorFn(row) {
      return numeral(row.carrierFee).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: `${TRANSACTION}.legalFee`,
    accessorKey: 'legalFee',
    accessorFn(row) {
      return numeral(row.legalFee).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  // {
  //   header: `${TRANSACTION}.adjustment`,
  //   accessorKey: 'adjustment',
  //   accessorFn(row) {
  //     return numeral(row.adjustment).format('$0,0.00')
  //   },
  // },
  {
    header: `${TRANSACTION}.finalSOWAmount`,
    accessorKey: 'finalSOWAmount',
    accessorFn(row) {
      return numeral(row.finalSOWAmount).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: `${TRANSACTION}.partialPayments`,
    accessorKey: 'partialPayment',
    accessorFn(row) {
      return numeral(row.partialPayment).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: `${TRANSACTION}.deductible`,
    accessorKey: 'deductible',
    accessorFn(row) {
      return numeral(row.deductible).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: `${TRANSACTION}.depreciation`,
    accessorKey: 'depreciation',
    accessorFn(row) {
      return numeral(row.depreciation).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: `${TRANSACTION}.AR`,
    accessorKey: 'accountReceivable',
    cell: row => <span data-testid="financial-overview-AR">{ numeral((row as any).row.original.accountReceivable).format('$0,0.00')}</span>,
    accessorFn(row) {
      const val = numeral(row.accountReceivable).format('$0,0.00');
      return val
    },
    meta: { format: 'currency' },
  },
]
