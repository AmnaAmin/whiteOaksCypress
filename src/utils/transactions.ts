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
  TransactionStatusValues,
  TransactionType,
  TransactionTypeValues,
} from 'types/transaction.type'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { dateFormat, dateISOFormat, datePickerFormat } from './date-time-utils'
import { useUserRolesSelector } from './redux-common-selectors'
import { readFileContent } from './vendor-details'
import { useMemo } from 'react'
import addDays from 'date-fns/addDays'
import differenceInDays from 'date-fns/differenceInDays'
import { convertImageToDataURL } from 'components/table/util'
import { createForm } from './lien-waiver'
import { Document } from 'types/vendor.types'

export const useTransactions = (projectId?: string) => {
  const client = useClient()

  const { data: transactions, ...rest } = useQuery<Array<TransactionType>>(['transactions', projectId], async () => {
    const response = await client(`change-orders?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})

    return response?.data
  })

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

const adminOrOperationTransactionTypeOptions = [
  {
    value: TransactionTypeValues.material,
    label: 'Material',
  },
  {
    value: TransactionTypeValues.payment,
    label: 'Payment',
  },
]

export const useTransactionTypes = () => {
  const { isProjectCoordinator, isAdmin } = useUserRolesSelector()
  const transactionTypeOptions = [
    {
      value: TransactionTypeValues.changeOrder,
      label: 'Change Order',
    },
    {
      value: TransactionTypeValues.draw,
      label: 'Draw',
    },
  ]

  return {
    transactionTypeOptions:
      isAdmin || isProjectCoordinator
        ? [...transactionTypeOptions, ...adminOrOperationTransactionTypeOptions]
        : transactionTypeOptions,
  }
}

export const TRANSACTION_STATUS_OPTIONS = [
  { value: TransactionStatusValues.pending, label: 'Pending' },
  { value: TransactionStatusValues.approved, label: 'Approved' },
  { value: TransactionStatusValues.cancelled, label: 'Cancelled' },
  { value: TransactionStatusValues.denied, label: 'Denied' },
]

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

export const createWorkOrderLabel = (skillName: string, companyName: string) => {
  return `${skillName} (${companyName})`
}

export const useProjectWorkOrdersWithChangeOrders = (projectId?: string) => {
  let workOrderSelectOptions: SelectOption[] = []
  const client = useClient()
  const { isAdmin, isProjectCoordinator } = useUserRolesSelector()

  const { data: changeOrders, ...rest } = useQuery<Array<ProjectWorkOrder>>(
    ['workordersWithChangeOrders', projectId],
    async () => {
      const response = await client(`project/${projectId}/workordersWithChangeOrders`, {})

      return response?.data
    },
  )

  const changeOrderOptions = changeOrders?.map(changeOrder => ({
    label: createWorkOrderLabel(changeOrder.skillName, changeOrder.companyName),
    value: `${changeOrder.id}`,
  }))

  if (isAdmin || isProjectCoordinator) {
    workOrderSelectOptions = changeOrderOptions
      ? [WORK_ORDER_DEFAULT_OPTION, ...changeOrderOptions]
      : [WORK_ORDER_DEFAULT_OPTION]
  } else {
    workOrderSelectOptions = changeOrderOptions || workOrderSelectOptions
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
}

export const createAgainstOptionLabel = (companyName: string, skillName: string) => {
  return `${companyName} (${skillName})`
}

export const useProjectWorkOrders = (projectId?: string) => {
  const { isAdmin, isProjectCoordinator } = useUserRolesSelector()
  const client = useClient()

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
          return !(status === 'paid' || status === 'cancelled')
        })
        .map(workOrder => ({
          label: createAgainstOptionLabel(workOrder.companyName, workOrder.skillName),
          value: `${workOrder.id}`,
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
    if (isAdmin || isProjectCoordinator) {
      return workOrderOptions ? [AGAINST_DEFAULT_OPTION, ...workOrderOptions] : [AGAINST_DEFAULT_OPTION]
    } else {
      return workOrderOptions || []
    }
  }, [workOrderOptions, isAdmin, isProjectCoordinator])

  return {
    workOrdersKeyValues,
    againstOptions,
    ...rest,
  }
}

export const CHANGE_ORDER_DEFAULT_VALUE = '0'
const CHANGE_ORDER_DEFAULT_OPTION = {
  label: '$0.00',
  value: CHANGE_ORDER_DEFAULT_VALUE,
}

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
      })),
    [changeOrders?.length],
  )

  return {
    changeOrderSelectOptions: changeOrderOptions
      ? [CHANGE_ORDER_DEFAULT_OPTION, ...changeOrderOptions]
      : [CHANGE_ORDER_DEFAULT_OPTION],
    ...rest,
  }
}

const getFileContents = async (document: any, documentType: number) => {
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
  const newExpectedCompletionDate = dateISOFormat(formValues.newExpectedCompletionDate)

  const documents: any = []

  // Transaction attachment document
  const attachment = await getFileContents(formValues.attachment, 58)
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
    clientApprovedDate: dateISOFormat(formValues.invoicedDate as string),
    paidDate: dateISOFormat(formValues.paidDate as string),
    paymentTerm: formValues.paymentTerm?.value || null,
    payDateVariance: formValues.payDateVariance || '',
    lineItems,
    documents,
    projectId: projectId ?? '',
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
    ...payload,
  }
}

export const TRANSACTION_FEILD_DEFAULT = {
  id: Date.now(),
  description: '',
  amount: '',
  checked: false,
}

export const LIEN_WAIVER_DEFAULT_VALUES = {
  claimantName: '',
  customerName: '',
  propertyAddress: '',
  owner: '',
  makerOfCheck: '',
  amountOfCheck: '',
  checkPayableTo: '',
  claimantsSignature: '',
  claimantTitle: '',
  dateOfSignature: '',
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
    transaction: [TRANSACTION_FEILD_DEFAULT],
    attachment: null,
    lienWaiverDocument: null,
    lienWaiver: LIEN_WAIVER_DEFAULT_VALUES,
    paymentRecieved: null,
    invoicedDate: null,
    paymentTerm: null,
    paidDate: null,
    payDateVariance: '',
    expectedCompletionDate: '',
    newExpectedCompletionDate: '',
    refundMaterial: false,
  }
}

type DateType = string | Date | null

export const calculatePayDateVariance = (invoicedDate: DateType, paidDate: DateType, paymentTerm) => {
  if (!invoicedDate || !paidDate) return ''

  const expectedPaymentDate = addDays(new Date(invoicedDate), Number(paymentTerm))

  return differenceInDays(expectedPaymentDate, new Date(paidDate))?.toString() || ''
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
    return options.find(option => option.value === value) ?? null
  }
  const payDateVariance = calculatePayDateVariance(
    transaction.clientApprovedDate,
    transaction.paidDate,
    transaction.paymentTerm,
  )

  const lienWaiverDocument = getLatestDocument(transaction.documents?.filter(doc => doc.fileType === 'lienWaiver.pdf'))
  const attachment = getLatestDocument(transaction.documents?.filter(doc => doc.fileType !== 'lienWaiver.pdf'))

  return {
    transactionType: {
      label: transaction.transactionTypeLabel,
      value: transaction.transactionType,
    },
    against:
      transaction.parentWorkOrderId === null
        ? againstOptions[0]
        : findOption(transaction.parentWorkOrderId?.toString(), againstOptions),
    workOrder: findOption(transaction.sowRelatedWorkOrderId?.toString(), workOrderOptions),
    changeOrder:
      transaction.sowRelatedChangeOrderId === null
        ? changeOrderOptions[0]
        : findOption(transaction.sowRelatedChangeOrderId?.toString(), changeOrderOptions),
    status: findOption(transaction.status, TRANSACTION_STATUS_OPTIONS),
    expectedCompletionDate: dateFormat(transaction.parentWorkOrderExpectedCompletionDate as string),
    newExpectedCompletionDate: '',
    createdBy: transaction.createdBy,
    dateCreated: dateFormat(transaction.createdDate as string),
    attachment,
    lienWaiverDocument,
    modifiedBy: transaction.modifiedBy,
    modifiedDate: dateFormat(transaction.modifiedDate as string),
    invoicedDate: datePickerFormat(transaction.clientApprovedDate as string),
    paymentTerm: findOption(`${transaction.paymentTerm}`, PAYMENT_TERMS_OPTIONS),
    paidDate: datePickerFormat(transaction.paidDate as string),
    payDateVariance,
    paymentRecieved: null,
    refundMaterial: false,
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
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        toast({
          title: 'New Transaction.',
          description: 'Transaction has been created successfully.',
          status: 'success',
          isClosable: true,
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
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        toast({
          title: 'Update Transaction.',
          description: 'Transaction has been updated successfully.',
          status: 'success',
          isClosable: true,
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

export const PAYMENT_TERMS_OPTIONS = [
  {
    value: '7',
    label: '7',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '14',
    label: '14',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '30',
    label: '30',
  },
]
