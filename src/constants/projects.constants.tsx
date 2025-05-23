import {
  Box,
  chakra,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import Status from 'features/common/status'
import numeral from 'numeral'
import { isDefined } from 'utils'
import { dateFormat } from 'utils/date-time-utils'
import { percentageFormatter } from 'utils/string-formatters'
import { Link } from 'react-router-dom'
import { RiFlag2Fill } from 'react-icons/ri'
import { t } from 'i18next'

export const PROJECT_TABLE_QUERIES_KEY = {
  id: 'id.equals',
  generalLabourName: 'generalLabourName.contains',
  claimNumber: 'claimNumber.contains',
  projectManager: 'projectManager.contains',
  projectStatus: 'projectStatus.in',
  streetAddress: 'streetAddress.contains',
  city: 'city.contains',
  clientStartDateStart: 'clientStartDate.greaterThanOrEqual',
  clientStartDateEnd: 'clientStartDate.lessThanOrEqual',
  homeOwnerName: 'homeOwnerName.contains',
  clientDueDateStart: 'clientDueDate.greaterThanOrEqual',
  clientDueDateEnd: 'clientDueDate.lessThanOrEqual',
  notes: 'notes.contains',
  projectTypeLabel: 'projectTypeLabel.contains',
  projectCoordinator: 'projectCoordinator.contains',
  accountPayable: 'displayAccountPayable.contains',
  accountPayableInvoiced: 'accountPayableInvoiced.equals',
  zipCode: 'zipCode.contains',
  clientName: 'clientName.contains',
  sowOriginalContractAmount: 'sowOriginalContractAmount.equals',
  projectRelatedCost: 'displayProjectRelatedCost.contains',
  woaPaidDateStart: 'woaPaidDate.greaterThanOrEqual',
  woaPaidDateEnd: 'woaPaidDate.lessThanOrEqual',
  invoiceNumber: 'invoiceNumber.contains',
  resubmissionInvoiceNumber: 'resubmissionInvoiceNumber.contains',
  woaInvoiceDateStart: 'woaInvoiceDate.greaterThanOrEqual',
  woaInvoiceDateEnd: 'woaInvoiceDate.lessThanOrEqual',
  firstWorkOrderDateStart: 'firstWorkOrderDate.greaterThanOrEqual',
  firstWorkOrderDateEnd: 'firstWorkOrderDate.lessThanOrEqual',
  accountRecievable: 'displayAccountRecievable.contains',
  market: 'market.contains',
  state: 'state.contains',
  woaCompletionDateStart: 'woaCompletionDate.greaterThanOrEqual',
  woaCompletionDateEnd: 'woaCompletionDate.lessThanOrEqual',
  region: 'region.contains',
  partialPayment: 'displayPartialPayment.contains',
  gridExpectedPaymentDateStart: 'gridExpectedPaymentDate.greaterThanOrEqual',
  gridExpectedPaymentDateEnd: 'gridExpectedPaymentDate.lessThanOrEqual',
  profitPercentage: 'displayProfitPercentage.contains',
  profitPercentageAmount: 'profitPercentageAmount.greaterThanOrEqual',
  profitTotal: 'displayProfitTotal.contains',
  materialCost: 'displayMaterialCost.equals',
  drawAmount: 'drawAmount.equals',
  vendorPaymentPercentage: 'displayVendorPaymentPercentage.equals',
  woNumber: 'woNumber.contains',
  poNumber: 'poNumber.contains',
  pastDue: 'pastDue.equals',
  projectManagerId: 'projectManagerId.in',
  projectStatusId: 'projectStatusId.in',
  clientSignoffDateStart: 'clientSignoffDate.greaterThanOrEqual',
  clientSignoffDateEnd: 'clientSignoffDate.lessThanOrEqual',
  clientWalkthroughDateStart: 'clientWalkthroughDate.greaterThanOrEqual',
  clientWalkthroughDateEnd: 'clientWalkthroughDate.lessThanOrEqual',
  sowNewAmount: 'displaySowNewAmount.equals',
  drawAmountSow: 'drawAmountSow.equals',
  drawAmountWo: 'displayDrawAmountWo.equals',
  disqualifiedRevenueFlag: 'disqualifiedRevenueFlag.equals',
  noteFlag: 'noteFlag.equals',
  lienDueFlag: 'lienDueFlag.equals',
  flagCheck: 'flagCheck.equals',
  displayId: 'displayId.contains',
  percentageCompletion: 'displayPercentageCompletion.contains',
  flag: 'flag.contains',
  woaStartDateStart: 'woaStartDate.greaterThanOrEqual',
  woaStartDateEnd: 'woaStartDate.lessThanOrEqual',
  lienRightExpireDateStart: 'lienRightExpireDate.greaterThanOrEqual',
  lienRightExpireDateEnd: 'lienRightExpireDate.lessThanOrEqual',
  latestNoteAddedDateStart: 'latestNoteAddedDate.greaterThanOrEqual',
  latestNoteAddedDateEnd: 'latestNoteAddedDate.lessThanOrEqual',
  noteOwner: 'noteOwner.contains',
  pcOrFpmUserId: 'pcOrFpmUserId.in',
  convertedDateStart: 'convertedDate.greaterThanOrEqual',
  convertedDateEnd: 'convertedDate.lessThanOrEqual',
  carrierName: 'carrierName.contains',
  preInvoiced:'preInvoiced.equals'
}

export const PopoverTooltip = ({ value, title }) => {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Box isTruncated>{value}</Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent textOverflow={'ellipsis'}>
          <PopoverArrow />
          <PopoverHeader color={'#2D3748'}>{t(title)}</PopoverHeader>
          <PopoverBody>
            <Text color={'#4A5568'}>{value}</Text>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export const PROJECT_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'displayId',
    size: 100,
    cell: (row: any) => {
      const value = row.cell.getValue()
      const isFlagged = row.row?.original?.lienDueFlag || row.row?.original?.noteFlag
      const id = row.row?.original?.id
      return (
        <Box
          fontWeight={'500'}
          _hover={{
            color: 'barColor.50',
            textDecor: 'underline',
          }}
          color="brand.300"
        >
          <chakra.span marginRight={isFlagged ? '12px' : '26'}>
            {row.row?.original?.noteFlag && <Icon data-testid={"note_flag_icon"} title="Note Flag" as={RiFlag2Fill} color="rgba(252, 129, 129, 1)" />}
            {row.row?.original?.lienDueFlag && (
              <Icon data-testid={"lien_due_expiry_flag_icon"} title="Lien Due Expiry Flag" as={RiFlag2Fill} color="rgb(236, 201, 75,1)" />
            )}
          </chakra.span>
          <Link to={`/project-details/${id}`}>{value}</Link>
        </Box>
      )
    },
  },
  {
    header: 'projects.projectTable.generalLabour',
    accessorKey: 'generalLabourName',
    size: 230,
  },
  {
    header: 'projects.projectTable.claimNumber',
    accessorKey: 'claimNumber',
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
    meta: { hideTitle: true },
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <PopoverTooltip value={value} title={'projects.projectTable.address'} />
    },
  },
  {
    header: 'projects.projectTable.city',
    accessorKey: 'city',
  },
  {
    header: 'projects.projectTable.clientStart',
    accessorKey: 'clientStartDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientStartDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.clientDue',
    accessorKey: 'clientDueDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientDueDate),
    meta: { format: 'date' },
  },
  {
    header: 'project.projectDetails.clientWalkthrough',
    accessorKey: 'clientWalkthroughDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientWalkthroughDate),
    meta: { format: 'date' },
  },
  {
    header: 'project.projectDetails.clientSignOff',
    accessorKey: 'clientSignoffDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.clientSignoffDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.convertedDate',
    accessorKey: 'convertedDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.convertedDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.flag',
    accessorKey: 'flag',
  },
  {
    header: 'projects.projectDetails.notes',
    accessorKey: 'notes',
    meta: { hideTitle: true },
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <PopoverTooltip value={value} title={'projects.projectDetails.notes'} />
    },
  },
  {
    header: 'projects.projectTable.dateAddedNotes',
    accessorKey: 'latestNoteAddedDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.latestNoteAddedDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.notesAddedBy',
    accessorKey: 'noteOwner',
  },
  {
    header: 'projects.projectDetails.completion',
    accessorKey: 'percentageCompletion',
    meta: { hideTitle: true },
    cell: (row: any) => {
      const value = row.cell.getValue()
      return <PopoverTooltip value={value} title={'projects.projectDetails.completion'} />
    },
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
    header: 'projects.projectTable.accountPayableInvoiced',
    accessorKey: 'accountPayableInvoiced',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.accountPayableInvoiced).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.accountPayable',
    accessorKey: 'accountPayable',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.accountPayable).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.woDraw',
    accessorKey: 'drawAmountWo',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.drawAmountWo).format('$0,0.00')
    },
    meta: { format: 'currency' },
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
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.projectCost',
    accessorKey: 'projectRelatedCost',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.projectRelatedCost).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.paid',
    accessorKey: 'woaPaidDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaPaidDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.woaStartDate',
    accessorKey: 'woaStartDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaStartDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.invoiceNumber',
    accessorKey: 'resubmissionInvoiceNumber',
  },
  {
    header: 'projects.projectTable.woCreatedDate',
    accessorKey: 'firstWorkOrderDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.firstWorkOrderDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.invoiceDate',
    accessorKey: 'woaInvoiceDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaInvoiceDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.accountRecievable',
    accessorKey: 'accountRecievable',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.accountRecievable).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.market',
    accessorKey: 'market',
  },
  {
    header: 'projects.projectTable.carrierName',
    accessorKey: 'carrierName',
  },
  {
    header: 'projects.projectTable.state',
    accessorKey: 'state',
  },
  {
    header: 'projects.projectTable.ownerName',
    accessorKey: 'homeOwnerName',
    meta: { hideTitle: true },
    cell: (row: any) => {
      const value = row.cell.getValue()

      return <PopoverTooltip value={value} title={'projects.projectTable.ownerName'} />
    },
  },
  {
    header: 'projects.projectTable.woaFinish',
    accessorKey: 'woaCompletionDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.woaCompletionDate),
    meta: { format: 'date' },
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
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.expectedPayment',
    accessorKey: 'gridExpectedPaymentDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.gridExpectedPaymentDate),
    meta: { format: 'date' },
  },
  {
    header: 'projects.projectTable.profitPercentage',
    accessorKey: 'profitPercentage',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.profitPercentage / 100).format('0,0.00%')
    },
    meta: { format: 'percentage' },
  },
  {
    header: 'projects.projectTable.profitTotal',
    accessorKey: 'profitTotal',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.profitTotal).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.materialCost',
    accessorKey: 'materialCost',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.materialCost).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.percentagePaid', // Not getting this from backend at the moment
    accessorKey: 'vendorPaymentPercentage',
    accessorFn(cellInfo: any) {
      return isDefined(cellInfo.vendorPaymentPercentage)
        ? numeral(percentageFormatter(cellInfo.vendorPaymentPercentage)).format('0.00%')
        : '0.00%'
    },
    meta: { format: 'percentage' },
  },
  {
    header: 'projects.projectTable.sowDraw',
    accessorKey: 'drawAmountSow',
    accessorFn(cellInfo: any) {
      return numeral(cellInfo.drawAmountSow).format('$0,0.00')
    },
    meta: { format: 'currency' },
  },
  {
    header: 'projects.projectTable.woNo',
    accessorKey: 'woNumber',
  },
  {
    header: 'projects.projectTable.poNo',
    accessorKey: 'poNumber',
  },
  {
    header: 'projects.projectTable.disqualifiedRevenueFlag',
    accessorKey: 'disqualifiedRevenueFlag',
  },
  {
    header: 'projects.projectTable.lienRightsExpires',
    accessorKey: 'lienRightExpireDate',
    accessorFn: (cellInfo: any) => dateFormat(cellInfo.lienRightExpireDate),
    meta: { format: 'date' },
  },
]
