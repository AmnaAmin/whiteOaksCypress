import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  useDisclosure,
  GridItem,
  Grid,
  VStack,
  Tooltip,
  Text,
} from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form'
import { isValidAndNonEmptyObject } from 'utils'
import { ConfirmationBox } from 'components/Confirmation'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import NumberFormat from 'react-number-format'
import { InvoicingType } from 'types/invoice.types'
import { useTransactionsV1 } from 'api/transactions'
import { InvoicingContext } from './invoicing'
import { currencyFormatter } from 'utils/string-formatters'

type InvoiceItemsFormProps = {
  formReturn: UseFormReturn<InvoicingType>
  invoice?: InvoicingType
  setTotalAmount: (value) => void
  totalAmount: number
}

export const InvoiceItems: React.FC<InvoiceItemsFormProps> = ({ setTotalAmount, formReturn, invoice, totalAmount }) => {
  const { t } = useTranslation()
  const isShowCheckboxes = true

  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = formReturn

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoiceItems',
  })
  const watchInvoiceArray = watch('invoiceItems')
  const controlledInvoiceArray = fields.map((field, index) => {
    return {
      ...field,
      ...watchInvoiceArray[index],
    }
  })

  const { projectData } = useContext(InvoicingContext)
  const { transactions } = useTransactionsV1(`${projectData?.id}`)

  useEffect(() => {
    if (!invoice) {
      if (transactions?.length) {
        setValue(
          'invoiceItems',
          transactions
            ?.filter(t => t.status === 'APPROVED' && !t.parentWorkOrderId)
            ?.map(t => ({
              id: null,
              transactionId: t.id,
              checked: false,
              type: t.name,
              description: t.transactionTypeLabel,
              amount: t.transactionTotal,
            })) ?? [],
        )
      }
    }
  }, [transactions?.length])

  useEffect(() => {
    let total_Amount = 0
    controlledInvoiceArray?.forEach(item => {
      total_Amount += parseFloat(item?.amount && item?.amount !== '' ? item?.amount?.toString() : '0')
    })
    setTotalAmount?.(total_Amount)
  }, [controlledInvoiceArray])

  const {
    isOpen: isDeleteConfirmationModalOpen,
    onClose: onDeleteConfirmationModalClose,
    onOpen: onDeleteConfirmationModalOpen,
  } = useDisclosure()

  const toggleAllCheckboxes = useCallback(
    event => {
      setValue(
        'invoiceItems',
        controlledInvoiceArray.map(items => ({
          ...items,
          checked: event.currentTarget.checked,
        })),
      )
    },
    [controlledInvoiceArray, setValue],
  )
  const deleteRows = useCallback(async () => {
    let indices = [] as any
    await controlledInvoiceArray?.forEach((item, index) => {
      if (item.checked) {
        indices.push(index)
      }
    })

    remove(indices)
    onDeleteConfirmationModalClose()
  }, [controlledInvoiceArray, onDeleteConfirmationModalClose, setValue])

  const addRow = useCallback(() => {
    append({ type: '', description: '', amount: '', checked: false })
  }, [append])

  const checkedItems = useMemo(() => {
    return controlledInvoiceArray?.map(item => item.checked)
  }, [controlledInvoiceArray])

  const allChecked = isValidAndNonEmptyObject(checkedItems) ? Object.values(checkedItems).every(Boolean) : false
  const someChecked = isValidAndNonEmptyObject(checkedItems) ? Object.values(checkedItems).some(Boolean) : false
  const isIndeterminate = someChecked && !allChecked
  return (
    <Box overflowX={'auto'} w="100%">
      <VStack alignItems="start" w="720px">
        <Flex w="100%" mt="10px" mb="15px" justifyContent={'space-between'}>
          <Box>
            <Flex flex="1">
              <Button
                data-testid="add-new-row-button"
                variant="outline"
                size="sm"
                colorScheme="darkPrimary"
                onClick={addRow}
                color="darkPrimary.300"
                leftIcon={<BiAddToQueue color="darkPrimary.300" />}
              >
                {t(`project.projectDetails.addNewRow`)}
              </Button>
              <Button
                data-testid="delete-row-button"
                variant="outline"
                size="sm"
                ml="10px"
                colorScheme="darkPrimary"
                _hover={{
                  _disabled: {
                    bg: '#EBF8FF',
                    color: 'darkPrimary.300',
                    opacity: 0.5,
                  },
                }}
                _disabled={{
                  bg: '#EBF8FF',
                  color: 'darkPrimary.300',
                  opacity: 0.5,
                }}
                leftIcon={<RiDeleteBinLine color="darkPrimary.300" />}
                onClick={onDeleteConfirmationModalOpen}
              >
                {t(`project.projectDetails.deleteRow`)}
              </Button>
            </Flex>
          </Box>
        </Flex>

        <Flex
          borderStyle="solid"
          borderColor="gray.300"
          borderWidth="1px 1px 1px 1px"
          flex="1"
          pos="relative"
          flexDirection="column"
          rounded={6}
          w="100%"
          minH="36vh"
        >
          <Grid
            gridTemplateColumns={isShowCheckboxes ? '30px 1fr 2fr 1fr' : '1fr 2fr 1fr'}
            py="3"
            fontSize="14px"
            color="gray.600"
            bg="bgGlobal.50"
            gap="1rem"
            borderStyle="solid"
            borderColor="gray.300"
            roundedTop={6}
          >
            {isShowCheckboxes && (
              <GridItem id="all-checkbox">
                <Checkbox
                  px="1.5"
                  variant="normal"
                  colorScheme="PrimaryCheckBox"
                  onChange={toggleAllCheckboxes}
                  isChecked={allChecked}
                  isIndeterminate={isIndeterminate}
                />
              </GridItem>
            )}
            <GridItem ml="10px"> {t(`project.projectDetails.type`)}</GridItem>
            <GridItem ml="10px"> {t(`project.projectDetails.description`)}</GridItem>
            <GridItem ml="10px">{t(`project.projectDetails.amount`)}</GridItem>
          </Grid>

          <Box flex="1" overflow="auto" maxH="200px" mb="60px" id="amounts-list">
            {controlledInvoiceArray?.map((invoiceItem, index) => {
              const isPaidOrOriginalSOW = ['Original SOW', 'Payment', 'Depreciation', 'Deductible', 'Draw'].includes(
                invoiceItem?.description as string,
              )
              return (
                <Grid
                  className="amount-input-row"
                  key={index}
                  gridTemplateColumns={isShowCheckboxes ? '30px 1fr 2fr 1fr' : '1fr 2fr 1fr'}
                  p={'6px'}
                  fontSize="14px"
                  color="gray.600"
                  gap="20px"
                  borderStyle="solid"
                  borderColor="gray.300"
                  height="auto"
                >
                  {isShowCheckboxes && (
                    <GridItem>
                      <Controller
                        control={control}
                        name={`invoiceItems.${index}.checked` as const}
                        render={({ field: { name, value, onChange } }) => {
                          return (
                            <Checkbox
                              variant="normal"
                              py="2"
                              data-testid={`checkbox-${index}`}
                              key={name}
                              name={name}
                              isChecked={invoiceItem.checked}
                              onChange={event => {
                                onChange(event.currentTarget.checked)
                              }}
                            />
                          )
                        }}
                      />
                    </GridItem>
                  )}
                  <GridItem>
                    <FormControl isInvalid={!!errors.invoiceItems?.[index]?.type}>
                      <Tooltip label={controlledInvoiceArray?.[index]?.type} placement="top" bg="#ffffff" color="black">
                        <Input
                          data-testid={`invoiceItems-type-${index}`}
                          type="text"
                          size="sm"
                          autoComplete="off"
                          placeholder="Add Type here"
                          noOfLines={1}
                          variant={'required-field'}
                          disabled={isPaidOrOriginalSOW}
                          {...register(`invoiceItems.${index}.type` as const, {
                            required: 'This is required field',
                          })}
                        />
                      </Tooltip>
                      <FormErrorMessage>{errors?.invoiceItems?.[index]?.description?.message ?? ''}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isInvalid={!!errors.invoiceItems?.[index]?.description}>
                      <Tooltip
                        label={controlledInvoiceArray?.[index]?.description}
                        placement="top"
                        bg="#ffffff"
                        color="black"
                      >
                        <Input
                          data-testid={`invoiceItems-description-${index}`}
                          type="text"
                          size="sm"
                          autoComplete="off"
                          placeholder="Add Description here"
                          noOfLines={1}
                          variant={'required-field'}
                          disabled={isPaidOrOriginalSOW}
                          {...register(`invoiceItems.${index}.description` as const, {
                            required: 'This is required field',
                          })}
                        />
                      </Tooltip>
                      <FormErrorMessage>{errors?.invoiceItems?.[index]?.description?.message ?? ''}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl px={1} isInvalid={!!errors.invoiceItems?.[index]?.amount}>
                      <Controller
                        name={`invoiceItems.${index}.amount` as const}
                        control={control}
                        rules={{
                          required: 'This is required field',
                        }}
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <NumberFormat
                                {...field}
                                data-testid={`invoiceItems-amount-${index}`}
                                customInput={Input}
                                value={controlledInvoiceArray?.[index]?.amount}
                                placeholder="Add Amount"
                                disabled={isPaidOrOriginalSOW}
                                onValueChange={e => {
                                  const inputValue = e?.floatValue ?? ''
                                  field.onChange(inputValue)
                                }}
                                variant={'required-field'}
                                size="sm"
                              />
                              {/*                           
                                <Input
                                  {...field}
                                  data-testid={`transaction-amount-${index}`}
                                  size="sm"
                                  placeholder="Add Amount"
                                  readOnly={isApproved || isSysFactoringFee || lateAndFactoringFeeForVendor}
                                  variant={'unstyled'}
                                  autoComplete="off"
                                  value={numeral(Number(field.value)).format('$0,0[.]00')}
                                />
                              */}
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
          <Box>
            <Grid
              gridTemplateColumns={'30px 1fr 1fr'}
              fontSize="14px"
              color="gray.600"
              borderWidth="1px 0 0 0"
              borderStyle="solid"
              borderColor="gray.300"
              bg="white"
              roundedBottom={6}
              height="auto"
            >
              {isShowCheckboxes && <GridItem />}
              <GridItem
                borderWidth="0 1px 0 0"
                borderStyle="solid"
                borderColor="gray.300"
                py="4"
                height="auto"
              ></GridItem>
              <GridItem py={'3'} data-testid="total-amount">
                <Flex direction={'row'} justifyContent={'space-between'} pl="30px" pr="30px">
                  <Text fontWeight={700}>
                    {t('total')}
                    {':'}
                  </Text>
                  <Text ml={'10px'}>{currencyFormatter(totalAmount ?? 0)}</Text>
                </Flex>
              </GridItem>
            </Grid>
          </Box>
          <Box>
            <Grid
              gridTemplateColumns={'30px 1fr 1fr'}
              fontSize="14px"
              color="gray.600"
              borderWidth="1px 0 0 0"
              borderStyle="solid"
              borderColor="gray.300"
              bg="white"
              roundedBottom={6}
              height="auto"
            >
              {isShowCheckboxes && <GridItem />}
              <GridItem
                borderWidth="0 1px 0 0"
                borderStyle="solid"
                borderColor="gray.300"
                py="4"
                height="auto"
              ></GridItem>
              <GridItem py={'3'} data-testid="total-amount">
                <Flex direction={'column'}>
                  <Flex direction={'row'} justifyContent={'space-between'} pl="30px" pr="30px">
                    <Text fontWeight={700}>
                      {t('project.projectDetails.subtotal')}
                      {':'}
                    </Text>
                    <Text ml={'10px'}>{currencyFormatter(projectData?.sowNewAmount ?? 0)}</Text>
                  </Flex>
                  <Flex direction={'row'} justifyContent={'space-between'} pl="30px" pr="30px" mt="10px">
                    <Text fontWeight={700}>
                      {t('balanceDue')}
                      {':'}
                    </Text>
                    <Text ml={'10px'}>{currencyFormatter(projectData?.sowNewAmount! - totalAmount)}</Text>
                  </Flex>
                </Flex>
              </GridItem>
            </Grid>
          </Box>
        </Flex>

        <ConfirmationBox
          title="Are You Sure?"
          content="Do you want to proceed? This process cannot be undone. "
          isOpen={isDeleteConfirmationModalOpen}
          onClose={onDeleteConfirmationModalClose}
          onConfirm={deleteRows}
        />
      </VStack>
    </Box>
  )
}
