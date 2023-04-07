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

export const MENU_ROLE_BASED: Menus = {
  [UserTypes.vendor]: [
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
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.profile`,
      Icon: BiUser,
      color: '#68D391',
    },
  ],

  [UserTypes.pc]: [
    // {
    //   pathTo: '/pcDashboard',
    //   title: 'Dashboard',
    //   Icon: FaHome,
    //   color: '#ED8936',
    // },
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: `${SIDE_NAV}.payable`,
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: `${SIDE_NAV}.receivable`,
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    // {
    //   pathTo: '/alerts',
    //   title: 'Alerts',
    //   Icon: BiError,
    //   color: '#ED64A6',
    // },
    {
      pathTo: '/clients',
      title: `${SIDE_NAV}.clients`,
      Icon: BiGroup,
      color: '#0BC5EA',
    },
  ],

  [UserTypes.vendorManager]: [
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/vendorSkills',
      title: `${SIDE_NAV}.vendorsSkills`,
      Icon: BiAlignMiddle,
      color: '#4E87F8',
      testId: 'vendorTrade',
    },
    {
      pathTo: '/markets',
      title: `${SIDE_NAV}.markets`,
      Icon: BiStats,
      color: '#68D391',
    },
  ],

  [UserTypes.doc]: [
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: `${SIDE_NAV}.clients`,
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: `${SIDE_NAV}.reports`,
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: `${SIDE_NAV}.performance`,
      Icon: BiLineChart,
      color: '#68D391',
    },
  ],

  [UserTypes.fpm]: [
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/performance',
      title: `${SIDE_NAV}.performance`,
      Icon: BiLineChart,
      color: '#68D391',
    },
  ],

  [UserTypes.publicAdmin]: [
    {
      pathTo: '/adminDashboard',
      title: `${SIDE_NAV}.dashboard`,
      Icon: FaHome,
      color: '#ED8936',
    },
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: `${SIDE_NAV}.payable`,
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: `${SIDE_NAV}.receivable`,
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: `${SIDE_NAV}.clients`,
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: `${SIDE_NAV}.reports`,
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: `${SIDE_NAV}.performance`,
      Icon: BiLineChart,
      color: '#68D391',
    },
    {
      pathTo: '/markets',
      title: `${SIDE_NAV}.markets`,
      Icon: BiStats,
      color: '#68D391',
    },
    {
      pathTo: '/projectType',
      title: 'Project type',
      Icon: BiDockTop,
      color: '#9B2C2C',
      testId: 'projectTypeLink',
    },
    {
      pathTo: '/vendorSkills',
      title: `${SIDE_NAV}.vendorsSkills`,
      Icon: BiAlignMiddle,
      color: '#4E87F8',
      testId: 'vendorTrade',
    },
  ],
  [UserTypes.admin]: [
    {
      pathTo: '/adminDashboard',
      title: `${SIDE_NAV}.dashboard`,
      Icon: FaHome,
      color: '#ED8936',
    },
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: `${SIDE_NAV}.payable`,
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: `${SIDE_NAV}.receivable`,
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: `${SIDE_NAV}.clients`,
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: `${SIDE_NAV}.reports`,
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: `${SIDE_NAV}.performance`,
      Icon: BiLineChart,
      color: '#68D391',
    },

    {
      pathTo: '/userManager',
      title: `${SIDE_NAV}.userMgmt`,
      Icon: BiUserPlus,
      color: '#ECC94B',
      testId: 'userManager',
    },
    {
      pathTo: '/markets',
      title: `${SIDE_NAV}.markets`,
      Icon: BiStats,
      color: '#68D391',
    },
    {
      pathTo: '/projectType',
      title: `${SIDE_NAV}.projectType`,
      Icon: BiDockTop,
      color: '#9B2C2C',
      testId: 'projectTypeLink',
    },
    {
      pathTo: '/vendorSkills',
      title: `${SIDE_NAV}.vendorsSkills`,
      Icon: BiAlignMiddle,
      color: '#4E87F8',
      testId: 'vendorTrade',
    },
    {
      pathTo: '/support-tickets',
      title: `${SIDE_NAV}.support`,
      Icon: FaReact,
      color: '#3182CE',
    },
    ...(showForPreProdAndLocal
      ? [
          {
            pathTo: '/alerts',
            title: `${SIDE_NAV}.alerts`,
            Icon: BiError,
            color: '#ED64A6',
          },
          {
            pathTo: '/cypressReport',
            title: `${SIDE_NAV}.cypressReport`,
            Icon: SiCypress,
            color: '#FC8181',
          },
        ]
      : []),
  ],

  [UserTypes.accounting]: [
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: `${SIDE_NAV}.payable`,
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: `${SIDE_NAV}.receivable`,
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: `${SIDE_NAV}.clients`,
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: `${SIDE_NAV}.reports`,
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: `${SIDE_NAV}.performance`,
      Icon: BiLineChart,
      color: '#68D391',
    },
  ],
  [UserTypes.operations]: [
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: `${SIDE_NAV}.payable`,
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: `${SIDE_NAV}.receivable`,
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: `${SIDE_NAV}.clients`,
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: `${SIDE_NAV}.reports`,
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: `${SIDE_NAV}.performance`,
      Icon: BiLineChart,
      color: '#68D391',
    },
    // {
    //   pathTo: '/userManager',
    //   title: 'User Mgmt',
    //   Icon: BiUserPlus,
    //   color: '#ECC94B',
    // },
  ],
  [UserTypes.clientManager]: [
    {
      pathTo: '/clients',
      title: `${SIDE_NAV}.clients`,
      Icon: BiGroup,
      color: '#0BC5EA',
    },
  ],
  [UserTypes.constructionOperations]: [
    {
      pathTo: '/estimates',
      title: `${SIDE_NAV}.estimates`,
      Icon: MdOnlinePrediction,
      color: '#ECC94B',
    },
    {
      pathTo: '/projects',
      title: `${SIDE_NAV}.projects`,
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/vendors',
      title: `${SIDE_NAV}.vendors`,
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
  ],
}

export const useRoleBasedMenu = (): Array<Menu> => {
  const { data } = useAuth()
  const { userTypeLabel } = data?.user as Account
  return MENU_ROLE_BASED[userTypeLabel] || []
}

export const APP_LOCAL_DATE_FORMAT_Z = 'yyyy-MM-dd'
