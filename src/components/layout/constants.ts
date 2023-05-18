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
import { Account } from 'types/account.types'
import { useAuth } from 'utils/auth-context'
import { SIDE_NAV } from './sideNav.i18n'
import { MdOnlinePrediction } from 'react-icons/md'

/*type Menu = {
  pathTo: string
  title: string
  Icon: React.ElementType
  color: string
  testId?: string
}*/

// Show tab on preprod only
const showForPreProd = window.location.href.includes('preprod')
const showForPreProdAndLocal = showForPreProd || window.location.href.includes('localhost:')

export const MenusList = [
  {
    pathTo: '/adminDashboard',
    title: `${SIDE_NAV}.dashboard`,
    Icon: FaHome,
    color: '#ED8936',
    permission: 'MENU.ADMINDASHBOARD',
  },
  {
    pathTo: '/vendorDashboard',
    title: `${SIDE_NAV}.dashboard`,
    Icon: FaHome,
    color: '#F6AD55',
    permission: 'MENU.VENDORDASHBOARD',
  },
  {
    pathTo: '/estimates',
    title: `${SIDE_NAV}.estimates`,
    Icon: MdOnlinePrediction,
    color: '#ECC94B',
    permission: 'MENU.ESTIMATES',
  },
  {
    pathTo: '/projects',
    title: `${SIDE_NAV}.projects`,
    Icon: FaAlignCenter,
    color: '#4E87F8',
    permission: 'MENU.PROJECTS',
  },
  {
    pathTo: '/payable',
    title: `${SIDE_NAV}.payable`,
    Icon: BiCreditCard,
    color: '#68D391',
    permission: 'MENU.PAYABLE',
  },
  {
    pathTo: '/receivable',
    title: `${SIDE_NAV}.receivable`,
    Icon: BiDollarCircle,
    color: '#4299E1',
    permission: 'MENU.RECEIVABLE',
  },
  {
    pathTo: '/vendors',
    title: `${SIDE_NAV}.vendors`,
    Icon: BiUserPin,
    color: '#9F7AEA',
    permission: 'MENU.VENDORS',
  },
  {
    pathTo: '/vendors',
    title: `${SIDE_NAV}.profile`,
    Icon: BiUser,
    color: '#68D391',
    permission: 'MENU.VENDORPROFILE',
  },
  {
    pathTo: '/clients',
    title: `${SIDE_NAV}.clients`,
    Icon: BiGroup,
    color: '#0BC5EA',
    permission: 'MENU.CLIENTS',
  },
  {
    pathTo: '/reports',
    title: `${SIDE_NAV}.reports`,
    Icon: BiBarChartSquare,
    color: '#FC8181',
    permission: 'MENU.REPORTS',
  },
  {
    pathTo: '/performance',
    title: `${SIDE_NAV}.performance`,
    Icon: BiLineChart,
    color: '#68D391',
    permission: 'MENU.PERFORMANCE',
  },

  {
    pathTo: '/userManager',
    title: `${SIDE_NAV}.userMgmt`,
    Icon: BiUserPlus,
    color: '#ECC94B',
    testId: 'userManager',
    permission: 'MENU.USERMANAGER',
  },
  {
    pathTo: '/projectType',
    title: `${SIDE_NAV}.projectType`,
    Icon: BiDockTop,
    color: '#9B2C2C',
    testId: 'projectTypeLink',
    permission: 'MENU.PROJECTTYPE',
  },
  {
    pathTo: '/vendorSkills',
    title: `${SIDE_NAV}.vendorsSkills`,
    Icon: BiAlignMiddle,
    color: '#4E87F8',
    testId: 'vendorTrade',
    permission: 'MENU.VENDORSKILLS',
  },
  {
    pathTo: '/markets',
    title: `${SIDE_NAV}.markets`,
    Icon: BiStats,
    color: '#68D391',
    permission: 'MENU.MARKETS',
  },
  {
    pathTo: '/support-tickets',
    title: `${SIDE_NAV}.support`,
    Icon: FaReact,
    color: '#3182CE',
    permission: 'MENU.SUPPORT',
  },
  ...(showForPreProdAndLocal
    ? [
        {
          pathTo: '/alerts',
          title: `${SIDE_NAV}.alerts`,
          Icon: BiError,
          color: '#ED64A6',
          permission: 'MENU.ALERTS',
        },
        {
          pathTo: '/cypressReport',
          title: `${SIDE_NAV}.cypressReport`,
          Icon: SiCypress,
          color: '#FC8181',
          permission: 'MENU.CYPRESSREPORT',
        },
      ]
    : []),
]

export const useRoleBasedMenu = (): Array<string> => {
  const { data } = useAuth()
  const { userTypeLabel } = data?.user as Account
  const permissions = MENU_PERMISSIONS[userTypeLabel] || []
  return permissions
}

export enum ROLE {
  Vendor = 'Vendor',
  PC = 'Project Coordinator',
  VendorManager = 'Vendor Manager',
  DOC = 'Director Of Construction',
  FPM = 'Field Project Manager',
  CO = 'Construction Operations',
  ClientManager = 'Client Manager',
  Accounting = 'Accounting',
  Operations = 'Operational',
  Admin = 'Admin',
}

const MENU_PERMISSIONS = {
  [ROLE.Vendor]: ['MENU.VENDORDASHBOARD', 'MENU.ESTIMATES', 'MENU.PROJECTS', 'MENU.VENDORPROFILE'],
  [ROLE.PC]: ['MENU.ESTIMATES', 'MENU.PROJECTS', 'MENU.PAYABLE', 'MENU.RECEIVABLE', 'MENU.VENDORS', 'MENU.CLIENTS'],
  [ROLE.VendorManager]: ['MENU.VENDORS', 'MENU.VENDORSKILLS', 'MENU.MARKETS'],
  [ROLE.DOC]: ['MENU.ESTIMATES', 'MENU.PROJECTS', 'MENU.VENDORS', 'MENU.CLIENTS', 'MENU.REPORTS', 'MENU.PERFORMANCE'],
  [ROLE.FPM]: ['MENU.ESTIMATES', 'MENU.PROJECTS', 'MENU.VENDORS'],
  [ROLE.CO]: ['MENU.ESTIMATES', 'MENU.PROJECTS', 'MENU.VENDORS'],
  [ROLE.ClientManager]: ['MENU.CLIENTS'],
  [ROLE.Operations]: [
    'MENU.ESTIMATES',
    'MENU.PROJECTS',
    'MENU.PAYABLE',
    'MENU.RECEIVABLE',
    'MENU.VENDORS',
    'MENU.CLIENTS',
    'MENU.REPORTS',
    'MENU.PERFORMANCE',
  ],
  [ROLE.Accounting]: [
    'MENU.ESTIMATES',
    'MENU.PROJECTS',
    'MENU.PAYABLE',
    'MENU.RECEIVABLE',
    'MENU.VENDORS',
    'MENU.CLIENTS',
    'MENU.REPORTS',
    'MENU.PERFORMANCE',
  ],
  [ROLE.Admin]: [
    'MENU.ADMINDASHBOARD',
    'MENU.ESTIMATES',
    'MENU.PROJECTS',
    'MENU.PAYABLE',
    'MENU.RECEIVABLE',
    'MENU.VENDORS',
    'MENU.CLIENTS',
    'MENU.REPORTS',
    'MENU.PERFORMANCE',
    'MENU.USERMANAGER',
    'MENU.MARKETS',
    'MENU.PROJECTTYPE',
    'MENU.VENDORSKILLS',
    'MENU.ALERTS',
    'MENU.CYPRESSREPORT',
    'MENU.SUPPORT',
  ],
}

export const APP_LOCAL_DATE_FORMAT_Z = 'yyyy-MM-dd'
