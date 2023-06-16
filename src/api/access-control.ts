import { useToast } from '@chakra-ui/toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
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
  { value: 'CYPRESSREPORT', label: 'Cypress Report' },
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

export const mapPermissionsToFormValues = permissionsArray => {
  const permissions = permissionsArray
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
      edit: permissionObj?.action === 'EDIT',
      read: permissionObj?.action === 'READ',
      hide: !permissionObj,
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
  const permissionSet = permission?.permissions?.map(p => p.key)
  return {
    roleName: permission?.name ?? '',
    location: LOCATIONS?.find(l => l.value === permission?.location) ?? LOCATIONS[0],
    assignment: ASSIGNMENTS?.find(a => a.value === permission?.assignment) ?? ASSIGNMENTS[0],
    permissions: mapPermissionsToFormValues(permission?.permissions),
    advancedPermissions: {
      fpmEdit: permissionSet?.includes(ADV_PERMISSIONS.fpmEdit),
      pcEdit: permissionSet?.includes(ADV_PERMISSIONS.pcEdit),
      clientEdit: permissionSet?.includes(ADV_PERMISSIONS.clientEdit),
      addressEdit: permissionSet?.includes(ADV_PERMISSIONS.addressEdit),
      marketEdit: permissionSet?.includes(ADV_PERMISSIONS.marketEdit),
      gateCodeEdit: permissionSet?.includes(ADV_PERMISSIONS.gateCodeEdit),
      lockBoxEdit: permissionSet?.includes(ADV_PERMISSIONS.lockBoxEdit),
      clientDueEdit: permissionSet?.includes(ADV_PERMISSIONS.clientDueEdit),
      clientStartEdit: permissionSet?.includes(ADV_PERMISSIONS.clientStartEdit),
      woaStartEdit: permissionSet?.includes(ADV_PERMISSIONS.woaStartEdit),
      verifyProjectEnable: permissionSet?.includes(ADV_PERMISSIONS.verifyProjectEnable),
      deactivateVendor: permissionSet?.includes(ADV_PERMISSIONS.deactivateVendor),
      transStatusEdit: permissionSet?.includes(ADV_PERMISSIONS.transStatusEdit),
      transPaidDateEdit: permissionSet?.includes(ADV_PERMISSIONS.transPaidDateEdit),
      transPaymentReceivedEdit: permissionSet?.includes(ADV_PERMISSIONS.transPaymentReceivedEdit),
      transInvoicedDateEdit: permissionSet?.includes(ADV_PERMISSIONS.transInvoicedDateEdit),
      futureDateEnabled: permissionSet?.includes(ADV_PERMISSIONS.futureDateEnabled),
      cancelWorkOrderEnable: permissionSet?.includes(ADV_PERMISSIONS.cancelWorkOrderEnable),
    },
  }
}
