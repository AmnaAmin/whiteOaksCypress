import { ColumnDef } from '@tanstack/react-table'
import Status from 'features/common/status'
import numeral from 'numeral'
import { isDefined } from 'utils'
import { dateFormat } from 'utils/date-time-utils'
import { percentageFormatter } from 'utils/string-formatters'

export const PROJECT_TABLE_QUERIES_KEY = {
  id: 'id.equals',
  generalLabourName: 'generalLabourName.contains',
  projectManager: 'projectManager.contains',
  projectStatus: 'projectStatus.equals',
  streetAddress: 'streetAddress.contains',
  city: 'city.contains',
  clientStartDate: 'clientStartDate.contains',
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
  vendorPaymentPercentage: 'vendorPaymentPercentage.equals',
  woNumber: 'woNumber.contains',
  poNumber: 'poNumber.contains',
  pastDue: 'pastDue.equals',
  projectManagerId: 'projectManagerId.in',
  projectStatusId: 'projectStatusId.in',
  clientSignoffDate: 'clientSignoffDate.lessThanOrEqual',
}

export const PROJECT_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    size: 100,
  },
  {
    header: 'projects.projectTable.generalLabour',
    accessorKey: 'generalLabourName',
    size: 230,
  },
  {
    header: 'projects.projectTable.projectManager',
    accessorKey: 'projectManager',
  },
  {
    header: 'projects.projectTable.status',
    accessorKey: 'projectStatus',
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <Status value={value} id={value} />
    },
  },
  {
    header: 'projects.projectTable.address',
    accessorKey: 'streetAddress',
  },
  {
    header: 'projects.projectTable.city',
    accessorKey: 'city',
  },
  {
    header: 'projects.projectTable.clientStart',
    accessorKey: 'clientStartDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientStartDate),
  },
  {
    header: 'projects.projectTable.clientDue',
    accessorKey: 'clientDueDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientDueDate),
  },
  {
    header: 'projects.projectTable.type',
    accessorKey: 'projectTypeLabel',
  },
  {
    header: 'projects.projectTable.projectCoordinator',
    accessorKey: 'projectCoordinator',
  },
  {
    header: 'projects.projectTable.accountPayable',
    accessorKey: 'accountPayable',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.zip',
    accessorKey: 'zipCode',
  },
  {
    header: 'projects.projectTable.client',
    accessorKey: 'clientName',
  },
  {
    header: 'projects.projectTable.sow',
    accessorKey: 'sowNewAmount',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.sowNewAmount).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.projectCost',
    accessorKey: 'projectRelatedCost',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.projectRelatedCost).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.paid',
    accessorKey: 'woaPaidDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaPaidDate),
  },
  {
    header: 'projects.projectTable.invoiceNumber',
    accessorKey: 'invoiceNumber',
  },
  {
    header: 'projects.projectTable.invoice',
    accessorKey: 'woaInvoiceDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaInvoiceDate),
  },
  {
    header: 'projects.projectTable.accountRecievable',
    accessorKey: 'accountRecievable',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.accountRecievable).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.market',
    accessorKey: 'market',
  },
  {
    header: 'projects.projectTable.state',
    accessorKey: 'state',
  },
  {
    header: 'projects.projectTable.woaFinish',
    accessorKey: 'woaCompletionDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaCompletionDate),
  },
  {
    header: 'projects.projectTable.region',
    accessorKey: 'region',
  },
  {
    header: 'projects.projectTable.partialPayment',
    accessorKey: 'partialPayment',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.partialPayment).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.expectedPayment',
    accessorKey: 'expectedPaymentDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.expectedPaymentDate),
  },
  {
    header: 'projects.projectTable.profitPercentage',
    accessorKey: 'profitPercentage',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.profitPercentage / 100).format('0,0.00%')
    },
  },
  {
    header: 'projects.projectTable.profitTotal',
    accessorKey: 'profitTotal',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.profitTotal).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.materialCost',
    accessorKey: 'materialCost',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.materialCost).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.vendorPayment', //Not getting this from backend at the moment
    accessorKey: 'vendorPaymentPercentage',
    accessorFn(cellInfo: any) {
      return isDefined(cellInfo.vendorPaymentPercentage)
        ? numeral(percentageFormatter(cellInfo.vendorPaymentPercentage)).format('0.00%')
        : '0.00%'
    },
  },
  {
    header: 'projects.projectTable.draw',
    accessorKey: 'drawAmount',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.drawAmount).format('$0,0.00')
    },
  },
  {
    header: 'projects.projectTable.woNo',
    accessorKey: 'woNumber',
  },
  {
    header: 'projects.projectTable.poNo',
    accessorKey: 'poNumber',
  },
]
