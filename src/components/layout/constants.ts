import { FaAlignCenter, FaHome, FaUser } from 'react-icons/fa'
import { Account, UserTypes } from 'types/account.types'
import { useAuth } from 'utils/auth-context'

type Menu = {
  pathTo: string
  title: string
  Icon: React.ElementType
}

type Menus = {
  [key in UserTypes]: Array<Menu>
}

export const MENU_ROLE_BASED: Menus = {
  [UserTypes.vendor]: [
    {
      pathTo: '/vendorDashboard',
      title: 'Dashboard',
      Icon: FaHome,
    },
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
    },
    {
      pathTo: '/vendors',
      title: 'Profile',
      Icon: FaUser,
    },
  ],
  [UserTypes.pc]: [
    {
      pathTo: '/pcDashboard',
      title: 'Dashboard',
      Icon: FaHome,
    },
    {
      pathTo: '/projects',
      title: 'Projects',
      Icon: FaAlignCenter,
    },
    {
      pathTo: '/payable',
      title: 'Payable',
      Icon: FaUser,
    },
  ],
}

export const useRoleBasedMenu = (): Array<Menu> => {
  const { data } = useAuth()
  const { userTypeLabel } = data?.user as Account

  return MENU_ROLE_BASED[userTypeLabel] || []
}
