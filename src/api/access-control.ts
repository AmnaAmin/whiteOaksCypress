import { useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'

export const useFetchRoles = () => {
  const client = useClient()

  return useQuery('get-roles', async () => {
    const response = await client(`authorities/list`, {})

    return response?.data
  })
}

export const useFetchRolesPermissions = roleName => {
  const client = useClient()

  return useQuery(
    ['get-roles', roleName],
    async () => {
      const response = await client(`authorities?name.in=${roleName}`, {})

      return response?.data
    },
    {
      enabled: !!roleName,
    },
  )
}

export const SECTIONS = [
  { value: 'ADMINDASHBOARD', label: 'Dashboard' },
  { value: 'ESTIMATE', label: 'Estimates' },
  { value: 'PROJECT', label: 'Projects' },
  { value: 'PAYABLE', label: 'Payable' },
  { value: 'RECEIVABLE', label: 'Receivable' },
  { value: 'VENDOR', label: 'Vendors' },
  { value: 'CLIENT', label: 'Clients' },
  { value: 'REPORT', label: 'Reports' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'USERMANAGER', label: 'Users' },
  { value: 'MARKET', label: 'Markets' },
  { value: 'VENDORSKILL', label: 'Vendor Skills' },
  { value: 'SUPPORT', label: 'Support' },
  { value: 'ALERT', label: 'Alerts' },
  { value: 'CYPRESSREPORT', label: 'Cypress Report' },
]

export const LOCATIONS = [
  { value: 'All', label: 'All' },
  { value: 'AREA', label: 'Area' },
  { value: 'REGION', label: 'Region' },
  { value: 'STATE', label: 'State' },
  { value: 'MARKET', label: 'Market' },
]

export const ASSIGNMENTS = [
  { value: 'All', label: 'All' },
  { value: 'FPM', label: 'FPM' },
  { value: 'PC', label: 'Project Coordinator' },
]
