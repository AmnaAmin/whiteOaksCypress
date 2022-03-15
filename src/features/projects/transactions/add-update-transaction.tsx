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
  Box,
  Heading,
  Text,
  Stack,
  Divider,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'components/form/react-select'
import { disabledInputStyle } from 'theme/common-style'
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
import {
  FormValues,
  SelectOption,
  TransactionTypeValues,
} from 'types/transaction.type'
import { dateFormat } from 'utils/date-time-utils'
import { useFieldShowHideDecision } from './hooks'
import { TransactionAmountForm } from './transaction-amount-form'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'

const date = new Date().toLocaleDateString()

type AddUpdateTransactionFormProps = {
  onClose: () => void
  selectedTransactionId?: number
}

const AddUpdateTransactionForm: React.FC<AddUpdateTransactionFormProps> = ({
  onClose,
  selectedTransactionId,
}) => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>()
  const { transaction } = useTransaction(selectedTransactionId)
  const { transactionTypeOptions } = useTransactionTypes()
  const { againstOptions, workOrdersKeyValues } =
    useProjectWorkOrders(projectId)
  const { workOrderSelectOptions } =
    useProjectWorkOrdersWithChangeOrders(projectId)
  const { changeOrderSelectOptions } =
    useWorkOrderChangeOrders(selectedWorkOrderId)
  const { mutate: createChangeOrder } = useChangeOrderMutation(projectId)
  const { mutate: updateChangeOrder } = useChangeOrderUpdateMutation(projectId)

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
        const payload = parseChangeOrderUpdateAPIPayload(
          values,
          transaction,
          projectId,
        )
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
          workOrdersKeyValues?.[againstOption.value]
            .workOrderExpectedCompletionDate ?? '',
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
      const formValues = parseTransactionToFormValues(
        transaction,
        againstOptions,
      )

      reset(formValues)
    } else if (againstOptions) {
      setValue('against', againstOptions?.[0])
      resetExpectedCompletionDateFields(againstOptions?.[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction, againstOptions.length, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="newTransactionForm">
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <FormControl isInvalid={!!errors.transactionType} maxW={250}>
            <FormLabel
              fontSize="14px"
              color="gray.600"
              fontWeight={500}
              htmlFor="transactionType"
            >
              {t('transactionType')}
            </FormLabel>
            <Controller
              rules={{ required: 'This is required' }}
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
                        if (
                          option.value !== TransactionTypeValues.changeOrder
                        ) {
                          reset({
                            ...defaultValues,
                            transactionType: option,
                            against: getValues('against'),
                          })
                          resetExpectedCompletionDateFields(
                            getValues('against') as SelectOption,
                          )
                        } else {
                          field.onChange(option)
                        }
                      }}
                    />
                    <FormErrorMessage>
                      {fieldState.error?.message}
                    </FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <Stack>
            <Text
              fontSize="14px"
              fontWeight={500}
              color="gray.600"
              fontStyle="normal"
            >
              {t('against')}
            </Text>
            <Text
              fontSize="14px"
              fontWeight={500}
              color="gray.400"
              fontStyle="normal"
            >
              ADT Renovation
            </Text>
            <Box w="250px" color="gray.200" pt="12px">
              <Divider />
            </Box>
            {/* <Divider w="250px" color="gray.200" /> */}
          </Stack>

          {/* <FormControl isInvalid={!!errors.against}>
            <FormLabel fontSize="lg" htmlFor="aginst">
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
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </>
              )}
            />
          </FormControl> */}
        </GridItem>

        {isShowWorkOrderSelectField && (
          <GridItem>
            <FormControl isInvalid={!!errors.workOrder}>
              <FormLabel fontSize="lg" htmlFor="workOrder">
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
                    <FormErrorMessage>
                      {fieldState.error?.message}
                    </FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
        )}
        {isShowChangeOrderSelectField && (
          <GridItem>
            <FormControl isInvalid={!!errors.changeOrder}>
              <FormLabel fontSize="lg" htmlFor="changeOrder">
                {t('changeOrder')}
              </FormLabel>
              <Controller
                control={control}
                name="changeOrder"
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <>
                    <Select options={changeOrderSelectOptions} {...field} />
                    <FormErrorMessage>
                      {fieldState.error?.message}
                    </FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
        )}

        {isShowExpectedCompletionDateField && (
          <GridItem>
            <Stack>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="gray.600"
                fontStyle="normal"
              >
                {t('expectedCompletionDate')}
              </Text>
              <Text
                fontSize="14px"
                fontWeight={400}
                color="gray.400"
                fontStyle="normal"
              >
                {date}
              </Text>
              <Box w="250px" color="gray.200" pt="12px">
                <Divider />
              </Box>
              {/* <Divider w="250px" color="gray.200" /> */}
            </Stack>
            {/* <FormControl isInvalid={!!errors.expectedCompletionDate}>
              <FormLabel fontSize="lg" htmlFor="expectedCompletionDate">
                {t('expectedCompletionDate')}
              </FormLabel>
              <Input
                id="expectedCompletionDate"
                type="text"
                size="lg"
                _disabled={disabledInputStyle}
                disabled
                {...register('expectedCompletionDate')}
              />
              <FormErrorMessage>
                {errors.expectedCompletionDate &&
                  errors.expectedCompletionDate.message}
              </FormErrorMessage>
            </FormControl> */}
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
              >
                {t('newExpectedCompletionDate')}
              </FormLabel>
              <Input
                borderLeft=" 2px solid #4E87F8"
                id="newExpectedCompletionDate"
                type="date"
                size="md"
                color="gray.400"
                {...register('newExpectedCompletionDate')}
              />
              <FormErrorMessage>
                {errors.newExpectedCompletionDate &&
                  errors.newExpectedCompletionDate.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        )}

        <GridItem>
          <Stack>
            <Text
              fontSize="14px"
              fontWeight={500}
              color="gray.600"
              fontStyle="normal"
            >
              {t('dateCreated')}
            </Text>
            <Text
              fontSize="14px"
              fontWeight={400}
              color="gray.400"
              fontStyle="normal"
            >
              {date}
            </Text>
            <Box w="250px" color="gray.200" pt="12px">
              <Divider />
            </Box>
            {/* <Divider w="250px" color="gray.200" /> */}
          </Stack>
          {/* <FormControl isInvalid={!!errors.dateCreated}>
            <FormLabel fontSize="lg" htmlFor="dateCreated">
              {t('dateCreated')}
            </FormLabel>
            <Input
              id="dateCreated"
              type="text"
              size="lg"
              _disabled={disabledInputStyle}
              disabled
              {...register('dateCreated', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>
              {errors.dateCreated && errors.dateCreated.message}
            </FormErrorMessage>
          </FormControl> */}
        </GridItem>

        <GridItem>
          <Stack>
            <Text
              fontSize="14px"
              fontWeight={500}
              color="gray.600"
              fontStyle="normal"
            >
              {t('createdBy')}
            </Text>
            <Text
              fontSize="14px"
              fontWeight={400}
              color="gray.400"
              fontStyle="normal"
            >
              vendor@devtek.ai
            </Text>
            <Box w="250px" color="gray.200" pt="12px">
              <Divider />
            </Box>
            {/* <Divider w="250px" color="gray.200" /> */}
          </Stack>
          {/* <FormControl isInvalid={!!errors.createdBy}>
            <FormLabel fontSize="lg" htmlFor="createdBy">
              {t('createdBy')}
            </FormLabel>
            <Input
              id="createdBy"
              type="text"
              size="lg"
              placeholder="createdBy"
              _disabled={disabledInputStyle}
              disabled
              {...register('createdBy', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>
              {errors.createdBy && errors.createdBy.message}
            </FormErrorMessage>
          </FormControl> */}
        </GridItem>
      </Grid>

      <TransactionAmountForm formReturn={formReturn} />
    </form>
  )
}

type CustomModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>
type AddNewTransactionProps = CustomModalProps
type UpdateTransactionProps = CustomModalProps & {
  selectedTransactionId: number
}

export const AddNewTransactionModal: React.FC<AddNewTransactionProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader bg="gray.50" borderBottom="1px solid #eee">
          {t('newTransaction')}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />
        <ModalBody px="6" py="8">
          <AddUpdateTransactionForm onClose={onClose} />
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button onClick={onClose} variant="text">
            {t('close')}
          </Button>

          <Button
            colorScheme="button"
            type="submit"
            form="newTransactionForm"
            ml="3"
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

        <ModalBody px="6" py="8">
          <AddUpdateTransactionForm
            onClose={onClose}
            selectedTransactionId={selectedTransactionId}
          />
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button onClick={onClose} variant="text">
            Close
          </Button>

          <Button
            colorScheme="CustomPrimaryColor"
            type="submit"
            form="newTransactionForm"
            ml="3"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
