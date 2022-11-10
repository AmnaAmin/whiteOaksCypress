import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import {
  BiAlignMiddle,
  BiBarChartSquare,
  BiCreditCard,
  BiDollarCircle,
  BiGroup,
  BiLineChart,
  BiStats,
  BiUser,
  BiUserPin,
  BiUserPlus,
} from 'react-icons/bi'

import { FaAlignCenter, FaHome } from 'react-icons/fa'
import { Account, UserTypes } from 'types/account.types'
import { useAuth } from 'utils/auth-context'
import { SIDE_NAV } from './sideNav.i18n'

type Menu = {
  pathTo: string
  title: string
  Icon: React.ElementType
  color: string
}

type Menus = {
  [key in UserTypes]: Array<Menu>
}


// const { t } = useTranslation()

// const dashboard = t(`${SIDE_NAV}.dashboard`)
// const projects = t(`${SIDE_NAV}.projects`)


export const MENU_ROLE_BASED: Menus = {
  [UserTypes.vendor]: [
    {
      pathTo: '/vendorDashboard',
      title: 'Dashboard',
      Icon: FaHome,
      color: '#ED8936',
    },
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/vendors',
      title: 'Profile',
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
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: 'Payable',
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: 'Receivable',
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: 'Vendors',
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
      title: 'Clients',
      Icon: BiGroup,
      color: '#0BC5EA',
    },
  ],

  [UserTypes.vendorManager]: [
    {
      pathTo: '/vendors',
      title: 'Vendors',
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/vendorSkills',
      title: 'Vendors Skills',
      Icon: BiAlignMiddle,
      color: '#4E87F8',
    },
    {
      pathTo: '/markets',
      title: 'Markets',
      Icon: BiStats,
      color: '#68D391',
    },
  ],

  [UserTypes.doc]: [
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/vendors',
      title: 'Vendors',
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: 'Clients',
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: 'Reports',
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: 'Performance',
      Icon: BiLineChart,
      color: '#68D391',
    },
  ],

  [UserTypes.fpm]: [
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/performance',
      title: 'Performance',
      Icon: BiLineChart,
      color: '#68D391',
    },
  ],

  [UserTypes.admin]: [
    {
      pathTo: '/userManager',
      title: 'User Mgmt',
      Icon: BiUserPlus,
      color: '#ECC94B',
    },
  ],
  [UserTypes.accounting]: [
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: 'Payable',
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: 'Receivable',
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: 'Vendors',
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: 'Clients',
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: 'Reports',
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: 'Performance',
      Icon: BiLineChart,
      color: '#68D391',
    },
  ],
  [UserTypes.operations]: [
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/payable',
      title: 'Payable',
      Icon: BiCreditCard,
      color: '#68D391',
    },
    {
      pathTo: '/receivable',
      title: 'Receivable',
      Icon: BiDollarCircle,
      color: '#4299E1',
    },
    {
      pathTo: '/vendors',
      title: 'Vendors',
      Icon: BiUserPin,
      color: '#9F7AEA',
    },
    {
      pathTo: '/clients',
      title: 'Clients',
      Icon: BiGroup,
      color: '#0BC5EA',
    },
    {
      pathTo: '/reports',
      title: 'Reports',
      Icon: BiBarChartSquare,
      color: '#FC8181',
    },
    {
      pathTo: '/performance',
      title: 'Performance',
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
      title: 'Clients',
      Icon: BiGroup,
      color: '#0BC5EA',
    },
  ],
  [UserTypes.constructionOperations]: [
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
      color: '#4E87F8',
    },
    {
      pathTo: '/vendors',
      title: 'Vendors',
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
