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
    label: `${changeOrder.skillName} (${changeOrder.companyName})`,
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
          label: `${workOrder.companyName} (${workOrder.skillName})`,
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

export const useWorkOrderChangeOrders = (workOrderId?: string) => {
  const client = useClient()

  const { data: changeOrders, ...rest } = useQuery<Array<ProjectWorkOrder>>(
    ['changeOrders', workOrderId],
    async () => {
      const response = await client(`change-orders?parentWorkOrderId.equals=${workOrderId}`, {})

      return response?.data
    },
    {
      enabled: !!workOrderId,
    },
  )

  const changeOrderOptions = useMemo(
    () =>
      changeOrders?.map(workOrder => ({
        label: `$${workOrder.changeOrderAmount} (${workOrder.name})`,
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

export const parseChangeOrderAPIPayload = async (
  formValues: FormValues,
  projectId?: string,
): Promise<ChangeOrderPayload> => {
  const expectedCompletionDate = dateISOFormat(formValues.expectedCompletionDate)
  const newExpectedCompletionDate = dateISOFormat(formValues.newExpectedCompletionDate)

  const document = formValues.attachment

  let attachment

  if (document) {
    const fileContents = await readFileContent(document as File)
    attachment = {
      documentType: 58,
      fileObjectContentType: document.type,
      fileType: document.name,
      fileObject: fileContents,
    }
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
    lineItems: formValues.transaction.map(transaction => ({
      description: transaction.description,
      whiteoaksCost: transaction.amount,
      quantity: '0',
      unitCost: '0',
      vendorCost: '0',
    })),
    documents: attachment ? [attachment] : [],
    projectId: projectId ?? '',
    ...againstProjectSOWPayload,
  }
}

export const parseChangeOrderUpdateAPIPayload = async (
  formValues: FormValues,
  transaction: ChangeOrderType,
  projectId?: string,
): Promise<ChangeOrderUpdatePayload> => {
  const expectedCompletionDate = dateISOFormat(formValues.expectedCompletionDate)
  const newExpectedCompletionDate = dateISOFormat(formValues.newExpectedCompletionDate)

  let attachment
  if (formValues.attachment?.name) {
    const fileContents = await readFileContent(formValues.attachment as File)
    attachment = {
      documentType: 58,
      fileObjectContentType: formValues.attachment.type,
      fileType: formValues.attachment.name,
      fileObject: fileContents,
    }
  } else {
    attachment = formValues.attachment
  }

  const againstProjectSOWSelected = formValues.against?.value === AGAINST_DEFAULT_VALUE
  const againstProjectSOWPayload =
    againstProjectSOWSelected && formValues.transactionType?.value === TransactionTypeValues.changeOrder
      ? {
          sowRelatedChangeOrderId:
            formValues.changeOrder?.value === CHANGE_ORDER_DEFAULT_VALUE ? null : `${formValues.changeOrder?.value}`,
          sowRelatedWorkOrderId:
            formValues.workOrder?.value === WORK_ORDER_DEFAULT_VALUE ? null : `${formValues.workOrder?.value}`,
          parentWorkOrderId: null,
        }
      : {
          parentWorkOrderId: againstProjectSOWSelected ? null : formValues.against?.value,
        }

  return {
    id: transaction.id,
    name: transaction.name,
    transactionTypeLabel: transaction.transactionTypeLabel,
    createdDate: transaction.createdDate,
    approvedBy: transaction.approvedBy,
    createdBy: transaction.createdBy as string,
    transactionType: formValues.transactionType?.value,
    status: formValues.status?.value || transaction.status,
    modifiedDate1: formValues.dateCreated,
    createdDate1: formValues.dateCreated,
    modifiedBy: formValues.createdBy as string,
    newExpectedCompletionDate,
    expectedCompletionDate,
    paymentTerm: formValues.paymentTerm?.value || null,
    clientApprovedDate: dateISOFormat(formValues.invoicedDate as string),
    paidDate: dateISOFormat(formValues.paidDate as string),
    lineItems: formValues.transaction.map(t => ({
      id: t.id,
      description: t.description,
      whiteoaksCost: t.amount,
      quantity: '0',
      unitCost: '0',
      vendorCost: '0',
    })),
    projectId: Number(projectId),
    vendorId: transaction.vendorId as number,
    documents: attachment ? [attachment] : [],
    ...againstProjectSOWPayload,
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
    transaction: [TRANSACTION_FEILD_DEFAULT],
    attachment: null,
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
    attachment: transaction?.documents?.[0],
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
        amount: `${item.whiteoaksCost}`,
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
          duration: 9000,
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
          duration: 5000,
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
