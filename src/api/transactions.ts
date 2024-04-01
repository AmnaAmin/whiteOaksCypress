import jsPdf from 'jspdf'
import { differenceInMilliseconds } from 'date-fns'
import { useToast } from '@chakra-ui/toast'
import {
  ChangeOrderPayload,
  ChangeOrderType,
  ChangeOrderUpdatePayload,
  FormValues,
  ProjectWorkOrder,
  SelectOption,
  TransactionMarkAsValues,
  TransactionStatusValues,
  TransactionType,
  TransactionTypeValues,
  WorkOrderAwardStats,
} from 'types/transaction.type'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { dateFormat, dateISOFormat, datePickerFormat } from 'utils/date-time-utils'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { readFileContent } from './vendor-details'
import { useMemo, useState } from 'react'
import differenceInDays from 'date-fns/differenceInDays'
import { convertImageToDataURL } from 'components/table/util'
import { createForm } from 'utils/lien-waiver'
import { Document } from 'types/vendor.types'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { PROJECT_FINANCIAL_OVERVIEW_API_KEY } from './projects'
import {
  ACCONT_RECEIVABLE_API_KEY,
  ACCOUNT_CARDS_RECEIVABLE_API_KEY,
  GET_PAGINATED_RECEIVABLE_QUERY_KEY,
} from 'api/account-receivable'
import numeral from 'numeral'
import { ErrorType } from 'types/common.types'
import {
  CHANGE_ORDER_DEFAULT_OPTION,
  CHANGE_ORDER_DEFAULT_VALUE,
  LIEN_WAIVER_DEFAULT_VALUES,
  REASON_STATUS_OPTIONS,
  TRANSACTION_FEILD_DEFAULT,
  TRANSACTION_FPM_DM_STATUS_OPTIONS,
  TRANSACTION_MARK_AS_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
} from 'features/project-details/transactions/transaction.constants'
import { ACCONT_PAYABLE_API_KEY, AP_CARDS } from './account-payable'
import { STATUS } from 'features/common/status'
import { InvoiceStatusValues, InvoicingType } from 'types/invoice.types'

export const GET_TRANSACTIONS_API_KEY = 'transactions'

export const useTransactions = (projectId?: string) => {
  const client = useClient()

  const { data: transactions, ...rest } = useQuery<Array<TransactionType>>(
    [GET_TRANSACTIONS_API_KEY, projectId],
    async () => {
      const response = await client(`change-orders?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})

      return response?.data
    },
    { enabled: !!projectId },
  )

  return {
    transactions,
    ...rest,
  }
}

export const useTransactionsV1 = (projectId?: string) => {
  const client = useClient()

  const { data: transactions, ...rest } = useQuery<Array<TransactionType>>(
    [GET_TRANSACTIONS_API_KEY, projectId],
    async () => {
      const response = await client(`change-orders/v1?projectId=${projectId}&sort=modifiedDate,asc`, {})

      await Promise.all(
        response?.data?.map(async t => {
          if (t.transactionType !== TransactionTypeValues.invoice) return

          const invoiceId = t.invoiceId

          const response = await client(`project-invoices/${invoiceId}`, {})

          const invoiceData = response?.data as InvoicingType

          if (invoiceData.status === InvoiceStatusValues.partialPaid) {
            t.status = 'Partial Paid'
          }
          if (invoiceData.status === InvoiceStatusValues.paid) {
            t.status = InvoiceStatusValues.paid
          }
        }),
      )

      return response?.data
    },
    { enabled: projectId !== 'undefined' && !!projectId },
  )

  return {
    transactions,
    ...rest,
  }
}

export const GET_TRANSACTIONS_BY_WORK_ORDER_API_KEY = 'transactions_work_order'

export const useWOTransactionsV1 = (workOrderId: string, projectId?: string) => {
  const client = useClient()

  const { data: transactions, ...rest } = useQuery<Array<TransactionType>>(
    [GET_TRANSACTIONS_BY_WORK_ORDER_API_KEY, projectId, workOrderId],
    async () => {
      const response = await client(`change-orders/v1?projectId=${projectId}&sort=modifiedDate,asc`, {})

      if (response && response.data) {
        response.data = response.data.filter(t => t.parentWorkOrderId === workOrderId)
      }

      return response?.data
    },
    { enabled: projectId !== 'undefined' },
  )

  return {
    transactions,
    ...rest,
  }
}

export const useProjectInfo = (projectId: string) => {
  const client = useClient()

  const { data: project, ...rest } = useQuery(['projects', projectId], async () => {
    const response = await client(`projects/${projectId}`, {})

    return response?.data
  })

  return {
    project,
    ...rest,
  }
}

const transactionTypeOptions = [
  {
    value: TransactionTypeValues.changeOrder,
    label: 'Change Order',
  },
  {
    value: TransactionTypeValues.draw,
    label: 'Draw',
  },
  {
    value: TransactionTypeValues.material,
    label: 'Material',
  },
  /* {
    value: TransactionTypeValues.payment,
    label: 'Payment',
  },*/
  {
    value: TransactionTypeValues.lateFee,
    label: 'Late Fee',
  },
  {
    value: TransactionTypeValues.shippingFee,
    label: 'Shipping Fee',
  },
  {
    value: TransactionTypeValues.carrierFee,
    label: 'Carrier Fee',
  },
  {
    value: TransactionTypeValues.permitFee,
    label: 'Permit Fee',
  },
  {
    value: TransactionTypeValues.depreciation,
    label: 'Depreciation',
  },
  {
    value: TransactionTypeValues.deductible,
    label: 'Deductible',
  },
  {
    value: TransactionTypeValues.legalFee,
    label: 'Legal Fee',
  },
]

export const useTransactionTypes = (screen?: string, projectStatus?: string) => {
  const { isVendor } = useUserRolesSelector()

  if (screen === 'WORK_ORDER_TRANSACTION_TABLE_MODAL' && !isVendor) {
    const transactionType = transactionTypeOptions.filter(option => option.label !== 'Payment')
    return {
      transactionTypeOptions: transactionType.slice(0, 4),
    }
  }
  if (projectStatus && [STATUS.Cancelled, STATUS.ClientPaid, STATUS.Paid].includes(projectStatus as STATUS)) {
    return {
      transactionTypeOptions: transactionTypeOptions.filter(t => t.label !== 'Legal Fee'),
    }
  }
  return {
    // Note for vendor user we only show change order and draw, that's why we filter out the rest
    transactionTypeOptions: isVendor ? transactionTypeOptions.slice(0, 2) : transactionTypeOptions,
  }
}

export const useTransactionStatusOptions = () => {
  const vendorOptions = [TransactionStatusValues.pending, TransactionStatusValues.cancelled]
  const { isVendor } = useUserRolesSelector()

  return isVendor
    ? TRANSACTION_STATUS_OPTIONS.filter(statusOption => vendorOptions.includes(statusOption.value))
    : TRANSACTION_STATUS_OPTIONS
}

export const WORK_ORDER_DEFAULT_VALUE = '0'
const WORK_ORDER_DEFAULT_OPTION = {
  label: 'ignore (Not applicable)',
  value: WORK_ORDER_DEFAULT_VALUE,
}

// create work order label for options title
export const createWorkOrderLabel = (skillName: string, companyName: string) => {
  return `${skillName} (${companyName})`
}

export const useProjectWorkOrdersWithChangeOrders = (projectId?: string) => {
  let workOrderSelectOptions: SelectOption[] = []
  const client = useClient()
  const { isVendor } = useUserRolesSelector()

  const { data: changeOrders, ...rest } = useQuery<Array<ProjectWorkOrder>>(
    ['workordersWithChangeOrders', projectId],
    async () => {
      const response = await client(`project/${projectId}/workordersWithChangeOrders`, {})

      return response?.data
    },
    {
      enabled: !!projectId,
    },
  )

  const changeOrderOptions = changeOrders?.map(changeOrder => ({
    label: createWorkOrderLabel(changeOrder.skillName, changeOrder.companyName),
    value: `${changeOrder.id}`,
  }))

  if (isVendor) {
    workOrderSelectOptions = changeOrderOptions || workOrderSelectOptions
  } else {
    workOrderSelectOptions = changeOrderOptions
      ? [WORK_ORDER_DEFAULT_OPTION, ...changeOrderOptions]
      : [WORK_ORDER_DEFAULT_OPTION]
  }

  return {
    workOrderSelectOptions,
    ...rest,
  }
}

export const AGAINST_DEFAULT_VALUE = '0'
const AGAINST_DEFAULT_OPTION = {
  label: 'Project SOW',
  value: AGAINST_DEFAULT_VALUE,
  awardStatus: null,
  isValidForAwardPlan: null,
}

export const createAgainstLabel = (companyName: string, woId: string) => {
  return `WO ${woId} (${companyName})`
}

export const useProjectWorkOrders = (projectId?: string, isUpdating?: boolean) => {
  const { isVendor, isAdmin } = useUserRolesSelector()
  const client = useClient()
  const VENDOR_EXPIRED = 15

  const { data: workOrders, ...rest } = useQuery<Array<ProjectWorkOrder>>(
    ['projectWorkOrders', projectId],
    async () => {
      const response = await client(`project/${projectId}/workorders`, {})

      return response?.data
    },
  )

  const workOrderOptions = useMemo(
    () =>
      workOrders
        ?.filter(wo => {
          const status = wo.statusLabel?.toLowerCase()
          const vendorExpiryCheck = wo.vendorStatusId !== VENDOR_EXPIRED || isAdmin
          return (
            (!(status === 'paid' || status === 'cancelled' || status === 'invoiced') && vendorExpiryCheck) || isUpdating
          )
        })
        .map(workOrder => ({
          label: createAgainstLabel(workOrder.companyName, `${workOrder.id}`),
          awardStatus: workOrder?.assignAwardPlan,
          onHoldWO: workOrder?.onHold,
          value: `${workOrder.id}`,
          isValidForAwardPlan: workOrder?.validForAwardPlan,
          isValidForNewAwardPlan: workOrder?.applyNewAwardPlan,
        })),
    [workOrders],
  )

  const workOrdersKeyValues:
    | {
        [key: string]: ProjectWorkOrder
      }
    | undefined = useMemo(
    () =>
      workOrders?.reduce(
        (workOrdersKeyValues, workOrder) => ({
          ...workOrdersKeyValues,
          [workOrder.id]: workOrder,
        }),
        {},
      ),
    [workOrders],
  )

  const againstOptions: SelectOption[] = useMemo(() => {
    if (isVendor) {
      return workOrderOptions || []
    } else {
      return workOrderOptions ? [AGAINST_DEFAULT_OPTION, ...workOrderOptions] : [AGAINST_DEFAULT_OPTION]
    }
  }, [workOrderOptions, isVendor])

  return {
    workOrdersKeyValues,
    againstOptions,
    ...rest,
  }
}

// Create label for change order
export const createChangeOrderLabel = (changeOrderAmount: number, workOrderName: string) => {
  return `$${changeOrderAmount} (${workOrderName})`
}

export const useWorkOrderChangeOrders = (workOrderId?: string) => {
  const client = useClient()
  const enabled = workOrderId !== null && workOrderId !== 'null' && workOrderId !== undefined

  const { data: changeOrders, ...rest } = useQuery<Array<ProjectWorkOrder>>(
    ['changeOrders', workOrderId],
    async () => {
      const response = await client(`change-orders?parentWorkOrderId.equals=${workOrderId}`, {})

      return response?.data
    },
    {
      enabled,
    },
  )

  const changeOrderOptions = useMemo(
    () =>
      changeOrders?.map(workOrder => ({
        label: createChangeOrderLabel(workOrder.changeOrderAmount, workOrder.name),
        value: workOrder.id,
        status: workOrder.status,
      })),
    [changeOrders?.length],
  )

  return {
    changeOrderSelectOptions: changeOrderOptions
      ? [CHANGE_ORDER_DEFAULT_OPTION, ...changeOrderOptions]
      : ([CHANGE_ORDER_DEFAULT_OPTION] as any),
    ...rest,
  }
}

export const useWorkOrderAwardStats = (
  workOrderId?: string,
  applyNewAwardPlan?: boolean,
  projectWorkOrderId?: string | number,
) => {
  const client = useClient()
  const enabled = workOrderId !== null && workOrderId !== 'null' && workOrderId !== undefined

  const { data: awardPlansStats, ...rest } = useQuery<Array<WorkOrderAwardStats>>(
    ['changeOrders', workOrderId, applyNewAwardPlan, projectWorkOrderId],
    async () => {
      let response

      if (applyNewAwardPlan) {
        response = await client(`v1/projects/${workOrderId}/${projectWorkOrderId}/workOrderPlanStat`, {})
      } else {
        response = await client(`projects/${workOrderId}/workOrderPlanStat`, {})
      }

      return response?.data
    },
    {
      enabled,
    },
  )

  return { awardPlansStats, ...rest }
}

export const getFileContents = async (document: any, documentType: number) => {
  if (!document) return Promise.resolve()

  if (document?.s3Url) return Promise.resolve()

  return new Promise(async (res, _) => {
    const fileContents = await readFileContent(document as File)
    res({
      documentType,
      fileObjectContentType: document.type,
      fileType: document.name,
      fileObject: fileContents,
    })
  })
}
export const useReasonTypes = () => {
  const client = useClient()

  return useQuery('reasonTypes', async () => {
    const response = await client(`lk_value/lookupType/22`, {})

    const formattedData = response?.data?.map(reasonType => ({
      label: reasonType.label,
      value: reasonType.value,
    }))

    return formattedData
  })
}
const generateLienWaiverPDF = async (lienWaiver: FormValues['lienWaiver'] | undefined) => {
  if (!lienWaiver?.claimantsSignature) return Promise.resolve(null)

  return new Promise((res, _) => {
    let form = new jsPdf()

    const dimention = {
      width: lienWaiver?.signatureWidth || 20,
      height: lienWaiver?.signatureHeight || 10,
    }

    convertImageToDataURL(lienWaiver?.claimantsSignature, (dataUrl: string) => {
      form = createForm(form, lienWaiver, dimention, dataUrl)
      const pdfUri = form.output('datauristring')

      res({
        documentType: 26,
        fileObject: pdfUri.split(',')[1],
        fileObjectContentType: 'application/pdf',
        fileType: `lienWaiver.pdf`,
      })
    })
  })
}

export const parseChangeOrderAPIPayload = async (
  formValues: FormValues,
  projectId?: string,
): Promise<ChangeOrderPayload> => {
  const expectedCompletionDate = dateISOFormat(formValues.expectedCompletionDate)
  const newExpectedCompletionDate = formValues.newExpectedCompletionDate as string

  const documents: any = []

  // Transaction attachment document
  const attachment = await getFileContents(formValues.attachment, formValues.transactionType?.value)
  const lienWaiverDocument = await generateLienWaiverPDF(formValues.lienWaiver)

  if (attachment) {
    documents.push(attachment)
  }

  if (lienWaiverDocument) {
    documents.push(lienWaiverDocument)
  }

  const isAgainstProjectSOWSelected = formValues.against?.value === AGAINST_DEFAULT_VALUE
  const againstProjectSOWPayload =
    isAgainstProjectSOWSelected && formValues.transactionType?.value === TransactionTypeValues.changeOrder
      ? {
          sowRelatedChangeOrderId:
            formValues.changeOrder?.value === CHANGE_ORDER_DEFAULT_VALUE ? null : `${formValues.changeOrder?.value}`,
          sowRelatedWorkOrderId:
            formValues.workOrder?.value === WORK_ORDER_DEFAULT_VALUE ? null : `${formValues.workOrder?.value}`,
          parentWorkOrderId: null,
        }
      : {
          parentWorkOrderId: isAgainstProjectSOWSelected ? null : `${formValues.against?.value}`,
        }

  const isOverpaymentTransaction = formValues.transactionType?.value === TransactionTypeValues.overpayment
  const paidDate = isOverpaymentTransaction ? formValues.paidBackDate : formValues.paidDate

  const markAsRevenue = isOverpaymentTransaction ? formValues.markAs?.value === TransactionMarkAsValues.revenue : null

  const lineItems = formValues.transaction
    .filter(transaction => transaction.amount !== '')
    .map(transaction => ({
      description: transaction.description,
      whiteoaksCost: transaction.amount,
      quantity: '0',
      unitCost: '0',
      vendorCost: '0',
    }))

  return {
    transactionType: formValues.transactionType?.value,
    createdDate1: formValues.dateCreated,
    createdBy: formValues.createdBy,
    newExpectedCompletionDate,
    expectedCompletionDate,
    markAsRevenue,
    clientApprovedDate: dateISOFormat(formValues.invoicedDate as string),
    paidDate: dateISOFormat(paidDate as string),
    paymentTerm: formValues.paymentTerm?.value || null,
    paymentTermDate: formValues.paymentTermDate,
    payDateVariance: formValues.payDateVariance || '',
    paymentReceived: dateISOFormat(formValues.paymentRecievedDate as string),
    lineItems,
    documents,
    projectId: projectId ?? '',
    paymentProcessed: formValues.paymentProcessed,
    payAfterDate: formValues.payAfterDate,
    verifiedByFpm: formValues.verifiedByFpm?.value,
    verifiedByManager: formValues.verifiedByManager?.value,
    reason: formValues.reason?.value,
    drawOnHold: formValues?.drawOnHold,
    ...againstProjectSOWPayload,
  }
}

export const parseChangeOrderUpdateAPIPayload = async (
  formValues: FormValues,
  transaction: ChangeOrderType,
  projectId?: string,
): Promise<ChangeOrderUpdatePayload> => {
  const payload = await parseChangeOrderAPIPayload(formValues, projectId)

  return {
    id: transaction.id,
    name: transaction.name,
    transactionTypeLabel: transaction.transactionTypeLabel,
    createdDate: transaction.createdDate,
    approvedBy: transaction.approvedBy,
    status: formValues.status?.value || transaction.status,
    modifiedDate1: formValues.dateCreated,
    modifiedBy: formValues.createdBy as string,
    vendorId: transaction.vendorId as number,
    // systemGenerated: transaction?.systemGenerated,
    ...payload,
    verifiedByFpm: formValues.verifiedByFpm?.value,
    verifiedByManager: formValues.verifiedByManager?.value,
    invoiceId: transaction?.invoiceId,
    invoiceNumber: transaction?.invoiceNumber,
    reason: formValues?.reason?.value,
    drawOnHold: formValues?.drawOnHold,
  }
}

export const transactionDefaultFormValues = (createdBy: string): FormValues => {
  return {
    transactionType: null,
    against: null,
    changeOrder: null,
    workOrder: null,
    status: null,
    dateCreated: dateFormat(new Date()),
    createdBy,
    modifiedBy: null,
    modifiedDate: null,
    markAs: null,
    paidBackDate: null,
    transaction: [TRANSACTION_FEILD_DEFAULT],
    attachment: null,
    lienWaiverDocument: null,
    lienWaiver: LIEN_WAIVER_DEFAULT_VALUES,
    paymentRecievedDate: null,
    invoicedDate: null,
    paymentTerm: null,
    paymentTermDate: null,
    paidDate: null,
    payDateVariance: '',
    expectedCompletionDate: '',
    newExpectedCompletionDate: '',
    reason: null,
    refund: false,
    paymentProcessed: null,
    payAfterDate: null,
    verifiedByFpm: null,
    verifiedByManager: null,
    drawOnHold: null,
  }
}

type DateType = string | Date | null

export const calculatePayDateVariance = (invoicedDate: DateType, paidDate: DateType) => {
  if (!invoicedDate || !paidDate) return ''

  return differenceInDays(new Date(invoicedDate), new Date(paidDate))?.toString() || ''
}

const getLatestDocument = (documents: Document[]) => {
  if (!documents) return null

  let latestDocument = documents?.[0]

  for (let i = 1; i < documents.length; i++) {
    const currentDocument = documents[i]

    if (
      differenceInMilliseconds(
        new Date(currentDocument.modifiedDate || ''),
        new Date(latestDocument.modifiedDate || ''),
      ) > 0
    ) {
      latestDocument = currentDocument
    }
  }

  return latestDocument
}

export const parseLienWaiverFormValues = (selectedWorkOrder: ProjectWorkOrder | undefined, totalAmount: string) => {
  return {
    claimantName: selectedWorkOrder?.claimantName || '',
    customerName: selectedWorkOrder?.customerName || '',
    propertyAddress: selectedWorkOrder?.propertyAddress || '',
    owner: selectedWorkOrder?.owner || '',
    makerOfCheck: selectedWorkOrder?.makerOfCheck || '',
    amountOfCheck: totalAmount,
    checkPayableTo: selectedWorkOrder?.claimantName || '',
    claimantsSignature: '',
    claimantTitle: '',
    dateOfSignature: '',
  }
}

export const parseTransactionToFormValues = (
  transaction: ChangeOrderType,
  againstOptions: SelectOption[],
  workOrderOptions: SelectOption[],
  changeOrderOptions: SelectOption[],
): FormValues => {
  const findOption = (value, options): SelectOption | null => {
    return options.find(option => option.value?.toString() === value) ?? null
  }

  const payDateVariance = calculatePayDateVariance(transaction.clientApprovedDate, transaction.paidDate)
  const drawOnHold = transaction?.drawOnHold
  const lienWaiverDocument = getLatestDocument(transaction.documents?.filter(doc => doc.fileType === 'lienWaiver.pdf'))
  const attachment = getLatestDocument(transaction.documents?.filter(doc => doc.fileType !== 'lienWaiver.pdf'))

  const againstOption =
    transaction.parentWorkOrderId === null
      ? againstOptions[0]
      : findOption(transaction.parentWorkOrderId?.toString(), againstOptions)

  const changeOrderOption =
    transaction.sowRelatedChangeOrderId === null
      ? changeOrderOptions[0]
      : findOption(transaction.sowRelatedChangeOrderId?.toString(), changeOrderOptions)

  const workOrderOption =
    transaction.sowRelatedWorkOrderId === null
      ? workOrderOptions[0]
      : findOption(transaction.sowRelatedWorkOrderId?.toString(), workOrderOptions)

  const vFpmOptions =
    transaction.verifiedByFpm === null ? null : findOption(transaction.verifiedByFpm, TRANSACTION_FPM_DM_STATUS_OPTIONS)

  const vDmOptions =
    transaction.verifiedByManager === null
      ? null
      : findOption(transaction.verifiedByManager, TRANSACTION_FPM_DM_STATUS_OPTIONS)

  const isRefunded =
    [
      TransactionTypeValues.material,
      TransactionTypeValues.lateFee,
      TransactionTypeValues.factoring,
      TransactionTypeValues.shippingFee,
      TransactionTypeValues.permitFee,
      TransactionTypeValues.carrierFee,
    ]?.includes(transaction.transactionType) && transaction.changeOrderAmount > 0

  const markAs = transaction.markAsRevenue ? TRANSACTION_MARK_AS_OPTIONS.revenue : TRANSACTION_MARK_AS_OPTIONS.paid
  const paidBackDate = transaction.transactionType === TransactionTypeValues.overpayment ? transaction.paidDate : null

  return {
    transactionType: {
      label: transaction.transactionTypeLabel,
      value: transaction.transactionType,
    },
    reason: REASON_STATUS_OPTIONS.find(v => v.value.toLowerCase() === transaction?.reason?.toLocaleLowerCase()) ?? null,
    drawOnHold,
    against: againstOption,
    workOrder: workOrderOption,
    changeOrder: changeOrderOption,
    status: findOption(transaction.status, TRANSACTION_STATUS_OPTIONS),
    expectedCompletionDate: dateFormat(transaction.parentWorkOrderExpectedCompletionDate as string),
    newExpectedCompletionDate: datePickerFormat(transaction.newExpectedCompletionDate as string),
    createdBy: transaction.createdBy,
    dateCreated: dateFormat(transaction.createdDate as string),
    markAs,
    paidBackDate: datePickerFormat(paidBackDate as string),
    attachment,
    lienWaiverDocument,
    modifiedBy: transaction.modifiedBy,
    modifiedDate: dateFormat(transaction.modifiedDate as string),
    invoicedDate: datePickerFormat(transaction.clientApprovedDate as string),
    paymentTerm: findOption(`${transaction.paymentTerm}`, PAYMENT_TERMS_OPTIONS),
    paymentTermDate: transaction.paymentTermDate,
    paidDate: datePickerFormat(transaction.paidDate as string),
    payDateVariance,
    paymentProcessed: transaction.paymentProcessed,
    payAfterDate: transaction.payAfterDate,
    verifiedByFpm: vFpmOptions,
    verifiedByManager: vDmOptions,
    paymentRecievedDate: datePickerFormat(transaction.paymentReceived as string),
    refund: isRefunded,
    transaction:
      transaction?.lineItems?.map(item => ({
        id: item.id,
        description: item.description,
        amount: `${item.whiteoaksCost + item.vendorCost}`,
        checked: false,
      })) ?? [],
  }
}

export const useChangeOrderMutation = (projectId?: string) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: ChangeOrderPayload) => {
      return client('change-orders', {
        data: payload,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([GET_TRANSACTIONS_BY_WORK_ORDER_API_KEY, projectId])
        queryClient.invalidateQueries([GET_TRANSACTIONS_API_KEY, projectId])
        queryClient.invalidateQueries(['invoices', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries([PROJECT_FINANCIAL_OVERVIEW_API_KEY, projectId])
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        queryClient.invalidateQueries(['changeOrder', projectId])
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(ACCONT_RECEIVABLE_API_KEY)
        queryClient.invalidateQueries(ACCOUNT_CARDS_RECEIVABLE_API_KEY)
        queryClient.invalidateQueries(['audit-logs', projectId])
        queryClient.invalidateQueries('reasonTypes')

        toast({
          title: 'New Transaction.',
          description: 'Transaction has been created successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: ErrorType) {
        toast({
          title: error?.title || 'Error while creating transaction.',
          description: error?.message || 'Something went wrong.',
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useChangeOrderUpdateMutation = (projectId?: string) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: ChangeOrderUpdatePayload) => {
      return client('change-orders', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('transactions_work_order')
        queryClient.invalidateQueries(['invoices', projectId])
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        queryClient.invalidateQueries([PROJECT_FINANCIAL_OVERVIEW_API_KEY, projectId])
        queryClient.invalidateQueries(['changeOrder', projectId])
        queryClient.invalidateQueries(['overpayment', Number(projectId)])
        queryClient.invalidateQueries(ACCONT_RECEIVABLE_API_KEY)
        queryClient.invalidateQueries(ACCOUNT_CARDS_RECEIVABLE_API_KEY)
        queryClient.invalidateQueries(ACCONT_PAYABLE_API_KEY)
        queryClient.invalidateQueries(GET_PAGINATED_RECEIVABLE_QUERY_KEY)
        queryClient.invalidateQueries(['audit-logs', projectId])
        queryClient.invalidateQueries(['changeOrders'])
        queryClient.invalidateQueries(['WorkOrderDetails'])
        queryClient.invalidateQueries([AP_CARDS])

        toast({
          title: 'Update Transaction.',
          description: 'Transaction has been updated successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: ErrorType) {
        toast({
          title: error?.title || 'Error while updating transaction.',
          description: error?.message || 'Something went wrong.',
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useTransaction = (transactionId?: number) => {
  const client = useClient()

  const { data: changeOrder, ...rest } = useQuery<ChangeOrderType>(
    ['transaction', transactionId],
    async () => {
      const response = await client(`change-orders/${transactionId}`, {})

      return response?.data
    },
    {
      enabled: !!transactionId,
    },
  )

  return {
    transaction: changeOrder,
    ...rest,
  }
}

export const useManagerEnabled = (projectId?: string) => {
  const client = useClient()

  const { data: managerEnabled } = useQuery(['managerEnabled'], async () => {
    const response = await client(`user/draw/permission/${projectId}`, {})
    return response?.data
  })

  return {
    managerEnabled,
  }
}

export const useTransactionExport = projectId => {
  const client = useClient()
  const [exportData, setExport] = useState([])
  const numberFormatter = value => numeral(value).format('$0,0.00')
  const formatDocumentResponse = data => {
    if (!data) return
    let exportData: any = []
    data.forEach(item => {
      exportData.push({
        ID: item.name ?? '',
        Type: item.transactionTypeLabel ?? '',
        Trade: item.skillName ?? '',
        Name: item.vendor || item.transactionOf || '',
        Details: 'Total ',
        Amount: item.changeOrderAmount ? numberFormatter(item.changeOrderAmount) : '',
        'Date submitted': dateFormat(item.createdDate) ?? '',
        'Date Approved': dateFormat(item.approvedDate) ?? '',
        'Approved by': item.approvedBy ?? '',
      })
      item.lineItems?.forEach(lineItem => {
        exportData.push({
          ID: '',
          Type: '',
          Trade: '',
          Name: '',
          Details: lineItem.description ?? '',
          Amount: lineItem.whiteoaksCost ? numberFormatter(lineItem.whiteoaksCost) : '',
          'Date submitted': dateFormat(item.createdDate) ?? '',
          'Date Approved': dateFormat(item.approvedDate) ?? '',
          'Approved by': item.approvedBy ?? '',
        })
      })
    })
    return exportData
  }

  useQuery(
    ['changeOrder', projectId],
    async () => {
      const response = await client(`changeOrder/project/${projectId}`, {})
      setExport(formatDocumentResponse(response?.data))
    },
    { enabled: !!projectId },
  )

  return {
    exportData,
  }
}

export const useOverPaymentTransaction = (transactionType?: number) => {
  const client = useClient()

  const { data: transactions, ...rest } = useQuery<Array<TransactionType>>(
    ['transactions', transactionType],
    async () => {
      const response = await client(`change-orders?transactionType.equals=${transactionType}&sort=modifiedDate,asc`, {})

      return response?.data
    },
  )

  return {
    transactions,
    ...rest,
  }
}

export const useUploadMaterialAttachment = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (payload: any) => {
      return client('smart-material-scan', {
        data: payload,
        method: 'POST',
      })
    },
    {
      onError(error: ErrorType) {
        toast({
          title: error?.title || 'Error while uploading attachment.',
          description: error?.message || 'Something went wrong.',
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

const swoPrefix = '/smartwo/api'
export const useFetchMaterialItems = (correlationId: string | null | undefined, refetchInterval: number) => {
  const client = useClient(swoPrefix)
  const { data, ...rest } = useQuery<any>(
    ['fetchMaterialItems', correlationId],
    async () => {
      const response = await client(`smart-materials/correlation/` + correlationId, {})

      return response?.data
    },
    {
      enabled: !!correlationId,
      refetchInterval: refetchInterval,
    },
  )

  return {
    materialItems: data || {},
    ...rest,
  }
}

export const mapMaterialItemstoTransactions = (items, isRefund) => {
  return items?.map(i => {
    return {
      id: Date.now(),
      description: i.description,
      amount: isRefund ? Math.abs(i.whiteoaksCost) : i.whiteoaksCost,
      checked: false,
    }
  })
}
