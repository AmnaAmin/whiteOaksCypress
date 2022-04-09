import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Button,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Grid,
  GridItem,
  ModalProps,
  ModalCloseButton,
  Progress,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
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
  useTransactionTypes,
  useWorkOrderChangeOrders,
} from 'utils/transactions'
import { FormValues, SelectOption, TransactionTypeValues } from 'types/transaction.type'
import { dateFormat } from 'utils/date-time-utils'
import { useFieldShowHideDecision } from './hooks'
import { TransactionAmountForm } from './transaction-amount-form'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'
import { ViewLoader } from 'components/page-level-loader'
import { ReadOnlyInput } from 'components/input-view/input-view'

type AddUpdateTransactionFormProps = {
  onClose: () => void
  selectedTransactionId?: number
}

const AddUpdateTransactionForm: React.FC<AddUpdateTransactionFormProps> = ({ onClose, selectedTransactionId }) => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>()
  const { transactionTypeOptions } = useTransactionTypes()

  // API calls
  const { transaction } = useTransaction(selectedTransactionId)
  const { againstOptions, workOrdersKeyValues, isLoading: isAgainstLoading } = useProjectWorkOrders(projectId)
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
    defaultValues,
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
  } = useFieldShowHideDecision(control)

  const onSubmit = useCallback(
    (values: FormValues) => {
      const queryOptions = {
        onSuccess() {
          onClose()
        },
      }

      // In case of id exists in transaction object it will be update call to save transaction.
      if (transaction?.id) {
        const payload = parseChangeOrderUpdateAPIPayload(values, transaction, projectId)
        updateChangeOrder({ ...payload, id: transaction.id }, queryOptions)
      } else {
        const payload = parseChangeOrderAPIPayload(values, projectId)
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
    <>
      {isFormSubmitLoading && (
        <Progress size="xs" isIndeterminate position="absolute" top="60px" left="0" width="100%" aria-label="loading" />
      )}
      <form onSubmit={handleSubmit(onSubmit)} id="newTransactionForm">
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={'1rem 0.5rem'}
          borderBottom="2px solid"
          borderColor="gray.200"
          pb="3"
          mb="5"
        >
          <GridItem>
            <Controller
              name="dateCreated"
              control={control}
              render={({ field: { name, onChange, value } }) => {
                return (
                  <ReadOnlyInput label={t('dateCreated')} name={name} onChange={onChange} value={value as string} />
                )
              }}
            />
          </GridItem>

          <GridItem>
            <Controller
              name="createdBy"
              control={control}
              render={({ field: { name, onChange, value } }) => {
                return <ReadOnlyInput label={t('createdBy')} name={name} onChange={onChange} value={value as string} />
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
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
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
                  borderLeft=" 2px solid #4E87F8"
                  id="newExpectedCompletionDate"
                  type="date"
                  size="md"
                  fontSize="14px"
                  color="gray.400"
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
      </form>
    </>
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
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader bg="gray.50" borderBottom="1px solid #eee">
          {t('newTransaction')}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />

        <ModalBody px="6" pt="3" pb="1">
          <AddUpdateTransactionForm onClose={onClose} />
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button onClick={onClose} variant="ghost" size="sm">
            {t('close')}
          </Button>

          <Button
            data-testid="save-transaction"
            colorScheme="CustomPrimaryColor"
            _focus={{ outline: 'none' }}
            _hover={{ bg: 'blue' }}
            type="submit"
            form="newTransactionForm"
            ml="3"
            size="sm"
          >
            {t('save')}
          </Button>
        </ModalFooter>
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
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader bg="gray.50" borderBottom="1px solid #eee">
          Update Transaction
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />
        <ModalBody px="6" pt="3" pb="1">
          <AddUpdateTransactionForm onClose={onClose} selectedTransactionId={selectedTransactionId} />
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>

          <Button
            data-testid="update-transaction"
            colorScheme="CustomPrimaryColor"
            _hover={{ bg: 'blue' }}
            _focus={{ outlin: 'none' }}
            type="submit"
            form="newTransactionForm"
            ml="3"
            size="sm"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
