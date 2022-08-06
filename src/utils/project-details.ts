import { useToast } from '@chakra-ui/react'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS } from 'constants/project-details.constants'
import { useMemo } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Client, ProjectType, State, User } from 'types/common.types'
import {
  DocumentPayload,
  ProjectDetailsAPIPayload,
  ProjectDetailsFormValues,
  ProjectStatus,
} from 'types/project-details.types'
import { Market, Project } from 'types/project.type'
import { SelectOption } from 'types/transaction.type'
import { useClient } from './auth-context'
import { dateISOFormat, datePickerFormat } from './date-time-utils'

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

  return useMutation(
    (payload: ProjectDetailsAPIPayload) => {
      return client(`projects`, {
        method: 'PUT',
        data: payload,
      })
    },
    {
      onSuccess: () => {
        toast({
          title: 'Project Details Updated',
          description: 'Project details updated successfully',
          status: 'success',
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
    value: value.toUpperCase(),
    label: value.toUpperCase(),
  }))
}

export const useProjectStatusSelectOptions = (project: Project) => {
  return useMemo(() => {
    if (!project) return []

    const projectStatus = project.projectStatus?.toLocaleLowerCase()
    const numberOfWorkOrders = project.numberOfWorkOrders
    const numberOfCompletedWorkOrders = project.numberOfCompletedWorkOrders
    const numberOfPaidWorkOrders = project.numberOfPaidWorkOrders
    const sowNewAmount = project.sowNewAmount || 0
    const partialPayment = project.partialPayment || 0

    if (!projectStatus) return []

    const projectStatusSelectOptions = PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS[projectStatus].map(status => ({
      value: status.toUpperCase(),
      label: status.toUpperCase(),
    }))

    const selectOptionWithDisableEnabled = projectStatusSelectOptions.map((selectOption: SelectOption) => {
      const optionLabel = selectOption?.label?.toLowerCase()

      // if project in new status and there are zero work orders then
      // active status should be disabled
      if (numberOfWorkOrders === 0 && projectStatus === ProjectStatus.New && optionLabel === ProjectStatus.Active) {
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
        projectStatus === ProjectStatus.Active &&
        optionLabel === ProjectStatus.Punch
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
        numberOfPaidWorkOrders === numberOfWorkOrders &&
        projectStatus === ProjectStatus.ClientPaid &&
        optionLabel === ProjectStatus.Paid
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
        projectStatus === ProjectStatus.Invoiced &&
        optionLabel === ProjectStatus.ClientPaid
      ) {
        return {
          ...selectOption,
          label: `${selectOption.label} (Remaining Payment must be $0`,
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
  projectTypeSelectOptions,
  projectCoordinatorSelectOptions,
  projectManagerSelectOptions,
  clientSelectOptions,
  stateSelectOptions,
  marketSelectOptions,
}: {
  project?: Project
  projectTypeSelectOptions?: SelectOption[]
  projectCoordinatorSelectOptions?: SelectOption[]
  projectManagerSelectOptions?: SelectOption[]
  clientSelectOptions?: SelectOption[]
  stateSelectOptions?: SelectOption[]
  marketSelectOptions?: SelectOption[]
}): ProjectDetailsFormValues | Object => {
  if (
    !project ||
    !projectTypeSelectOptions ||
    !projectCoordinatorSelectOptions ||
    !projectManagerSelectOptions ||
    !clientSelectOptions ||
    !stateSelectOptions ||
    !marketSelectOptions
  ) {
    return {}
  }

  const findOptionByValue = (options: SelectOption[], value: string | number | null): SelectOption | null =>
    options.find(option => option.value === value) || null

  const projectStatusSelectOptions = getProjectStatusSelectOptions()
  const sowNewAmount = project.sowNewAmount ?? 0
  const partialPayment = project.partialPayment ?? 0
  const overPayment = partialPayment - sowNewAmount
  const remainingPayment = project.accountRecievable || 0

  return {
    // Project Management form values
    status: findOptionByValue(projectStatusSelectOptions, project.projectStatus),
    type: findOptionByValue(projectTypeSelectOptions, project.projectType),
    woNumber: project.woNumber,
    poNumber: project.poNumber,
    projectName: project.name,
    woaStartDate: datePickerFormat(project.woaStartDate as string),
    woaCompletionDate: datePickerFormat(project.woaCompletionDate as string),
    clientStartDate: datePickerFormat(project.clientStartDate as string),
    clientDueDate: datePickerFormat(project.clientDueDate as string),
    clientWalkthroughDate: datePickerFormat(project.clientWalkthroughDate as string),
    clientSignOffDate: datePickerFormat(project.clientSignoffDate as string),

    // Project Invoice and Payment form values
    originalSOWAmount: project.sowOriginalContractAmount,
    sowLink: project.sowLink,
    finalSOWAmount: project.sowNewAmount,
    invoiceNumber: project.invoiceNumber,
    invoiceAttachment: project.documents?.[0],
    invoiceBackDate: datePickerFormat(project.woaBackdatedInvoiceDate as string),
    paymentTerms: findOptionByValue(PAYMENT_TERMS_OPTIONS, project.paymentTerm),
    woaInvoiceDate: datePickerFormat(project.woaInvoiceDate as string),
    woaExpectedPayDate: datePickerFormat(project.expectedPaymentDate as string),
    overPayment: overPayment < 0 ? 0 : overPayment,
    remainingPayment: remainingPayment < 0 ? 0 : remainingPayment,
    payment: '',

    // Contacts form values
    projectCoordinator: findOptionByValue(projectCoordinatorSelectOptions, project.projectCoordinatorId),
    projectCoordinatorPhoneNumber: '',
    projectCoordinatorExtension: '',
    fieldProjectManager: findOptionByValue(projectManagerSelectOptions, project.projectManagerId),
    fieldProjectManagerPhoneNumber: project.projectManagerPhoneNumber,
    fieldProjectManagerExtension: project.projectManagerPhoneNumberExtension,
    superName: project.superFirstName,
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
    dateCreated: datePickerFormat(project.createdDate as string),
    activeDate: datePickerFormat(project.modifiedDate as string),
    punchDate: datePickerFormat(project.punchDate as string),
    closedDate: datePickerFormat(project.closedDate as string),
    clientPaidDate: datePickerFormat(project.clientPaidDate as string),
    collectionDate: datePickerFormat(project.collectionDate as string),
    disputedDate: datePickerFormat(project.disputedDate as string),
    woaPaidDate: datePickerFormat(project.woaPaidDate as string),
    dueDateVariance: project.dueDateVariance,
    payDateVariance: project.payDateVariance,
    payVariance: project.payVariance,
  }
}

const removePropertiesFromObject = (obj: Project, properties: string[]): Project => {
  const newObj = { ...obj }
  properties.forEach(property => delete newObj[property])
  return newObj
}

const createDocumentPayload = (file: File): Promise<DocumentPayload> => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    let filetype = 'text/plain'

    if (file.type !== '') filetype = file.type

    reader.addEventListener('load', (event: any) => {
      res({
        fileType: file.name,
        fileObject: event?.target?.result?.split(',')[1],
        fileObjectContentType: filetype,
        documentType: 42,
      })
    })

    reader.readAsDataURL(file)
  })
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

  console.log('attachment', documents)
  return {
    ...projectPayload,
    // Project Management payload
    projectStatus: formValues?.status?.value || null,
    projectType: formValues?.type?.value ?? null,
    woNumber: formValues.woNumber,
    poNumber: formValues.poNumber,
    name: formValues.projectName,
    woaStartDate: dateISOFormat(formValues.woaStartDate),
    woaCompletionDate: dateISOFormat(formValues.woaCompletionDate),
    clientStartDate: dateISOFormat(formValues.clientStartDate),
    clientDueDate: dateISOFormat(formValues.clientDueDate),
    clientWalkthroughDate: dateISOFormat(formValues?.clientWalkthroughDate),

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

    // Contacts payload
    projectCordinatorId: formValues?.projectCoordinator?.value,
    projectCoordinatorPhoneNumber: formValues?.projectCoordinatorPhoneNumber,
    projectCoordinatorPhoneNumberExtension: formValues?.projectCoordinatorExtension,
    projectManagerId: formValues?.fieldProjectManager?.value,
    projectManagerPhoneNumber: formValues?.fieldProjectManagerPhoneNumber,
    projectManagerPhoneNumberExtension: formValues?.fieldProjectManagerExtension,
    superFirstName: formValues?.superName,
    superLastName: '',
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
