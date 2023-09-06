import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

// import { Button } from 'components/button/button'
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
  useSelectedWorkOrder,
  useTotalAmount,
} from './hooks'
import { TransactionAmountForm } from './transaction-amount-form'
import { useUserProfile, useUserRolesSelector } from 'utils/redux-common-selectors'
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
  TRANSACTION_MARK_AS_OPTIONS_ARRAY,
} from 'features/project-details/transactions/transaction.constants'
import { TRANSACTION } from './transactions.i18n'
import { format } from 'date-fns'
import UpdateProjectAward from './update-project-award'

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
  const { isAdmin, isVendor, isAccounting } = useUserRolesSelector()
  const [isMaterialsLoading, setMaterialsLoading] = useState<boolean>(false)
  const [isShowLienWaiver, setIsShowLienWaiver] = useState<Boolean>(false)
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>()
  const [totalItemsAmount, setTotalItemAmount] = useState()
  const { isOpen: isProjectAwardOpen, onClose: onProjectAwardClose, onOpen: onProjectAwardOpen } = useDisclosure()
  // const [document, setDocument] = useState<File | null>(null)
  const { transactionTypeOptions } = useTransactionTypes(screen, projectStatus)

  // API calls
  const { transaction } = useTransaction(selectedTransactionId)
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
  const isAdminEnabled = isAdmin || isAccounting

  const materialAndDraw = transType?.label === 'Material' || transType?.label === 'Draw'
  const projectAwardCheck = !check && isValidForAwardPlan && materialAndDraw && !isRefund
  const disableSave =
    projectAwardCheck || //when there is no project award
    remainingAmountExceededFlag || //when remaining amount exceeds for material/draw + is not Refund + is not approved
    (isCompletedWorkLessThanNTEPercentage && !isAdminEnabled) //when %complete is less than NTE and user is not admin/accounting

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
  } = useFieldShowHideDecision(control, transaction)

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

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (hasPendingDrawsOnPaymentSave(values)) {
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
    [createChangeOrder, onClose, projectId, transaction, updateChangeOrder],
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
  const futureDateDisable = !isAdminEnabled ? format(new Date(), 'yyyy-MM-dd') : ''

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

      {isCompletedWorkLessThanNTEPercentage &&
        (isAdminEnabled ? (
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
                                options={changeOrderSelectOptions}
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
                          isDisabled={isApproved && !isAdminEnabled}
                          {...register('invoicedDate', {
                            required: isInvoicedDateRequired ? REQUIRED_FIELD_ERROR_MESSAGE : '',
                          })}
                        />
                        <FormErrorMessage>{errors?.invoicedDate?.message}</FormErrorMessage>
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
                        isDisabled={isApproved && !isAdminEnabled}
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
                                options={transactionStatusOptions}
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
                )}
              </Grid>

              <TransactionAmountForm
                formReturn={formReturn}
                onSetTotalRemainingAmount={setTotalItemAmount}
                transaction={transaction}
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
            isDisabled={amount === 0 || isPlanExhausted || !invoicedDate}
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
          ((!isApproved && !lateAndFactoringFeeForVendor) || isAdminEnabled) && (
            <>
              <Button
                type="submit"
                form="newTransactionForm"
                data-testid="save-transaction"
                colorScheme="darkPrimary"
                variant="solid"
                disabled={isFormSubmitLoading && isMaterialsLoading && disableSave}
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
