import {
  ChangeOrderType,
  FormValues,
  ProjectWorkOrder,
  SelectOption,
  TransactionStatusValues,
  TransactionTypeValues,
} from 'types/transaction.type'
import { AGAINST_DEFAULT_VALUE, calculatePayDateVariance, parseLienWaiverFormValues } from 'api/transactions'
import { Control, useWatch } from 'react-hook-form'
import numeral from 'numeral'
import { useEffect, useMemo } from 'react'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

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
    isShowPaymentRecievedDateField: selectedTransactionTypeId === TransactionTypeValues.payment,
  }
}

export const useFieldRequiredDecision = (control: Control<FormValues, any>, transaction?: ChangeOrderType) => {
  const status = useWatch({ name: 'status', control })
  const isStatusApproved = status?.value === TransactionStatusValues.approved

  return {
    isPaidDateRequired: isStatusApproved,
    isInvoicedDateRequired: isStatusApproved,
  }
}

export const useFieldDisabledEnabledDecision = (control: Control<FormValues, any>, transaction?: ChangeOrderType) => {
  // const { isAdmin } = useUserRolesSelector()
  const isUpdateForm = !!transaction
  const isStatusApproved =
    transaction?.status === TransactionStatusValues.approved ||
    transaction?.status === TransactionStatusValues.cancelled

  return {
    isUpdateForm,
    isApproved: isStatusApproved,
    isPaidDateDisabled: !transaction || isStatusApproved,
    isStatusDisabled: isStatusApproved,
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

  return {
    formattedAmount: numeral(totalAmount).format('$0,0.00'),
    amount: totalAmount,
  }
}

export const useIsLienWaiverRequired = (control: Control<FormValues, any>, transaction?: ChangeOrderType) => {
  const transactionType = useWatch({ name: 'transactionType', control })
  const { amount: formTotalAmount } = useTotalAmount(control)
  const against = useWatch({ name: 'against', control })
  const savedTransactionAmount = transaction?.lineItems?.reduce((result, transaction) => {
    if (transaction.whiteoaksCost) {
      return result + Number(transaction.whiteoaksCost)
    } else {
      return result
    }
  }, 0)

  return (
    savedTransactionAmount !== formTotalAmount &&
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
    const lienWaiver = parseLienWaiverFormValues(selectedWorkOrder, totalAmount)

    setValue('lienWaiver', lienWaiver)
  }, [totalAmount, selectedWorkOrder, setValue])
}

export const useAgainstOptions = (againstOptions: SelectOption[], control: Control<FormValues, any>) => {
  const { isVendor } = useUserRolesSelector()
  const transactionType = useWatch({ name: 'transactionType', control })

  return useMemo(() => {
    // In case of other users than vendors the first option of againstOptions is the
    // Project SOW which should be hide in case transactionType is material
    if (transactionType?.value === TransactionTypeValues.material && !isVendor) {
      return againstOptions.slice(1)
    }

    if (transactionType?.value === TransactionTypeValues.payment) {
      return againstOptions.slice(0, 1)
    }

    return againstOptions
  }, [transactionType, againstOptions])
}

export const useCalculatePayDateVariance = (control: Control<FormValues, any>) => {
  const invoicedDate = useWatch({ name: 'invoicedDate', control })
  const paidDate = useWatch({ name: 'paidDate', control })
  const paymentTerm = useWatch({ name: 'paymentTerm', control })

  return calculatePayDateVariance(invoicedDate, paidDate, paymentTerm?.value)
}
