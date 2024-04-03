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
      userTypeId: res?.userTypeId,
      assignment: res?.assignment,
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

export const useDeleteRole = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation(
    roleName => {
      return client(`authorities/${roleName}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['get-roles'])
        toast({
          title: 'Access Control',
          description: 'Role has been deleted successfully',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        console.log('Unable to delete role', error)
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
        queryClient.invalidateQueries(['get-roles'])
        toast({
          title: 'Access Control',
          description: 'Role has been updated successfully',
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
export const useGetSections = ({ isDevtekUser }) => {
  return [
    ...(isDevtekUser ? [{ value: 'ADMINDASHBOARD', label: 'Dashboard' }] : []),
    ...(isDevtekUser ? [{ value: 'VENDORDASHBOARD', label: 'Vendor Dashboard' }] : []),
    ...(isDevtekUser ? [{ value: 'VENDORDASHBOARDEST', label: 'Vendor Estimates Dashboard' }] : []),

    ...(isDevtekUser ? [{ value: 'MAINTENANCEPAYABLE', label: 'Maintenance Payable' }] : []),
    ...(isDevtekUser ? [{ value: 'MAINTENANCERECEIVABLE', label: 'Maintenance Receivable' }] : []),
    { value: 'ESTIMATE', label: 'Estimates' },
    { value: 'ESTPAYABLE', label: 'Estimates Payable' },
    { value: 'ESTRECEIVABLE', label: 'Estimates Receivable' },
    { value: 'PROJECT', label: 'Projects' },
    { value: 'PAYABLE', label: 'Payable' },
    { value: 'RECEIVABLE', label: 'Receivable' },
    { value: 'VENDOR', label: 'Vendors' },
    { value: 'CLIENT', label: 'Clients' },
    { value: 'PERFORMANCE', label: 'Performance' },
    { value: 'USERMANAGER', label: 'Users' },
    { value: 'MARKET', label: 'Markets' },
    { value: 'LOCATION', label: 'Locations' },
    { value: 'VENDORSKILL', label: 'Vendor Skills' },
    { value: 'CLIENTTYPE', label: 'Client Type' },
    { value: 'PROJECTTYPE', label: 'Project Type' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'MESSAGES', label: 'Messages' },
    ...(isDevtekUser ? [{ value: 'VENDORPROJECT', label: 'Vendor Projects' }] : []),
    ...(isDevtekUser ? [{ value: 'VENDORPROFILE', label: 'Vendor Profile' }] : []),
    ...(isDevtekUser ? [{ value: 'ALERT', label: 'Alerts' }] : []),
    ...(isDevtekUser ? [{ value: 'REPORT', label: 'Reports' }] : []),
  ]
}

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
  { value: 'VENDOR', label: 'Vendor' },
]

export const mapPermissionsToFormValues = (permission, sections) => {
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
  sections?.forEach(s => {
    const permissionObj = permissions?.find(p => s.value === p.section && ['READ', 'EDIT'].includes(p.action))
    sectionWisePermissions?.push({
      name: s.value,
      edit: permissionObj?.action === 'EDIT',
      read: permissionObj?.action === 'READ',
      hide: !permissionObj,
      label: s.label,
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
  verifyVendorDocuments = 'VENDOR.VERIFYDOCUMENTS',
  transStatusEdit = 'PROJECTDETAIL.TRANSACTION.STATUS.EDIT',
  transPaidDateEdit = 'PROJECTDETAIL.TRANSACTION.PAIDDATE.EDIT',
  transPaymentReceivedEdit = 'PROJECTDETAIL.TRANSACTION.PAYMENTRECEIVED.EDIT',
  transInvoicedDateEdit = 'PROJECTDETAIL.TRANSACTION.INVOICEDATE.EDIT',
  futureDateEnabled = 'PROJECTDETAIL.TRANSACTION.FUTUREPAYMENT.EDIT',
  cancelWorkOrderEnable = 'PROJECTDETAIL.WORKORDER.CANCEL.EDIT',
  hideCreateProject = 'PROJECT.CREATE.HIDE',
  hidePaidProjects = 'PROJECT.PAID.HIDE',
  overrideDrawRestrictionOnPercentageCompletion = 'PROJECTDETAIL.TRANSACTION.NTEPERCENTAGE.OVERRIDE',
  verifiedByFPM = 'PROJECTDETAIL.TRANSACTION.VERIFIEDBYFPM.EDIT',
  invoiceDateEdit = 'PROJECTDETAIL.INVOICING.INVOICEDATE.EDIT',
  invoiceEdit = 'PROJECTDETAIL.INVOICING.EDIT',
  enableConvertProject = 'ESTIMATEDETAIL.CONVERTPROJECT.ENABLE',
  estFpmEdit = 'ESTIMATEDETAILS.CONTACTS.FPM.EDIT',
  estGateCodeEdit = 'ESTIMATEDETAILS.CONTACTS.GATECODE.EDIT',
  estLockBoxEdit = 'ESTIMATEDETAILS.CONTACTS.LOCKBOX.EDIT',
  carrierFeeCreateInApprovedStatus = 'ESTIMATEDETAILS.TRANSACTION.CARRIERFEEONAPPROVED.ENABLE',
  invoiceDateEditEst = 'ESTIMATEDETAILS.INVOICING.INVOICEDATE.EDIT',
  invoiceEditEst = 'ESTIMATEDETAILS.INVOICING.EDIT',
  preInvoicingEdit = 'PREINVOICED.EDIT',
  vendorAccountsTabView = 'VENDOR.ACCOUNTS.EDIT'
}

export const mapFormValuestoPayload = (values, allPermissions) => {
  console.log('allPermissions', allPermissions)
  let permissions = values.permissions
    ?.filter(p => !p.hide && (p.edit || p.read)) //remove all hidden. And select ones that have edit or read true
    ?.map(p => {
      const key = p.name + '.' + (p.edit ? 'EDIT' : 'READ')
      return allPermissions?.find(a => a.key === key)
    })

  for (const key in values.advancedPermissionsCons) {
    if (values.advancedPermissionsCons[key]) {
      const permissionObj = allPermissions?.find(a => a.key === ADV_PERMISSIONS[key])
      permissions.push(permissionObj)
    }
  }
  for (const key in values.advancedPermissionsEst) {
    if (values.advancedPermissionsEst[key]) {
      const permissionObj = allPermissions?.find(a => a.key === ADV_PERMISSIONS[key])
      permissions.push(permissionObj)
    }
  }

  return {
    name: values?.roleName,
    location: values?.location?.value,
    assignment: values?.assignment?.value,
    systemRole: values?.systemRole,
    userTypeId: 0,
    permissions,
  }
}

export const permissionsDefaultValues = ({ permissions, sections }) => {
  const permission = permissions?.[0]
  const permissionSet = permission?.name === 'SYSTEM_ROLE' ? ['ALL'] : permission?.permissions?.map(p => p.key)
  let advancedPermissionsCons = []
  let advancedPermissionsEst = []
  advancedPermissions.advancedPermissionsCons.forEach(p => {
    if (p === 'hideCreateProject' || p === 'hidePaidProjects') {
      advancedPermissionsCons[p] = permissionSet?.some(ps => [ADV_PERMISSIONS.hideCreateProject].includes(ps))
    } else {
      advancedPermissionsCons[p] = permissionSet?.some(ps => [ADV_PERMISSIONS[p], 'ALL'].includes(ps))
    }
  })
  advancedPermissions.advancedPermissionsEst.forEach(p => {
    advancedPermissionsEst[p] = permissionSet?.some(ps => [ADV_PERMISSIONS[p], 'ALL'].includes(ps))
  })
  return {
    roleName: permission?.name ?? '',
    location: LOCATIONS?.find(l => l.value === permission?.location) ?? LOCATIONS[0],
    assignment: ASSIGNMENTS?.find(a => a.value === permission?.assignment) ?? ASSIGNMENTS[0],
    permissions: mapPermissionsToFormValues(permission, sections),
    systemRole: permission?.systemRole,
    advancedPermissionsCons,
    advancedPermissionsEst,
  }
}

export const setDefaultPermission = ({ setValue, sectionPermission, assignment }) => {
  let defaultPermissions = [] as any
  sectionPermission.forEach(section => {
    if (section.isEdit) {
      defaultPermissions = [...defaultPermissions, ...DEFAULTPERMISSIONS[section.name][assignment]]
    }
  })
  advancedPermissions.advancedPermissionsEst.forEach(p => {
    if (defaultPermissions.includes(p)) setValue(`advancedPermissionsEst.${p}`, true)
    else setValue(`advancedPermissionsEst.${p}`, false)
  })
  advancedPermissions.advancedPermissionsCons.forEach(p => {
    if (defaultPermissions.includes(p)) setValue(`advancedPermissionsCons.${p}`, true)
    else setValue(`advancedPermissionsCons.${p}`, false)
  })
}

const DEFAULTPERMISSIONS = {
  PROJECT: {
    FPM: ['gateCodeEdit', 'lockBoxEdit', 'hideCreateProject', 'hidePaidProjects', 'verifiedByFPM'],
    PC: [
      'fpmEdit',
      'pcEdit',
      'clientEdit',
      'addressEdit',
      'marketEdit',
      'gateCodeEdit',
      'lockBoxEdit',
      'clientDueEdit',
      'clientStartEdit',
      'woaStartEdit',
      'verifyProjectEnable',
      'preInvoicingEdit'
    ],
    All: [
      'fpmEdit',
      'pcEdit',
      'clientEdit',
      'addressEdit',
      'marketEdit',
      'gateCodeEdit',
      'lockBoxEdit',
      'clientDueEdit',
      'clientStartEdit',
      'woaStartEdit',
      'verifyProjectEnable',
    ],
    VENDOR: [],
  },

  VENDOR: {
    PC: ['verifyVendorDocuments', 'deactivateVendor'],
    VENDOR: [],
    All: ['verifyVendorDocuments', 'deactivateVendor'],
    FPM: [],
  },
  ESTIMATE: {
    FPM: ['estLockBoxEdit', 'estGateCodeEdit'],
    PC: ['estLockBoxEdit', 'estGateCodeEdit', 'enableConvertProject'],
    All: ['estLockBoxEdit', 'estGateCodeEdit', 'enableConvertProject'],
    VENDOR: [],
  },
}

const advancedPermissions = {
  advancedPermissionsCons: [
    'fpmEdit',
    'pcEdit',
    'clientEdit',
    'addressEdit',
    'marketEdit',
    'gateCodeEdit',
    'lockBoxEdit',
    'clientDueEdit',
    'clientStartEdit',
    'woaStartEdit',
    'verifyProjectEnable',
    'deactivateVendor',
    'transStatusEdit',
    'transPaidDateEdit',
    'transPaymentReceivedEdit',
    'transInvoicedDateEdit',
    'futureDateEnabled',
    'cancelWorkOrderEnable',
    'hideCreateProject',
    'hidePaidProjects',
    'overrideDrawRestrictionOnPercentageCompletion',
    'verifyVendorDocuments',
    'verifiedByFPM',
    'invoiceDateEdit',
    'invoiceEdit',
    'preInvoicingEdit',
    'vendorAccountsTabView'
  ],
  advancedPermissionsEst: [
    'enableConvertProject',
    'estFpmEdit',
    'estGateCodeEdit',
    'estLockBoxEdit',
    'carrierFeeCreateInApprovedStatus',
    'invoiceDateEditEst',
    'invoiceEditEst',
  ],
}
