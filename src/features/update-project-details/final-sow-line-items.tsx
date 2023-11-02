import React, { useCallback, useEffect, useMemo } from 'react'
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  GridItem,
  Grid,
  VStack,
  Tooltip,
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { isValidAndNonEmptyObject } from 'utils'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { InvoicingType } from 'types/invoice.types'
import { useTransactionsV1 } from 'api/transactions'
import { TransactionTypeValues } from 'types/transaction.type'
import { Project } from 'types/project.type'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'

type InvoiceItemsFormProps = {
  formReturn: UseFormReturn<InvoicingType>
  invoice?: InvoicingType
  projectData: Project | undefined
  fields: any
}

export const FinalSowLineItems: React.FC<InvoiceItemsFormProps> = ({ formReturn, invoice, projectData, fields }) => {
  const { t } = useTranslation()
  const isPaid = (invoice?.status as string)?.toLocaleUpperCase() === 'PAID'

  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = formReturn

  const watchInvoiceArray = watch('finalSowLineItems')

  const { transactions } = useTransactionsV1(`${projectData?.id}`)

  const isAddedInFinalSow = transaction => {
    const compatibleType =
      transaction.transactionType === TransactionTypeValues.carrierFee ||
      transaction.transactionType === TransactionTypeValues.legalFee ||
      transaction.transactionType === TransactionTypeValues.changeOrder ||
      transaction.transactionType === TransactionTypeValues.originalSOW
    return (
      transaction.status === 'APPROVED' &&
      !transaction.parentWorkOrderId &&
      compatibleType &&
      !transaction.invoiceNumber
    )
  }

  useEffect(() => {
    if (!invoice) {
      if (transactions?.length) {
        let finalSowLineItems = [] as any
        transactions.forEach(t => {
          if (isAddedInFinalSow(t)) {
            console.log(t)
            finalSowLineItems.push({
              id: null,
              transactionId: t.id,
              checked: false,
              name: t.name,
              type: 'finalSowLineItems',
              description: t.transactionTypeLabel,
              amount: t.transactionTotal,
              modifiedDate: datePickerFormat(t.modifiedDate),
            })
          }
        })
        setValue('finalSowLineItems', finalSowLineItems ?? [])
      }
    }
  }, [transactions?.length])

  const toggleAllCheckboxes = useCallback(
    event => {
      setValue(
        'finalSowLineItems',
        watchInvoiceArray.map(items => ({
          ...items,
          checked: event.currentTarget.checked,
        })),
      )
    },
    [watchInvoiceArray, setValue],
  )

  const checkedItems = useMemo(() => {
    return watchInvoiceArray?.map(item => item.checked)
  }, [watchInvoiceArray])

  const allChecked = isValidAndNonEmptyObject(checkedItems) ? Object.values(checkedItems).every(Boolean) : false
  const someChecked = isValidAndNonEmptyObject(checkedItems) ? Object.values(checkedItems).some(Boolean) : false
  const isIndeterminate = someChecked && !allChecked
  return (
    <Box overflowX={'auto'} w="100%">
      <VStack alignItems="start" w="720px">
        <Flex
          borderStyle="solid"
          borderColor="gray.300"
          borderWidth="1px 1px 1px 1px"
          flex="1"
          pos="relative"
          flexDirection="column"
          rounded={6}
          w="100%"
        >
          <Grid
            gridTemplateColumns={'30px 1fr 2fr 1fr 1fr'}
            py="3"
            fontSize="14px"
            color="gray.600"
            bg="bgGlobal.50"
            gap="1rem"
            borderStyle="solid"
            borderColor="gray.300"
            roundedTop={6}
          >
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

            <GridItem ml="10px"> {t(`project.projectDetails.type`)}</GridItem>
            <GridItem ml="10px"> {t(`project.projectDetails.description`)}</GridItem>
            <GridItem ml="10px">{t(`project.projectDetails.date`)}</GridItem>
            <GridItem ml="10px">{t(`project.projectDetails.amount`)}</GridItem>
          </Grid>

          <Box flex="1" overflow="auto" maxH="155px" minH="155px" id="amounts-list">
            {watchInvoiceArray?.length > 0 ? (
              <>
                {watchInvoiceArray?.map((invoiceItem, index) => {
                  const isPaidOrOriginalSOW =
                    ['Original SOW', 'Carrier Fee', 'Legal Fee', 'ChangeOrder'].includes(
                      invoiceItem?.description as string,
                    ) && !!invoiceItem?.transactionId
                  return (
                    <Grid
                      className="amount-input-row"
                      key={index}
                      gridTemplateColumns={'30px 1fr 2fr 1fr 1fr'}
                      p={'6px'}
                      fontSize="14px"
                      color="gray.600"
                      gap="20px"
                      textAlign={'center'}
                      borderStyle="solid"
                      borderColor="gray.300"
                      height="auto"
                    >
                      <GridItem>
                        <Controller
                          control={control}
                          name={`finalSowLineItems.${index}.checked` as const}
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

                      <GridItem>
                        <FormControl isInvalid={!!errors.finalSowLineItems?.[index]?.name}>
                          <Tooltip label={watchInvoiceArray?.[index]?.name} placement="top" bg="#ffffff" color="black">
                            <Input
                              data-testid={`finalSowLineItems-type-${index}`}
                              type="text"
                              size="sm"
                              autoComplete="off"
                              placeholder="Add Type here"
                              noOfLines={1}
                              variant={'required-field'}
                              disabled={isPaidOrOriginalSOW || isPaid}
                              {...register(`finalSowLineItems.${index}.name` as const, {
                                required: 'This is required field',
                              })}
                            />
                          </Tooltip>
                          <FormErrorMessage>
                            {errors?.finalSowLineItems?.[index]?.description?.message ?? ''}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isInvalid={!!errors.finalSowLineItems?.[index]?.description}>
                          <Tooltip
                            label={watchInvoiceArray?.[index]?.description}
                            placement="top"
                            bg="#ffffff"
                            color="black"
                          >
                            <Input
                              data-testid={`finalSowLineItems-description-${index}`}
                              type="text"
                              size="sm"
                              autoComplete="off"
                              placeholder="Add Description here"
                              noOfLines={1}
                              variant={'required-field'}
                              disabled={isPaidOrOriginalSOW || isPaid}
                              {...register(`finalSowLineItems.${index}.description` as const, {
                                required: 'This is required field',
                              })}
                            />
                          </Tooltip>
                          <FormErrorMessage>
                            {errors?.finalSowLineItems?.[index]?.description?.message ?? ''}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isInvalid={!!errors.finalSowLineItems?.[index]?.modifiedDate}>
                          <Tooltip
                            label={dateFormat(watchInvoiceArray?.[index]?.modifiedDate as string)}
                            placement="top"
                            bg="#ffffff"
                            color="black"
                          >
                            <Input
                              data-testid={`finalSowLineItems-modifiedDate-${index}`}
                              type="date"
                              size="sm"
                              variant={'required-field'}
                              disabled={isPaidOrOriginalSOW || isPaid}
                              {...register(`finalSowLineItems.${index}.modifiedDate` as const, {
                                required: false,
                              })}
                            />
                          </Tooltip>
                          <FormErrorMessage>
                            {errors?.finalSowLineItems?.[index]?.description?.message ?? ''}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl px={1} isInvalid={!!errors.finalSowLineItems?.[index]?.amount}>
                          <Controller
                            name={`finalSowLineItems.${index}.amount` as const}
                            control={control}
                            rules={{
                              required: 'This is required field',
                            }}
                            render={({ field, fieldState }) => {
                              return (
                                <>
                                  <NumberFormat
                                    {...field}
                                    data-testid={`finalSowLineItems-amount-${index}`}
                                    customInput={Input}
                                    value={watchInvoiceArray?.[index]?.amount}
                                    placeholder="Add Amount"
                                    disabled={isPaidOrOriginalSOW || isPaid}
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
              </>
            ) : (
              <Box w="100%" mt="10px" mb="10px" textAlign="center" fontSize={'14px'} color="gray.500">
                {t('noDataDisplayed')}
              </Box>
            )}
          </Box>
        </Flex>
      </VStack>
    </Box>
  )
}
