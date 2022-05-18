import {
  ChangeOrderType,
  FormValues,
  ProjectWorkOrder,
  SelectOption,
  TransactionTypeValues,
} from 'types/transaction.type'
import { AGAINST_DEFAULT_VALUE } from 'utils/transactions'
import { Control, useWatch } from 'react-hook-form'
import numeral from 'numeral'
import { useEffect, useMemo } from 'react'

export const useFieldShowHideDecision = (control: Control<FormValues, any>, transaction?: ChangeOrderType) => {
  const transactionType = useWatch({ name: 'transactionType', control })
  const against = useWatch({ name: 'against', control })
  const selectedTransactionTypeId = transactionType?.value
  const selectedAgainstId = against?.value

  const isTransactionTypeChangeOrderSelected =
    selectedTransactionTypeId && selectedTransactionTypeId === TransactionTypeValues.changeOrder
  const isAgainstWorkOrderOptionSelected = selectedAgainstId && selectedAgainstId !== AGAINST_DEFAULT_VALUE
  const isAgainstProjectSOWOptionSelected = selectedAgainstId && selectedAgainstId === AGAINST_DEFAULT_VALUE
  const isShowStatusField = !!transaction
  const isTransactionTypeDrawAgainstProjectSOWSelected =
    isAgainstProjectSOWOptionSelected && selectedTransactionTypeId === TransactionTypeValues.draw
  const isShowRefundMaterialCheckbox = selectedTransactionTypeId === TransactionTypeValues.material

  return {
    isShowWorkOrderSelectField: isAgainstProjectSOWOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowChangeOrderSelectField: isAgainstProjectSOWOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowExpectedCompletionDateField: isAgainstWorkOrderOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowNewExpectedCompletionDateField: isAgainstWorkOrderOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowStatusField,
    isTransactionTypeDrawAgainstProjectSOWSelected,
    isShowRefundMaterialCheckbox,
  }
}

export const useTotalAmount = (control: Control<FormValues, any>) => {
  const transaction = useWatch({ name: 'transaction', control })
  const totalAmount = transaction?.reduce((result, transaction) => {
    if (transaction.amount) {
      return result + Number(transaction.amount)
    } else {
      return result
    }
  }, 0)

  return { formattedAmount: numeral(totalAmount).format('$0,0[.]00'), amount: totalAmount }
}

export const useIsLienWaiverRequired = (control: Control<FormValues, any>, transaction) => {
  const transactionType = useWatch({ name: 'transactionType', control })
  const against = useWatch({ name: 'against', control })

  return (
    !transaction &&
    transactionType?.value === TransactionTypeValues.draw &&
    against &&
    against.value !== AGAINST_DEFAULT_VALUE
  )
}

export const useSelectedWorkOrder = (
  control: Control<FormValues, any>,
  workOrdersKeyValues: { [key: string]: ProjectWorkOrder } | undefined,
) => {
  const selectedWorkOrderOption = useWatch({ name: 'against', control })

  return workOrdersKeyValues?.[selectedWorkOrderOption?.value]
}

export const useLienWaiverFormValues = (
  control: Control<FormValues, any>,
  selectedWorkOrder: ProjectWorkOrder | undefined,
  setValue,
) => {
  const { formattedAmount: totalAmount } = useTotalAmount(control)

  useEffect(() => {
    const lienWaiver = {
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

    setValue('lienWaiver', lienWaiver)
  }, [totalAmount, selectedWorkOrder, setValue])
}

export const useAgainstOptions = (againstOptions: SelectOption[], control: Control<FormValues, any>) => {
  const transactionType = useWatch({ name: 'transactionType', control })

  return useMemo(() => {
    if (transactionType?.value === TransactionTypeValues.material) {
      return againstOptions.slice(1)
    }

    if (transactionType?.value === TransactionTypeValues.payment) {
      return againstOptions.slice(0, 1)
    }

    return againstOptions
  }, [transactionType])
}
