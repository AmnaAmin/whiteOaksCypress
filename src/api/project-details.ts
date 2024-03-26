import { useToast } from '@chakra-ui/react'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { OPTIONS, PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS } from 'constants/project-details.constants'
import { useContext, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Client, ErrorType, ProjectType, State, User } from 'types/common.types'
import {
  DocumentPayload,
  OverPaymentType,
  ProjectDetailsAPIPayload,
  ProjectDetailsFormValues,
  ProjectStatus,
  ResubmissionListItem,
} from 'types/project-details.types'
import { Market, Project, ProjectExtraAttributesType } from 'types/project.type'
import { SelectOption } from 'types/transaction.type'
import { useClient } from 'utils/auth-context'
import { dateISOFormat, datePickerFormat, getLocalTimeZoneDate } from 'utils/date-time-utils'
import { createDocumentPayload } from 'utils/file-utils'
import { PROJECT_EXTRA_ATTRIBUTES } from './pc-projects'
import { PROJECT_FINANCIAL_OVERVIEW_API_KEY } from './projects'
import { GET_TRANSACTIONS_API_KEY } from './transactions'
import { AuditLogType } from 'types/common.types'
import { PROJECT_STATUS } from 'features/common/status'
import { readFileContent } from './vendor-details'
import { ReceivableContext } from 'features/recievable/construction-portal-receiveable'

export const useGetOverpayment = (projectId: number | null) => {
  const client = useClient()

  return useQuery<OverPaymentType>(
    ['overpayment', projectId],
    async () => {
      const response = await client(`change-orders/${projectId}/113/PENDING`, {})

      return response?.data
    },
    { enabled: !!projectId },
  )
}

export const useGetStateSelectOptions = () => {
  const client = useClient()

  const { data: states, ...rest } = useQuery<State[]>('states', async () => {
    const response = await client(`states?page=0&sort=name,asc`, {})

    return response?.data
  })

  const stateSelectOptions =
    states?.map(state => ({
      value: state.code,
      label: state.name,
    })) || []

  return { stateSelectOptions, ...rest }
}

export const useGetMarketSelectOptions = () => {
  const client = useClient()

  const { data: markets, ...rest } = useQuery<Market[]>('markets', async () => {
    const response = await client(`markets?page=0&sort=name,asc`, {})

    return response?.data
  })

  const marketSelectOptions =
    markets?.map((market: Market) => ({
      value: market.id,
      label: market.stateName,
    })) || []

  return { marketSelectOptions, ...rest }
}

export const useGetUsersByType = (userType: number) => {
  const client = useClient()

  const { data: users, ...rest } = useQuery<User[]>(['users', userType], async () => {
    const temp = `users/v2/usertype/${userType}`
    const response = await client(`${temp}`, {})
    return response?.data
  })

  const userSelectOptions =
    users?.map((user: User) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    })) || []

  return {
    userSelectOptions,
    users,
    ...rest,
  }
}

export const useGetProjectTypeSelectOptions = () => {
  const client = useClient()

  const { data: Projects, ...rest } = useQuery<ProjectType[]>('project-types', async () => {
    const response = await client(`project_type`, {})

    return response?.data
  })

  const projectTypeSelectOptions =
    Projects?.map((project: ProjectType) => ({
      value: project.id,
      label: project.value,
    })) || []

  return { projectTypeSelectOptions, ...rest }
}

export const useGetClientSelectOptions = () => {
  const client = useClient()

  const { data: clients, ...rest } = useQuery<Client[]>('clients', async () => {
    const response = await client(`clients?activated.equals=true&sort=companyName,asc`, {})

    return response?.data
  })

  const clientSelectOptions =
    clients?.map((client: Client) => ({
      value: client.id,
      label: client.companyName,
      carrier: client.carrier,
      paymentTerm: client.paymentTerm,
    })) || []

  return { clientSelectOptions, ...rest }
}

export const useProjectDetailsUpdateMutation = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  const receiveableFormReturn = useContext(ReceivableContext)

  return useMutation(
    (payload: ProjectDetailsAPIPayload) => {
      return client(`projects`, {
        method: 'PUT',
        data: payload,
      })
    },
    {
      onSuccess: project => {
        const projectId = `${project?.data?.id}`

        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['overpayment', project?.data?.id])
        queryClient.invalidateQueries([PROJECT_EXTRA_ATTRIBUTES, project?.data?.id])
        queryClient.invalidateQueries([GET_TRANSACTIONS_API_KEY, projectId])
        queryClient.invalidateQueries([PROJECT_FINANCIAL_OVERVIEW_API_KEY, projectId])
        queryClient.invalidateQueries(['audit-logs', projectId])
        queryClient.invalidateQueries(['invoicesDetail', projectId])
        queryClient.invalidateQueries(['properties'])
        queryClient.invalidateQueries('paymentSourcesUpdate')
        receiveableFormReturn?.resetField('id')
        receiveableFormReturn?.setValue('selected', [])
        receiveableFormReturn?.resetField('selected')

        toast({
          title: 'Project Details Updated',
          description: 'Project details updated successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: ErrorType) {
        toast({
          title: error?.title || 'Something went wrong',
          description: error?.message || 'Something went wrong in project details update',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}
export const statusArrayApplicableforCurrentStatus = (isvalidForAwaitingPunch: Boolean) => {
  const statusArray = PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS
  if (isvalidForAwaitingPunch) {
    statusArray[ProjectStatus.Awaitingpunch] = [
      OPTIONS[ProjectStatus.Active],
      OPTIONS[ProjectStatus.Awaitingpunch],
      OPTIONS[ProjectStatus.Punch],
      OPTIONS[ProjectStatus.Disputed],
      OPTIONS[ProjectStatus.Cancelled],
    ]
    statusArray[ProjectStatus.Active] = [OPTIONS[ProjectStatus.Active], OPTIONS[ProjectStatus.Awaitingpunch]]
  }
  return statusArray
}
export const getProjectStatusSelectOptions = () => {
  return Object.entries(ProjectStatus).map(([key, value]) => ({
    value: value,
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  }))
}

export const useProjectStatusSelectOptions = (project: Project, isAdmin?: boolean) => {
  return useMemo(() => {
    if (!project) return []
    const isvalidForAwaitingPunch = project?.validForAwaitingPunchStatus
    const projectStatusId = project.projectStatusId
    const numberOfWorkOrders = project.numberOfWorkOrders
    const numberOfCompletedWorkOrders = project.numberOfCompletedWorkOrders
    const numberOfPaidWorkOrders = project.numberOfPaidWorkOrders
    const sowNewAmount = project.sowNewAmount || 0
    const partialPayment = project.partialPayment || 0

    if (!projectStatusId) return []

    //      let projectStatusSelectOptions =PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS[projectStatusId] || []
    // if (isvalidForAwaitingPunch){
    //    projectStatusSelectOptions = PROJECT_STATUSES_ASSOCIATE_WITH_NEW_CURRENT_STATUS[projectStatusId] || []
    // }
    const projectStatusSelectOptions =
      statusArrayApplicableforCurrentStatus(isvalidForAwaitingPunch)[projectStatusId] || []

    const selectOptionWithDisableEnabled = projectStatusSelectOptions.map((selectOption: SelectOption) => {
      const optionValue = selectOption?.value

      // if project in new status and there are zero work orders then
      // active status should be disabled
      if (numberOfWorkOrders === 0 && projectStatusId === ProjectStatus.New && optionValue === ProjectStatus.Active) {
        return {
          ...selectOption,
          label: `${selectOption.label} (Minimum 1 Workorder Required)`,
          disabled: true,
        }
      }
      // if Project status is Active and some workorders are not completed then
      // Project Awaiting punch status should be disabled
      if (
        numberOfWorkOrders !== numberOfCompletedWorkOrders &&
        isvalidForAwaitingPunch &&
        projectStatusId === ProjectStatus.Active &&
        optionValue === ProjectStatus.Awaitingpunch
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (All Workorders must be completed)`,
          disabled: true,
        }
      }
      // if Project status is Active and some workorders are not completed then
      // Project  punch status should be disabled
      if (
        numberOfWorkOrders !== numberOfCompletedWorkOrders &&
        projectStatusId === ProjectStatus.Active &&
        optionValue === ProjectStatus.Punch
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (All Workorders must be completed)`,
          disabled: true,
        }
      }

      // if Project status is Reconcile
      // Project Close status should be disabled
      //projectStatusId === ProjectStatus.Reconcile || projectStatusId === ProjectStatus.Punch
      if (!project.isReconciled && optionValue === ProjectStatus.Closed) {
        return {
          ...selectOption,
          label: `${selectOption.label} (Verification required)`,
          disabled: true,
        }
      }

      // If project status is Client Paid and there are some workOrders not paid then
      // project status Paid should be disabled
      if (
        numberOfPaidWorkOrders !== numberOfWorkOrders && //AM || WOA-4187
        projectStatusId === ProjectStatus.ClientPaid &&
        optionValue === ProjectStatus.Paid
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (All Vendor WO must be paid)`,
          disabled: true,
        }
      }

      // If Project Status is OverPayment and there are some workOrders not paid then project status Paid should be disabled

      if (
        numberOfPaidWorkOrders !== numberOfWorkOrders &&
        projectStatusId === ProjectStatus.Overpayment &&
        optionValue === ProjectStatus.Paid
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (All Vendor WO must be paid)`,
          disabled: true,
        }
      }

      // if project status is Invoiced and remaining payment is not zero then
      // also if there is pending draw transaction, then client paid will be disabled
      // project status Paid should be disabled
      if (
        sowNewAmount - partialPayment > 0 &&
        projectStatusId === ProjectStatus.Invoiced &&
        optionValue === ProjectStatus.ClientPaid
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (Remaining Payment must be $0)`,
          disabled: true,
        }
      }

      // if project status is Disputed and remaining payment is not zero then
      // also if there is pending draw transaction, then client paid will be disabled
      // project status Paid should be disabled
      if (
        sowNewAmount - partialPayment > 0 &&
        projectStatusId === ProjectStatus.Disputed &&
        optionValue === ProjectStatus.ClientPaid
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (Remaining Payment must be $0)`,
          disabled: true,
        }
      }

      // If project status is Overpayment and there are some workorders not paid then
      // project status Paid should be disabled
      if (
        numberOfWorkOrders !== numberOfCompletedWorkOrders &&
        projectStatusId === ProjectStatus.Overpayment &&
        optionValue === ProjectStatus.Paid
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (You have pending transactions)`,
          disabled: true,
        }
      }

      if (!isAdmin && optionValue === ProjectStatus.Invoiced) {
        return {
          ...selectOption,
          label: `${selectOption.label}`,
          disabled: true,
        }
      }

      return selectOption
    })

    return selectOptionWithDisableEnabled
  }, [project])
}

export const useProjectOverrideStatusSelectOptions = projectData => {
  let overrideProjectStatusOptions
  const projectStatusId = projectData?.projectStatusId
  const previousProjectStatus = projectData?.previousStatus
  const selectOption = { value: null, label: 'Select' }
  const isvalidForAwaitingPunch = projectData?.validForAwaitingPunchStatus
  return useMemo(() => {
    if (!projectStatusId) return []
    // Setting Override Status dropdown on the basis of Project Status
    if (projectStatusId !== undefined) {
      overrideProjectStatusOptions = []
      // Project Status -> Active
      if (projectStatusId === Number(PROJECT_STATUS.active.value)) {
        overrideProjectStatusOptions = [selectOption, PROJECT_STATUS.new, PROJECT_STATUS.disputed]
      }
      // Project Status -> Awaiting Punch
      else if (projectStatusId === Number(PROJECT_STATUS.awaitingpunch.value)) {
        overrideProjectStatusOptions = [selectOption, PROJECT_STATUS.new, PROJECT_STATUS.active]
      }
      // Project Status -> Punch
      else if (projectStatusId === Number(PROJECT_STATUS.punch.value)) {
        overrideProjectStatusOptions = [
          selectOption,
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          isvalidForAwaitingPunch ? PROJECT_STATUS.awaitingpunch : PROJECT_STATUS.disputed,
        ]
      }
      // Project Status -> Reconcile
      else if (projectStatusId === Number(PROJECT_STATUS.reconcile.value)) {
        overrideProjectStatusOptions = [selectOption, PROJECT_STATUS.new, PROJECT_STATUS.active, PROJECT_STATUS.punch]
      }
      // Project Status -> Closed
      else if (projectStatusId === Number(PROJECT_STATUS.closed.value)) {
        overrideProjectStatusOptions = [
          selectOption,
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          PROJECT_STATUS.punch,
          PROJECT_STATUS.disputed,
        ]

        if (isvalidForAwaitingPunch) {
          overrideProjectStatusOptions.push(PROJECT_STATUS.awaitingpunch)
        }
      }

      // Project Status -> Invoiced
      else if (projectStatusId === Number(PROJECT_STATUS.invoiced.value)) {
        overrideProjectStatusOptions = [
          selectOption,
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          PROJECT_STATUS.punch,
          PROJECT_STATUS.closed,
          PROJECT_STATUS.disputed,
        ]
      }
      // Project Status -> Paid
      else if (projectStatusId === Number(PROJECT_STATUS.paid.value)) {
        overrideProjectStatusOptions = [
          selectOption,
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          PROJECT_STATUS.punch,
          PROJECT_STATUS.closed,
          PROJECT_STATUS.invoiced,
          PROJECT_STATUS.clientPaid,
          PROJECT_STATUS.disputed,
        ]
      }
      // Project Status -> Client Paid
      else if (projectStatusId === Number(PROJECT_STATUS.clientPaid.value)) {
        overrideProjectStatusOptions = [
          selectOption,
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          PROJECT_STATUS.punch,
          PROJECT_STATUS.closed,
          PROJECT_STATUS.invoiced,
          PROJECT_STATUS.disputed,
        ]
      }
      // Project Status -> Disputed
      // In case of disputed, all the cases will be implemented on the basis of previous Status
      else if (projectStatusId === Number(PROJECT_STATUS.disputed.value)) {
        overrideProjectStatusOptions = [selectOption, PROJECT_STATUS.reconcile, PROJECT_STATUS.awaitingpunch]
        // Last Project Status -> Active
        if (previousProjectStatus === Number(PROJECT_STATUS.active.value)) {
          overrideProjectStatusOptions = [
            selectOption,
            PROJECT_STATUS.new,
            PROJECT_STATUS.active,
            PROJECT_STATUS.disputed,
          ]
        }
        // Last Project Status -> Punch
        else if (previousProjectStatus === Number(PROJECT_STATUS.punch.value)) {
          overrideProjectStatusOptions = [
            selectOption,
            PROJECT_STATUS.new,
            PROJECT_STATUS.active,
            PROJECT_STATUS.punch,
            PROJECT_STATUS.disputed,
          ]
        }
        // Last Project Status -> Closed
        else if (previousProjectStatus === Number(PROJECT_STATUS.closed.value)) {
          overrideProjectStatusOptions = [
            selectOption,
            PROJECT_STATUS.new,
            PROJECT_STATUS.active,
            PROJECT_STATUS.punch,
            PROJECT_STATUS.closed,
            PROJECT_STATUS.disputed,
          ]
        }
        // Last Project Status -> Invoiced
        else if (previousProjectStatus === Number(PROJECT_STATUS.invoiced.value)) {
          overrideProjectStatusOptions = [
            selectOption,
            PROJECT_STATUS.new,
            PROJECT_STATUS.active,
            PROJECT_STATUS.punch,
            PROJECT_STATUS.closed,
            PROJECT_STATUS.invoiced,
            PROJECT_STATUS.disputed,
          ]
        }
        // Last Project Status -> Paid
        else if (previousProjectStatus === Number(PROJECT_STATUS.paid.value)) {
          overrideProjectStatusOptions = [
            selectOption,
            PROJECT_STATUS.new,
            PROJECT_STATUS.active,
            PROJECT_STATUS.punch,
            PROJECT_STATUS.closed,
            PROJECT_STATUS.invoiced,
            PROJECT_STATUS.clientPaid,
            PROJECT_STATUS.paid,
            PROJECT_STATUS.disputed,
          ]
        }
        // Last Project Status -> Client Paid
        else if (previousProjectStatus === Number(PROJECT_STATUS.clientPaid.value)) {
          overrideProjectStatusOptions = [
            selectOption,
            PROJECT_STATUS.new,
            PROJECT_STATUS.active,
            PROJECT_STATUS.punch,
            PROJECT_STATUS.closed,
            PROJECT_STATUS.invoiced,
            PROJECT_STATUS.clientPaid,
            PROJECT_STATUS.disputed,
          ]
        }
        // Last Project Status -> Reconcile
        else if (previousProjectStatus === Number(PROJECT_STATUS.reconcile.value)) {
          overrideProjectStatusOptions = [selectOption, PROJECT_STATUS.new, PROJECT_STATUS.active, PROJECT_STATUS.punch]
        }
        // Last Project Status -> Overpayment
        else if (previousProjectStatus === Number(PROJECT_STATUS.overpayment.value)) {
          overrideProjectStatusOptions = [
            selectOption,
            PROJECT_STATUS.new,
            PROJECT_STATUS.active,
            PROJECT_STATUS.punch,
            PROJECT_STATUS.closed,
            PROJECT_STATUS.invoiced,
            PROJECT_STATUS.disputed,
          ]
        }
      }
    }
    return overrideProjectStatusOptions
  }, [projectData, projectStatusId])
}

const PAYMENT_TERMS = [7, 10, 15, 30]

export const getPaymentTermsSelectOptions = () => {
  return PAYMENT_TERMS.map(paymentTerm => ({
    value: paymentTerm,
    label: `${paymentTerm}`,
  }))
}

export const parseFormValuesFromAPIData = ({
  project,
  projectExtraAttributes,
  projectTypeSelectOptions,
  projectCoordinatorSelectOptions,
  projectManagerSelectOptions,
  clientSelectOptions,
  overPayment,
  stateSelectOptions,
  marketSelectOptions,
  propertySelectOptions,
  clientTypesSelectOptions,
  paymentSourceOptions,
}: {
  project?: Project
  paymentSourceOptions?: any
  projectExtraAttributes?: ProjectExtraAttributesType
  overPayment?: OverPaymentType
  projectTypeSelectOptions?: SelectOption[]
  projectCoordinatorSelectOptions?: SelectOption[]
  projectManagerSelectOptions?: SelectOption[]
  clientSelectOptions?: SelectOption[]
  stateSelectOptions?: any
  marketSelectOptions?: SelectOption[]
  propertySelectOptions: SelectOption[]
  clientTypesSelectOptions: SelectOption[]
}): ProjectDetailsFormValues | Object => {
  if (
    !project ||
    !projectTypeSelectOptions ||
    !projectCoordinatorSelectOptions ||
    !projectManagerSelectOptions ||
    !clientSelectOptions ||
    !clientTypesSelectOptions ||
    !stateSelectOptions ||
    !marketSelectOptions
  ) {
    return {}
  }

  const findOptionByValue = (options: SelectOption[], value: string | number | null): SelectOption | null =>
    options.find(option => option.value === value) || null

  // Due to corrupt data, getting state on the basis of id and code so using both the values
  const stateValue = stateSelectOptions?.find(b => b?.value === project?.state)
  const stateIdValue = stateSelectOptions?.find(b => b?.id === Number(project?.state))

  const marketValue = marketSelectOptions?.find(b => b?.label === project?.market)

  const projectStatusSelectOptions = getProjectStatusSelectOptions()
  const remainingPayment = project.accountRecievable || 0
  const carrier = findOptionByValue(
    clientSelectOptions,
    typeof project.clientName === 'string' ? project.clientName?.trim() : project.clientName,
  )?.carrier?.find(c => c.id === project.carrierId)

  return {
    // Project Management form values
    status: findOptionByValue(projectStatusSelectOptions, project.projectStatusId),
    type: findOptionByValue(projectTypeSelectOptions, project.projectType),
    woNumber: project.woNumber,
    poNumber: project.poNumber,
    projectName: project.name,
    woaStartDate: project.woaStartDate as string,
    woaCompletionDate: datePickerFormat(project.woaCompletionDate as string),
    clientStartDate: project.clientStartDate as string,
    clientDueDate: project.clientDueDate as string,
    clientWalkthroughDate: project.clientWalkthroughDate as string,
    clientSignOffDate: project.clientSignoffDate as string,
    claimNumber: project.claimNumber,
    reoNumber: project.reoNumber,
    overrideProjectStatus: '',
    isReconciled: project.isReconciled as boolean,
    awaitingPunchDate: project.awaitingPunchDate as string,
    reconcileDate: project.reconcileDate as string,
    verifiedDate: project.verifiedDate as string,
    reconciledBy: project.reconciledBy as string,
    verifiedBy: project.verifiedBy as string,
    verifiedbyDesc: project.verifiedbyDesc as string,
    reconciledbyDesc: project.reconciledbyDesc as string,
    projectClosedDueDate: datePickerFormat(project.projectClosedDueDate),
    lienFiled: datePickerFormat(project.lienRightFileDate),
    lienExpiryDate: datePickerFormat(project?.lienRightExpireDate),
    paymentSource: paymentSourceOptions,

    // Project Invoice and Payment form values
    originalSOWAmount: project.sowOriginalContractAmount,
    sowLink: project.sowLink,
    finalSOWAmount: project.sowNewAmount,
    invoiceNumber: project.invoiceNumber,
    invoiceAttachment: project.documents?.[0],
    invoiceBackDate: getLocalTimeZoneDate(project.woaBackdatedInvoiceDate as string),
    invoiceLink: project.invoiceLink,
    paymentTerms: findOptionByValue(PAYMENT_TERMS_OPTIONS, project.paymentTerm),
    //woaInvoiceDate: getLocalTimeZoneDate(project.woaInvoiceDate as string),
    woaExpectedPayDate: project.expectedPaymentDate as string,
    overPayment: overPayment?.sum,
    remainingPayment: remainingPayment < 0 ? 0 : remainingPayment,
    payment: '',
    depreciation: '',
    resubmittedInvoice: project?.resubmissionDTOList?.map(r => {
      return {
        id: r.id,
        docId: r.docId,
        docUrl: r.docUrl,
        projectId: r.projectId,
        notificationDate: datePickerFormat(r.resubmissionNotificationDate),
        resubmissionDate: datePickerFormat(r.resubmissionDate),
        paymentTerms: findOptionByValue(PAYMENT_TERMS_OPTIONS, r.resubmissionPaymentTerm),
        dueDate: datePickerFormat(r.resubmissionDueDate),
        invoiceNumber: r.resubmissionInvoiceNumber,
      }
    }),
    // Contacts form values
    projectCoordinator: findOptionByValue(projectCoordinatorSelectOptions, project.projectCoordinatorId),
    projectCoordinatorPhoneNumber: project.pcPhoneNumber,
    projectCoordinatorExtension: project.pcPhoneNumberExtension,
    fieldProjectManager: findOptionByValue(projectManagerSelectOptions, project.projectManagerId),
    fieldProjectManagerPhoneNumber: project.projectManagerPhoneNumber,
    fieldProjectManagerExtension: project.pmPhoneNumberExtension,
    superName: project.superFirstName,
    superPhoneNumber: project.superPhoneNumber,
    superPhoneNumberExtension: project.superPhoneNumberExtension,
    superEmail: project.superEmailAddress,
    client: clientSelectOptions?.find(c => c?.label === project?.clientName?.trim()),
    clientType: findOptionByValue(clientTypesSelectOptions, project.clientTypeId),
    homeOwnerName: project.homeOwnerName,
    homeOwnerPhone: project.homeOwnerPhone,
    homeOwnerEmail: project.homeOwnerEmail,
    carrier: !!carrier ? { label: carrier?.name, value: carrier?.id } : null,
    agentName: project.agentName,
    carrierName: project.carrier?.label ? project.carrier?.label : project?.carrierName,
    agentPhone: project.agentPhone,
    agentEmail: project.agentEmail,
    preInvoiced: project.preInvoiced ?? false,

    // Location Form values
    address: findOptionByValue(propertySelectOptions, project?.propertyId),
    city: project.city,
    state: stateValue ? stateValue : stateIdValue,
    zip: project.zipCode,
    market: marketValue,
    gateCode: project.gateCode,
    lockBoxCode: project.lockBoxCode,
    hoaContactEmail: project.hoaEmailAddress,
    hoaContactPhoneNumber: project.hoaPhone,
    hoaContactExtension: project.hoaPhoneNumberExtension,
    property: findOptionByValue(propertySelectOptions, project?.propertyId)?.property,

    // Misc form values
    dateCreated: getLocalTimeZoneDate(project.createdDate as string),
    activeDate: getLocalTimeZoneDate(projectExtraAttributes?.activeDate as string),
    punchDate: getLocalTimeZoneDate(projectExtraAttributes?.punchDate as string),
    closedDate: getLocalTimeZoneDate(project.projectClosedDate as string),
    clientPaidDate: getLocalTimeZoneDate(project.clientPaidDate as string),
    collectionDate: getLocalTimeZoneDate(projectExtraAttributes?.collectionDate as string),
    disputedDate: getLocalTimeZoneDate(project?.disputedDate as string),
    woaPaidDate: getLocalTimeZoneDate(project.woaPaidDate as string),
    dueDateVariance: project.dueDateVariance,
    disqualifiedRevenueDate: datePickerFormat(project.disqualifiedRevenueDate),
    emailNotificationDate: datePickerFormat(project.emailNotificationDate),
    disqualifiedRevenueFlag: project.disqualifiedRevenueFlag,

    payDateVariance: project.signoffDateVariance,
    payVariance: project.woaPayVariance,
  }
}
export const usePaymentSourceOptions = (projectId) => {
  const client = useClient()

  const { data: paymentSource} = useQuery(
    'paymentSourcesUpdate',
    async () => {
     
        const response = await client(`projects/${projectId}/paymentSources`, {})
        return response?.data
     
    },
    { enabled: !!projectId } 
  )

  // Map paymentSource data to required format
  const options = paymentSource?.map((type) => ({
    label: type.lookupValueValue,
    value: type.lookupValueId,
  }))

  return  options 
}

const removePropertiesFromObject = (obj: Project, properties: string[]): Project => {
  const newObj = { ...obj }
  properties.forEach(property => delete newObj[property])
  return newObj
}

export const parseProjectDetailsPayloadFromFormData = async (
  formValues: ProjectDetailsFormValues,
  project: Project,
): Promise<ProjectDetailsAPIPayload> => {
  const projectPayload = removePropertiesFromObject(project, ['projectManager'])
  let documents: Array<DocumentPayload> = []

  if (formValues?.invoiceAttachment) {
    documents[0] = await createDocumentPayload(formValues.invoiceAttachment)
  }

  const isNewAddress = formValues?.address?.__isNew__

  const property = {
    streetAddress: formValues?.address?.label || null,
    city: formValues?.city,
    state: formValues?.state?.value,
    zipCode: formValues?.zip,
  }

  const resubmissionList = await Promise.all(
    formValues?.resubmittedInvoice?.map(async r => {
      let documentDTO
      if (r?.uploadedInvoice) {
        const uploadedInvoice = await readFileContent(r?.uploadedInvoice)
        documentDTO = {
          documentType: 39,
          fileObjectContentType: r.uploadedInvoice.type,
          fileType: r.uploadedInvoice.name,
          fileObject: uploadedInvoice,
        }
      }
      return {
        docId: r.docId,
        docUrl: r.docUrl,
        id: r.id,
        projectId: project?.id,
        resubmissionNotificationDate: r.notificationDate,
        resubmissionDate: r.resubmissionDate,
        resubmissionDueDate: r.dueDate,
        resubmissionPaymentTerm: r.paymentTerms?.value,
        resubmissionInvoiceNumber: r.invoiceNumber,
        documentDTO: documentDTO,
      } as ResubmissionListItem
    }),
  )

  return {
    ...projectPayload,
    // Project Management payload
    projectStatusId: formValues?.status?.value || null,
    previousStatus: project?.projectStatusId,
    projectType: formValues?.type?.value ?? null,
    woNumber: formValues.woNumber,
    poNumber: formValues.poNumber,
    name: formValues.projectName,
    woaStartDate: dateISOFormat(formValues.woaStartDate),
    woaCompletionDate: dateISOFormat(formValues.woaCompletionDate),
    clientStartDate: dateISOFormat(formValues.clientStartDate),
    clientDueDate: dateISOFormat(formValues.clientDueDate),
    clientWalkthroughDate: dateISOFormat(formValues?.clientWalkthroughDate),
    clientSignoffDate: dateISOFormat(formValues?.clientSignOffDate),
    claimNumber: formValues.claimNumber,
    reoNumber: formValues.reoNumber,
    overrideProjectStatus: formValues.overrideProjectStatus?.value,
    isReconciled: formValues.isReconciled === null ? false : formValues.isReconciled,
    lienRightFileDate: dateISOFormat(formValues.lienFiled),
    projectClosedDueDate: dateISOFormat(formValues.projectClosedDueDate),
    lienRightExpireDate: dateISOFormat(formValues.lienExpiryDate),
    preInvoiced:formValues.preInvoiced ?? false,
    paymentSource:formValues?.paymentSource?.map(e => {
      return {lookupValueId:e.value,lookupValueValue:e.title}
    }) ,

    // Invoicing and payment payload
    sowOriginalContractAmount: formValues?.originalSOWAmount,
    sowNewAmount: formValues?.finalSOWAmount,
    invoiceNumber: formValues?.invoiceNumber,
    documents,
    woaBackdatedInvoiceDate: dateISOFormat(formValues?.invoiceBackDate),
    paymentTerm: formValues?.paymentTerms?.value || null,
    //woaInvoiceDate: dateISOFormat(formValues?.woaInvoiceDate),
    expectedPaymentDate: dateISOFormat(formValues?.woaExpectedPayDate),
    overPayment: formValues?.overPayment,
    remainingPayment: formValues?.remainingPayment,
    payVariance: formValues?.payVariance,
    newPartialPayment: formValues?.payment,
    newDepreciationPayment: formValues?.depreciation,
    resubmissionList,

    // Contacts payload
    projectCordinatorId: formValues?.projectCoordinator?.value,
    pcPhoneNumber: formValues?.projectCoordinatorPhoneNumber,
    pcPhoneNumberExtension: formValues?.projectCoordinatorExtension,
    projectManagerId: formValues?.fieldProjectManager?.value,
    projectManagerPhoneNumber: formValues?.fieldProjectManagerPhoneNumber,
    pmPhoneNumberExtension: formValues?.fieldProjectManagerExtension,
    superFirstName: formValues?.superName,
    superLastName: '',
    superPhoneNumber: formValues?.superPhoneNumber,
    superPhoneNumberExtension: formValues?.superPhoneNumberExtension,
    superEmailAddress: formValues?.superEmail,
    clientName: formValues?.client?.label || null,
    homeOwnerName: formValues.homeOwnerName,
    homeOwnerPhone: formValues.homeOwnerPhone,
    homeOwnerEmail: formValues.homeOwnerEmail,
    carrierId: formValues.carrier?.value ? formValues.carrier?.value : project?.carrierId,
    carrierName: formValues.carrier?.label ? formValues.carrier?.label : project?.carrierName,
    agentName: formValues.agentName,
    agentPhone: formValues.agentPhone,
    agentEmail: formValues.agentEmail,
    clientType: formValues?.clientType?.value,

    // Location
    streetAddress: formValues?.address?.label || null,
    city: formValues?.city,
    state: formValues?.state?.value || null,
    zipCode: formValues?.zip,
    market: formValues?.market?.label || null,
    gateCode: formValues?.gateCode,
    lockBoxCode: formValues?.lockBoxCode,
    hoaPhone: formValues?.hoaContactPhoneNumber,
    hoaPhoneNumberExtension: formValues?.hoaContactExtension,
    hoaEmailAddress: formValues?.hoaContactEmail,
    woaPayVariance: null,
    newProperty: property,
    property,
    newMarketId: formValues.market?.value,
    propertyId: isNewAddress ? undefined : formValues?.address?.value,

    // Misc payload
    createdDate: dateISOFormat(formValues?.dateCreated),
    disqualifiedRevenueDate: formValues?.disqualifiedRevenueDate,
    disqualifiedRevenueFlag: formValues?.disqualifiedRevenueFlag,
  }
}
// type.equals=Project&
export const useProjectAuditLogs = projectId => {
  const client = useClient('/audit/api')

  const { data: auditLogs, ...rest } = useQuery(['audit-logs', projectId], async () => {
    const response = await client(`audit-trails?groupId.equals=${projectId}&page=0&size=10000000&sort=id,desc`, {})

    return response?.data
  })
  let mappedAuditLogs = [] as AuditLogType[]
  auditLogs?.forEach(log => {
    log.data?.forEach(data => {
      mappedAuditLogs.push({
        id: log.id,
        modifiedBy: log?.modifiedBy,
        modifiedDate: log?.modifiedDate,
        parameter: data?.attribute,
        oldValue: data.old_value,
        newValue: data.new_value,
      })
    })
  })

  return {
    auditLogs: mappedAuditLogs,
    ...rest,
  }
}
