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
  { value: 'DASHBOARD', label: 'Dashboard' },
  { value: 'ESTIMATE', label: 'Estimates' },
  { value: 'PROJECT', label: 'Projects' },
  { value: 'PAYABLE', label: 'Payable' },
  { value: 'RECEIVABLE', label: 'Receivable' },
  { value: 'VENDORS', label: 'Vendors' },
  { value: 'CLIENTS', label: 'Clients' },
  { value: 'REPORTS', label: 'Reports' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'USER', label: 'Users' },
  { value: 'MARKET', label: 'Markets' },
  { value: 'VENDORSKILLs', label: 'Vendor Skills' },
  { value: 'SUPPORT', label: 'Support' },
  { value: 'ALERT', label: 'Alerts' },
  { value: 'CYPRESS', label: 'Cypress Report' },
]
