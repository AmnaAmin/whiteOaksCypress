export type TableColumnSetting = {
  id: number
  flex: number | null
  hide: boolean
  sort: string | null
  sortIndex: string | null
  colId: string
  aggFunc: string | null
  pivot: false
  pivotIndex: string | null
  pinned: string | null
  rowGroup: false
  rowGroupIndex: string | null
  type: string
  field: string
  cellRenderer: string | null
  contentKey: string
  order: number
  minWidth: number
  userId: string
}

export enum TableNames {
  adminDashboard = 'adminDashboard',
  vendorProjects = 'vendorProjects',
  project = 'project',
  new_project = 'new_project',
  transaction = 'transaction',
  workOrder = 'workOrder',
  alerts = 'alerts',
  pcproject = 'pc-project',
  vendors = 'vendors',
  projectFinancialOverview = 'project-financial-overview',
  payable = 'payable',
  receivable = 'receivable',
  document = 'document',
  upcomingPayment = 'upcomingPayment',
  auditLogs = 'auditLogs',
  vendorSkills = 'vendorSkills',
  markets = 'markets',
  estimates = 'estimates',
  performance = 'performance',
  vendorUsers = 'vendor-users',
  vendorUsersTable = 'vendor-users-table',
  vendorPaymentAccountTable = 'vendor-payment-account-table',
  woaUsersTable = 'woa-users-table',
  devtekUsersTable = 'devtek-users-table',
  vendorProject = 'vendorProject',
  testProject = 'testProject',
  clients = 'clients-table',
  invoicing = 'invoicing',
}
