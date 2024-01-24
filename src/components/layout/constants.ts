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
  BiQrScan,
  BiInfinite,
  BiBugAlt,
  BiGitRepoForked,
} from 'react-icons/bi'
import { IoLocationSharp } from 'react-icons/io5'
import { TiFlowParallel } from 'react-icons/ti'
import { FaAlignCenter, FaHome, FaReact, FaMailBulk } from 'react-icons/fa'
import { SIDE_NAV } from './sideNav.i18n'
import { MdOnlinePrediction } from 'react-icons/md'
import { IconType } from 'react-icons'
import { AccessControlIcon } from './icons/icon-access-control'

export type Menu = {
  pathTo: string
  title: string
  Icon?: IconType
  color?: string
  testId?: string
  permissions: string[]
}

// Show tab on preprod only
const showForPreProd = window.location.href.includes('preprod')
const showForPreProdAndLocal =
  showForPreProd || window.location.href.includes('localhost:') || window.location.href.includes('dev')

export const MenusList: Menu[] = [
  {
    pathTo: '/adminDashboard',
    title: `${SIDE_NAV}.dashboard`,
    Icon: FaHome,
    color: '#ED8936',
    permissions: ['ADMINDASHBOARD.EDIT', 'ADMINDASHBOARD.READ', 'ALL'],
    testId: 'adminDashboardMenuItem',
  },
  {
    pathTo: '/vendorDashboard',
    title: `${SIDE_NAV}.dashboard`,
    Icon: FaHome,
    color: '#F6AD55',
    permissions: ['VENDORDASHBOARD.EDIT', 'VENDORDASHBOARD.READ'],
    testId: 'vendorDashboardMenuItem',
  },
  {
    pathTo: '/estimates',
    title: `${SIDE_NAV}.estimates`,
    Icon: MdOnlinePrediction,
    color: '#ECC94B',
    permissions: ['ESTIMATE.EDIT', 'ESTIMATE.READ', 'ALL'],
    testId: 'estimatesMenuItem',
  },
  {
    pathTo: '/projects',
    title: `${SIDE_NAV}.projects`,
    Icon: FaAlignCenter,
    color: '#4E87F8',
    permissions: ['PROJECT.EDIT', 'PROJECT.READ', 'VENDORPROJECT.READ', 'VENDORPROJECT.EDIT', 'ALL'],
    testId: 'projectsMenuItem',
  },
  {
    pathTo: '/payable',
    title: `${SIDE_NAV}.payable`,
    Icon: BiCreditCard,
    color: '#68D391',
    permissions: ['PAYABLE.EDIT', 'PAYABLE.READ', 'ALL'],
    testId: 'payableMenuItem',
  },
  {
    pathTo: '/receivable',
    title: `${SIDE_NAV}.receivable`,
    Icon: BiDollarCircle,
    color: '#4299E1',
    permissions: ['RECEIVABLE.EDIT', 'RECEIVABLE.READ', 'ESTIMATERECEIVABLE.READ', 'ESTIMATERECEIVABLE.READ', 'ALL'],
    testId: 'recievableMenuItem',
  },
  {
    pathTo: '/vendors',
    title: `${SIDE_NAV}.vendors`,
    Icon: BiUserPin,
    color: '#9F7AEA',
    permissions: ['VENDOR.EDIT', 'VENDOR.READ', 'ALL'],
    testId: 'vendorMenuItem',
  },
  {
    pathTo: '/vendors',
    title: `${SIDE_NAV}.profile`,
    Icon: BiUser,
    color: '#68D391',
    permissions: ['VENDORPROFILE.EDIT', 'VENDORPROFILE.READ'],
    testId: 'profileMenuItem',
  },
  {
    pathTo: '/clients',
    title: `${SIDE_NAV}.clients`,
    Icon: BiGroup,
    color: '#0BC5EA',
    permissions: ['CLIENT.EDIT', 'CLIENT.READ', 'ALL'],
    testId: 'clientMenuItem',
  },
  {
    pathTo: '/messages',
    title: `${SIDE_NAV}.messages`,
    Icon: FaMailBulk,
    color: '#ED64A6',
    permissions: ['MESSAGES.EDIT', 'MESSAGES.READ', 'ALL'],
  },
  {
    pathTo: '/reports',
    title: `${SIDE_NAV}.reports`,
    Icon: BiBarChartSquare,
    color: '#FC8181',
    permissions: ['REPORT.READ', 'REPORT.EDIT', 'ALL'],
    testId: 'reportMenuItem',
  },
  {
    pathTo: '/performance',
    title: `${SIDE_NAV}.performance`,
    Icon: BiLineChart,
    color: '#68D391',
    permissions: ['PERFORMANCE.EDIT', 'PERFORMANCE.READ', 'ALL'],
    testId: 'reportMenuItem',
  },
  {
    pathTo: '/userManager',
    title: `${SIDE_NAV}.userMgmt`,
    Icon: BiUserPlus,
    color: '#ECC94B',
    testId: 'userManager',
    permissions: ['USERMANAGER.EDIT', 'USERMANAGER.READ', 'ALL'],
  },
  {
    pathTo: '/roles',
    title: `${SIDE_NAV}.accessControl`,
    Icon: AccessControlIcon,
    color: '#D487F8',
    testId: 'accessControl',
    permissions: ['ALL'],
  },
  {
    pathTo: '/projectType',
    title: `${SIDE_NAV}.projectType`,
    Icon: BiDockTop,
    color: '#9B2C2C',
    testId: 'projectTypeLink',
    permissions: ['PROJECTTYPE.EDIT', 'PROJECTTYPE.READ', 'ALL'],
  },
  {
    pathTo: '/vendorSkills',
    title: `${SIDE_NAV}.vendorsSkills`,
    Icon: BiAlignMiddle,
    color: '#4E87F8',
    testId: 'vendorTrade',
    permissions: ['VENDORSKILL.EDIT', 'VENDORSKILL.READ', 'ALL'],
  },
  {
    pathTo: '/clientType',
    title: 'Client type',
    Icon: BiUser,
    color: '#0BC5EA',
    testId: 'clientTypeLink',
    permissions: ['CLIENTTYPE.EDIT', 'CLIENTTYPE.READ', 'ALL'],
  },
  {
    pathTo: '/markets',
    title: `${SIDE_NAV}.markets`,
    Icon: BiStats,
    color: '#68D391',
    permissions: ['MARKET.EDIT', 'MARKET.READ', 'ALL'],
  },
  {
    pathTo: '/location',
    title: `${SIDE_NAV}.locations`,
    Icon: IoLocationSharp,
    color: '#9B2C2C',
    permissions: ['LOCATION.EDIT', 'LOCATION.READ', 'ALL'],
  },
  {
    pathTo: '/support-tickets',
    title: `${SIDE_NAV}.support`,
    Icon: FaReact,
    color: '#3182CE',
    permissions: ['SUPPORT.EDIT', 'SUPPORT.READ', 'ALL'],
    testId: 'supportMenuItem',
  },
  ...(showForPreProdAndLocal
    ? [
        {
          pathTo: '/alerts',
          title: `${SIDE_NAV}.alerts`,
          Icon: BiError,
          color: '#ED64A6',
          permissions: ['ALERT.EDIT', 'ALERT.READ', 'ALL'],
        },
        {
          pathTo: '/cypressReport',
          title: `${SIDE_NAV}.cypressReport`,
          Icon: TiFlowParallel,
          color: '#3182CE',
          permissions: ['ALL'],
        },
      ]
    : []),
  ...(showForPreProdAndLocal
    ? [
        {
          pathTo: '/vendor-scan',
          title: `${SIDE_NAV}.vendorQRScan`,
          Icon: BiQrScan,
          color: '#D3D3D3',
          permissions: ['ALL'],
        },
      ]
    : []),
  ...(showForPreProdAndLocal
    ? [
        {
          pathTo: '/cypressTriggers',
          title: `${SIDE_NAV}.cypressTriggers`,
          Icon: BiGitRepoForked,
          color: '#3182CE',
          permissions: ['ALL'],
        },
        {
          pathTo: '/sonarqubeDashboard',
          title: `${SIDE_NAV}.sonarqubeDashboard`,
          Icon: BiBugAlt,
          color: '#7182CE',
          permissions: ['ALL'],
        },
        {
          pathTo: '/automationDashboard',
          title: `${SIDE_NAV}.automationDashboard`,
          Icon: BiInfinite,
          color: '#3092CE',
          permissions: ['ALL'],
        },
      ]
    : []),
]

export const APP_LOCAL_DATE_FORMAT_Z = 'yyyy-MM-dd'
