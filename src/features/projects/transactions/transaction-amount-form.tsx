import React, { ChangeEvent, useCallback, useMemo, useRef } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Text,
  HStack,
} from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { AiOutlineFileText, AiOutlinePlus } from 'react-icons/ai'
import { Controller, useFieldArray, useWatch, UseFormReturn } from 'react-hook-form'
import { isValidAndNonEmptyObject } from 'utils'
import { useFieldDisabledEnabledDecision, useFieldShowHideDecision, useTotalAmount } from './hooks'
import { ChangeOrderType, FormValues, TransactionTypeValues } from 'types/transaction.type'
import { ConfirmationBox } from 'components/Confirmation'
import { TRANSACTION_FEILD_DEFAULT } from 'utils/transactions'
import { MdOutlineCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { BiDownload } from 'react-icons/bi'

type TransactionAmountFormProps = {
  formReturn: UseFormReturn<FormValues>
  transaction?: ChangeOrderType
}

export const TransactionAmountForm: React.FC<TransactionAmountFormProps> = ({
  formReturn,
  transaction: changeOrder,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = formReturn
  const values = getValues()
  const {
    isOpen: isDeleteConfirmationModalOpen,
    onClose: onDeleteConfirmationModalClose,
    onOpen: onDeleteConfirmationModalOpen,
  } = useDisclosure()

  const transaction = useWatch({ name: 'transaction', control })
  const document = useWatch({ name: 'attachment', control })

  const checkedItems = useMemo(() => {
    return transaction.map(item => item.checked)
  }, [transaction])

  const {
    fields: transactionFields,
    append,
    remove: removeTransactionField,
  } = useFieldArray({
    control,
    name: 'transaction',
  })

  // useOnRefundMaterialCheckboxChange(control, update)

  const { isShowRefundMaterialCheckbox } = useFieldShowHideDecision(control)
  const { isAproved } = useFieldDisabledEnabledDecision(control, changeOrder)

  const allChecked = isValidAndNonEmptyObject(checkedItems) ? Object.values(checkedItems).every(Boolean) : false
  const someChecked = isValidAndNonEmptyObject(checkedItems) ? Object.values(checkedItems).some(Boolean) : false
  const isIndeterminate = someChecked && !allChecked

  const { formattedAmount: totalAmount } = useTotalAmount(control)

  const toggleAllCheckboxes = useCallback(
    event => {
      setValue(
        'transaction',
        transactionFields.map(transactionItem => ({
          ...transactionItem,
          checked: event.currentTarget.checked,
        })),
      )
    },
    [transactionFields, setValue],
  )

  const addRow = useCallback(() => {
    const id = Date.now()

    append({ id, description: '', amount: '', checked: false })
  }, [append])

  const deleteRows = useCallback(() => {
    const indexes: number[] = []
    transactionFields.forEach((transaction, index) => {
      if (transaction.checked) {
        indexes.push(index)
      }
    })

    removeTransactionField(indexes)
    onDeleteConfirmationModalClose()

    if (transactionFields.length === indexes.length) {
      setValue('transaction', [TRANSACTION_FEILD_DEFAULT])
    }
  }, [removeTransactionField, transactionFields, onDeleteConfirmationModalClose, setValue])

  const onFileChange = useCallback(
    e => {
      const files = e.target.files
      if (files[0]) {
        setValue('attachment', files[0])
      }
    },
    [setValue],
  )

  const onRefundMaterialCheckboxChange = isChecked => {
    const transaction = getValues('transaction')

    transaction?.forEach((transactionField, index) => {
      const amount = Math.abs(Number(transactionField.amount))
      const amountValue = isChecked ? amount : -1 * amount

      // @ts-ignore
      setValue(`transaction.${index}.amount`, amountValue)
    })
  }

  return (
    <>
      <Flex justifyContent="space-between" w="100%" mt="30px" mb="15px">
        <Box flex="1">
          <Button
            data-testid="add-new-row-button"
            variant="ghost"
            size="sm"
            borderColor="#4E87F8"
            color="#4E87F8"
            onClick={addRow}
            isDisabled={isAproved}
            leftIcon={<AiOutlinePlus color="#4E87F8" />}
          >
            {t('addNewRow')}
          </Button>
          <Button
            data-testid="delete-row-button"
            variant="ghost"
            size="sm"
            ml="10px"
            borderColor="#4E87F8"
            color="#4E87F8"
            leftIcon={<RiDeleteBinLine color="#4E87F8" />}
            onClick={onDeleteConfirmationModalOpen}
            isDisabled={!someChecked || isAproved}
          >
            {t('deleteRow')}
          </Button>
        </Box>

        <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={onFileChange}></input>
        <HStack>
          {isShowRefundMaterialCheckbox && (
            <Controller
              control={control}
              name="refundMaterial"
              render={({ field: { name, value, onChange } }) => {
                return (
                  <Checkbox
                    data-testid="refund-material"
                    name={name}
                    variant="link"
                    _focus={{ outline: 'none' }}
                    isChecked={!!value}
                    isDisabled={isAproved}
                    onChange={event => {
                      const isChecked = event.currentTarget.checked
                      onRefundMaterialCheckboxChange(isChecked)
                      onChange(isChecked)
                    }}
                  >
                    Refund material
                  </Checkbox>
                )
              }}
            />
          )}
          {values.attachment && values.attachment.s3Url && (
            <a href={values?.attachment?.s3Url} download style={{ color: '#4E87F8' }}>
              <Flex>
                <Box mt="3px">
                  <BiDownload fontSize="sm" />
                </Box>
                <Text ml="5px" fontSize="14px" fontWeight={500} fontStyle="normal">
                  {values?.attachment?.fileType}
                </Text>
              </Flex>
            </a>
          )}
          {document ? (
            <Box
              color="barColor.100"
              border="1px solid #e2e8f0"
              // a
              borderRadius="4px"
              fontSize="16px"
            >
              <HStack spacing="5px" h="31px" padding="10px" align="center">
                <Box as="span" maxWidth="500px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                  {document?.name || document.fileType}
                </Box>
                <MdOutlineCancel
                  cursor="pointer"
                  onClick={() => {
                    setValue('attachment', null)
                    if (inputRef.current) inputRef.current.value = ''
                  }}
                />
              </HStack>
            </Box>
          ) : (
            <Button
              onClick={e => {
                if (inputRef.current) {
                  inputRef.current.click()
                }
              }}
              leftIcon={<AiOutlineFileText />}
              variant="ghost"
              size="sm"
              colorScheme="brand"
              isDisabled={isAproved}
            >
              {t('attachment')}
            </Button>
          )}
        </HStack>
      </Flex>

      <Box border="1px solid #efefef" h="200px" overflow="auto">
        <Table colorScheme="gray">
          <Thead bg="gray.50">
            <Tr>
              {transactionFields?.length > 1 && (
                <Th px="3">
                  <Checkbox
                    data-testid="all-checkbox"
                    isChecked={allChecked}
                    isDisabled={isAproved}
                    isIndeterminate={isIndeterminate}
                    onChange={toggleAllCheckboxes}
                  />
                </Th>
              )}
              <Th fontWeight={700} fontSize="12px" color="gray.600" fontStyle="normal" textTransform="capitalize">
                {t('description')}
              </Th>
              <Th fontWeight={700} fontSize="12px" color="gray.600" fontStyle="normal" textTransform="capitalize">
                {t('amount')}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactionFields.map((transactionField, index) => {
              return (
                <Tr key={transactionField.id}>
                  {transactionFields?.length > 1 && (
                    <Td px="3">
                      <Controller
                        control={control}
                        name={`transaction.${index}.checked` as const}
                        render={({ field: { name, value, onChange } }) => {
                          return (
                            <Checkbox
                              data-testid={`checkbox-${index}`}
                              key={name}
                              name={name}
                              isDisabled={isAproved}
                              isChecked={transactionField.checked}
                              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                transactionField.checked = event.currentTarget.checked
                                onChange(event.currentTarget.checked)
                              }}
                            />
                          )
                        }}
                      />
                    </Td>
                  )}
                  <Td>
                    <FormControl isInvalid={!!errors.transaction?.[index].description}>
                      <Input
                        data-testid={`transaction-description-${index}`}
                        type="text"
                        size="sm"
                        autoComplete="off"
                        placeholder="description"
                        isDisabled={isAproved}
                        {...register(`transaction.${index}.description` as const, {
                          required: 'This is required field',
                        })}
                      />

                      <FormErrorMessage>{errors?.transaction?.[index]?.description?.message ?? ''}</FormErrorMessage>
                    </FormControl>
                  </Td>
                  <Td maxW="120">
                    <FormControl isInvalid={!!errors.transaction?.[index].amount}>
                      <Controller
                        name={`transaction.${index}.amount` as const}
                        control={control}
                        rules={{
                          required: 'This is required field',
                        }}
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <Input
                                {...field}
                                data-testid={`transaction-amount-${index}`}
                                type="number"
                                size="sm"
                                placeholder="amount"
                                isDisabled={isAproved}
                                autoComplete="off"
                                value={field.value}
                                onChange={event => {
                                  const inputValue = Number(event.currentTarget.value)
                                  const transactionTypeId = getValues('transactionType')?.value
                                  const isRefundMaterialCheckboxChecked = getValues('refundMaterial')

                                  field.onChange(
                                    TransactionTypeValues.draw === transactionTypeId ||
                                      (TransactionTypeValues.material === transactionTypeId &&
                                        !isRefundMaterialCheckboxChecked)
                                      ? -1 * Math.abs(inputValue)
                                      : inputValue,
                                  )
                                }}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Box>
      <Flex p="3" flexDirection="row-reverse" borderWidth="0 1px 1px 1px" borderStyle="solid" borderColor="gray.100">
        <Text data-testid="total-amount" color="gray.600" fontSize="14px" fontWeight={500} fontStyle="normal">
          {t('total')}: {totalAmount}
        </Text>
      </Flex>

      <ConfirmationBox
        title="Delete Transaction Row"
        content="delete selected rows"
        isOpen={isDeleteConfirmationModalOpen}
        onClose={onDeleteConfirmationModalClose}
        onConfirm={deleteRows}
      />
    </>
  )
}
