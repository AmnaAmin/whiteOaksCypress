import { ProjectWorkOrder, TransactionTypeValues } from 'types/transaction.type'
import { AGAINST_DEFAULT_VALUE } from 'utils/transactions'
import { useWatch } from 'react-hook-form'
import numeral from 'numeral'
import { useEffect } from 'react'

export const useFieldShowHideDecision = control => {
  const transactionType = useWatch({ name: 'transactionType', control })
  const against = useWatch({ name: 'against', control })
  const selectedTransactionTypeId = transactionType?.value
  const selectedAgainstId = against?.value

  const isTransactionTypeDefaultOptionSelected =
    selectedTransactionTypeId && selectedTransactionTypeId === TransactionTypeValues.changeOrder
  const isAgainstWorkOrderOptionSelected = selectedAgainstId && selectedAgainstId !== AGAINST_DEFAULT_VALUE
  const isAgainstProjectSOWOptionSelected = selectedAgainstId && selectedAgainstId === AGAINST_DEFAULT_VALUE

  return {
    isShowWorkOrderSelectField: isAgainstProjectSOWOptionSelected,
    isShowChangeOrderSelectField: isAgainstProjectSOWOptionSelected,
    isShowExpectedCompletionDateField: isAgainstWorkOrderOptionSelected && isTransactionTypeDefaultOptionSelected,
    isShowNewExpectedCompletionDateField: isAgainstWorkOrderOptionSelected && isTransactionTypeDefaultOptionSelected,
  }
}

export const useTotalAmount = control => {
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

export const useIsLienWaiverRequired = control => {
  const transactionType = useWatch({ name: 'transactionType', control })

  return transactionType?.value === TransactionTypeValues.draw
}

export const useSelectedWorkOrder = (control, workOrdersKeyValues: { [key: string]: ProjectWorkOrder } | undefined) => {
  const selectedWorkOrderOption = useWatch({ name: 'against', control })

  return workOrdersKeyValues?.[selectedWorkOrderOption?.value]
}

export const useLienWaiverFormValues = (control, selectedWorkOrder: ProjectWorkOrder | undefined, setValue) => {
  const { amount: totalAmount } = useTotalAmount(control)

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

    console.log('lienWaiver change to default', lienWaiver)
    setValue('lienWaiver', lienWaiver)
  }, [totalAmount, selectedWorkOrder, setValue])
}
