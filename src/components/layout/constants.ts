import {
  BiAlignMiddle,
  BiBarChartSquare,
  BiCreditCard,
  BiDockTop,
  BiDollarCircle,
  BiGroup,
  BiLineChart,
  BiStats,
  BiUser,
  BiUserPin,
  BiUserPlus,
  BiError,
} from 'react-icons/bi'
import { SiCypress } from 'react-icons/si'
import { FaAlignCenter, FaHome, FaReact } from 'react-icons/fa'
import { Account, UserTypes } from 'types/account.types'
import { useAuth } from 'utils/auth-context'
import { SIDE_NAV } from './sideNav.i18n'
import { MdOnlinePrediction } from 'react-icons/md'

type Menu = {
  pathTo: string
  title: string
  Icon: React.ElementType
  color: string
  testId?: string
}

type Menus = {
  [key in UserTypes]: Array<Menu>
}

// Show tab on preprod only
const showForPreProd = window.location.href.includes('preprod')
const showForPreProdAndLocal = showForPreProd || window.location.href.includes('localhost:')

export const Menus = [
  {
    pathTo: '/adminDashboard',
    title: `${SIDE_NAV}.dashboard`,
    Icon: FaHome,
    color: '#ED8936',
    permissions: ['ADMINDASHBOARD.EDIT', 'ADMINDASHBOARD.READ'],
  },
  {
    pathTo: '/vendorDashboard',
    title: `${SIDE_NAV}.dashboard`,
    Icon: FaHome,
    color: '#F6AD55',
  },
  {
    pathTo: '/estimates',
    title: `${SIDE_NAV}.estimates`,
    Icon: MdOnlinePrediction,
    color: '#ECC94B',
    permissions: ['ESTIMATES.EDIT', 'ESTIMATES.READ'],
  },
  {
    pathTo: '/projects',
    title: `${SIDE_NAV}.projects`,
    Icon: FaAlignCenter,
    color: '#4E87F8',
    permissions: ['PROJECTS.EDIT', 'PROJECTS.READ'],
  },
  {
    pathTo: '/payable',
    title: `${SIDE_NAV}.payable`,
    Icon: BiCreditCard,
    color: '#68D391',
    permissions: ['PAYABLE.EDIT', 'PAYABLE.READ'],
  },
  {
    pathTo: '/receivable',
    title: `${SIDE_NAV}.receivable`,
    Icon: BiDollarCircle,
    color: '#4299E1',
    permissions: ['RECEIVABLE.EDIT', 'RECEIVABLE.READ'],
  },
  {
    pathTo: '/vendors',
    title: `${SIDE_NAV}.vendors`,
    Icon: BiUserPin,
    color: '#9F7AEA',
    permissions: ['VENDORS.EDIT', 'VENDORS.READ'],
  },
  {
    pathTo: '/vendors',
    title: `${SIDE_NAV}.profile`,
    Icon: BiUser,
    color: '#68D391',
    permissions: ['VENDORPROFILE.EDIT', 'VENDORPROFILE.READ'],
  },
  {
    pathTo: '/clients',
    title: `${SIDE_NAV}.clients`,
    Icon: BiGroup,
    color: '#0BC5EA',
    permissions: ['CLIENTS.EDIT', 'CLIENTS.READ'],
  },
  {
    pathTo: '/reports',
    title: `${SIDE_NAV}.reports`,
    Icon: BiBarChartSquare,
    color: '#FC8181',
    permissions: ['REPORTS.EDIT', 'REPORTS.READ'],
  },
  {
    pathTo: '/performance',
    title: `${SIDE_NAV}.performance`,
    Icon: BiLineChart,
    color: '#68D391',
    permissions: ['REPORTS.EDIT', 'REPORTS.READ'],
  },

  {
    pathTo: '/userManager',
    title: `${SIDE_NAV}.userMgmt`,
    Icon: BiUserPlus,
    color: '#ECC94B',
    testId: 'userManager',
    permissions: ['USERMANAGER.EDIT', 'USERMANAGER.READ'],
  },
  {
    pathTo: '/markets',
    title: `${SIDE_NAV}.markets`,
    Icon: BiStats,
    color: '#68D391',
    permissions: ['MARKETS.EDIT', 'MARKETS.READ'],
  },
  {
    pathTo: '/projectType',
    title: `${SIDE_NAV}.projectType`,
    Icon: BiDockTop,
    color: '#9B2C2C',
    testId: 'projectTypeLink',
    permissions: ['PROJECTTYPE.EDIT', 'PROJECTTYPE.READ'],
  },
  {
    pathTo: '/vendorSkills',
    title: `${SIDE_NAV}.vendorsSkills`,
    Icon: BiAlignMiddle,
    color: '#4E87F8',
    testId: 'vendorTrade',
    permissions: ['VENDORSKILLS.EDIT', 'VENDORSKILLS.READ'],
  },
  {
    pathTo: '/support-tickets',
    title: `${SIDE_NAV}.support`,
    Icon: FaReact,
    color: '#3182CE',
    permissions: ['SUPPORT.EDIT', 'SUPPORT.READ'],
  },
  ...(showForPreProdAndLocal
    ? [
        {
          pathTo: '/alerts',
          title: `${SIDE_NAV}.alerts`,
          Icon: BiError,
          color: '#ED64A6',
          permissions: ['ALERTS.EDIT', 'ALERTS.READ'],
        },
        {
          pathTo: '/cypressReport',
          title: `${SIDE_NAV}.cypressReport`,
          Icon: SiCypress,
          color: '#FC8181',
          permissions: ['CYPRESSREPORT.EDIT', 'CYPRESSREPORT.READ'],
        },
      ]
    : []),
]

export const useRoleBasedMenu = (): Array<any> => {
  const { data } = useAuth()
  const { userTypeLabel } = data?.user as Account
  const permissions = MENU_PERMISSIONS[userTypeLabel] || []
  return permissions
}

export enum ROLE {
  Vendor = 'Vendor',
  PC = 'PC',
  VendorManager = 'Vendor Manager',
  DOC = 'Director Of Construction',
  FPM = 'Field Project Manager',
  CO = 'Construction Operations',
  ClientManager = 'Client Manager',
  Accounting = 'Accounting',
  Operations = 'Operations',
  Admin = 'Admin',
}

const MENU_PERMISSIONS = {
  [ROLE.Vendor]: ['VENDORDASHBOARD.EDIT', 'ESTIMATES.EDIT', 'PROJECTS.EDIT', 'VENDORPROFILE.EDIT'],
  [ROLE.PC]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'PAYABALE.EDIT', 'RECEIVABLE.EDIT', 'VENDORS.EDIT', 'CLIENTS.EDIT'],
  [ROLE.VendorManager]: ['VENDORS.EDIT', 'VENDORSKILLS.EDIT', 'MARKETS.EDIT'],
  [ROLE.DOC]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'VENDORS.EDIT', 'CLIENTS.EDIT', 'REPORTS.EDIT', 'PERFORMANCE.EDIT'],
  [ROLE.FPM]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'VENDORS.EDIT'],
  [ROLE.CO]: ['ESTIMATES.EDIT', 'PROJECTS.EDIT', 'VENDORS.EDIT'],
  [ROLE.ClientManager]: ['CLIENTS.EDIT'],
  [ROLE.Operations]: [
    'ESTIMATES.EDIT',
    'PROJECTS.EDIT',
    'PAYABALE.EDIT',
    'RECEIVABLE.EDIT',
    'VENDORS.EDIT',
    'CLIENTS.EDIT',
    'PERFORMANCE.EDIT',
  ],
  [ROLE.Accounting]: [
    'ESTIMATES.EDIT',
    'PROJECTS.EDIT',
    'PAYABALE.EDIT',
    'RECEIVABLE.EDIT',
    'VENDORS.EDIT',
    'CLIENTS.EDIT',
    'PERFORMANCE.EDIT',
  ],
  [ROLE.Admin]: [
    'ADMINDASHBOARD.EDIT',
    'ESTIMATES.EDIT',
    'PROJECTS.EDIT',
    'PAYABLE.EDIT',
    'RECEIVABLE.EDIT',
    'VENDORS.EDIT',
    'CLIENTS.EDIT',
    'REPORTS.EDIT',
    'PERFORMANCE.EDIT',
    'USERMANAGER.EDIT',
    'MARKETS.EDIT',
    'PROJECTTYPE.EDIT',
    'VENDORSKILLS.EDIT',
    'ALERTS.EDIT',
    'CYPRESSREPORT.EDIT',
    'SUPPORT.EDIT',
  ],
}

export const APP_LOCAL_DATE_FORMAT_Z = 'yyyy-MM-dd'
