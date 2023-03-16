export const SELECTED_CARD_MAP_URL = {
  workInProgress: 'projectStatusId.in=7,8,9,10,120',
  receivable: 'projectStatusId.in=11',
  payable: 'numberOfInvoicedWorkorders.greaterThan=0&projectStatusId.notIn=220,33',
  material: 'projectStatusId.notIn=33,41,220,11,72&materialCost.notEquals=0',
  draw: 'projectStatusId.notIn=33,41,220,11,72&drawAmountWo.notEquals=0',
}
export const filterByMonthOptions = [
  { value: 'All', label: 'All' },
  { value: 'Jan', label: 'January' },
  { value: 'Feb', label: 'February' },
  { value: 'Mar', label: 'March' },
  { value: 'Apr', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'Jun', label: 'June' },
  { value: 'Jul', label: 'July' },
  { value: 'Aug', label: 'August' },
  { value: 'Sep', label: 'September' },
  { value: 'Oct', label: 'October' },
  { value: 'Nov', label: 'November' },
  { value: 'Dec', label: 'December' },
]

export const barColors = [
  { key: 'workInProgress', color: '#FC8181', className: 'wip', name: 'WIP' },
  { key: 'draw', color: '#F6E05E', className: 'draw', name: 'Draw' },
  { key: 'revenue', color: '#F6AD55', className: 'revenue', name: 'Revenue' },
  {
    key: 'accountReceivable',
    color: '#63B3ED',
    className: 'accountReceivable',
    name: 'Account Receivable',
  },
  { key: 'accountPayable', color: '#B794F4', className: 'accountPayable', name: 'Account Payable' },
  { key: 'material', color: '#68D391', className: 'materials', name: 'Materials' },
]

export const lineColor = {
  key: 'profit',
  stroke: '#C05621',
  color: '#fff',
  fill: '#C05621 !important',
  className: 'grossProfit',
  name: 'Gross Profit',
}
