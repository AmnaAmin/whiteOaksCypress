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
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
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
  useTransactionTypes,
  useWorkOrderChangeOrders,
} from 'api/transactions'
import { ChangeOrderType, FormValues, SelectOption } from 'types/transaction.type'
import { dateFormat } from 'utils/date-time-utils'
import {
  useAgainstOptions,
  useCalculatePayDateVariance,
  useFieldDisabledEnabledDecision,
  useFieldRequiredDecision,
  useFieldShowHideDecision,
  useIsLienWaiverRequired,
  useLienWaiverFormValues,
  useSelectedWorkOrder,
  useTotalAmount,
} from './hooks'
import { TransactionAmountForm } from './transaction-amount-form'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'
import { ViewLoader } from 'components/page-level-loader'
import { ReadOnlyInput } from 'components/input-view/input-view'
import { DrawLienWaiver, LienWaiverAlert } from './draw-transaction-lien-waiver'
import { calendarIcon } from 'theme/common-style'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'

const TransactionReadOnlyInfo: React.FC<{ transaction?: ChangeOrderType }> = ({ transaction }) => {
  const { t } = useTranslation()
  const { getValues } = useFormContext<FormValues>()
  const formValues = getValues()

  return (
    <Grid
      // templateColumns="repeat(auto-fit, minmax(120px, 1fr))"
      templateColumns="repeat(4, 1fr)"
      gap={'1rem 20px'}
      borderBottom="2px solid"
      borderColor="gray.200"
      py="5"
    >
      <GridItem>
        <ReadOnlyInput
          label={t('dateCreated')}
          name={'dateCreated'}
          value={formValues.dateCreated as string}
          Icon={BiCalendar}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput label={t('createdBy')} name="createdBy" value={formValues.createdBy as string} Icon={BiDetail} />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t('dateModified')}
          name={'dateModified'}
          value={(formValues.modifiedDate as string) || '----'}
          Icon={BiCalendar}
        />
      </GridItem>
      <GridItem>
        <ReadOnlyInput
          label={t('modifiedBy')}
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
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, selectedTransactionId, projectId }) => {
  const { t } = useTranslation()

  const [isShowLienWaiver, setIsShowLienWaiver] = useState<Boolean>(false)
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>()
  // const [document, setDocument] = useState<File | null>(null)
  const { transactionTypeOptions } = useTransactionTypes()

  // API calls
  const { transaction } = useTransaction(selectedTransactionId)
  const {
    againstOptions: againstSelectOptions,
    workOrdersKeyValues,
    isLoading: isAgainstLoading,
  } = useProjectWorkOrders(projectId, !!selectedTransactionId)
  const transactionStatusOptions = useTransactionStatusOptions()
  const { workOrderSelectOptions, isLoading: isChangeOrderLoading } = useProjectWorkOrdersWithChangeOrders(projectId)
  const { changeOrderSelectOptions, isLoading: isWorkOrderLoading } = useWorkOrderChangeOrders(selectedWorkOrderId)
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
    control,
    reset, //  isTruncated title={label}
  } = formReturn

  const {
    isShowChangeOrderSelectField,
    isShowWorkOrderSelectField,
    isShowNewExpectedCompletionDateField,
    isShowExpectedCompletionDateField,
    isShowStatusField,
    isTransactionTypeDrawAgainstProjectSOWSelected,
    isShowPaymentRecievedDateField,
  } = useFieldShowHideDecision(control, transaction)
  const { isInvoicedDateRequired, isPaidDateRequired } = useFieldRequiredDecision(control, transaction)
  const { isUpdateForm, isApproved, isPaidDateDisabled, isStatusDisabled } = useFieldDisabledEnabledDecision(
    control,
    transaction,
  )

  const isLienWaiverRequired = useIsLienWaiverRequired(control, transaction)
  const selectedWorkOrder = useSelectedWorkOrder(control, workOrdersKeyValues)
  const { amount } = useTotalAmount(control)
  const againstOptions = useAgainstOptions(againstSelectOptions, control)
  const payDateVariance = useCalculatePayDateVariance(control)

  useLienWaiverFormValues(control, selectedWorkOrder, setValue)

  const onAgainstOptionSelect = (option: SelectOption) => {
    if (option?.value !== AGAINST_DEFAULT_VALUE) {
      setValue('paymentTerm', null)
      setValue('invoicedDate', null)
      setValue('workOrder', null)
      setValue('changeOrder', null)
    } else {
      setValue('newExpectedCompletionDate', '')
    }

    resetExpectedCompletionDateFields(option)
  }

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const queryOptions = {
        onSuccess() {
          onClose()
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

  useEffect(
    function updateAgainstOption() {
      if (transaction) return

      if (againstOptions.length === 1 && transactionType) {
        setValue('against', againstOptions?.[0])
        resetExpectedCompletionDateFields(againstOptions?.[0])
      } else if (againstOptions.length > 1) {
        setValue('against', null)
      }
    },
    [againstOptions, transactionType, transaction],
  )

  const onModalClose = () => {
    reset(defaultValues)
    onClose()
  }

  return (
    <Flex direction="column">
      {isFormLoading && <ViewLoader />}
      {isLienWaiverRequired && <LienWaiverAlert />}

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
              <Grid templateColumns="repeat(3, 1fr)" gap={'1.5rem 1rem'} pt="10" pb="4">
                <GridItem>
                  <FormControl isInvalid={!!errors.transactionType} data-testid="transaction-type">
                    <FormLabel fontSize="14px" color="gray.600" fontWeight={500} htmlFor="transactionType">
                      {t('transactionType')}
                    </FormLabel>
                    <Controller
                      rules={{ required: 'This is required field' }}
                      control={control}
                      name="transactionType"
                      render={({ field, fieldState }) => {
                        return (
                          <>
                            <Select
                              {...field}
                              options={transactionTypeOptions}
                              isDisabled={isUpdateForm}
                              size="md"
                              selectProps={{ isBorderLeft: true }}
                              onChange={async (option: SelectOption) => {
                                const formValues = { ...defaultValues, transactionType: option }

                                reset(formValues)

                                // resetExpectedCompletionDateFields(getValues('against') as SelectOption)
                              }}
                            />
                            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                          </>
                        )
                      }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isInvalid={!!errors.against} data-testid="against-select-field">
                    <FormLabel htmlFor="aginst" fontSize="14px" color="gray.600" fontWeight={500}>
                      {t('against')}
                    </FormLabel>
                    <Controller
                      control={control}
                      name="against"
                      rules={{ required: 'This is required' }}
                      render={({ field, fieldState }) => (
                        <>
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
                        </>
                      )}
                    />
                  </FormControl>
                </GridItem>

                {isShowWorkOrderSelectField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.workOrder} data-testid="work-order-select">
                      <FormLabel htmlFor="workOrder" fontSize="14px" color="gray.600" fontWeight={500}>
                        {t('workOrder')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="workOrder"
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                          <>
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
                          </>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                )}

                {isShowChangeOrderSelectField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.changeOrder} data-testid="change-order-select">
                      <FormLabel fontSize="14px" color="gray.600" fontWeight={500} htmlFor="changeOrder">
                        {t('changeOrder')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="changeOrder"
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              isDisabled={isUpdateForm}
                              options={changeOrderSelectOptions}
                              selectProps={{ isBorderLeft: true }}
                              {...field}
                            />
                            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
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
                        color="gray.600"
                        htmlFor="expectedCompletionDate"
                        whiteSpace="nowrap"
                      >
                        {t('expectedCompletion')}
                      </FormLabel>
                      <InputGroup>
                        <Input
                          data-testid="expected-completion-date"
                          id="expectedCompletionDate"
                          size="md"
                          isDisabled={true}
                          css={calendarIcon}
                          {...register('expectedCompletionDate')}
                        />
                        <InputRightElement children={<Icon as={BiCalendar} boxSize="5" color="gray.400" mr="11px" />} />
                      </InputGroup>

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
                        color="gray.600"
                        htmlFor="newExpectedCompletionDate"
                        whiteSpace="nowrap"
                      >
                        {t('newExpectedCompletionDate')}
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
                      <FormControl isInvalid={!!errors.paymentTerm} data-testid="payment-term-select">
                        <FormLabel htmlFor="paymentTerm" fontSize="14px" color="gray.600" fontWeight={500}>
                          {t('paymentTerm')}
                        </FormLabel>
                        <Controller
                          control={control}
                          name="paymentTerm"
                          rules={{ required: 'This is required' }}
                          render={({ field, fieldState }) => (
                            <>
                              <Select
                                {...field}
                                selectProps={{ isBorderLeft: true }}
                                options={PAYMENT_TERMS_OPTIONS}
                                isDisabled={isUpdateForm}
                                onChange={paymentTermOption => {
                                  field.onChange(paymentTermOption)
                                }}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
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
                          color="gray.600"
                          htmlFor="invoicedDate"
                          whiteSpace="nowrap"
                        >
                          {t('invoicedDate')}
                        </FormLabel>
                        <Input
                          data-testid="invoice-date"
                          id="invoicedDate"
                          type="date"
                          variant={isInvoicedDateRequired ? 'required-field' : 'outline'}
                          css={calendarIcon}
                          isDisabled={isApproved}
                          {...register('invoicedDate', {
                            required: isInvoicedDateRequired ? 'This is required field.' : '',
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
                          color="gray.600"
                          htmlFor="paidDate"
                          whiteSpace="nowrap"
                        >
                          {t('paidDate')}
                        </FormLabel>
                        <Input
                          data-testid="paid-date"
                          id="paidDate"
                          type="date"
                          variant={isPaidDateRequired ? 'required-field' : 'outline'}
                          size="md"
                          isDisabled={isPaidDateDisabled}
                          css={calendarIcon}
                          {...register('paidDate', { required: isPaidDateRequired ? 'This is required field.' : '' })}
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
                          color="gray.600"
                          htmlFor="payDateVariance"
                          whiteSpace="nowrap"
                        >
                          {t('payDateVariance')}
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
                        color="gray.600"
                        htmlFor="paymentRecievedDate"
                        whiteSpace="nowrap"
                      >
                        {t('paymentReceivedDate')}
                      </FormLabel>
                      <Input
                        data-testid="payment-received-date"
                        id="paymentRecievedDate"
                        size="md"
                        type="date"
                        variant="required-field"
                        isDisabled={isApproved}
                        {...register('paymentRecievedDate', { required: 'This is required field.' })}
                      />
                      <FormErrorMessage>{errors?.paymentRecievedDate?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                )}

                {isShowStatusField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.status} data-testid="status-select-field">
                      <FormLabel htmlFor="aginst" fontSize="14px" color="gray.600" fontWeight={500}>
                        {t('status')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="status"
                        rules={{ required: 'This is required' }}
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              {...field}
                              options={transactionStatusOptions}
                              isDisabled={isStatusDisabled}
                              onChange={statusOption => {
                                field.onChange(statusOption)
                              }}
                            />
                            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                          </>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                )}
              </Grid>

              <TransactionAmountForm formReturn={formReturn} transaction={transaction} />
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

      <HStack alignItems="center" justifyContent="end" mt="16px" spacing="16px">
        {isShowLienWaiver ? (
          <Button onClick={() => setIsShowLienWaiver(false)} variant="outline" colorScheme="brand">
            {t('back')}
          </Button>
        ) : (
          <Button onClick={onModalClose} variant="solid" colorScheme="brand" data-testid="close-transaction-form">
            {t('Cancel')}
          </Button>
        )}

        {isLienWaiverRequired && !isShowLienWaiver ? (
          <Button
            data-testid="next-to-lien-waiver-form"
            type="button"
            variant="solid"
            colorScheme="brand"
            isDisabled={amount === 0}
            onClick={event => {
              event.stopPropagation()
              setTimeout(() => {
                setIsShowLienWaiver(true)
              })
            }}
          >
            {t('next')}
          </Button>
        ) : (
          !isApproved && (
            <Button
              type="submit"
              form="newTransactionForm"
              data-testid="save-transaction"
              colorScheme="brand"
              variant="solid"
            >
              {t('save')}
            </Button>
          )
        )}
      </HStack>
    </Flex>
  )
}
