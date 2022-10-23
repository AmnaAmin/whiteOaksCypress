import { useToast } from '@chakra-ui/react'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS } from 'constants/project-details.constants'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Client, ErrorType, ProjectType, State, User } from 'types/common.types'
import {
  DocumentPayload,
  OverPaymentType,
  ProjectDetailsAPIPayload,
  ProjectDetailsFormValues,
  ProjectStatus,
} from 'types/project-details.types'
import { Market, Project, ProjectExtraAttributesType } from 'types/project.type'
import { SelectOption } from 'types/transaction.type'
import { useClient } from 'utils/auth-context'
import { dateISOFormat, getLocalTimeZoneDate } from 'utils/date-time-utils'
import { createDocumentPayload } from 'utils/file-utils'
import { PROJECT_EXTRA_ATTRIBUTES } from './pc-projects'
import { GET_TRANSACTIONS_API_KEY } from './transactions'

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
    const response = await client(`users/usertype/${userType}`, {})

    return response?.data
  })

  const userSelectOptions =
    users?.map((user: User) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    })) || []

  return {
    userSelectOptions,
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
    const response = await client(`clients`, {})

    return response?.data
  })

  const clientSelectOptions =
    clients?.map((client: Client) => ({
      value: client.companyName,
      label: client.companyName,
    })) || []

  return { clientSelectOptions, ...rest }
}

export const useProjectDetailsUpdateMutation = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

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

export const getProjectStatusSelectOptions = () => {
  return Object.entries(ProjectStatus).map(([key, value]) => ({
    value: value,
    label: key.toUpperCase(),
  }))
}

export const useProjectStatusSelectOptions = (project: Project) => {
  return useMemo(() => {
    if (!project) return []

    const projectStatusId = project.projectStatusId
    const numberOfWorkOrders = project.numberOfWorkOrders
    const numberOfCompletedWorkOrders = project.numberOfCompletedWorkOrders
    const numberOfPaidWorkOrders = project.numberOfPaidWorkOrders
    const sowNewAmount = project.sowNewAmount || 0
    const partialPayment = project.partialPayment || 0

    if (!projectStatusId) return []

    const projectStatusSelectOptions = PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS[projectStatusId] || []

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
      // Project punch status should be disabled
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

      // If project status is Client Paid and there are some workorders not paid then
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

      // if project status is Invoiced and remaining payment is not zero then
      // project status Paid should be disabled
      if (
        sowNewAmount - partialPayment > 0 &&
        projectStatusId === ProjectStatus.Invoiced &&
        optionValue === ProjectStatus.ClientPaid
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (Remaining Payment must be $0`,
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

      return selectOption
    })

    return selectOptionWithDisableEnabled
  }, [project])
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
}: {
  project?: Project
  projectExtraAttributes?: ProjectExtraAttributesType
  overPayment?: OverPaymentType
  projectTypeSelectOptions?: SelectOption[]
  projectCoordinatorSelectOptions?: SelectOption[]
  projectManagerSelectOptions?: SelectOption[]
  clientSelectOptions?: SelectOption[]
}): ProjectDetailsFormValues | Object => {
  if (
    !project ||
    !projectTypeSelectOptions ||
    !projectCoordinatorSelectOptions ||
    !projectManagerSelectOptions ||
    !clientSelectOptions
  ) {
    return {}
  }

  const findOptionByValue = (options: SelectOption[], value: string | number | null): SelectOption | null =>
    options.find(option => option.value === value) || null

  const projectStatusSelectOptions = getProjectStatusSelectOptions()
  const remainingPayment = project.accountRecievable || 0

  return {
    // Project Management form values
    status: findOptionByValue(projectStatusSelectOptions, project.projectStatusId),
    type: findOptionByValue(projectTypeSelectOptions, project.projectType),
    woNumber: project.woNumber,
    poNumber: project.poNumber,
    projectName: project.name,
    woaStartDate: getLocalTimeZoneDate(project.woaStartDate as string),
    woaCompletionDate: getLocalTimeZoneDate(project.woaCompletionDate as string),
    clientStartDate: getLocalTimeZoneDate(project.clientStartDate as string),
    clientDueDate: getLocalTimeZoneDate(project.clientDueDate as string),
    clientWalkthroughDate: getLocalTimeZoneDate(project.clientWalkthroughDate as string),
    clientSignOffDate: getLocalTimeZoneDate(project.clientSignoffDate as string),

    // Project Invoice and Payment form values
    originalSOWAmount: project.sowOriginalContractAmount,
    sowLink: project.sowLink,
    finalSOWAmount: project.sowNewAmount,
    invoiceNumber: project.invoiceNumber,
    invoiceAttachment: project.documents?.[0],
    invoiceBackDate: getLocalTimeZoneDate(project.woaBackdatedInvoiceDate as string),
    invoiceLink: project.invoiceLink,
    paymentTerms: findOptionByValue(PAYMENT_TERMS_OPTIONS, project.paymentTerm),
    woaInvoiceDate: getLocalTimeZoneDate(project.woaInvoiceDate as string),
    woaExpectedPayDate: getLocalTimeZoneDate(project.expectedPaymentDate as string),
    overPayment: overPayment?.sum,
    remainingPayment: remainingPayment < 0 ? 0 : remainingPayment,
    payment: '',

    // Contacts form values
    projectCoordinator: findOptionByValue(projectCoordinatorSelectOptions, project.projectCoordinatorId),
    projectCoordinatorPhoneNumber: project.pcPhoneNumber,
    projectCoordinatorExtension: project.pcPhoneNumberExtension,
    fieldProjectManager: findOptionByValue(projectManagerSelectOptions, project.projectManagerId),
    fieldProjectManagerPhoneNumber: project.projectManagerPhoneNumber,
    fieldProjectManagerExtension: project.pmPhoneNumberExtension,
    superName: project.superLastName,
    superPhoneNumber: project.superPhoneNumber,
    superPhoneNumberExtension: project.superPhoneNumberExtension,
    superEmail: project.superEmailAddress,
    client: findOptionByValue(clientSelectOptions, project.clientName),

    // Location Form values
    address: project.streetAddress,
    city: project.city,
    state: project.state,
    zip: project.zipCode,
    market: project.market,
    gateCode: project.gateCode,
    lockBoxCode: project.lockBoxCode,
    hoaContactEmail: project.hoaEmailAddress,
    hoaContactPhoneNumber: project.hoaPhone,
    hoaContactExtension: project.hoaPhoneNumberExtension,

    // Misc form values
    dateCreated: getLocalTimeZoneDate(project.createdDate as string),
    activeDate: getLocalTimeZoneDate(projectExtraAttributes?.activeDate as string),
    punchDate: getLocalTimeZoneDate(projectExtraAttributes?.punchDate as string),
    closedDate: getLocalTimeZoneDate(project.projectClosedDate as string),
    clientPaidDate: getLocalTimeZoneDate(project.clientPaidDate as string),
    collectionDate: getLocalTimeZoneDate(projectExtraAttributes?.collectionDate as string),
    disputedDate: getLocalTimeZoneDate(projectExtraAttributes?.disputedDate as string),
    woaPaidDate: getLocalTimeZoneDate(project.woaPaidDate as string),
    dueDateVariance: project.dueDateVariance,
    payDateVariance: project.signoffDateVariance,
    payVariance: project.woaPayVariance,
  }
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

  return {
    ...projectPayload,
    // Project Management payload
    projectStatusId: formValues?.status?.value || null,
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

    // Invoicing and payment payload
    sowOriginalContractAmount: formValues?.originalSOWAmount,
    sowNewAmount: formValues?.finalSOWAmount,
    invoiceNumber: formValues?.invoiceNumber,
    documents,
    woaBackdatedInvoiceDate: dateISOFormat(formValues?.invoiceBackDate),
    paymentTerm: formValues?.paymentTerms?.value || null,
    woaInvoiceDate: dateISOFormat(formValues?.woaInvoiceDate),
    expectedPaymentDate: dateISOFormat(formValues?.woaExpectedPayDate),
    overPayment: formValues?.overPayment,
    remainingPayment: formValues?.remainingPayment,
    payVariance: formValues?.payVariance,
    newPartialPayment: formValues?.payment,

    // Contacts payload
    projectCordinatorId: formValues?.projectCoordinator?.value,
    pcPhoneNumber: formValues?.projectCoordinatorPhoneNumber,
    pcPhoneNumberExtension: formValues?.projectCoordinatorExtension,
    projectManagerId: formValues?.fieldProjectManager?.value,
    projectManagerPhoneNumber: formValues?.fieldProjectManagerPhoneNumber,
    pmPhoneNumberExtension: formValues?.fieldProjectManagerExtension,
    superFirstName: '',
    superLastName: formValues?.superName,
    superPhoneNumber: formValues?.superPhoneNumber,
    superPhoneNumberExtension: formValues?.superPhoneNumberExtension,
    superEmailAddress: formValues?.superEmail,
    clientName: formValues?.client?.label || null,

    // Location
    streetAddress: formValues?.address,
    city: formValues?.city,
    state: formValues?.state,
    zipCode: formValues?.zip,
    market: formValues?.market,
    gateCode: formValues?.gateCode,
    lockBoxCode: formValues?.lockBoxCode,
    hoaPhone: formValues?.hoaContactPhoneNumber,
    hoaPhoneNumberExtension: formValues?.hoaContactExtension,
    hoaEmailAddress: formValues?.hoaContactEmail,
    woaPayVariance: null,
    property: {
      streetAddress: formValues?.address,
      city: formValues?.city,
      state: formValues?.state,
      zipCode: formValues?.zip,
    },

    // Misc payload
    createdDate: dateISOFormat(formValues?.dateCreated),
  }
}
