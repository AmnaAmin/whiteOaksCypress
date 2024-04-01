import { Box, Checkbox, FormControl, Icon } from '@chakra-ui/react'
import Table from 'components/table-refactored/table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { difference } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, FieldValue, UseFormReturn, useWatch } from 'react-hook-form'
import { BiXCircle } from 'react-icons/bi'
import { currencyFormatter, validateAmountDigits } from 'utils/string-formatters'
import { WORK_ORDER } from '../workOrder.i18n'
import {
  CreatableSelectForTable,
  EditableField,
  InputField,
  LineItems,
  SelectCheckBox,
  selectedCell,
  SWOProject,
} from './assignedItems.utils'
import { useLocation, usePaymentGroupVals } from 'api/location'

type RemainingListType = {
  setSelectedItems: (items) => void
  selectedItems: LineItems[]
  remainingFieldArray: FieldValue<any>
  isLoading?: boolean
  formControl: UseFormReturn<any>
  swoProject: SWOProject
}
type CellInputType = {
  row: { index: number }
  values: {
    remainingItems: LineItems[]
  }
  formControl: UseFormReturn<any>
  fieldName: string
  handleChange?: (e, index) => void
  type?: string
  valueFormatter?: (value) => void
  selectedCell: selectedCell | null | undefined
  setSelectedCell: (val) => void
  rules?: any
  maxLength?: number
  errorSetFunc?: any
}
const renderInput = (props: CellInputType) => {
  const {
    row,
    values,
    formControl,
    fieldName,
    handleChange,
    type,
    valueFormatter,
    selectedCell,
    setSelectedCell,
    rules,
    maxLength,
    errorSetFunc,
  } = props

  const isNew = values?.remainingItems?.[row?.index]?.action === 'new'
  return (
    <Box pl={'5px'}>
      {isNew ? (
        <InputField
          maxLength={maxLength}
          index={row?.index}
          fieldName={fieldName}
          formControl={formControl}
          inputType={type}
          fieldArray="remainingItems"
          onChange={handleChange}
          rules={rules}
          errorSetFunc={errorSetFunc}
        ></InputField>
      ) : (
        <EditableField
          maxLength={maxLength}
          index={row?.index}
          fieldName={fieldName}
          formControl={formControl}
          inputType={type}
          fieldArray="remainingItems"
          onChange={handleChange}
          valueFormatter={valueFormatter}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          allowEdit={true}
          rules={rules}
        />
      )}
    </Box>
  )
}

const RemainingListTable = (props: RemainingListType) => {
  const { selectedItems, setSelectedItems, isLoading, remainingFieldArray, formControl } = props
  const { remove } = remainingFieldArray
  const { getValues, setValue, control } = formControl
  const values = getValues()
  const remainingItemsWatch = useWatch({ name: 'remainingItems', control })
  const [total, setTotal] = useState<any>({ index: '', value: 0 })
  const [selectedCell, setSelectedCell] = useState<selectedCell | null | undefined>(null)
  const { locationSelectOptions } = useLocation()
  const { paymentGroupValsOptions } = usePaymentGroupVals()

  useEffect(() => {
    setValue(`remainingItems.${total.index}.totalPrice`, total.value)
  }, [total])

  const handleQuantityChange = (e, index) => {
    setTotal({ index, value: Number(e?.target?.value * Number(remainingItemsWatch[index]?.unitPrice)) })
  }

  const handleUnitPriceChange = (e, index) => {
    setTotal({ index, value: Number(e?.target?.value) * Number(remainingItemsWatch[index]?.quantity) })
  }

  const REMAINING_ITEMS_COLUMNS = useMemo(() => {
    return [
      {
        header: () => {
          return (
            <Checkbox
              data-testid="checkAllItems"
              isChecked={
                values?.remainingItems?.length > 0 &&
                difference(
                  values?.remainingItems.map(r => r.id),
                  selectedItems.map(s => s.id),
                )?.length < 1
              }
              onChange={e => {
                if (e.currentTarget?.checked) {
                  setSelectedItems([...values?.remainingItems])
                } else {
                  setSelectedItems([])
                }
              }}
            />
          )
        },
        accessorKey: 'assigned',
        size: 80,
        cell: ({ row }) => {
          const isNew = values?.remainingItems?.[row?.index]?.action === 'new'
          return (
            <Box paddingLeft={'6px'}>
              {!isNew ? (
                <SelectCheckBox
                  index={row.index}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  row={values?.remainingItems?.[row?.index]}
                />
              ) : (
                <Icon
                  as={BiXCircle}
                  data-testid={`remove-` + row?.index}
                  boxSize={5}
                  color="brand.300"
                  onClick={() => {
                    remove(row?.index)
                  }}
                  cursor="pointer"
                ></Icon>
              )}
            </Box>
          )
        },
      },

      {
        header: `${WORK_ORDER}.location`,
        accessorKey: 'location',
        size: 250,
        cell: ({ row }) => {
          const index = row?.index
          const {
            formState: { errors },
            control,
          } = formControl

          return (
            <Box>
              <FormControl isInvalid={!!errors.remainingItems?.[index]?.location} width="220px">
                <Controller
                  control={control}
                  name={`remainingItems.${index}.location`}
                  render={({ field }) => {
                    return (
                      <>
                        <CreatableSelectForTable
                          classNamePrefix={'locationRemainingItems'}
                          index={index}
                          field={field}
                          valueFormatter={null}
                          key={'assignedItems.' + [index]}
                          id={`assignedItems.${index}.location`}
                          isDisabled={false}
                          options={locationSelectOptions}
                          newObjectFormatting={null}
                        />
                      </>
                    )
                  }}
                />
              </FormControl>
            </Box>
          )
        },
      },
      {
        header: `${WORK_ORDER}.paymentGroup`,
        accessorKey: 'paymentGroup',
        size: 250,
        cell: ({ row }) => {
          const index = row?.index
          const {
            formState: { errors },
            control,
          } = formControl

          return (
            <Box>
              <FormControl isInvalid={!!errors.remainingItems?.[index]?.paymentGroup} width="220px">
                <Controller
                  control={control}
                  name={`remainingItems.${index}.paymentGroup`}
                  render={({ field }) => {
                    return (
                      <>
                        <CreatableSelectForTable
                          classNamePrefix={'paymentGroupItems'}
                          index={index}
                          field={field}
                          valueFormatter={null}
                          key={'paymentGroup.' + [index]}
                          id={`assignedItems.${index}.paymentGroup`}
                          isDisabled={false}
                          options={paymentGroupValsOptions}
                          newObjectFormatting={null}
                        />
                      </>
                    )
                  }}
                />
              </FormControl>
            </Box>
          )
        },
      },
      {
        header: `${WORK_ORDER}.sku`,
        accessorKey: 'sku',
        cell: ({ row }) => {
          return renderInput({
            row: row,
            values,
            formControl,
            fieldName: 'sku',
            selectedCell,
            setSelectedCell,
            rules: {
              maxLength: {
                value: 256,
                message: (
                  <div>
                    <span>Please use 255</span>
                    <br />
                    <span>characters only.</span>
                  </div>
                ) as any,
              },
            },
            errorSetFunc: (e, setError, clearErrors) => {
              const inputValue = e.target.value
              console.log('inputValue', inputValue.length)
              if (inputValue.length >= 255) {
                setError(`${'remainingItems'}.${row.index}.${'sku'}`, {
                  type: 'maxLength',
                  message: (
                    <div>
                      <span>Please use 255</span>
                      <br />
                      <span>characters only.</span>
                    </div>
                  ) as any,
                })
              } else {
                clearErrors(`${'remainingItems'}.${row.index}.${'sku'}`)
              }
            },
          })
        },
        size: 100,
      },
      {
        header: `${WORK_ORDER}.productName`,
        accessorKey: 'productName',
        cell: ({ row }) => {
          return renderInput({
            row,
            values,
            formControl,
            fieldName: 'productName',
            selectedCell,
            setSelectedCell,
            rules: { maxLength: { value: 1025, message: 'Please use 1024 characters only.' }, required: '*Required' },
            errorSetFunc: (e, setError, clearErrors) => {
              const inputValue = e.target.value
              console.log('inputValue', inputValue.length)
              if (inputValue.length >= 1025) {
                setError(`${'remainingItems'}.${row.index}.${'productName'}`, {
                  type: 'maxLength',
                  message: 'Please use 1024 characters only.',
                })
              } else {
                clearErrors(`${'remainingItems'}.${row.index}.${'productName'}`)
              }
            },
          })
        },
        size: 200,
      },
      {
        header: `${WORK_ORDER}.details`,
        accessorKey: 'description',
        cell: ({ row }) => {
          return renderInput({
            maxLength: 2000,
            row,
            values,
            formControl,
            fieldName: 'description',
            selectedCell,
            setSelectedCell,
            rules: { maxLength: { value: 1025, message: 'Please use 1024 characters only.' }, required: '*Required' },
            errorSetFunc: (e, setError, clearErrors) => {
              const inputValue = e.target.value
              console.log('inputValue', inputValue.length)
              if (inputValue.length >= 1025) {
                setError(`${'remainingItems'}.${row.index}.${'description'}`, {
                  type: 'maxLength',
                  message: 'Please use 1024 characters only.',
                })
              } else {
                clearErrors(`${'remainingItems'}.${row.index}.${'description'}`)
              }
            },
          })
        },

        size: 300,
      },
      {
        header: `${WORK_ORDER}.quantity`,
        accessorKey: 'quantity',
        cell: ({ row }) => {
          return renderInput({
            row,
            values,
            formControl,
            fieldName: 'quantity',
            type: 'number',
            selectedCell,
            setSelectedCell,
            handleChange: (e, index) => {
              handleQuantityChange(e, index)
            },
            rules: {
              validate: {
                matchPattern: v => {
                  return validateAmountDigits(v)
                },
              },
              required: '*Required',
            },
          })
        },
        size: 120,
      },
      {
        header: `${WORK_ORDER}.unitPrice`,
        accessorKey: 'unitPrice',
        cell: ({ row }) => {
          return renderInput({
            row,
            values,
            formControl,
            fieldName: 'unitPrice',
            valueFormatter: currencyFormatter,
            type: 'number',
            selectedCell,
            setSelectedCell,
            handleChange: (e, index) => {
              handleUnitPriceChange(e, index)
            },
            rules: {
              validate: {
                matchPattern: v => {
                  return validateAmountDigits(v)
                },
              },
              required: '*Required',
            },
          })
        },
        size: 120,
      },
      {
        header: `${WORK_ORDER}.total`,
        accessorKey: 'totalPrice',
        cell: ({ row }) => {
          return (
            <>
              <Box data-testid={'cell-' + row?.index + '-totalPrice'} pl={'7px'} minW={'100px'} minH={'20px'}>
                {currencyFormatter(values?.remainingItems?.[row?.index]?.totalPrice)}
              </Box>
            </>
          )
        },
        size: 150,
      },
    ]
  }, [
    selectedCell,
    setSelectedCell,
    selectedItems,
    setSelectedItems,
    values.remainingItems,
    locationSelectOptions?.length,
    paymentGroupValsOptions?.length,
  ])

  const handleOnDragEnd = useCallback(
    result => {
      if (!result.destination) return

      const items = Array.from(values.remainingItems)
      const {
        source: { index: sourceIndex },
        destination: { index: destinationIndex },
      } = result

      const [reorderedItem] = items.splice(sourceIndex, 1)
      items.splice(destinationIndex, 0, reorderedItem)

      setValue('remainingItems', items)
    },
    [values?.remainingItems],
  )

  return (
    <Box height="calc(100vh - 300px)" overflow="auto">
      <TableContextProvider data={values.remainingItems} columns={REMAINING_ITEMS_COLUMNS}>
        <Table
          handleOnDrag={handleOnDragEnd}
          isLoading={isLoading}
          isEmpty={!isLoading && !values.remainingItems?.length}
        />
      </TableContextProvider>
    </Box>
  )
}
export default RemainingListTable
