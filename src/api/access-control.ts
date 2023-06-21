import { useToast } from '@chakra-ui/toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'

export const useFetchRoles = () => {
  const client = useClient()

  const { data, ...rest } = useQuery('get-roles', async () => {
    const response = await client(`authorities/list`, {})
    return response?.data
  })
  const options =
    data?.map(res => ({
      value: res?.name,
      label: res?.name,
      location: res?.location,
    })) || []
  return { data, options, ...rest }
}

export const useFetchRolesPermissions = roleName => {
  const client = useClient()

  return useQuery(
    ['get-roles-permissions', roleName],
    async () => {
      const response = await client(`authorities?name.in=${roleName}`, {})

      return response?.data
    },
    {
      enabled: !!roleName,
    },
  )
}

export const useFetchAllPermissions = () => {
  const client = useClient()

  return useQuery('all-permissions', async () => {
    const response = await client(`permissions`, {})

    return response?.data
  })
}

export const useCreateNewRoleMutation = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    payload => {
      return client('authorities', {
        data: payload,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['get-roles'])
        toast({
          title: 'Access Control',
          description: 'New Role has been created successfully',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save role.'
        toast({
          title: 'Access Control',
          position: 'top-left',
          description,
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useUpdateRoleMutation = roleName => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    payload => {
      return client('authorities', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['get-roles-permissions', roleName])
        toast({
          title: 'Access Control',
          description: 'New Role has been updated successfully',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save role.'
        toast({
          title: 'Access Control',
          position: 'top-left',
          description,
          status: 'error',
          isClosable: true,
        })
      },
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
]

export const LOCATIONS = [
  { value: 'All', label: 'All' },
  { value: 'REGION', label: 'Region' },
  { value: 'STATE', label: 'State' },
  { value: 'MARKET', label: 'Market' },
]

export const ASSIGNMENTS = [
  { value: 'All', label: 'All' },
  { value: 'FPM', label: 'FPM' },
  { value: 'PC', label: 'Project Coordinator' },
]

export const mapPermissionsToFormValues = permission => {
  const isAdmin = permission?.name === 'ROLE_ADMIN'
  const permissions = permission?.permissions
    ?.filter(p => {
      // select all permissions that are at module level like VENDOR.EDIT, PROJECT.EDIT
      const permissionKey = p.key
      const splitPermission = permissionKey.split('.')
      return splitPermission?.length === 2
    })
    ?.map(p => {
      const permissionKey = p.key
      const splitPermission = permissionKey.split('.')
      return { section: splitPermission?.[0], action: splitPermission?.[splitPermission?.length - 1] }
    })

  const sectionWisePermissions = [] as any
  SECTIONS?.forEach(s => {
    const permissionObj = permissions?.find(p => s.value === p.section && ['READ', 'EDIT'].includes(p.action))
    sectionWisePermissions?.push({
      name: s.value,
      edit: permissionObj?.action === 'EDIT' || isAdmin,
      read: permissionObj?.action === 'READ',
      hide: !permissionObj && !isAdmin,
    })
  })
  return sectionWisePermissions
}

export enum ADV_PERMISSIONS {
  fpmEdit = 'PROJECTDETAIL.CONTACT.FPM.EDIT',
  pcEdit = 'PROJECTDETAIL.CONTACT.PC.EDIT',
  clientEdit = 'PROJECTDETAIL.CONTACT.CLIENT.EDIT',
  addressEdit = 'PROJECTDETAIL.CONTACT.ADDRESS.EDIT',
  marketEdit = 'PROJECTDETAIL.CONTACT.MARKET.EDIT',
  gateCodeEdit = 'PROJECTDETAIL.CONTACT.GATECODE.EDIT',
  lockBoxEdit = 'PROJECTDETAIL.CONTACT.LOCKBOX.EDIT',
  clientDueEdit = 'PROJECTDETAIL.MGMT.CLIENTDUEDATE.EDIT',
  clientStartEdit = 'PROJECTDETAIL.MGMT.CLIENTSTART.EDIT',
  woaStartEdit = 'PROJECTDETAIL.MGMT.WOASTART.EDIT',
  verifyProjectEnable = 'PROJECTDETAIL.MGMT.PROJECTVERIFIED.EDIT',
  deactivateVendor = 'VENDOR.DEACTIVEVENDOR',
  transStatusEdit = 'PROJECTDETAIL.TRANSACTION.STATUS.EDIT',
  transPaidDateEdit = 'PROJECTDETAIL.TRANSACTION.PAIDDATE.EDIT',
  transPaymentReceivedEdit = 'PROJECTDETAIL.TRANSACTION.PAYMENTRECEIVED.EDIT',
  transInvoicedDateEdit = 'PROJECTDETAIL.TRANSACTION.INVOICEDATE.EDIT',
  futureDateEnabled = 'PROJECTDETAIL.TRANSACTION.FUTUREPAYMENT.EDIT',
  cancelWorkOrderEnable = 'PROJECTDETAIL.WORKORDER.CANCEL.EDIT',
}

export const mapFormValuestoPayload = (values, allPermissions) => {
  let permissions = values.permissions
    ?.filter(p => !p.hide && (p.edit || p.read)) //remove all hidden. And select ones that have edit or read true
    ?.map(p => {
      const key = p.name + '.' + (p.edit ? 'EDIT' : 'READ')
      return allPermissions?.find(a => a.key === key)
    })
  for (const key in values.advancedPermissions) {
    if (values.advancedPermissions[key]) {
      const permissionObj = allPermissions?.find(a => a.key === ADV_PERMISSIONS[key])
      permissions.push(permissionObj)
    }
  }

  return {
    name: values?.roleName,
    location: values?.location?.value,
    assignment: values?.assignment?.value,
    permissions,
  }
}

export const permissionsDefaultValues = ({ permissions }) => {
  const permission = permissions?.[0]
  const permissionSet = permission?.name === 'ROLE_ADMIN' ? ['ALL'] : permission?.permissions?.map(p => p.key)
  return {
    roleName: permission?.name ?? '',
    location: LOCATIONS?.find(l => l.value === permission?.location) ?? LOCATIONS[0],
    assignment: ASSIGNMENTS?.find(a => a.value === permission?.assignment) ?? ASSIGNMENTS[0],
    permissions: mapPermissionsToFormValues(permission),
    advancedPermissions: {
      fpmEdit: permissionSet?.some(p => [ADV_PERMISSIONS.fpmEdit, 'ALL'].includes(p)),
      pcEdit: permissionSet?.some(p => [ADV_PERMISSIONS.pcEdit, 'ALL'].includes(p)),
      clientEdit: permissionSet?.some(p => [ADV_PERMISSIONS.clientEdit, 'ALL'].includes(p)),
      addressEdit: permissionSet?.some(p => [ADV_PERMISSIONS.addressEdit, 'ALL'].includes(p)),
      marketEdit: permissionSet?.some(p => [ADV_PERMISSIONS.marketEdit, 'ALL'].includes(p)),
      gateCodeEdit: permissionSet?.some(p => [ADV_PERMISSIONS.gateCodeEdit, 'ALL'].includes(p)),
      lockBoxEdit: permissionSet?.some(p => [ADV_PERMISSIONS.lockBoxEdit, 'ALL'].includes(p)),
      clientDueEdit: permissionSet?.some(p => [ADV_PERMISSIONS.clientDueEdit, 'ALL'].includes(p)),
      clientStartEdit: permissionSet?.some(p => [ADV_PERMISSIONS.clientStartEdit, 'ALL'].includes(p)),
      woaStartEdit: permissionSet?.some(p => [ADV_PERMISSIONS.woaStartEdit, 'ALL'].includes(p)),
      verifyProjectEnable: permissionSet?.some(p => [ADV_PERMISSIONS.verifyProjectEnable, 'ALL'].includes(p)),
      deactivateVendor: permissionSet?.some(p => [ADV_PERMISSIONS.deactivateVendor, 'ALL'].includes(p)),
      transStatusEdit: permissionSet?.some(p => [ADV_PERMISSIONS.transStatusEdit, 'ALL'].includes(p)),
      transPaidDateEdit: permissionSet?.some(p => [ADV_PERMISSIONS.transPaidDateEdit, 'ALL'].includes(p)),
      transPaymentReceivedEdit: permissionSet?.some(p => [ADV_PERMISSIONS.transPaymentReceivedEdit, 'ALL'].includes(p)),
      transInvoicedDateEdit: permissionSet?.some(p => [ADV_PERMISSIONS.transInvoicedDateEdit, 'ALL'].includes(p)),
      futureDateEnabled: permissionSet?.some(p => [ADV_PERMISSIONS.futureDateEnabled, 'ALL'].includes(p)),
      cancelWorkOrderEnable: permissionSet?.some(p => [ADV_PERMISSIONS.cancelWorkOrderEnable, 'ALL'].includes(p)),
    },
  }
}
