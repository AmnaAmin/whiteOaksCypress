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
import { SIDE_NAV } from './sideNav.i18n'
import { MdOnlinePrediction } from 'react-icons/md'

type Menu = {
  pathTo: string
  title: string
  Icon?: React.ElementType
  color?: string
  testId?: string
  permissions: string[]
}

// Show tab on preprod only
const showForPreProd = window.location.href.includes('preprod')
const showForPreProdAndLocal = showForPreProd || window.location.href.includes('localhost:')

export const MenusList: Menu[] = [
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
    permissions: ['VENDORDASHBOARD.EDIT', 'VENDORDASHBOARD.READ'],
  },
  {
    pathTo: '/estimates',
    title: `${SIDE_NAV}.estimates`,
    Icon: MdOnlinePrediction,
    color: '#ECC94B',
    permissions: ['ESTIMATE.EDIT', 'ESTIMATE.READ'],
  },
  {
    pathTo: '/projects',
    title: `${SIDE_NAV}.projects`,
    Icon: FaAlignCenter,
    color: '#4E87F8',
    permissions: ['PROJECT.EDIT', 'PROJECT.READ', 'VENDORPROJECT.READ', 'VENDORPROJECT.EDIT'],
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
    permissions: ['VENDOR.EDIT', 'VENDOR.READ'],
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
    permissions: ['CLIENT.EDIT', 'CLIENT.READ'],
  },
  {
    pathTo: '/reports',
    title: `${SIDE_NAV}.reports`,
    Icon: BiBarChartSquare,
    color: '#FC8181',
    permissions: ['REPORT.READ'],
  },
  {
    pathTo: '/performance',
    title: `${SIDE_NAV}.performance`,
    Icon: BiLineChart,
    color: '#68D391',
    permissions: ['PERFORMANCE.EDIT', 'PERFORMANCE.READ'],
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
    permissions: ['VENDORSKILL.EDIT', 'VENDORSKILL.READ'],
  },
  {
    pathTo: '/markets',
    title: `${SIDE_NAV}.markets`,
    Icon: BiStats,
    color: '#68D391',
    permissions: ['MARKET.EDIT', 'MARKET.READ'],
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
          permissions: ['ALERT.EDIT', 'ALERT.READ'],
        },
        {
          pathTo: '/cypressReport',
          title: `${SIDE_NAV}.cypressReport`,
          Icon: SiCypress,
          color: '#FC8181',
          permissions: ['CYPRESSREPORT.READ'],
        },
      ]
    : []),
]

export const APP_LOCAL_DATE_FORMAT_Z = 'yyyy-MM-dd'
