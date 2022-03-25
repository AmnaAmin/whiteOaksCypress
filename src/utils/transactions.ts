import { useToast } from '@chakra-ui/toast'
import {
  ChangeOrderPayload,
  ChangeOrderType,
  ChangeOrderUpdatePayload,
  FormValues,
  ProjectWorkOrder,
  SelectOption,
  TransactionType,
  TransactionTypeValues,
} from 'types/transaction.type'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { dateFormat, dateISOFormat } from './date-time-utils'
import { useUserRolesSelector } from './redux-common-selectors'

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
  const { isAdmin } = useUserRolesSelector()
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
    transactionTypeOptions: isAdmin
      ? [...transactionTypeOptions, ...adminOrOperationTransactionTypeOptions]
      : transactionTypeOptions,
  }
}

export const WORK_ORDER_DEFAULT_VALUE = '0'
const WORK_ORDER_DEFAULT_OPTION = {
  label: 'ignore (Not applicable)',
  value: WORK_ORDER_DEFAULT_VALUE,
}

export const useProjectWorkOrdersWithChangeOrders = (projectId?: string) => {
  let workOrderSelectOptions: SelectOption[] = []
  const client = useClient()
  const { isAdmin } = useUserRolesSelector()

  const { data: changeOrders, ...rest } = useQuery<Array<ProjectWorkOrder>>(
    ['workordersWithChangeOrders', projectId],
    async () => {
      const response = await client(`project/${projectId}/workordersWithChangeOrders`, {})

      return response?.data
    },
  )

  const changeOrderOptions = changeOrders?.map(changeOrder => ({
    label: `${changeOrder.skillName} (${changeOrder.companyName})`,
    value: changeOrder.id,
  }))

  if (isAdmin) {
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
  let againstOptions: SelectOption[] = []
  const { isAdmin } = useUserRolesSelector()
  const client = useClient()

  const { data: workOrders, ...rest } = useQuery<Array<ProjectWorkOrder>>(
    ['projectWorkOrders', projectId],
    async () => {
      const response = await client(`project/${projectId}/workorders`, {})

      return response?.data
    },
  )
  const workOrderOptions = workOrders
    ?.filter(wo => wo.statusLabel !== 'Paid')
    .map(workOrder => ({
      label: `${workOrder.companyName} (${workOrder.skillName})`,
      value: workOrder.id,
    }))

  const workOrdersKeyValues:
    | {
        [key: string]: ProjectWorkOrder
      }
    | undefined = workOrders?.reduce(
    (workOrdersKeyValues, workOrder) => ({
      ...workOrdersKeyValues,
      [workOrder.id]: workOrder,
    }),
    {},
  )

  if (isAdmin) {
    againstOptions = workOrderOptions ? [AGAINST_DEFAULT_OPTION, ...workOrderOptions] : [AGAINST_DEFAULT_OPTION]
  } else {
    againstOptions = workOrderOptions || againstOptions
  }

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

  const changeOrderOptions = changeOrders?.map(workOrder => ({
    label: `${workOrder.companyName} (${workOrder.skillName})`,
    value: workOrder.id,
  }))

  return {
    changeOrderSelectOptions: changeOrderOptions
      ? [CHANGE_ORDER_DEFAULT_OPTION, ...changeOrderOptions]
      : [CHANGE_ORDER_DEFAULT_OPTION],
    ...rest,
  }
}

export const parseChangeOrderAPIPayload = (formValues: FormValues, projectId?: string): ChangeOrderPayload => {
  const expectedCompletionDate = dateISOFormat(formValues.expectedCompletionDate)
  const newExpectedCompletionDate = dateISOFormat(formValues.newExpectedCompletionDate)

  const againstProjectSOWPayload =
    formValues.against?.value === AGAINST_DEFAULT_VALUE
      ? {
          sowRelatedChangeOrderId: formValues.changeOrder?.value,
          sowRelatedWorkOrderId: `${formValues.against?.value}`,
          parentWorkOrderId: null,
        }
      : {
          parentWorkOrderId: `${formValues.against?.value}`,
        }

  return {
    transactionType: formValues.transactionType?.value,
    createdDate1: formValues.dateCreated,
    createdBy: formValues.createdBy,
    newExpectedCompletionDate,
    expectedCompletionDate,
    clientApprovedDate: null,
    paidDate: null,
    lineItems: formValues.transaction.map(transaction => ({
      description: transaction.description,
      whiteoaksCost: transaction.amount,
      quantity: '0',
      unitCost: '0',
      vendorCost: '0',
    })),
    projectId: projectId ?? '',
    ...againstProjectSOWPayload,
  }
}

export const parseChangeOrderUpdateAPIPayload = (
  formValues: FormValues,
  transaction: ChangeOrderType,
  projectId?: string,
): ChangeOrderUpdatePayload => {
  const expectedCompletionDate = dateISOFormat(formValues.expectedCompletionDate)
  const newExpectedCompletionDate = dateISOFormat(formValues.newExpectedCompletionDate)

  const againstProjectSOWPayload =
    formValues.against?.value === AGAINST_DEFAULT_VALUE
      ? {
          sowRelatedChangeOrderId: formValues.changeOrder?.value,
          sowRelatedWorkOrderId: `${formValues.against?.value}`,
          parentWorkOrderId: null,
        }
      : {
          parentWorkOrderId: formValues.against?.value,
        }

  return {
    id: transaction.id,
    name: transaction.name,
    transactionTypeLabel: transaction.transactionTypeLabel,
    createdDate: transaction.createdDate,
    approvedBy: transaction.approvedBy,
    createdBy: transaction.createdBy as string,
    transactionType: formValues.transactionType?.value,
    status: transaction.status,
    modifiedDate1: formValues.dateCreated,
    createdDate1: formValues.dateCreated,
    modifiedBy: formValues.createdBy as string,
    newExpectedCompletionDate,
    expectedCompletionDate,
    clientApprovedDate: null,
    paidDate: null,
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
    ...againstProjectSOWPayload,
  }

  // return {
  //   id: 24444,
  //   name: 'DR-ADT Renovations Inc-01/07/2022',
  //   transactionTypeLabel: 'Draw',
  //   skillName: 'General Labor',
  //   vendor: 'ADT Renovations Inc',
  //   changeOrderAmount: 1000,
  //   status: 'PENDING',
  //   createdDate: '2022-01-07T16:06:34Z',
  //   approvedBy: null,
  //   transactionType: 30,
  //   parentWorkOrderId: 5122,
  //   createdDate1: '01/07/2022',
  //   createdBy: 'vendor@devtek.ai',
  //   modifiedDate1: '01/07/2022',
  //   modifiedBy: 'vendor@devtek.ai',
  //   newExpectedCompletionDate: null,
  //   expectedCompletionDate: null,
  //   clientApprovedDate: null,
  //   paidDate: null,
  //   lineItems: [
  //     {
  //       id: 25373,
  //       description: 'exclude paint',
  //       unitCost: '0',
  //       quantity: '0',
  //       vendorCost: '0',
  //       whiteoaksCost: '-1000',
  //     },
  //   ],
  //   projectId: 2775,
  // };
}

export const TRANSACTION_FEILD_DEFAULT = {
  id: Date.now(),
  description: '',
  amount: '',
}
export const transactionDefaultFormValues = (createdBy: string): FormValues => {
  return {
    transactionType: null,
    against: null,
    changeOrder: null,
    workOrder: null,
    expectedCompletionDate: '',
    newExpectedCompletionDate: '',
    dateCreated: dateFormat(new Date()),
    createdBy,
    transaction: [TRANSACTION_FEILD_DEFAULT],
  }
}

export const parseTransactionToFormValues = (
  transaction: ChangeOrderType,
  againstOptions: SelectOption[],
): FormValues => {
  return {
    transactionType: {
      label: transaction.transactionTypeLabel,
      value: transaction.transactionType,
    },
    against: againstOptions.find(option => option.value === transaction.parentWorkOrderId) ?? null,
    workOrder: null,
    changeOrder: null,
    expectedCompletionDate: dateFormat(transaction.parentWorkOrderExpectedCompletionDate as string) ?? null,
    newExpectedCompletionDate: '',
    createdBy: transaction.createdBy,
    dateCreated: dateFormat(transaction.createdDate as string),
    transaction:
      transaction?.lineItems?.map(item => ({
        id: item.id,
        description: item.description,
        amount: `${item.whiteoaksCost}`,
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
        toast({
          title: 'Update Transaction.',
          description: 'Transaction has been updated successfully.',
          status: 'success',
          duration: 9000,
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
