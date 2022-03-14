import React, { useCallback, useRef, useState } from 'react'
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
import {
  Controller,
  useFieldArray,
  useWatch,
  UseFormReturn,
} from 'react-hook-form'
import { isValidAndNonEmptyObject } from 'utils'
import { useTotalAmount } from './hooks'
import { FormValues, TransactionTypeValues } from 'types/transaction.type'
import { ConfirmationBox } from 'components/Confirmation'
import { TRANSACTION_FEILD_DEFAULT } from 'utils/transactions'
import { MdOutlineCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { GenericObjectType } from 'types/common.types'

type TransactionAmountFormProps = {
  formReturn: UseFormReturn<FormValues>
}

export const TransactionAmountForm: React.FC<TransactionAmountFormProps> = ({
  formReturn,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [document, setDocument] = useState<File | null>(null)

  const onFileChange = useCallback(
    e => {
      const files = e.target.files
      if (files[0]) {
        setDocument(files[0])
      }
    },
    [setDocument],
  )
  const {
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = formReturn
  const {
    isOpen: isDeleteConfirmationModalOpen,
    onClose: onDeleteConfirmationModalClose,
    onOpen: onDeleteConfirmationModalOpen,
  } = useDisclosure()

  const transaction = useWatch({ name: 'transaction', control })
  const {
    fields: transactionFields,
    append,
    remove: removeTransactionField,
  } = useFieldArray({
    control,
    name: 'transaction',
  })

  const [checkedItems, setCheckedItems] = React.useState<GenericObjectType>(
    transaction.reduce(
      (final, current) => ({ ...final, [current.id]: false }),
      {},
    ),
  )
  const allChecked = isValidAndNonEmptyObject(checkedItems)
    ? Object.values(checkedItems).every(Boolean)
    : false
  const someChecked = isValidAndNonEmptyObject(checkedItems)
    ? Object.values(checkedItems).some(Boolean)
    : false
  const isIndeterminate = someChecked && !allChecked

  const totalAmount = useTotalAmount(control)

  const toggleAllCheckboxes = useCallback(
    event => {
      setCheckedItems(state => {
        const result: GenericObjectType = {}
        state &&
          Object.keys(state).forEach(key => {
            result[key] = event.currentTarget.checked
          })
        return result
      })
    },
    [setCheckedItems],
  )

  const removeCheckedCheckboxes = () => {
    setCheckedItems(state => {
      for (const item in state) {
        if (state[item]) {
          delete state[item]
        }
      }

      return state
    })
  }

  const addRow = useCallback(() => {
    const id = Date.now()

    append({ id, description: '', amount: '' })
    setCheckedItems(state => ({ ...state, [id]: false }))
  }, [append, setCheckedItems])

  const deleteRows = useCallback(() => {
    const indexes: number[] = []
    transactionFields.forEach((transaction, index) => {
      if (checkedItems[transaction.id]) {
        indexes.push(index)
      }
    })

    removeTransactionField(indexes)
    removeCheckedCheckboxes()
    onDeleteConfirmationModalClose()

    if (transactionFields.length === indexes.length) {
      setValue('transaction', [TRANSACTION_FEILD_DEFAULT])
    }
  }, [
    checkedItems,
    removeTransactionField,
    transactionFields,
    onDeleteConfirmationModalClose,
    setValue,
  ])

  return (
    <>
      <Flex justifyContent="space-between" w="100%" mt="30px" mb="15px">
        <Box flex="1">
          <Button
            variant="outline"
            size="md"
            borderColor="button.300"
            color="button.300"
            onClick={addRow}
            leftIcon={<AiOutlinePlus />}
          >
            {t('addNewRow')}
          </Button>
          <Button
            variant="outline"
            size="md"
            ml="10px"
            borderColor="button.300"
            color="button.300"
            disabled={!someChecked}
            leftIcon={<RiDeleteBinLine />}
            onClick={onDeleteConfirmationModalOpen}
          >
            {t('deleteRow')}
          </Button>
        </Box>

        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={onFileChange}
        ></input>
        {document ? (
          <Box
            color="barColor.100"
            border="1px solid #e2e8f0"
            // a
            borderRadius="4px"
            fontSize="16px"
          >
            <HStack spacing="5px" h="31px" padding="10px" align="center">
              <Box
                as="span"
                maxWidth="500px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {document?.name}
              </Box>
              <MdOutlineCancel
                cursor="pointer"
                onClick={() => {
                  setDocument(null)
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
            variant="outline"
            size="md"
            borderColor="button.300"
            color="button.300"
          >
            {t('attachment')}
          </Button>
        )}
      </Flex>

      <Box border="1px solid #efefef" h="300px" overflow="auto">
        <Table colorScheme="gray">
          <Thead bg="gray.50">
            <Tr>
              {transactionFields?.length > 1 && (
                <Th px="3">
                  <Checkbox
                    isChecked={allChecked}
                    isIndeterminate={isIndeterminate}
                    onChange={toggleAllCheckboxes}
                  />
                </Th>
              )}
              <Th
                fontWeight={700}
                fontSize="12px"
                color="gray.600"
                fontStyle="normal"
                textTransform="capitalize"
              >
                {t('description')}
              </Th>
              <Th
                fontWeight={700}
                fontSize="12px"
                color="gray.600"
                fontStyle="normal"
                textTransform="capitalize"
              >
                {t('amount')}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactionFields.map((transactionField, index) => (
              <Tr key={`field${index}`}>
                {transactionFields?.length > 1 && (
                  <Td px="3">
                    <Checkbox
                      isChecked={!!checkedItems?.[transactionField.id]}
                      onChange={e =>
                        setCheckedItems(state => ({
                          ...state,
                          [transactionField.id]: e.currentTarget.checked,
                        }))
                      }
                    />
                  </Td>
                )}
                <Td>
                  <FormControl
                    isInvalid={!!errors.transaction?.[index].description}
                  >
                    <Input
                      type="text"
                      size="lg"
                      placeholder="description"
                      {...register(
                        `transaction.${index}.description` as const,
                        { required: 'This is required' },
                      )}
                    />

                    <FormErrorMessage>
                      {errors?.transaction?.[index]?.description?.message ?? ''}
                    </FormErrorMessage>
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
                              type="number"
                              size="lg"
                              placeholder="amount"
                              onChange={event => {
                                const inputValue = Number(
                                  event.currentTarget.value,
                                )
                                field.onChange(
                                  TransactionTypeValues.draw ===
                                    getValues('transactionType')?.value
                                    ? -1 * Math.abs(inputValue)
                                    : inputValue,
                                )
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
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex pt="3" flexDirection="row-reverse">
        <Text
          color="gray.600"
          fontSize="16px"
          fontWeight={600}
          fontStyle="normal"
        >
          {totalAmount}
        </Text>
      </Flex>

      <ConfirmationBox
        title="Delete Transaction Row"
        content="delete selected rows."
        isOpen={isDeleteConfirmationModalOpen}
        onClose={onDeleteConfirmationModalClose}
        onConfirm={deleteRows}
      />
    </>
  )
}
