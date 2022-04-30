import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Grid,
  GridItem,
  ModalProps,
  Progress,
  Flex,
  Box,
  HStack,
  Button,
} from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/modal'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

// import { Button } from 'components/button/button'
import Select from 'components/form/react-select'
import { useParams } from 'react-router'
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
} from 'utils/transactions'
import { FormValues, SelectOption, TransactionTypeValues } from 'types/transaction.type'
import { dateFormat } from 'utils/date-time-utils'
import {
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

type AddUpdateTransactionFormProps = {
  onClose: () => void
  selectedTransactionId?: number
}

const AddUpdateTransactionForm: React.FC<AddUpdateTransactionFormProps> = ({ onClose, selectedTransactionId }) => {
  const { t } = useTranslation()
  const [isShowLienWaiver, setIsShowLienWaiver] = useState<Boolean>(false)
  const { projectId } = useParams<'projectId'>()
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>()
  // const [document, setDocument] = useState<File | null>(null)
  const { transactionTypeOptions } = useTransactionTypes()

  // API calls
  const { transaction } = useTransaction(selectedTransactionId)
  const { againstOptions, workOrdersKeyValues, isLoading: isAgainstLoading } = useProjectWorkOrders(projectId)
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
    control,
    reset,
    getValues,
  } = formReturn

  const {
    isShowExpectedCompletionDateField,
    isShowChangeOrderSelectField,
    isShowWorkOrderSelectField,
    isShowNewExpectedCompletionDateField,
    isShowStatusField,
  } = useFieldShowHideDecision(control, transaction)
  const isLienWaiverRequired = useIsLienWaiverRequired(control, transaction)
  const selectedWorkOrder = useSelectedWorkOrder(control, workOrdersKeyValues)
  const { amount } = useTotalAmount(control)

  useLienWaiverFormValues(control, selectedWorkOrder, setValue)

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const queryOptions = {
        onSuccess() {
          onClose()
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
    if (transaction && againstOptions) {
      // Reset the default values of form fields in case transaction and againstOptions options exists.
      const formValues = parseTransactionToFormValues(transaction, againstOptions)

      reset(formValues)
    } else if (againstOptions) {
      setValue('against', againstOptions?.[0])
      resetExpectedCompletionDateFields(againstOptions?.[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction, againstOptions.length, setValue])

  if (isFormLoading) return <ViewLoader />

  return (
    <Flex direction="column">
      {isLienWaiverRequired && <LienWaiverAlert />}

      {isFormSubmitLoading && (
        <Progress size="xs" isIndeterminate position="absolute" top="60px" left="0" width="100%" aria-label="loading" />
      )}

      <FormProvider {...formReturn}>
        <form onSubmit={handleSubmit(onSubmit)} id="newTransactionForm">
          {/** In case Draw selected and user click next will show Lien Waiver Popover */}
          {!isShowLienWaiver ? (
            <Box flex={1}>
              {/** Readonly information of Transaction */}
              <Grid
                templateColumns="repeat(4, fit-content(100px))"
                gap={'1rem 30px'}
                borderBottom="2px solid"
                borderColor="gray.200"
                py="5"
              >
                <GridItem>
                  <Controller
                    name="dateCreated"
                    control={control}
                    render={({ field: { name, onChange, value } }) => {
                      return (
                        <ReadOnlyInput
                          label={t('dateCreated')}
                          name={name}
                          onChange={onChange}
                          value={value as string}
                        />
                      )
                    }}
                  />
                </GridItem>

                <GridItem>
                  <Controller
                    name="createdBy"
                    control={control}
                    render={({ field: { name, onChange, value } }) => {
                      return (
                        <ReadOnlyInput label={t('createdBy')} name={name} onChange={onChange} value={value as string} />
                      )
                    }}
                  />
                </GridItem>
                {isShowExpectedCompletionDateField && (
                  <GridItem>
                    <Controller
                      name="expectedCompletionDate"
                      control={control}
                      render={({ field: { name, onChange, value } }) => {
                        return (
                          <ReadOnlyInput
                            testId="expected-completion-date"
                            label={t('expectedCompletionDate')}
                            name={name}
                            onChange={onChange}
                            value={value as string}
                          />
                        )
                      }}
                    />
                  </GridItem>
                )}
              </Grid>

              {/** Editable form */}
              <Grid templateColumns="repeat(3, 1fr)" gap={'1rem 1rem'} pt="10" pb="4">
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
                              isDisabled={!!transaction}
                              size="md"
                              selectProps={{ isBorderLeft: true }}
                              onChange={(option: SelectOption) => {
                                if (option.value !== TransactionTypeValues.changeOrder) {
                                  reset({
                                    ...defaultValues,
                                    transactionType: option,
                                    against: getValues('against'),
                                  })
                                  resetExpectedCompletionDateFields(getValues('against') as SelectOption)
                                } else {
                                  field.onChange(option)
                                }
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
                            isDisabled={!!transaction}
                            onChange={againstOption => {
                              resetExpectedCompletionDateFields(againstOption)
                              field.onChange(againstOption)
                            }}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </>
                      )}
                    />
                  </FormControl>
                </GridItem>

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

                {isShowWorkOrderSelectField && (
                  <GridItem>
                    <FormControl isInvalid={!!errors.workOrder}>
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
                              options={workOrderSelectOptions}
                              {...field}
                              onChange={option => {
                                setSelectedWorkOrderId(option.value)
                                field.onChange(option)
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
                    <FormControl isInvalid={!!errors.changeOrder}>
                      <FormLabel fontSize="14px" color="gray.600" fontWeight={500} htmlFor="changeOrder">
                        {t('changeOrder')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="changeOrder"
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                          <>
                            <Select options={changeOrderSelectOptions} {...field} />
                            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                          </>
                        )}
                      />
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
                        {...register('newExpectedCompletionDate')}
                      />
                      <FormErrorMessage>
                        {errors.newExpectedCompletionDate && errors.newExpectedCompletionDate.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                )}
              </Grid>

              <TransactionAmountForm formReturn={formReturn} />
            </Box>
          ) : (
            <Box flex={1}>
              {/** This component need Nested form Implementation using FormProvider */}
              <DrawLienWaiver />
            </Box>
          )}
        </form>

        <DevTool control={control} />
      </FormProvider>

      <HStack alignItems="center" justifyContent="end" py="4">
        {isShowLienWaiver ? (
          <Button onClick={() => setIsShowLienWaiver(false)} variant="outline" colorScheme="brand">
            {t('back')}
          </Button>
        ) : (
          <Button onClick={onClose} variant="outline" colorScheme="brand">
            {t('close')}
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
              setIsShowLienWaiver(true)
            }}
          >
            {t('next')}
          </Button>
        ) : (
          <Button
            type="submit"
            form="newTransactionForm"
            data-testid="save-transaction"
            colorScheme="brand"
            variant="solid"
          >
            {t('save')}
          </Button>
        )}
      </HStack>
    </Flex>
  )
}

type CustomModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>
type AddNewTransactionProps = CustomModalProps
type UpdateTransactionProps = CustomModalProps & {
  selectedTransactionId: number
}

export const AddNewTransactionModal: React.FC<AddNewTransactionProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader>{t('newTransaction')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <AddUpdateTransactionForm onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const UpdateTransactionModal: React.FC<UpdateTransactionProps> = ({
  isOpen,
  onClose,
  selectedTransactionId,
}) => {
  // const { transaction } = useTransaction(selectedTransactionIdd);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader>Update Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddUpdateTransactionForm onClose={onClose} selectedTransactionId={selectedTransactionId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
