import { useToast } from '@chakra-ui/toast'
import { STATUS } from 'features/common/status'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { ProjectWorkOrder } from 'types/transaction.type'
import { useClient } from 'utils/auth-context'
import { dateISOFormat, datePickerFormat } from 'utils/date-time-utils'
import { PROJECT_FINANCIAL_OVERVIEW_API_KEY } from './projects'
import { currencyFormatter } from 'utils/string-formatters'
import { useTranslation } from 'react-i18next'
import { ACCONT_PAYABLE_API_KEY } from './account-payable'

type UpdateWorkOrderProps = {
  hideToast?: boolean
  swoProjectId?: string | number | null
}

export const useUpdateWorkOrderMutation = (props: UpdateWorkOrderProps) => {
  const { hideToast } = props
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>()
  const { t } = useTranslation()

  return useMutation(
    payload => {
      return client('work-orders', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([PROJECT_FINANCIAL_OVERVIEW_API_KEY, projectId])
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries(ACCONT_PAYABLE_API_KEY)
        if (!hideToast) {
          toast({
            title: 'Work Order',
            description: 'Work Order has been saved successfully.',
            status: 'success',
            isClosable: true,
            position: 'top-left',
          })
        }
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save workorder.'
        if (error.errorKey === 'EXPECTED_AND_COMPLETION_1_YEAR_ERROR') {
          description = t('EXPECTED_AND_COMPLETION_1_YEAR_ERROR')
        }
        toast({
          title: 'Work Order',
          description,
          position: 'top-left',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useCreateWorkOrderMutation = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>()
  const { t } = useTranslation()

  return useMutation(
    payload => {
      return client('work-orders', {
        data: payload,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        queryClient.invalidateQueries([PROJECT_FINANCIAL_OVERVIEW_API_KEY, projectId])
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries(['projectSchedule', projectId])

        toast({
          title: 'Work Order',
          description: 'Work Order created successfully',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save workorder.'
        if (error.errorKey === 'EXPECTED_AND_COMPLETION_1_YEAR_ERROR') {
          description = t('EXPECTED_AND_COMPLETION_1_YEAR_ERROR')
        }
        toast({
          title: 'Work Order',
          position: 'top-left',
          description,
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useNoteMutation = projectId => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: any) => {
      return client('notes', {
        data: payload,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['notes', projectId])
        toast({
          title: 'Note',
          description: 'Note has been saved successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        toast({
          title: 'Note',
          description: (error.title as string) ?? 'Unable to save note.',
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useNotes = ({ workOrderId }: { workOrderId: number | undefined }) => {
  const client = useClient()

  const { data: notes, ...rest } = useQuery<Array<Document>>(['notes', workOrderId], async () => {
    const response = await client(`notes?workOrderId.equals=${workOrderId}&sort=modifiedDate,asc`, {})
    return response?.data
  })

  return {
    notes,
    ...rest,
  }
}

/* WorkOrder Payments */
export const useFieldEnableDecision = (workOrder?: ProjectWorkOrder) => {
  const defaultStatus = false
  const completedState = [STATUS.Completed].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  const invoicedState = [STATUS.Invoiced].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  return {
    dateInvoiceSubmittedEnabled: defaultStatus || invoicedState,
    paymentTermEnabled: defaultStatus || invoicedState,
    paymentTermDateEnabled: defaultStatus,
    expectedPaymentDateEnabled: defaultStatus || completedState || invoicedState,
    datePaymentProcessedEnabled: defaultStatus || completedState || invoicedState,
    datePaidEnabled: defaultStatus || completedState || invoicedState,
    invoiceAmountEnabled: defaultStatus,
    clientOriginalApprovedAmountEnabled: defaultStatus,
    clientApprovedAmountEnabled: defaultStatus,
  }
}

export const parsePaymentValuesToPayload = formValues => {
  return {
    dateInvoiceSubmitted: dateISOFormat(formValues?.dateInvoiceSubmitted),
    paymentTerm: formValues?.paymentTerm?.value,
    paymentTermDate: dateISOFormat(formValues?.paymentTermDate),
    expectedPaymentDate: dateISOFormat(formValues?.expectedPaymentDate),
    datePaymentProcessed: dateISOFormat(formValues?.datePaymentProcessed),
    datePaid: dateISOFormat(formValues?.datePaid),
  }
}

export const defaultValuesPayment = (workOrder, paymentsTerms) => {
  const defaultValues = {
    dateInvoiceSubmitted: datePickerFormat(workOrder?.dateInvoiceSubmitted),
    paymentTerm: workOrder?.paymentTerm
      ? paymentsTerms.find(p => p.value === workOrder?.paymentTerm)
      : paymentsTerms.find(p => p.value === '20'),
    paymentTermDate: datePickerFormat(workOrder?.paymentTermDate),
    expectedPaymentDate: datePickerFormat(workOrder?.expectedPaymentDate),
    datePaymentProcessed: datePickerFormat(workOrder?.datePaymentProcessed),
    datePaid: datePickerFormat(workOrder?.datePaid),
    invoiceAmount: currencyFormatter(workOrder?.invoiceAmount),
    clientOriginalApprovedAmount: currencyFormatter(workOrder?.clientOriginalApprovedAmount),
    clientApprovedAmount: currencyFormatter(workOrder?.clientApprovedAmount),
  }
  return defaultValues
}

/* WorkOrder Details */

export const useFieldEnableDecisionDetailsTab = ({ workOrder, formValues }) => {
  const defaultStatus = false
  const completedByVendor =
    [STATUS.Active, STATUS.PastDue].includes(workOrder?.statusLabel?.toLowerCase() as STATUS) &&
    formValues?.assignedItems?.every(e => e.isCompleted && e.isVerified)
  return {
    completedByVendor: defaultStatus || completedByVendor,
  }
}

export const parseWODetailValuesToPayload = formValues => {
  /*- id will be set when line item is saved in workorder
    - smartLineItem id is id of line item in swo */

  const assignedItems = [
    ...formValues?.assignedItems?.map(a => {
      const isNewSmartLineItem = !a.smartLineItemId
      if (a.document) {
        delete a?.document?.fileObject
        delete a?.document?.documentTypelabel
      }
      const assignedItem = {
        ...a,
        document: a.uploadedDoc ? { id: a?.document?.id, ...a.uploadedDoc } : a.document,
        id: isNewSmartLineItem ? '' : a.id,
        smartLineItemId: isNewSmartLineItem ? a.id : a.smartLineItemId,
      }
      delete assignedItem.uploadedDoc
      return assignedItem
    }),
  ]
  return {
    workOrderStartDate: dateISOFormat(formValues?.workOrderStartDate),
    workOrderDateCompleted: dateISOFormat(formValues?.workOrderDateCompleted),
    workOrderExpectedCompletionDate: dateISOFormat(formValues?.workOrderExpectedCompletionDate),
    showPricing: formValues.showPrice,
    assignedItems: [...assignedItems],
  }
}

export const defaultValuesWODetails = workOrder => {
  const defaultValues = {
    workOrderStartDate: datePickerFormat(workOrder?.workOrderStartDate),
    workOrderDateCompleted: datePickerFormat(workOrder?.workOrderDateCompleted),
    workOrderExpectedCompletionDate: datePickerFormat(workOrder?.workOrderExpectedCompletionDate),
    showPrice: workOrder.showPricing ?? false,
    assignedItems:
      workOrder?.assignedItems?.length > 0
        ? workOrder?.assignedItems?.map(e => {
            return { ...e, uploadedDoc: null, clientAmount: (e.price ?? 0) * (e.quantity ?? 0) }
          })
        : [],
  }
  return defaultValues
}

/* WorkOrder LienWaiver */

export const defaultValuesLienWaiver = lienWaiverData => {
  const defaultValues = {
    claimantName: lienWaiverData?.claimantName,
    customerName: lienWaiverData?.customerName,
    propertyAddress: lienWaiverData?.propertyAddress,
    owner: lienWaiverData?.owner,
    makerOfCheck: lienWaiverData?.makerOfCheck,
    finalInvoiceAmount: lienWaiverData?.finalInvoiceAmount,
    checkPayableTo: lienWaiverData?.claimantName,
    claimantsSignature: lienWaiverData?.claimantsSignature,
    claimantTitle: lienWaiverData?.claimantTitle,
    dateOfSignature: lienWaiverData?.dateOfSignature,
    lienWaiverAccepted: !lienWaiverData?.lienWaiverAccepted,
  }
  return defaultValues
}

export const useLWFieldsStatusDecision = ({ workOrder }) => {
  const disabled =
    ![STATUS.Completed, STATUS.Invoiced, STATUS.Declined].includes(workOrder?.statusLabel?.toLocaleLowerCase()) ||
    (workOrder.leanWaiverSubmitted && workOrder?.lienWaiverAccepted)
  return {
    isFieldsDisabled: disabled,
  }
}

/* New Work Order */

export const parseNewWoValuesToPayload = (formValues, projectId) => {
  const selectedCapacity = 1
  const arr = [] as any
  const assignedItems = [
    ...formValues?.assignedItems?.map(a => {
      if (a.document) {
        delete a?.document?.fileObject
      }
      const assignedItem = {
        ...a,
        document: a.uploadedDoc ? a.uploadedDoc : a.document,
        id: '',
        smartLineItemId: a.id,
      }
      delete assignedItem.uploadedDoc
      return assignedItem
    }),
  ]
  return {
    workOrderStartDate: dateISOFormat(formValues.workOrderStartDate),
    workOrderExpectedCompletionDate: dateISOFormat(formValues.workOrderExpectedCompletionDate),
    invoiceAmount: formValues.invoiceAmount,
    clientApprovedAmount: formValues.clientApprovedAmount,
    percentage: formValues.percentage,
    vendorId: formValues.vendorId?.value,
    vendorSkillId: formValues.vendorSkillId?.value,
    // new work-order have hardcoded capacity
    capacity: selectedCapacity,
    assignedItems: formValues?.assignedItems?.length > 0 ? assignedItems : [],
    documents: arr,
    status: 34,
    showPricing: formValues.showPrice,
    projectId: projectId,
  }
}
