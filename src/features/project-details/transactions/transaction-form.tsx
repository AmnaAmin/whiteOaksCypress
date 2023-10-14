import React, { useCallback, useEffect, useMemo, useState, ChangeEvent } from 'react'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Grid,
  GridItem,
  Progress,
  Flex,
  Box,
  HStack,
  Button,
  Divider,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Controller, FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import addDays from 'date-fns/addDays'
import { datePickerFormat } from 'utils/date-time-utils'
import Select from 'components/form/react-select'

import {
  AGAINST_DEFAULT_VALUE,
  parseChangeOrderAPIPayload,
  parseChangeOrderUpdateAPIPayload,
  parseTransactionToFormValues,
  transactionDefaultFormValues,
  useChangeOrderMutation,
  useChangeOrderUpdateMutation,
  useProjectWorkOrders,
  useProjectWorkOrdersWithChangeOrders,
  useTransaction,
  useTransactionStatusOptions,
  useTransactionsV1,
  useTransactionTypes,
  useWorkOrderAwardStats,
  useWorkOrderChangeOrders,
  useManagerEnabled,
} from 'api/transactions'
import {
  ChangeOrderType,
  FormValues,
  SelectOption,
  TransactionStatusValues,
  TransactionTypeValues,
} from 'types/transaction.type'
import { dateFormat } from 'utils/date-time-utils'
import {
  useAgainstOptions,
  useCalculatePayDateVariance,
  useFieldDisabledEnabledDecision,
  useFieldRequiredDecision,
  useFieldShowHideDecision,
  useIsAwardSelect,
  useIsLienWaiverRequired,
  useLienWaiverFormValues,
  usePermissionBasedDecision,
  useSelectedWorkOrder,
  useTotalAmount,
} from './hooks'
import { TransactionAmountForm } from './transaction-amount-form'
import { useRoleBasedPermissions, useUserProfile, useUserRolesSelector } from 'utils/redux-common-selectors'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'
import { ViewLoader } from 'components/page-level-loader'
import { ReadOnlyInput } from 'components/input-view/input-view'
import {
  DrawLienWaiver,
  LienWaiverAlert,
  PercentageCompletionLessThanNTEAlert,
  ProjectAwardAlert,
  ProjectTransactionRemainingAlert,
} from './draw-transaction-lien-waiver'
import { calendarIcon } from 'theme/common-style'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import {
  REQUIRED_FIELD_ERROR_MESSAGE,
  STATUS_SHOULD_NOT_BE_PENDING_ERROR_MESSAGE,
  TRANSACTION_FPM_DM_STATUS_OPTIONS,
  TRANSACTION_MARK_AS_OPTIONS_ARRAY,
} from 'features/project-details/transactions/transaction.constants'
import { TRANSACTION } from './transactions.i18n'
import { format } from 'date-fns'
import UpdateProjectAward from './update-project-award'
import { WORK_ORDER } from 'features/work-order/workOrder.i18n'
import { useLocation } from 'react-router-dom'

const TransactionReadOnlyInfo: React.FC<{ transaction?: ChangeOrderType }> = ({ transaction }) => {
  const { t } = useTranslation()
  const { getValues } = useFormContext<FormValues>()
  const formValues = getValues()

  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(100px,1fr))"
      gap={{ base: '1rem 20px', sm: '3.5rem' }}
      borderBottom="1px solid #E2E8F0"
      borderColor="gray.200"
      py="5"
    >
      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.dateCreated`)}
          name={'dateCreated'}
          value={formValues.dateCreated as string}
          Icon={BiCalendar}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.dateModified`)}
          name={'dateModified'}
          value={(formValues.modifiedDate as string) || '----'}
          Icon={BiCalendar}
        />
      </GridItem>
      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.createdBy`)}
          name="createdBy"
          value={formValues.createdBy as string}
          Icon={BiDetail}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.modifiedBy`)}
          name={'modifiedBy'}
          value={(formValues.modifiedBy as string) || '----'}
          Icon={BiDetail}
        />
      </GridItem>
    </Grid>
  )
}

export type TransactionFormProps = {
  onClose: () => void
  selectedTransactionId?: number
  projectId: string
  projectStatus: string
  heading?: string
  screen?: string
  currentWorkOrderId?: number
  setCreatedTransaction?: any
  isVendorExpired?: boolean
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onClose,
  selectedTransactionId,
  projectId,
  projectStatus,
  screen,
  currentWorkOrderId,
  setCreatedTransaction,
  isVendorExpired,
}) => {
  const { t } = useTranslation()
  const toast = useToast()
  const { isVendor } = useUserRolesSelector()
  const [isMaterialsLoading, setMaterialsLoading] = useState<boolean>(false)
  const [isShowLienWaiver, setIsShowLienWaiver] = useState<Boolean>(false)
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>()
  const [totalItemsAmount, setTotalItemAmount] = useState(0)
  const [disableBtn, setDisableBtn] = useState(false)
  const [fileParseMsg, setFileParseMsg] = useState(false)
  const { isOpen: isProjectAwardOpen, onClose: onProjectAwardClose, onOpen: onProjectAwardOpen } = useDisclosure()
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const isPayableRead = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ') && isPayable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isPayableRead || isProjRead
  // const [document, setDocument] = useState<File | null>(null)
  const { transactionTypeOptions } = useTransactionTypes(screen, projectStatus)

  // API calls
  const { transaction } = useTransaction(selectedTransactionId)
  const { managerEnabled } = useManagerEnabled(projectId)
  const isManagingFPM = managerEnabled?.allowed
  const isShowFpm = !!transaction
  const {
    againstOptions: againstSelectOptions,
    workOrdersKeyValues,
    isLoading: isAgainstLoading,
    refetch: refetchWOKey,
  } = useProjectWorkOrders(projectId, !!selectedTransactionId)

  const transactionStatusOptions = useTransactionStatusOptions()
  const { workOrderSelectOptions, isLoading: isChangeOrderLoading } = useProjectWorkOrdersWithChangeOrders(projectId)
  const { changeOrderSelectOptions, isLoading: isWorkOrderLoading } = useWorkOrderChangeOrders(selectedWorkOrderId)

  const { awardPlansStats, refetch: refetchAwardStats } = useWorkOrderAwardStats(projectId)

  const { mutate: createChangeOrder, isLoading: isChangeOrderSubmitLoading } = useChangeOrderMutation(projectId)
  const { mutate: updateChangeOrder, isLoading: isChangeOrderUpdateLoading } = useChangeOrderUpdateMutation(projectId)

  const isFormLoading = isAgainstLoading || isChangeOrderLoading || isWorkOrderLoading
  const isFormSubmitLoading = isChangeOrderSubmitLoading || isChangeOrderUpdateLoading

  const { login = '' } = useUserProfile() as Account

  const defaultValues: FormValues = useMemo(() => {
    return transactionDefaultFormValues(login)
  }, [login])

  const formReturn = useForm<FormValues>({
    defaultValues: {
      ...defaultValues,
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
    control,
    reset, //  isTruncated title={label}
  } = formReturn

  const selectedWorkOrder = useSelectedWorkOrder(control, workOrdersKeyValues)
  const against = useWatch({ name: 'against', control })
  const transType = useWatch({ name: 'transactionType', control })
  const invoicedDate = useWatch({ name: 'invoicedDate', control })
  const workOrderId = against?.value
  const isRefund = useWatch({ name: 'refund', control })
  const watchStatus = watch('status')

  const onInvoiceBackDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const paymentTerm = getValues().paymentTerm?.value

    // Do not calculated WOA expect date if payment term is not selected
    if (!paymentTerm) return

    const payAfterDate = addDays(utcDate, paymentTerm)
    setValue('payAfterDate', datePickerFormat(payAfterDate))
  }

  const onPaymentTermChange = (option: SelectOption) => {
    const { invoicedDate } = getValues()
    if (invoicedDate === null || invoicedDate === '') {
      return
    }

    const date = new Date(invoicedDate as string)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const paymentTerm = Number(option.value)

    if (!date) return
    const payAfterDate = addDays(utcDate, paymentTerm)
    setValue('payAfterDate', datePickerFormat(payAfterDate))
  }

  const selectedWorkOrderStats = useMemo(() => {
    return awardPlansStats?.filter(plan => plan.workOrderId === Number(workOrderId))[0]
  }, [workOrderId, awardPlansStats])

  const { isUpdateForm, isApproved, isPaidDateDisabled, isStatusDisabled, lateAndFactoringFeeForVendor } =
    useFieldDisabledEnabledDecision(control, transaction, isMaterialsLoading)

  const {
    check,
    isValidForAwardPlan,
    isPlanExhausted,
    showUpgradeOption,
    showLimitReached,
    isCompletedWorkLessThanNTEPercentage,
    remainingAmountExceededFlag,
  } = useIsAwardSelect({
    control,
    selectedWorkOrderStats,
    totalItemsAmount,
    isRefund,
    selectedWorkOrder,
    isApproved,
  })

  const { permissions } = useRoleBasedPermissions()
  /* add permissions to verify by fpm and district manager*/
  const isEnabledToOverrideNTE = permissions.some(p =>
    ['PROJECTDETAIL.TRANSACTION.NTEPERCENTAGE.OVERRIDE', 'ALL'].includes(p),
  )
  const isEnabledForVerifyingAsFPM = permissions.some(p =>
    ['PROJECTDETAIL.TRANSACTION.VERIFIEDBYFPM.EDIT', 'ALL'].includes(p),
  )
  const isAdmin = useRoleBasedPermissions()?.permissions?.includes('ALL')

  const materialAndDraw = transType?.label === 'Material' || transType?.label === 'Draw'
  const selectedCancelledOrDenied = [TransactionStatusValues.cancelled, TransactionStatusValues.denied].includes(
    watchStatus?.value,
  )
  const projectAwardCheck = !check && isValidForAwardPlan && materialAndDraw && !isRefund
  const disableSave =
    !selectedCancelledOrDenied && //Check if the status is being changed to cancel/deny let the transaction be allowed.
    (projectAwardCheck || //when there is no project award
      (remainingAmountExceededFlag && !isAdmin) || //when remaining amount exceeds for material/draw + is not Refund + is not approved
      (isCompletedWorkLessThanNTEPercentage && !isEnabledToOverrideNTE)) //when %complete is less than NTE and user is not admin/accounting

  const {
    isShowChangeOrderSelectField,
    isShowWorkOrderSelectField,
    isShowNewExpectedCompletionDateField,
    isShowExpectedCompletionDateField,
    isShowStatusField,
    isTransactionTypeDrawAgainstProjectSOWSelected,
    isShowPaidBackDateField,
    isShowMarkAsField,
    isShowPaymentRecievedDateField,
    isPaymentTermDisabled,
    isShowDM,
    isShowDrawFieldAgainstWO,
  } = useFieldShowHideDecision(control, transaction)

  const { editInvoiceDate, editPaymentReceived, enableFutureDate, allowSaveOnApproved } = usePermissionBasedDecision()
  const { isInvoicedDateRequired, isPaidDateRequired, isPaymentTermRequired } = useFieldRequiredDecision(
    control,
    transaction,
  )

  const isLienWaiverRequired = useIsLienWaiverRequired(control, transaction)

  const { transactions } = useTransactionsV1(`${projectId}`)

  const { amount } = useTotalAmount(control)
  const againstOptions = useAgainstOptions(
    againstSelectOptions,
    control,
    projectStatus,
    transaction,
    currentWorkOrderId,
  )
  const payDateVariance = useCalculatePayDateVariance(control)
  const watchTransactionType = watch('transactionType')
  useLienWaiverFormValues(control, selectedWorkOrder, setValue)

  useEffect(() => {
    if (selectedWorkOrder?.awardPlanPayTerm && !transaction?.id) {
      const paymentTermValue = {
        value: selectedWorkOrder?.awardPlanPayTerm,
        label: selectedWorkOrder?.awardPlanPayTerm as string,
        title: selectedWorkOrder?.awardPlanPayTerm as string,
      }
      setValue('paymentTerm', paymentTermValue)
    } else {
      const updatedPaymentTerm = {
        value: transaction?.paymentTerm,
        label: transaction?.paymentTerm,
        title: transaction?.paymentTerm,
      }
      setValue('paymentTerm', updatedPaymentTerm as any)
    }
  }, [selectedWorkOrder])

  const onAgainstOptionSelect = (option: SelectOption) => {
    if (option?.value !== AGAINST_DEFAULT_VALUE) {
      setValue('invoicedDate', null)
      setValue('workOrder', null)
      setValue('changeOrder', null)
    } else {
      setValue('newExpectedCompletionDate', '')
      setValue('paymentTerm', null)
    }

    resetExpectedCompletionDateFields(option)
  }

  const drawTransaction = transaction?.transactionType === TransactionTypeValues.draw

  const hasPendingDrawsOnPaymentSave = values => {
    const isDrawAgainstProject =
      values?.transactionType?.value === TransactionTypeValues.draw && values?.against?.label === 'Project SOW'
    if (
      ([TransactionTypeValues.payment, TransactionTypeValues.depreciation, TransactionTypeValues.carrierFee].includes(
        values?.transactionType?.value,
      ) ||
        isDrawAgainstProject) &&
      !transaction
    ) {
      const pendingDraws = transactions?.filter(
        t =>
          [
            TransactionTypeValues.draw,
            TransactionTypeValues.payment,
            TransactionTypeValues.depreciation,
            TransactionTypeValues.carrierFee,
          ].includes(t.transactionType) &&
          !t?.parentWorkOrderId &&
          [TransactionStatusValues.pending].includes(t?.status as TransactionStatusValues),
      )
      if (pendingDraws && pendingDraws?.length > 0) {
        toast({
          title: 'Payments Error',
          description: t(`project.projectDetails.paymentError`),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        return true
      }
    }
    return false
  }

  // Admin has a different set of restriction because he is allowed to change amount in any status
  // If the admin is trying to cancel or deny the transaction - we will ignore any amount change

  // If the admin is trying to change the amount in approved transaction - he will be allowed to enter an amount equal to current approved amount + remaining amount---
  // ---Example $50 were approved. Remaining is $20. Now he can enter any amount less than or equal to $70.

  // If the admin changes amount in any other status (pending/denied/cancelled), he is allowed to enter an amount less than remaining amount.
  const isAdminEnabledToChange = () => {
    if (isAdmin) {
      if ([TransactionStatusValues.cancelled, TransactionStatusValues.denied].includes(watchStatus?.value)) {
        return true
      }
      if (
        transaction?.status?.toLocaleUpperCase() === TransactionStatusValues.approved &&
        materialAndDraw &&
        totalItemsAmount > -1 * transaction?.changeOrderAmount! + selectedWorkOrderStats?.totalAmountRemaining!
      ) {
        toast({
          title: 'Error',
          description: t(`PaymentRemaining`),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        return false
      } else if (
        transaction?.status?.toLocaleUpperCase() !== TransactionStatusValues.approved &&
        materialAndDraw &&
        totalItemsAmount > selectedWorkOrderStats?.totalAmountRemaining!
      ) {
        toast({
          title: 'Error',
          description: t(`PaymentRemaining`),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        return false
      }
    }
    return true
  }

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (hasPendingDrawsOnPaymentSave(values)) {
        return
      }
      if (!isAdminEnabledToChange()) {
        return
      }
      const queryOptions = {
        onSuccess(res) {
          onClose()
          setCreatedTransaction?.(res)
          reset()
        },
      }

      // In case of id exists in transaction object it will be update call to save transaction.
      if (transaction?.id) {
        const payload = await parseChangeOrderUpdateAPIPayload(values, transaction, projectId)
        updateChangeOrder({ ...payload, id: transaction.id }, queryOptions)
      } else {
        const payload = await parseChangeOrderAPIPayload(values, projectId)
        createChangeOrder(payload, queryOptions)
      }
    },
    [
      createChangeOrder,
      onClose,
      projectId,
      transaction,
      updateChangeOrder,
      selectedWorkOrderStats,
      totalItemsAmount,
      watchStatus,
    ],
  )

  const resetExpectedCompletionDateFields = useCallback(
    (againstOption: SelectOption) => {
      if (againstOption && againstOption?.value !== AGAINST_DEFAULT_VALUE) {
        const expectedCompletionDate = dateFormat(
          workOrdersKeyValues?.[againstOption.value].workOrderExpectedCompletionDate ?? '',
        )
        setValue('expectedCompletionDate', expectedCompletionDate)
      } else {
        setValue('expectedCompletionDate', '')
        setValue('newExpectedCompletionDate', '')
      }
    },
    [workOrdersKeyValues, setValue],
  )

  // Disable selection of future payment received date for all users expect Admin and Accounting
  const futureDateDisable = !enableFutureDate ? format(new Date(), 'yyyy-MM-dd') : ''

  useEffect(() => {
    if (transaction && againstOptions && workOrderSelectOptions && changeOrderSelectOptions) {
      // Reset the default values of form fields in case transaction and againstOptions options exists.
      const formValues = parseTransactionToFormValues(
        transaction,
        againstOptions,
        workOrderSelectOptions,
        changeOrderSelectOptions,
      )

      reset(formValues)
      setSelectedWorkOrderId(`${transaction.sowRelatedWorkOrderId}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction, againstOptions?.length, workOrderSelectOptions.length, changeOrderSelectOptions.length])

  const { transactionType } = getValues()
  // const { against } = getValues()

  useEffect(
    function updateAgainstOption() {
      if (transaction) return

      if (againstOptions.length === 1 && watchTransactionType) {
        setValue('against', againstOptions?.[0])
        resetExpectedCompletionDateFields(againstOptions?.[0])
      } else if (againstOptions.length > 1) {
        setValue('against', null)
      }
    },
    [watchTransactionType, transaction],
  )

  const onModalClose = () => {
    reset(defaultValues)
    onClose()
  }

  return (
    <Flex direction="column">
      {isFormLoading && <ViewLoader />}
      {check && isLienWaiverRequired && !isPlanExhausted && <LienWaiverAlert />}
      {projectAwardCheck ? <ProjectAwardAlert /> : null}
      {check && showUpgradeOption && !isApproved && (
        <ProjectTransactionRemainingAlert
          msg="DrawRemaining"
          onOpen={onProjectAwardOpen}
          onClose={onClose}
          isUpgradeProjectAward={true}
        />
      )}

      {check && showLimitReached && <ProjectTransactionRemainingAlert msg="PlanLimitExceed" />}

      {remainingAmountExceededFlag && <ProjectTransactionRemainingAlert msg="PaymentRemaining" />}
      {fileParseMsg && <PercentageCompletionLessThanNTEAlert msg={t(`${WORK_ORDER}.attachmentParsingFailure`)} />}
      {isCompletedWorkLessThanNTEPercentage &&
        (isEnabledToOverrideNTE ? (
          <PercentageCompletionLessThanNTEAlert msg="PercentageCompletionForAdminAndAccount" />
        ) : (
          <PercentageCompletionLessThanNTEAlert msg="PercentageCompletion" />
        ))}

      {isFormSubmitLoading && (
        <Progress size="xs" isIndeterminate position="absolute" top="60px" left="0" width="100%" aria-label="loading" />
      )}

      <FormProvider {...formReturn}>
        <form onSubmit={handleSubmit(onSubmit)} id="newTransactionForm">
          {/** In case Draw selected and user click next will show Lien Waiver Popover */}
          {!isShowLienWaiver ? (
            <Flex flex={1} direction="column" minH="600px">
              {/** Readonly information of Transaction */}
              <TransactionReadOnlyInfo transaction={transaction} />

              {/** Editable form */}
              <Grid
                templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                gap={'1.5rem 1rem'}
                pt="20px"
                pb="4"
              >
                <GridItem>
                  <FormControl isInvalid={!!errors.transactionType} data-testid="transaction-type">
                    <FormLabel fontSize="14px" color="gray.700" fontWeight={500} htmlFor="transactionType">
                      {t(`${TRANSACTION}.transactionType`)}
                    </FormLabel>
                    <Controller
                      rules={{ required: REQUIRED_FIELD_ERROR_MESSAGE }}
                      control={control}
                      name="transactionType"
                      render={({ field, fieldState }) => {
                        return (
                          <div data-testid="transaction-type-id">
                            <Select
                              {...field}
                              options={transactionTypeOptions}
                              isDisabled={isUpdateForm}
                              size="md"
                              selectProps={{ isBorderLeft: true, menuHeight: isVendor ? '88px' : '187px' }}
                              onChange={async (option: SelectOption) => {
                                const formValues = { ...defaultValues, transactionType: option }

                                reset(formValues)

                                // resetExpectedCompletionDateFields(getValues('against') as SelectOption)
                              }}
                            />
                            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                          </div>
                        )
                      }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isInvalid={!!errors.against}>
                    <FormLabel htmlFor="aginst" fontSize="14px" color="gray.700" fontWeight={500}>
                      {t(`${TRANSACTION}.against`)}
                    </FormLabel>
                    <Controller
                      control={control}
                      name="against"
                      rules={{ required: REQUIRED_FIELD_ERROR_MESSAGE }}
                      render={({ field, fieldState }) => (
                        <>
                          <div data-testid="against-select-field">
                            <Select
                              {...field}
                              selectProps={{ isBorderLeft: true }}
                              options={againstOptions}
                              isDisabled={isUpdateForm}
                              onChange={option => {
                                onAgainstOptionSelect(option)
                                field.onChange(option)
                              }}
                            />
                            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                          </div>
                        </>
                      )}
                    />
                  </FormControl>
                </GridItem>

                {isShowWorkOrderSelectField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.workOrder}>
                      <FormLabel htmlFor="workOrder" fontSize="14px" color="gray.700" fontWeight={500}>
                        {t(`${TRANSACTION}.workOrder`)}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="workOrder"
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                          <>
                            <div data-testid="work-order-select">
                              <Select
                                {...field}
                                isDisabled={isUpdateForm}
                                selectProps={{ isBorderLeft: true }}
                                options={workOrderSelectOptions}
                                onChange={option => {
                                  field.onChange(option)
                                  setSelectedWorkOrderId(option.value)
                                }}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </div>
                          </>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                )}

                {isShowChangeOrderSelectField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.changeOrder}>
                      <FormLabel fontSize="14px" color="gray.700" fontWeight={500} htmlFor="changeOrder">
                        {t(`${TRANSACTION}.changeOrder`)}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="changeOrder"
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                          <>
                            <div data-testid="change-order-select">
                              <Select
                                isDisabled={isUpdateForm}
                                options={changeOrderSelectOptions.filter((op: any) => op?.status !== 'CANCELLED')}
                                selectProps={{ isBorderLeft: true }}
                                {...field}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </div>
                          </>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                )}

                {isShowExpectedCompletionDateField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.expectedCompletionDate}>
                      <FormLabel
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight={500}
                        color="gray.700"
                        htmlFor="expectedCompletionDate"
                        whiteSpace="nowrap"
                      >
                        {t(`${TRANSACTION}.expectedCompletion`)}
                      </FormLabel>
                      <Input
                        data-testid="expected-completion-date"
                        id="expectedCompletionDate"
                        size="md"
                        isDisabled={true}
                        css={calendarIcon}
                        {...register('expectedCompletionDate')}
                      />

                      <FormErrorMessage>{errors?.expectedCompletionDate?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                )}

                {isShowNewExpectedCompletionDateField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.newExpectedCompletionDate}>
                      <FormLabel
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight={500}
                        color="gray.700"
                        htmlFor="newExpectedCompletionDate"
                        whiteSpace="nowrap"
                      >
                        {t(`${TRANSACTION}.newExpectedCompletionDate`)}
                      </FormLabel>

                      <Input
                        data-testid="new-expected-completion-date"
                        id="newExpectedCompletionDate"
                        type="date"
                        size="md"
                        css={calendarIcon}
                        isDisabled={isApproved}
                        {...register('newExpectedCompletionDate')}
                      />

                      <FormErrorMessage>{errors?.newExpectedCompletionDate?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                )}

                {isTransactionTypeDrawAgainstProjectSOWSelected && (
                  <>
                    <GridItem>
                      <FormControl isInvalid={!!errors.paymentTerm}>
                        <FormLabel htmlFor="paymentTerm" fontSize="14px" color="gray.700" fontWeight={500}>
                          {t(`${TRANSACTION}.paymentTerm`)}
                        </FormLabel>
                        <Controller
                          control={control}
                          name="paymentTerm"
                          rules={{ required: isPaymentTermRequired ? REQUIRED_FIELD_ERROR_MESSAGE : '' }}
                          render={({ field, fieldState }) => (
                            <>
                              <div data-testid="payment-term-select">
                                <Select
                                  {...field}
                                  selectProps={{ isBorderLeft: isPaymentTermRequired }}
                                  options={PAYMENT_TERMS_OPTIONS}
                                  isDisabled={isPaymentTermDisabled}
                                  onChange={paymentTermOption => {
                                    field.onChange(paymentTermOption)
                                    onPaymentTermChange(paymentTermOption)
                                  }}
                                />
                                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                              </div>
                            </>
                          )}
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={!!errors.invoicedDate}>
                        <FormLabel
                          fontSize="14px"
                          fontStyle="normal"
                          fontWeight={500}
                          color="gray.700"
                          htmlFor="invoicedDate"
                          whiteSpace="nowrap"
                        >
                          {t(`${TRANSACTION}.invoicedDate`)}
                        </FormLabel>
                        <Input
                          data-testid="invoice-date"
                          id="invoicedDate"
                          type="date"
                          variant={isInvoicedDateRequired ? 'required-field' : 'outline'}
                          css={calendarIcon}
                          isDisabled={isApproved && !editInvoiceDate}
                          {...register('invoicedDate', {
                            required: isInvoicedDateRequired ? REQUIRED_FIELD_ERROR_MESSAGE : '',
                            onChange: onInvoiceBackDateChange,
                          })}
                        />
                        <FormErrorMessage>{errors?.invoicedDate?.message}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl isInvalid={!!errors.payDateVariance}>
                        <FormLabel
                          fontSize="14px"
                          fontStyle="normal"
                          fontWeight={500}
                          color="gray.700"
                          htmlFor="payDateVariance"
                          whiteSpace="nowrap"
                        >
                          {t(`${TRANSACTION}.payDateVariance`)}
                        </FormLabel>
                        <Input
                          data-testid="pay-date-variance"
                          id="payDateVariance"
                          type="text"
                          size="md"
                          value={payDateVariance}
                          css={calendarIcon}
                          isDisabled
                          {...register('payDateVariance')}
                        />
                        <FormErrorMessage>{errors?.payDateVariance?.message}</FormErrorMessage>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={!!errors.paidDate}>
                        <FormLabel
                          fontSize="14px"
                          fontStyle="normal"
                          fontWeight={500}
                          color="gray.700"
                          htmlFor="paidDate"
                          whiteSpace="nowrap"
                        >
                          {t(`${TRANSACTION}.paidDate`)}
                        </FormLabel>
                        <Input
                          data-testid="paid-date"
                          id="paidDate"
                          type="date"
                          variant={isPaidDateRequired ? 'required-field' : 'outline'}
                          size="md"
                          isDisabled={isPaidDateDisabled}
                          css={calendarIcon}
                          {...register('paidDate', {
                            required: isPaidDateRequired ? REQUIRED_FIELD_ERROR_MESSAGE : '',
                          })}
                        />
                        <FormErrorMessage>{errors?.paidDate?.message}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    {isShowDrawFieldAgainstWO && (
                      <>
                        <GridItem>
                          <FormControl isInvalid={!!errors.paymentProcessed}>
                            <FormLabel
                              fontSize="14px"
                              fontStyle="normal"
                              fontWeight={500}
                              color="gray.700"
                              htmlFor="paymentProcessed"
                              whiteSpace="nowrap"
                            >
                              {t(`${TRANSACTION}.paymentProcessed`)}
                            </FormLabel>
                            <Input
                              data-testid="payment-processed"
                              id="paymentProcessed"
                              type="date"
                              size="md"
                              css={calendarIcon}
                              {...register('paymentProcessed')}
                            />
                            <FormErrorMessage>{errors?.paymentProcessed?.message}</FormErrorMessage>
                          </FormControl>
                        </GridItem>

                        <GridItem>
                          <FormControl isInvalid={!!errors.payAfterDate}>
                            <FormLabel
                              fontSize="14px"
                              fontStyle="normal"
                              fontWeight={500}
                              color="gray.700"
                              htmlFor="payAfterDate"
                              whiteSpace="nowrap"
                            >
                              {t(`${TRANSACTION}.payAfterDate`)}
                            </FormLabel>
                            <Input
                              data-testid="pay-after"
                              id="payAfterDate"
                              type="date"
                              size="md"
                              isDisabled
                              css={calendarIcon}
                              {...register('payAfterDate', {
                                required: isPaidDateRequired ? REQUIRED_FIELD_ERROR_MESSAGE : '',
                              })}
                            />
                            <FormErrorMessage>{errors?.payAfterDate?.message}</FormErrorMessage>
                          </FormControl>
                        </GridItem>
                        {isShowFpm && (
                          <GridItem>
                            <FormControl isInvalid={!!errors.verifiedByFpm} data-testid="verified-by-fpm">
                              <FormLabel fontSize="14px" color="gray.700" fontWeight={500} htmlFor="verifiedByFpm">
                                {t(`${TRANSACTION}.verifiedByFpm`)}
                              </FormLabel>
                              <Controller
                                control={control}
                                name="verifiedByFpm"
                                render={({ field, fieldState }) => {
                                  return (
                                    <>
                                      <Select
                                        {...field}
                                        options={TRANSACTION_FPM_DM_STATUS_OPTIONS}
                                        isDisabled={!isEnabledForVerifyingAsFPM}
                                        size="md"
                                        selectProps={{ isBorderLeft: true }}
                                        onChange={statusOption => {
                                          field.onChange(statusOption)
                                        }}
                                      />
                                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                    </>
                                  )
                                }}
                              />
                            </FormControl>
                          </GridItem>
                        )}
                        {isShowDM && (
                          <GridItem>
                            <FormControl isInvalid={!!errors.verifiedByManager} data-testid="verified-by-dm">
                              <FormLabel fontSize="14px" color="gray.700" fontWeight={500} htmlFor="verifiedByManager">
                                {t(`${TRANSACTION}.verifiedByManager`)}
                              </FormLabel>
                              <Controller
                                control={control}
                                name="verifiedByManager"
                                render={({ field, fieldState }) => {
                                  return (
                                    <>
                                      <Select
                                        {...field}
                                        options={TRANSACTION_FPM_DM_STATUS_OPTIONS}
                                        isDisabled={!isManagingFPM}
                                        size="md"
                                        selectProps={{ isBorderLeft: true }}
                                        onChange={statusOption => {
                                          field.onChange(statusOption)
                                        }}
                                      />
                                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                    </>
                                  )
                                }}
                              />
                            </FormControl>
                          </GridItem>
                        )}
                      </>
                    )}
                  </>
                )}

                {isShowPaymentRecievedDateField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.paymentRecievedDate}>
                      <FormLabel
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight={500}
                        color="gray.700"
                        htmlFor="paymentRecievedDate"
                        whiteSpace="nowrap"
                      >
                        {watchTransactionType?.value === TransactionTypeValues.woPaid
                          ? t(`${TRANSACTION}.woPaymentDate`)
                          : t(`${TRANSACTION}.paymentReceivedDate`)}
                      </FormLabel>
                      <Input
                        data-testid="payment-received-date"
                        id="paymentRecievedDate"
                        size="md"
                        type="date"
                        variant="required-field"
                        isDisabled={isApproved && !editPaymentReceived}
                        max={futureDateDisable}
                        {...register('paymentRecievedDate', { required: REQUIRED_FIELD_ERROR_MESSAGE })}
                      />
                      <FormErrorMessage>{errors?.paymentRecievedDate?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                )}

                {/**
                 * NOTE: Fields markAs and paidBackDate will show when the transaction of type Overpayment is selected.
                 * **/}
                {isShowMarkAsField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.markAs} data-testid="mark-as-select-field">
                      <FormLabel fontSize="14px" color="gray.700" fontWeight={500} htmlFor="markAs">
                        {t(`${TRANSACTION}.markAs`)}
                      </FormLabel>
                      <Controller
                        rules={{ required: REQUIRED_FIELD_ERROR_MESSAGE }}
                        control={control}
                        name="markAs"
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <Select
                                {...field}
                                options={TRANSACTION_MARK_AS_OPTIONS_ARRAY}
                                isDisabled={isApproved}
                                size="md"
                                selectProps={{ isBorderLeft: true }}
                                onChange={field.onChange}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </GridItem>
                )}

                {isShowPaidBackDateField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.paidBackDate}>
                      <FormLabel
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight={500}
                        color="gray.700"
                        htmlFor="paidBackDate"
                        whiteSpace="nowrap"
                      >
                        {t(`${TRANSACTION}.paidBackDate`)}
                      </FormLabel>
                      <Input
                        data-testid="paid-back-date"
                        id="paidBackDate"
                        type="date"
                        variant={'required-field'}
                        size="md"
                        isDisabled={isPaidDateDisabled}
                        css={calendarIcon}
                        {...register('paidBackDate', { required: REQUIRED_FIELD_ERROR_MESSAGE })}
                      />
                      <FormErrorMessage>{errors?.paidBackDate?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                )}

                {isShowStatusField && (
                  <>
                    <GridItem>
                      <FormControl isInvalid={!!errors.status}>
                        <FormLabel htmlFor="aginst" fontSize="14px" color="gray.700" fontWeight={500}>
                          {t(`${TRANSACTION}.status`)}
                        </FormLabel>
                        <Controller
                          control={control}
                          name="status"
                          rules={{
                            required: REQUIRED_FIELD_ERROR_MESSAGE,
                            validate: option => {
                              return transactionType?.value === TransactionTypeValues.overpayment &&
                                option?.value === TransactionStatusValues.pending
                                ? STATUS_SHOULD_NOT_BE_PENDING_ERROR_MESSAGE
                                : true
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <>
                              <div data-testid="status-select-field">
                                <Select
                                  {...field}
                                  options={
                                    drawTransaction ? TRANSACTION_FPM_DM_STATUS_OPTIONS : transactionStatusOptions
                                  }
                                  isDisabled={isStatusDisabled}
                                  onChange={statusOption => {
                                    field.onChange(statusOption)
                                  }}
                                />
                                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                              </div>
                            </>
                          )}
                        />
                      </FormControl>
                    </GridItem>
                  </>
                )}
              </Grid>

              <TransactionAmountForm
                formReturn={formReturn}
                onSetTotalRemainingAmount={amount => {
                  setTotalItemAmount(amount)
                }}
                transaction={transaction}
                setDisableBtn={setDisableBtn}
                disableError={disableBtn}
                setFileParseMsg={setFileParseMsg}
                isMaterialsLoading={isMaterialsLoading}
                setMaterialsLoading={setMaterialsLoading}
                selectedTransactionId={selectedTransactionId}
              />
            </Flex>
          ) : (
            <Box flex={1}>
              {/** This component need Nested form Implementation using FormProvider */}
              <DrawLienWaiver />
            </Box>
          )}
        </form>

        <DevTool control={control} />
      </FormProvider>

      <Divider mt={3}></Divider>
      <HStack alignItems="center" justifyContent="end" mt="16px" spacing="16px">
        {isShowLienWaiver ? (
          <Button onClick={() => setIsShowLienWaiver(false)} variant="outline" colorScheme="darkPrimary">
            {t(`${TRANSACTION}.back`)}
          </Button>
        ) : (
          <Button
            onClick={onModalClose}
            variant={'outline'}
            colorScheme="darkPrimary"
            data-testid="close-transaction-form"
          >
            {t(`${TRANSACTION}.cancel`)}
          </Button>
        )}

        {isLienWaiverRequired && !isShowLienWaiver ? (
          <Button
            data-testid="next-to-lien-waiver-form"
            type="button"
            variant="solid"
            isDisabled={
              !selectedCancelledOrDenied && (amount === 0 || (isPlanExhausted && !isApproved) || !invoicedDate) //Check if the status is being changed to cancel/deny let the transaction be allowed.
            }
            colorScheme="darkPrimary"
            onClick={event => {
              event.stopPropagation()
              setTimeout(() => {
                setIsShowLienWaiver(true)
              })
            }}
          >
            {t(`${TRANSACTION}.next`)}
          </Button>
        ) : (
          ((!isReadOnly && !isApproved && !lateAndFactoringFeeForVendor) || allowSaveOnApproved) && (
            <>
              <Button
                type="submit"
                form="newTransactionForm"
                data-testid="save-transaction"
                colorScheme="darkPrimary"
                variant="solid"
                disabled={isFormSubmitLoading || isMaterialsLoading || disableSave || disableBtn}
              >
                {t(`${TRANSACTION}.save`)}
              </Button>
            </>
          )
        )}
        <UpdateProjectAward
          isOpen={isProjectAwardOpen}
          onClose={onProjectAwardClose}
          selectedWorkOrder={selectedWorkOrder}
          refetchAwardStats={refetchAwardStats}
          refetchWOKey={refetchWOKey}
        />
      </HStack>
    </Flex>
  )
}
