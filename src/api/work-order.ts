import { useToast } from '@chakra-ui/toast'
import { STATUS } from 'features/common/status'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { ProjectWorkOrder } from 'types/transaction.type'
import { useClient } from 'utils/auth-context'
import { dateISOFormatWithZeroTime, datePickerFormat } from 'utils/date-time-utils'
import { PROJECT_FINANCIAL_OVERVIEW_API_KEY } from './projects'
import { currencyFormatter, removeCurrencyFormat } from 'utils/string-formatters'
import { useTranslation } from 'react-i18next'
import { ACCONT_PAYABLE_API_KEY } from './account-payable'
import { readFileContent } from './vendor-details'
import { sortBy } from 'lodash'
import { useUserRolesSelector } from 'utils/redux-common-selectors'


type UpdateWorkOrderProps = {
  hideToast?: boolean
  swoProjectId?: string | number | null
  setUpdating?: (val) => void
}

export const completePercentageValues = [
  { value: 10, label: '10%' },
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 95, label: '95%' },
  { value: 100, label: '100%' },
]

export const newObjectFormatting = data => {
  const obj = {
    label: `${data?.label}%`,
    value: data?.value,
    __isNew__: true,
  }
  return obj
}

export const useUpdateWorkOrderMutation = (props: UpdateWorkOrderProps) => {
  const { hideToast, setUpdating } = props
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
      onSuccess(res) {
        setUpdating?.(false)
        const updatedWorkOrderId = res?.data?.id
        queryClient.invalidateQueries([PROJECT_FINANCIAL_OVERVIEW_API_KEY, projectId])
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        queryClient.invalidateQueries(['WorkOrderDetails', updatedWorkOrderId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries(ACCONT_PAYABLE_API_KEY)
        queryClient.invalidateQueries(['audit-logs', projectId])
        queryClient.invalidateQueries(['changeOrders'])
        queryClient.invalidateQueries(['projectAward'])
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
        queryClient.invalidateQueries(['audit-logs', projectId])

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

export const useFetchWorkOrder = ({ workOrderId }: { workOrderId: number | undefined }) => {
  const client = useClient()

  const { data: workOrder, ...rest } = useQuery(
    ['WorkOrderDetails', workOrderId],
    async () => {
      const response = await client(`work-orders/${workOrderId} `, {})
      return response?.data
    },
    { enabled: !!workOrderId },
  )
  const workOrderDetails = {
    ...workOrder,
    assignedItems: sortBy(workOrder?.assignedItems, e => {
      return e.orderNo
    }),
  }

  return {
    workOrderAssignedItems: sortBy(workOrder?.assignedItems, e => {
      return e.orderNo
    }),
    awardPlanScopeAmount: workOrder?.awardPlanScopeAmount,
    displayAwardPlan: workOrder?.displayAwardPlan,
    workOrderDetails: workOrderDetails,
    ...rest,
  }
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
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['audit-logs', projectId])
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

  const { data: notes, ...rest } = useQuery<Array<Document>>(
    ['notes', workOrderId],
    async () => {
      const response = await client(`notes?workOrderId.equals=${workOrderId}&sort=modifiedDate,asc`, {})
      return response?.data
    },
    {
      enabled: !!workOrderId,
    },
  )

  return {
    notes,
    ...rest,
  }
}

/* WorkOrder Payments */
export const useFieldEnableDecision = (workOrder?: ProjectWorkOrder) => {
  const { isAdmin, isAccounting } = useUserRolesSelector()
  const isAdminOrAccount = isAdmin || isAccounting
  const defaultStatus = false
  // not used for now -  const completedState = [STATUS.Completed].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  const invoicedState = [STATUS.Invoiced].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  return {
    dateInvoiceSubmittedEnabled: (defaultStatus || isAdmin) && workOrder?.visibleToVendor,
    paymentTermEnabled: defaultStatus || (workOrder?.assignAwardPlan && isAdmin && workOrder?.visibleToVendor),
    paymentTermDateEnabled: (defaultStatus || isAdmin) && workOrder?.visibleToVendor,
    expectedPaymentDateEnabled: (defaultStatus || isAdmin) && workOrder?.visibleToVendor,
    datePaymentProcessedEnabled: (defaultStatus || isAdmin) && workOrder?.visibleToVendor,
    datePaidEnabled:
      (defaultStatus || invoicedState || isAdmin) &&
      workOrder?.visibleToVendor &&
      (workOrder?.onHold && !isAdminOrAccount ? defaultStatus : true),
    invoiceAmountEnabled: (defaultStatus || isAdmin) && workOrder?.visibleToVendor,
    clientOriginalApprovedAmountEnabled: (defaultStatus || isAdmin) && workOrder?.visibleToVendor,
    clientApprovedAmountEnabled: (defaultStatus || isAdmin) && workOrder?.visibleToVendor,
    finalInvoiceAmountEnabled: defaultStatus,
    paymentDateEnabled: (!isAdmin ? defaultStatus || invoicedState : true) && workOrder?.visibleToVendor,
    partialPaymentEnabled:
      (!isAdmin ? defaultStatus || invoicedState : true) &&
      workOrder?.visibleToVendor &&
      (workOrder?.onHold && !isAdminOrAccount ? defaultStatus : true),
  }
}

export const parsePaymentValuesToPayload = formValues => {
  return {
    dateInvoiceSubmitted: dateISOFormatWithZeroTime(formValues?.dateInvoiceSubmitted),
    paymentTerm: formValues?.paymentTerm?.value,
    paymentTermDate: dateISOFormatWithZeroTime(formValues?.paymentTermDate),
    expectedPaymentDate: dateISOFormatWithZeroTime(formValues?.expectedPaymentDate),
    datePaymentProcessed: dateISOFormatWithZeroTime(formValues?.datePaymentProcessed),
    datePaid: dateISOFormatWithZeroTime(formValues?.datePaid),
    partialPayment: formValues?.partialPayment,
    invoiceAmount: removeCurrencyFormat(formValues?.invoiceAmount),
    clientOriginalApprovedAmount: removeCurrencyFormat(formValues?.clientOriginalApprovedAmount),
    clientApprovedAmount: removeCurrencyFormat(formValues?.clientApprovedAmount),
    partialPaymentDate: dateISOFormatWithZeroTime(formValues?.paymentDate),
  }
}

export const parseProjectAwardValuesToPayload = (id, projectAwardData, largeWorkOrder) => {
  return {
    awardPlanId: id,
    paymentTerm: projectAwardData.find(pa => pa.id === id)?.payTerm,
    largeWorkOrder: largeWorkOrder ? largeWorkOrder : false,
  }
}

export const parseTransactionsValuesToPayload = onHold => {
  return {
    onHold: onHold,
  }
}

export const defaultValuesPayment = (workOrder, paymentsTerms) => {
  const defaultValues = {
    dateInvoiceSubmitted: datePickerFormat(workOrder?.dateInvoiceSubmitted),
    paymentTerm: workOrder?.paymentTerm
      ? paymentsTerms.find(p => p.value === workOrder?.paymentTerm)
      : paymentsTerms.find(p => p.value === '30'),
    paymentTermDate: datePickerFormat(workOrder?.paymentTermDate),
    expectedPaymentDate: datePickerFormat(workOrder?.expectedPaymentDate),
    datePaymentProcessed: datePickerFormat(workOrder?.datePaymentProcessed),
    datePaid: datePickerFormat(workOrder?.datePaid),
    invoiceAmount: currencyFormatter(workOrder?.invoiceAmount),
    clientOriginalApprovedAmount: currencyFormatter(workOrder?.clientOriginalApprovedAmount),
    clientApprovedAmount: currencyFormatter(workOrder?.clientApprovedAmount),
    partialPayment: 0,
    // paymentDate:datePickerFormat(workOrder?.partialPaymentDate),
    finalInvoiceAmount: currencyFormatter(workOrder?.finalInvoiceAmount),
  }
  return defaultValues
}

/* WorkOrder Details */

export const useFieldEnableDecisionDetailsTab = ({ workOrder, formValues }) => {
  const { isAdmin } = useUserRolesSelector()
  const completedByVendor =
    [STATUS.Active, STATUS.PastDue].includes(workOrder?.statusLabel?.toLowerCase() as STATUS) &&
    formValues?.assignedItems?.length < 1
  return {
    completedByVendor: completedByVendor,
    workOrderStartDateEnable:
      [STATUS.Active, STATUS.PastDue].includes(workOrder.statusLabel?.toLowerCase()) ||
      isAdmin ||
      !workOrder?.visibleToVendor,
    workOrderExpectedCompletionDateEnable:
      [STATUS.Active, STATUS.PastDue].includes(workOrder.statusLabel?.toLowerCase()) ||
      isAdmin ||
      !workOrder?.visibleToVendor,
  }
}

export const parseWODetailValuesToPayload = (formValues, workOrder, isSkillService?: boolean) => {
  /*- id will be set when line item is saved in workorder
    - smartLineItem id is id of line item in swo */
  const cancelWorkOrder = formValues?.cancel.value === 35

  let assignedItems = !cancelWorkOrder
    ? [
        ...formValues?.assignedItems?.map((a, index) => {
          const isNewSmartLineItem = !a.smartLineItemId
          if (a.document) {
            delete a?.document?.fileObject
            delete a?.document?.documentTypelabel
          }
          const assignedItem = {
            ...a,
            completePercentage:
              typeof a.completePercentage === 'number'
                ? a.completePercentage
                : Number(a.completePercentage?.label?.slice(0, -1)),
            document: a.uploadedDoc ? { id: a?.document?.id, ...a.uploadedDoc } : a.document,
            id: isNewSmartLineItem ? '' : a.id,
            smartLineItemId: isNewSmartLineItem ? a.id : a.smartLineItemId,
            orderNo: index,
            location: a.location.label,
          }
          delete assignedItem.uploadedDoc
          if (assignedItem?.paymentGroup && typeof assignedItem?.paymentGroup === 'object') assignedItem.paymentGroup = assignedItem?.paymentGroup?.label;
          return assignedItem
        }),
      ]
    : []

    if ( isSkillService  ) {
      assignedItems = assignedItems.map( a => {
        a.profit = 0;
        return a;
      } )
    }

    return {
    cancel: formValues?.cancel?.value,
    ...(cancelWorkOrder && { status: 35, cancelledDate: new Date() }),
    workOrderStartDate: formValues?.workOrderStartDate,
    workOrderDateCompleted: formValues?.workOrderDateCompleted,
    workOrderExpectedCompletionDate: formValues?.workOrderExpectedCompletionDate,
    showPricing: formValues.showPrice,
    assignedItems: [...assignedItems],
    notifyVendor: formValues.notifyVendor,
    visibleToVendor: formValues.assignToVendor,
    byPassSOWRule: formValues.byPassSOWRule,
    vendorId: formValues.vendorId?.value ?? workOrder?.vendorId,
    vendorSkillId: formValues.vendorSkillId?.value,
    invoiceAmount: removeCurrencyFormat(formValues?.invoiceAmount),
    clientApprovedAmount: removeCurrencyFormat(formValues?.clientApprovedAmount),
    clientOriginalApprovedAmount: removeCurrencyFormat(formValues?.clientOriginalApprovedAmount),
    percentage: formValues?.percentage,
    completePercentage:
      typeof formValues.completePercentage === 'number'
        ? formValues.completePercentage
        : Number(formValues.completePercentage?.label?.slice(0, -1)),
    isWorkOrderDetailsEdit:  !!workOrder?.isWorkOrderDetailsEdit
  }
}

export const defaultValuesWODetails = (workOrder, defaultSkill, locations, paymentGroupValsOptions) => {
  const defaultValues = {
    cancel: {
      value: '',
      label: 'Select',
    },
    vendorSkillId: defaultSkill,
    vendorId: '',
    workOrderStartDate: datePickerFormat(workOrder?.workOrderStartDate),
    workOrderDateCompleted: datePickerFormat(workOrder?.workOrderDateCompleted),
    workOrderExpectedCompletionDate: datePickerFormat(workOrder?.workOrderExpectedCompletionDate),
    showPrice: workOrder.showPricing ?? false,
    notifyVendor: workOrder.notifyVendor ?? false,
    assignToVendor: workOrder.visibleToVendor ?? false,
    byPassSOWRule: workOrder.byPassSOWRule ?? false,
    invoiceAmount: currencyFormatter(workOrder?.invoiceAmount),
    clientApprovedAmount: currencyFormatter(workOrder?.clientApprovedAmount),
    clientOriginalApprovedAmount: removeCurrencyFormat(workOrder?.clientOriginalApprovedAmount),
    percentage: workOrder?.percentage,
    assignedItems:
      workOrder?.assignedItems?.length > 0
        ? workOrder?.assignedItems?.map(e => {
            const locationFound = locations?.find(l => l.value === e?.location)
            const payFound = paymentGroupValsOptions?.find(l => l.label === e?.paymentGroup)
            let location
            let paymentGroup
            if (payFound) {
              paymentGroup = { label: payFound?.label, value: payFound?.id ?? payFound?.value }
            } else if (!!e.paymentGroup && payFound) {
              paymentGroup = { label: e?.paymentGroup, value: e?.paymentGroup }
            } else {
              paymentGroup = null
            }

            if (locationFound) {
              location = { label: locationFound.value, value: locationFound.id }
            } else if (!!e.location) {
              location = { label: e?.location, value: e?.location }
            } else {
              location = null
            }
            return {
              ...e,
              uploadedDoc: null,
              clientAmount: (e.price ?? 0) * (e.quantity ?? 0),
              location,
              paymentGroup,
            }
          })
        : [],
    completePercentage: workOrder?.completePercentage,
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
    uploadLW: null as any,
  }
  return defaultValues
}

export const useLWFieldsStatusDecision = ({ workOrder }) => {
  const disabled =
    ![STATUS.Completed, STATUS.Invoiced, STATUS.Rejected].includes(workOrder?.statusLabel?.toLocaleLowerCase()) ||
    (workOrder.leanWaiverSubmitted && workOrder?.lienWaiverAccepted)
  return {
    isFieldsDisabled: disabled,
  }
}

/* New Work Order */

export const parseNewWoValuesToPayload = async (formValues, projectId) => {
  const selectedCapacity = 1
  var documents = [] as any
  const assignedItems = [
    ...formValues?.assignedItems?.map((a, index) => {
      if (a.document) {
        delete a?.document?.fileObject
      }
      const assignedItem = {
        ...a,
        document: a.uploadedDoc ? a.uploadedDoc : a.document,
        id: '',
        smartLineItemId: a.id,
        orderNo: index,
        location: a.location.label,
        paymentGroup: a?.paymentGroup?.label,
      }
      delete assignedItem.uploadedDoc
      return assignedItem
    }),
  ]

  if (formValues?.uploadWO) {
    const fileContents = await readFileContent(formValues?.uploadWO)
    documents.push({
      fileObjectContentType: formValues?.uploadWO?.type,
      fileType: formValues?.uploadWO?.name,
      fileObject: fileContents ?? '',
      documentType: 16,
    })
  }
  return {
    cancel: formValues.cancel?.value,
    workOrderStartDate: formValues.workOrderStartDate,
    workOrderExpectedCompletionDate: formValues.workOrderExpectedCompletionDate,
    invoiceAmount: formValues.invoiceAmount,
    clientApprovedAmount: formValues.clientApprovedAmount,
    percentage: formValues.percentage,
    vendorId: formValues.vendorId?.value,
    vendorSkillId: formValues.vendorSkillId?.value,
    // new work-order have hardcoded capacity
    capacity: selectedCapacity,
    assignedItems: formValues?.assignedItems?.length > 0 ? assignedItems : [],
    documents,
    status: formValues.assignToVendor ? 34 : 1035,
    showPricing: formValues.showPrice,
    notifyVendor: formValues.notifyVendor,
    visibleToVendor: formValues.assignToVendor,
    byPassSOWRule: formValues.byPassSOWRule,
    projectId: projectId,
  }
}


export const isVendorSkillServices = (skills: any, skillId: number) => {
  const skill =  skills?.find(s => s.id === skillId );
  if ( ! skill ) return false;
  if ( skill.services === 'YES' ) return true;

  return false;
} 