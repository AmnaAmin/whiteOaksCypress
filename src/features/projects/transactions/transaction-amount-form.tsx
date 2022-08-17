import React, { ChangeEvent, useCallback, useMemo, useRef } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  useDisclosure,
  Text,
  HStack,
  Divider,
  GridItem,
  Grid,
} from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { AiOutlinePlus } from 'react-icons/ai'
import { Controller, useFieldArray, useWatch, UseFormReturn } from 'react-hook-form'
import { isValidAndNonEmptyObject } from 'utils'
import { useFieldDisabledEnabledDecision, useFieldShowHideDecision, useTotalAmount } from './hooks'
import { ChangeOrderType, FormValues, TransactionTypeValues } from 'types/transaction.type'
import { ConfirmationBox } from 'components/Confirmation'
import { TRANSACTION_FEILD_DEFAULT } from 'utils/transactions'
import { MdOutlineCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { BiDownload, BiFile } from 'react-icons/bi'
import numeral from 'numeral'

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
  const { isApproved } = useFieldDisabledEnabledDecision(control, changeOrder)

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

  const isShowCheckboxes = transactionFields?.length > 1

  return (
    <>
      <Flex justifyContent="space-between" w="100%" mt="30px" mb="15px">
        {!isApproved && (
          <Box flex="1">
            <Button
              data-testid="add-new-row-button"
              variant="outline"
              size="sm"
              borderColor="#4E87F8"
              color="#4E87F8"
              onClick={addRow}
              leftIcon={<AiOutlinePlus color="#4E87F8" />}
            >
              {t('addNewRow')}
            </Button>
            <Button
              data-testid="delete-row-button"
              variant="outline"
              size="sm"
              ml="10px"
              borderColor="#4E87F8"
              color="#4E87F8"
              _disabled={{
                bg: '#EBF8FF',
                color: '#4E87F8',
                _hover: {
                  bg: '#EBF8FF'
                }
              }}
              leftIcon={<RiDeleteBinLine color="#4E87F8" />}
              onClick={onDeleteConfirmationModalOpen}
              isDisabled={!someChecked}
            >
              {t('deleteRow')}
            </Button>
          </Box>
        )}

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
                    isDisabled={isApproved}
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
          {values?.lienWaiverDocument?.s3Url && (
            <>
              <a href={values?.lienWaiverDocument?.s3Url} download style={{ color: '#4E87F8' }}>
                <Flex>
                  <Box mt="3px">
                    <BiDownload fontSize="sm" />
                  </Box>
                  <Text ml="5px" fontSize="14px" fontWeight={500} fontStyle="normal" maxW="110px" isTruncated>
                    Lien Waiver
                  </Text>
                </Flex>
              </a>

              <Divider orientation="vertical" />
            </>
          )}

          {values.attachment && values.attachment.s3Url && (
            <>
              <a href={values?.attachment?.s3Url} download style={{ color: '#4E87F8' }}>
                <Flex>
                  <Box mt="3px">
                    <BiDownload fontSize="sm" />
                  </Box>
                  <Text
                    ml="5px"
                    fontSize="14px"
                    fontWeight={500}
                    fontStyle="normal"
                    maxW="110px"
                    isTruncated
                    title={values?.attachment?.fileType}
                  >
                    {values?.attachment?.fileType}
                  </Text>
                </Flex>
              </a>
              <Divider orientation="vertical" />
            </>
          )}

          {!isApproved &&
            (document ? (
              <Box color="barColor.100" border="1px solid #4E87F8" borderRadius="4px" fontSize="14px">
                <HStack spacing="5px" h="31px" padding="10px" align="center">
                  <Text as="span" maxW="120px" isTruncated title={document?.name || document.fileType}>
                    {document?.name || document.fileType}
                  </Text>
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
                leftIcon={<BiFile />}
                variant="outline"
                size="sm"
                colorScheme="brand"
                isDisabled={isApproved}
              >
                {t('attachment')}
              </Button>
            ))}
        </HStack>
      </Flex>

      <Flex
        borderStyle="solid"
        borderColor="gray.200"
        borderWidth="1px 1px 1px 1px"
        flex="1"
        pos="relative"
        flexDirection="column"
      >
        <Grid
          gridTemplateColumns={isShowCheckboxes ? '30px 2fr 1fr' : '2fr 1fr'}
          px="4"
          py="3"
          fontSize="14px"
          color="gray.600"
          bg="gray.50"
          gap="1rem 4rem"
          borderWidth="0 0 1px 0"
          borderStyle="solid"
          borderColor="gray.200"
        >
          {isShowCheckboxes && (
            <GridItem id="all-checkbox">
              <Checkbox
                isChecked={allChecked}
                isDisabled={isApproved}
                isIndeterminate={isIndeterminate}
                onChange={toggleAllCheckboxes}
              />
            </GridItem>
          )}
          <GridItem>{t('description')}</GridItem>
          <GridItem>{t('amount')}</GridItem>
        </Grid>
        <Box flex="1" overflow="auto" maxH="200px" mb="60px" id="amounts-list">
          {transactionFields.map((transactionField, index) => {
            return (
              <Grid
                className="amount-input-row"
                key={transactionField.id}
                gridTemplateColumns={isShowCheckboxes ? '30px 2fr 1fr' : '2fr 1fr'}
                p="4"
                fontSize="14px"
                color="gray.600"
                gap="2rem 4rem"
                borderWidth={'0 0 1px 0'}
                borderStyle="solid"
                borderColor="gray.200"
              >
                {isShowCheckboxes && (
                  <GridItem>
                    <Controller
                      control={control}
                      name={`transaction.${index}.checked` as const}
                      render={({ field: { name, value, onChange } }) => {
                        return (
                          <Checkbox
                            py="2"
                            data-testid={`checkbox-${index}`}
                            key={name}
                            name={name}
                            isDisabled={isApproved}
                            isChecked={transactionField.checked}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                              transactionField.checked = event.currentTarget.checked
                              onChange(event.currentTarget.checked)
                            }}
                          />
                        )
                      }}
                    />
                  </GridItem>
                )}
                <GridItem pr="7">
                  <FormControl isInvalid={!!errors.transaction?.[index]?.description}>
                    <Input
                      data-testid={`transaction-description-${index}`}
                      type="text"
                      size="sm"
                      autoComplete="off"
                      placeholder="Add Description here"
                      readOnly={isApproved}
                      variant={isApproved ? 'unstyled' : 'required-field'}
                      {...register(`transaction.${index}.description` as const, {
                        required: 'This is required field',
                      })}
                    />

                    <FormErrorMessage>{errors?.transaction?.[index]?.description?.message ?? ''}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem pr="7">
                  <FormControl isInvalid={!!errors.transaction?.[index]?.amount}>
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
                              type={isApproved ? 'text' : 'number'}
                              size="sm"
                              placeholder="Add Amount"
                              readOnly={isApproved}
                              variant={isApproved ? 'unstyled' : 'required-field'}
                              autoComplete="off"
                              value={isApproved ? numeral(Number(field.value)).format('$0,0[.]00') : field.value}
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
                </GridItem>
              </Grid>
            )
          })}
        </Box>
        <Box position="absolute" left="0" right="0" bottom="0" zIndex={1}>
          <Grid
            gridTemplateColumns={isShowCheckboxes ? '30px 2fr 1fr' : '2fr 1fr'}
            fontSize="14px"
            color="gray.600"
            columnGap="4rem"
            borderWidth="1px 0 0 0"
            borderStyle="solid"
            borderColor="gray.200"
            bg="white"
          >
            {isShowCheckboxes && <GridItem />}
            <GridItem borderWidth="0 1px 0 0" borderStyle="solid" borderColor="gray.200" py="4"></GridItem>
            <GridItem py="4" fontWeight="bold" data-testid="total-amount">
              {t('total')}: {totalAmount}
            </GridItem>
          </Grid>
        </Box>
      </Flex>

      <ConfirmationBox
        title="Are You Sure?"
        content="Do you really want to delete these items? This process cannot be undone."
        isOpen={isDeleteConfirmationModalOpen}
        onClose={onDeleteConfirmationModalClose}
        onConfirm={deleteRows}
      />
    </>
  )
}
