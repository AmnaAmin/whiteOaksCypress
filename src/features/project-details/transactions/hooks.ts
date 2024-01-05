import {
  ChangeOrderType,
  FormValues,
  ProjectWorkOrder,
  SelectOption,
  TransactionMarkAsValues,
  TransactionStatusValues,
  TransactionsWithRefundType,
  TransactionTypeValues,
} from 'types/transaction.type'
import { AGAINST_DEFAULT_VALUE, calculatePayDateVariance, parseLienWaiverFormValues } from 'api/transactions'
import { Control, useWatch } from 'react-hook-form'
import numeral from 'numeral'
import { useEffect, useMemo } from 'react'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { StringProjectStatus } from 'types/project-details.types'

/*function getRefundTransactionType(type): TransactionsWithRefundType {
  if (type === TransactionTypeValues.material)
    return {
      id: 'refund-material',
      name: 'refundMaterial',
      label: 'Refund material',
    }

  if (type === TransactionTypeValues.lateFee)
    return {
      id: 'refund-late-fee',
      name: 'refundLateFee',
      label: 'Refund late fee',
    }
  if (type === TransactionTypeValues.permitFee)
    return {
      id: 'refund-permit-fee',
      name: 'refundPermitFee',
      label: 'Refund Permit fee',
    }
  if (type === TransactionTypeValues.carrierFee)
    return {
      id: 'refund-carrier-fee',
      name: 'refundCarrierFee',
      label: 'Refund Carrier fee',
    }
  if (type === TransactionTypeValues.shippingFee)
    return {
      id: 'refund-shipping-fee',
      name: 'refundShippingFee',
      label: 'Refund Shipping fee',
    }
  return {
    id: 'refund-factoring',
    name: 'refundFactoring',
    label: 'Refund factoring',
  }
}*/

export const useFieldShowHideDecision = (control: Control<FormValues, any>, transaction?: ChangeOrderType) => {
  const transactionType = useWatch({ name: 'transactionType', control })
  const markAs = useWatch({ name: 'markAs', control })
  const against = useWatch({ name: 'against', control })
  const status = useWatch({ name: 'status', control })
  const selectedTransactionTypeId = transactionType?.value
  const selectedAgainstId = against?.value
  const { isAdmin } = useUserRolesSelector()

  const isTransactionTypeChangeOrderSelected =
    selectedTransactionTypeId &&
    [TransactionTypeValues.changeOrder, TransactionTypeValues.legalFee].includes(selectedTransactionTypeId)
    const isLegalFeeExcluded  =
    selectedTransactionTypeId &&
    [TransactionTypeValues.changeOrder].includes(selectedTransactionTypeId)
  const isTransactionTypeOverpaymentSelected =
    selectedTransactionTypeId && selectedTransactionTypeId === TransactionTypeValues.overpayment
  const isAgainstWorkOrderOptionSelected = selectedAgainstId && selectedAgainstId !== AGAINST_DEFAULT_VALUE
  const isAgainstProjectSOWOptionSelected = selectedAgainstId && selectedAgainstId === AGAINST_DEFAULT_VALUE
  const isTransactionTypeDrawAgainstProjectSOWSelected = selectedTransactionTypeId === TransactionTypeValues.draw

  // const isTransactionTypeDrawAgainstProjectSOWSelected = selectedTransactionTypeId === TransactionTypeValues.shipping
  // YK - PSWOA-1243
  // && isAgainstProjectSOWOptionSelected
  const refundCheckbox: TransactionsWithRefundType = {
    // ...getRefundTransactionType(selectedTransactionTypeId),
    id: 'refund',
    name: 'refund',
    label: 'Refund',
    isVisible: [
      TransactionTypeValues.material,
      TransactionTypeValues.lateFee,
      TransactionTypeValues.factoring,
      TransactionTypeValues.shippingFee,
      TransactionTypeValues.carrierFee,
      TransactionTypeValues.permitFee,
    ].some(val => val === selectedTransactionTypeId),
  }
  const isPaymentTermDisabled = isAgainstWorkOrderOptionSelected && !isAdmin
  const drawTransaction = transaction?.transactionType === TransactionTypeValues.draw
  const vFpm = transaction?.verifiedByFpm as unknown as string
  const vDM = transaction?.verifiedByManager as unknown as string

  // The status field should be hidden if user create new transaction or
  // if the transaction of type overpayment with markAs = revenue
  // also we can use markAs?.value === TransactionMarkAsValues.revenue but sometime it's null
  //if draw is against work order then status field will be shown when it is approved by FPM and Direct Manager of that fpm
  const isShowDrawStatusField = vFpm === TransactionStatusValues.approved && vDM === TransactionStatusValues.approved
  var isShowStatusField = false
  if (!!transaction) {
    if (!drawTransaction) {
      if (!(isTransactionTypeOverpaymentSelected && markAs?.value !== TransactionMarkAsValues.paid)) {
        isShowStatusField = true
      }
    } else {
      if (isAgainstProjectSOWOptionSelected) {
        isShowStatusField = true
      } else {
        if (isShowDrawStatusField) {
          isShowStatusField = true
        }
      }
    }
  }

  const isStatusNotCancelled = status?.value !== TransactionStatusValues.cancelled
  const markAsPaid = markAs?.value === 'paid'

  return {
    isShowWorkOrderSelectField: isAgainstProjectSOWOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowChangeOrderSelectField: isAgainstProjectSOWOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowExpectedCompletionDateField: isAgainstWorkOrderOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowNewExpectedCompletionDateField: isAgainstWorkOrderOptionSelected && isTransactionTypeChangeOrderSelected,
    isShowReasonField: isAgainstProjectSOWOptionSelected && isLegalFeeExcluded,
    isShowStatusField,
    isShowDrawFieldAgainstWO: isAgainstWorkOrderOptionSelected,
    drawTransaction,
    isTransactionTypeDrawAgainstProjectSOWSelected,
    refundCheckbox,
    isShowDM: vFpm === TransactionStatusValues.approved,
    isShowFpm: !!transaction && drawTransaction,
    isPaymentTermDisabled,
    isShowPaymentRecievedDateField: [
      TransactionTypeValues.payment,
      TransactionTypeValues.woPaid,
      TransactionTypeValues.deductible,
      TransactionTypeValues.depreciation,
    ].includes(selectedTransactionTypeId),
    isShowPaidBackDateField: isTransactionTypeOverpaymentSelected && markAsPaid && isStatusNotCancelled,
    isShowMarkAsField: isTransactionTypeOverpaymentSelected && isStatusNotCancelled,
  }
}

export const useFieldRequiredDecision = (control: Control<FormValues, any>, transaction) => {
  const status = useWatch({ name: 'status', control })

  const isStatusApproved = status?.value === TransactionStatusValues.approved
  // const against = useWatch({ name: 'against', control })
  // const transactionType = useWatch({ name: 'transactionType', control })
  return {
    isPaymentTermRequired: !transaction?.id || isStatusApproved, // if new transaction modal or edit modal with approved status.
    isPaidDateRequired: isStatusApproved,
    isInvoicedDateRequired: !transaction?.id || isStatusApproved, // if new transaction modal or edit modal with approved status.
  }
}

export const usePermissionBasedDecision = () => {
  const { permissions } = useRoleBasedPermissions()
  const enableFutureDate = permissions.some(p => ['PROJECTDETAIL.TRANSACTION.FUTUREPAYMENT.EDIT', 'ALL'].includes(p))
  const editPaymentReceived = permissions.some(p =>
    ['PROJECTDETAIL.TRANSACTION.PAYMENTRECEIVED.EDIT', 'ALL'].includes(p),
  )
  const editInvoiceDate = permissions.some(p => ['PROJECTDETAIL.TRANSACTION.INVOICEDATE.EDIT', 'ALL'].includes(p))
  return {
    enableFutureDate,
    editPaymentReceived,
    editInvoiceDate,
    allowSaveOnApproved: enableFutureDate || editPaymentReceived || editInvoiceDate,
  }
}

export const isManualTransaction = transactionType =>
  [
    TransactionTypeValues.changeOrder,
    TransactionTypeValues.material,
    TransactionTypeValues.draw,
    TransactionTypeValues.factoring,
    TransactionTypeValues.lateFee,
    TransactionTypeValues.payment,
    TransactionTypeValues.permitFee,
    TransactionTypeValues.carrierFee,
    TransactionTypeValues.shippingFee,
    TransactionTypeValues.deductible,
    TransactionTypeValues.depreciation,
    TransactionTypeValues.legalFee,
  ].includes(transactionType)

export const useFieldDisabledEnabledDecision = (
  control: Control<FormValues, any>,
  transaction?: ChangeOrderType,
  isMaterialsLoading?: boolean,
) => {
  const { permissions } = useRoleBasedPermissions()
  const { isVendor, isAccounting } = useUserRolesSelector()
  const isAdmin = useRoleBasedPermissions()?.permissions?.includes('ALL')
  const statusEditPermission = permissions.some(p => ['PROJECTDETAIL.TRANSACTION.STATUS.EDIT', 'ALL'].includes(p))
  const paidEditPermission = permissions.some(p => ['PROJECTDETAIL.TRANSACTION.PAIDDATE.EDIT', 'ALL'].includes(p))
  const isUpdateForm = !!transaction || isMaterialsLoading
  const lateAndFactoringFeeForVendor =
    isVendor &&
    (transaction?.transactionType === TransactionTypeValues.lateFee ||
      transaction?.transactionType === TransactionTypeValues.factoring)
  const statusFieldForVendor = isVendor && transaction?.transactionType === TransactionTypeValues.draw

  const isStatusApproved =
    transaction?.status === TransactionStatusValues.approved ||
    transaction?.status === TransactionStatusValues.cancelled ||
    transaction?.status === TransactionStatusValues.denied
  // const isFactoringFeeSysGenerated =
  //   transaction?.transactionType === TransactionTypeValues.factoring && transaction?.systemGenerated
  const isInvoicePayment =
    transaction?.transactionType === TransactionTypeValues.payment && !!transaction?.invoiceNumber
  return {
    isUpdateForm,
    isApproved: isStatusApproved,
    // isSysFactoringFee: isFactoringFeeSysGenerated,
    isPaidDateDisabled: !transaction && isStatusApproved && !paidEditPermission,
    isStatusDisabled:
      (isStatusApproved && !statusEditPermission) ||
      isMaterialsLoading ||
      lateAndFactoringFeeForVendor ||
      // isFactoringFeeSysGenerated ||
      statusFieldForVendor ||
      isInvoicePayment ||
      (!isAdmin && !isAccounting && transaction?.transactionType === TransactionTypeValues.draw),

    lateAndFactoringFeeForVendor: lateAndFactoringFeeForVendor,
    // isFactoringFeeSysGenerated,
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

export const useTotalPendingDrawAmount = items => {
  let totalAmount
  //filtering pending transactions & Draw only (type=30)
  const transactionItems = items.filter(
    co => co.status === TransactionStatusValues.pending && co.transactionType === 30,
  )

  if (transactionItems.length > 1) {
    totalAmount = transactionItems.map(a => a.transactionTotal).reduce((prev, curr) => prev + curr, 0)
  } else {
    totalAmount = transactionItems[0]?.transactionTotal
  }
  return totalAmount ? totalAmount : 0
}

export const useIsAwardSelect = ({
  control,
  selectedWorkOrderStats,
  totalItemsAmount,
  isRefund,
  selectedWorkOrder,
  transaction,
}) => {
  const against = useWatch({ name: 'against', control })
  const transType = useWatch({ name: 'transactionType', control })
  const watchStatus = useWatch({ name: 'status', control })
  const verifyByFPMStatus = useWatch({ name: 'verifiedByFpm', control })
  const verifyByManagerStatus = useWatch({ name: 'verifiedByManager', control })
  const statuses = [watchStatus?.value, verifyByFPMStatus?.value, verifyByManagerStatus?.value]
  const isBeingCancelled = [TransactionStatusValues.cancelled, TransactionStatusValues.denied]?.some(p =>
    statuses.includes(p),
  )

  const check = against?.awardStatus
  const isValidForAwardPlan = against?.isValidForAwardPlan
  const isDrawOrMaterial = transType?.label === 'Draw' || transType?.label === 'Material'
  const isAmountChanged = Math.abs(totalItemsAmount) !== Math.abs(transaction?.changeOrderAmount)

  const remainingAmountExceededFlag =
    isAmountChanged &&
    isValidForAwardPlan &&
    isDrawOrMaterial &&
    !isRefund &&
    totalItemsAmount > selectedWorkOrderStats?.totalAmountRemaining! &&
    !isBeingCancelled

  const drawConsumed =
    transType?.label === 'Draw' &&
    (selectedWorkOrderStats?.drawRemaining === null ||
      (selectedWorkOrderStats && selectedWorkOrderStats?.drawRemaining < 1))

  const materialConsumed =
    transType?.label === 'Material' &&
    !isRefund &&
    (selectedWorkOrderStats?.materialRemaining === null ||
      (selectedWorkOrderStats && selectedWorkOrderStats?.materialRemaining < 1))

  const isNotFinalPlan = selectedWorkOrder?.awardPlanId < 4

  const isPlanExhausted =
    isValidForAwardPlan && (drawConsumed || materialConsumed || remainingAmountExceededFlag) && !isBeingCancelled

  const showUpgradeOption = isPlanExhausted && isNotFinalPlan && !isBeingCancelled

  const showLimitReached = isPlanExhausted && !isNotFinalPlan && !isBeingCancelled

  const isCompletedWorkLessThanNTEPercentage =
    isAmountChanged &&
    transType?.label === 'Draw' &&
    totalItemsAmount > selectedWorkOrderStats?.allowedDrawAmount! &&
    !isBeingCancelled

  return {
    check,
    isValidForAwardPlan,
    isPlanExhausted,
    showUpgradeOption,
    showLimitReached,
    isCompletedWorkLessThanNTEPercentage,
    remainingAmountExceededFlag,
  }
}

export const useIsLienWaiverRequired = (control: Control<FormValues, any>, transaction?: ChangeOrderType) => {
  const transactionType = useWatch({ name: 'transactionType', control })

  const transactionStatus = useWatch({ name: 'status', control })
  const verifyByFPMStatus = useWatch({ name: 'verifiedByFpm', control })
  const verifyByManagerStatus = useWatch({ name: 'verifiedByManager', control })
  const { amount: formTotalAmount } = useTotalAmount(control)
  const against = useWatch({ name: 'against', control })
  const statuses = [transactionStatus?.value, verifyByFPMStatus?.value, verifyByManagerStatus?.value]
  const isBeingCancelled = [TransactionStatusValues.cancelled, TransactionStatusValues.denied]?.some(p =>
    statuses.includes(p),
  )
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
    against.value !== AGAINST_DEFAULT_VALUE &&
    !isBeingCancelled
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

export const useAgainstOptions = (
  againstOptions: SelectOption[],
  control: Control<FormValues, any>,
  projectStatus,
  transaction,
  currentWorkOrderId?,
) => {
  const { isVendor } = useUserRolesSelector()
  const transactionType = useWatch({ name: 'transactionType', control })

  return useMemo(() => {
    if (currentWorkOrderId) {
      return isVendor
        ? againstOptions.filter(option => option.value === currentWorkOrderId?.toString())
        : againstOptions.slice(1)?.filter(option => option.value === currentWorkOrderId?.toString())
    }

    // In case of other users than vendors the first option of againstOptions is the
    // Project SOW which should be hide in case transactionType is material
    if (transactionType?.value === TransactionTypeValues.material && !isVendor) {
      return againstOptions.slice(1)
    }
    if (transactionType?.value === TransactionTypeValues.draw && !isVendor) {
      return againstOptions.slice(1)
    }
    // If the transaction is new and transaction type is draw and project status is invoiced or following state, hide Project SOW againstOption
    if (
      transactionType?.value === TransactionTypeValues.draw &&
      !isVendor &&
      !transaction?.id &&
      ![
        StringProjectStatus.New,
        StringProjectStatus.Active,
        StringProjectStatus.Punch,
        StringProjectStatus.Closed,
        StringProjectStatus.Reconcile,
      ].includes(projectStatus?.toLowerCase())
    ) {
      return againstOptions.slice(1)
    }

    if (
      transactionType?.value === TransactionTypeValues.changeOrder &&
      !transaction?.id &&
      ['client paid'].includes(projectStatus?.toLowerCase())
    ) {
      return againstOptions.slice(1)
    }

    if (
      [TransactionTypeValues.lateFee, TransactionTypeValues.factoring].some(
        value => transactionType?.value === value,
      ) &&
      !isVendor
    ) {
      return againstOptions.slice(1)
    }

    if (
      [TransactionTypeValues.payment, TransactionTypeValues.deductible, TransactionTypeValues.depreciation].includes(
        transactionType?.value,
      )
    ) {
      return againstOptions.slice(0, 1)
    }
    if (
      [
        TransactionTypeValues.permitFee,
        TransactionTypeValues.shippingFee,
        TransactionTypeValues.carrierFee,
        TransactionTypeValues.legalFee,
      ].some(value => transactionType?.value === value)
    ) {
      return [againstOptions[0]]
    }
    return againstOptions
  }, [transactionType, againstOptions])
}

export const useCalculatePayDateVariance = (control: Control<FormValues, any>) => {
  const invoicedDate = useWatch({ name: 'invoicedDate', control })
  const paidDate = useWatch({ name: 'paidDate', control })

  return calculatePayDateVariance(invoicedDate, paidDate)
}
