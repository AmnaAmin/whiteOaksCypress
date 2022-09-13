import { ColumnDef } from '@tanstack/react-table'
import Status from 'features/common/status'
import numeral from 'numeral'
import { dateFormat } from 'utils/date-time-utils'

export const PROJECT_TABLE_QUERIES_KEY = {
  id: 'id.equals',
  generalLabour: 'generalLabour.contains',
  projectManager: 'projectManager.contains',
  projectStatus: 'projectStatus.equals',
  streetAddress: 'streetAddress.contains',
  city: 'city.contains',
  clientStartDate: 'clientStartDate.equals',
  clientDueDate: 'clientDueDate.equals',
  projectTypeLabel: 'projectTypeLabel.contains',
  projectCoordinator: 'projectCoordinator.contains',
  accountPayable: 'accountPayable.contains',
  zipCode: 'zipCode.contains',
  clientName: 'clientName.contains',
  sowOriginalContractAmount: 'sowOriginalContractAmount.greaterThanOrEqual',
  projectRelatedCost: 'projectRelatedCost.greaterThanOrEqual',
  woaPaidDate: 'woaPaidDate.equals',
  invoiceNumber: 'invoiceNumber.contains',
  woaInvoiceDate: 'woaInvoiceDate.equals',
  accountRecievable: 'accountRecievable.greaterThanOrEqual',
  market: 'market.contains',
  state: 'state.contains',
  woaCompletionDate: 'woaCompletionDate.equals',
  region: 'region.contains',
  partialPayment: 'partialPayment.contains',
  expectedPaymentDate: 'expectedPaymentDate.equals',
  profitPercentage: 'profitPercentage.equals',
  profitPercentageAmount: 'profitPercentageAmount.greaterThanOrEqual',
  profitTotal: 'profitTotal.equals',
  materialCost: 'materialCost.contains',
  drawAmount: 'drawAmount.greaterThanOrEqual',
  woNumber: 'woNumber.contains',
  poNumber: 'poNumber.contains',
  pastDue: 'pastDue.equals',
  projectManagerId: 'projectManagerId.in',
}

export const PROJECT_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'General Labor',
    accessorKey: 'generalLabourName',
    maxSize: 200,
  },
  {
    header: 'FPM',
    accessorKey: 'projectManager',
  },
  {
    header: 'Status',
    accessorKey: 'projectStatus',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <Status value={value} id={value} />
    },
  },
  {
    header: 'Address',
    accessorKey: 'streetAddress',
  },
  {
    header: 'City',
    accessorKey: 'city',
  },
  {
    header: 'Client Start Date',
    accessorKey: 'clientStartDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientStartDate),
  },
  {
    header: 'Client Due Date',
    accessorKey: 'clientDueDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientDueDate),
  },
  {
    header: 'Type',
    accessorKey: 'projectTypeLabel',
  },
  {
    header: 'Project Coordinator',
    accessorKey: 'projectCoordinator',
  },
  {
    header: 'Account Payable',
    accessorKey: 'accountPayable',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
  },
  {
    header: 'Zip',
    accessorKey: 'zipCode',
  },
  {
    header: 'Client',
    accessorKey: 'clientName',
  },
  {
    header: 'SOW Final Amount',
    accessorKey: 'sowOriginalContractAmount',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.sowOriginalContractAmount).format('$0,0.00')
    },
  },
  {
    header: 'Project Cost',
    accessorKey: 'projectRelatedCost',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.projectRelatedCost).format('$0,0.00')
    },
  },
  {
    header: 'Paid Date',
    accessorKey: 'woaPaidDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaPaidDate),
  },
  {
    header: 'Invoice Number',
    accessorKey: 'invoiceNumber',
  },
  {
    header: 'Invoice Date',
    accessorKey: 'woaInvoiceDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaInvoiceDate),
  },
  {
    header: 'Account Receivable',
    accessorKey: 'accountRecievable',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.accountRecievable).format('$0,0.00')
    },
  },
  {
    header: 'Market',
    accessorKey: 'market',
  },
  {
    header: 'State',
    accessorKey: 'state',
  },
  {
    header: 'WOA Finish',
    accessorKey: 'woaCompletionDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaCompletionDate),
  },
  {
    header: 'Region',
    accessorKey: 'region',
  },
  {
    header: 'Partial Payment',
    accessorKey: 'partialPayment',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.partialPayment).format('$0,0.00')
    },
  },
  {
    header: 'Expected Payment',
    accessorKey: 'expectedPaymentDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.expectedPaymentDate),
  },
  {
    header: 'Profit Margins',
    accessorKey: 'profitPercentage',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.profitPercentage / 100).format('0,0.00%')
    },
  },
  {
    header: 'Profits',
    accessorKey: 'profitTotal',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.profitTotal).format('$0,0.00')
    },
  },
  {
    header: 'Material Cost',
    accessorKey: 'materialCost',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.materialCost).format('$0,0.00')
    },
  },
  {
    header: 'Draw Amount',
    accessorKey: 'drawAmount',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.drawAmount).format('$0,0.00')
    },
  },
  {
    header: 'WO Number',
    accessorKey: 'woNumber',
  },
  {
    header: 'PO Number',
    accessorKey: 'poNumber',
  },
]
