import { Box, Checkbox, Flex, Icon, Td, Tr } from '@chakra-ui/react'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import Table from 'components/table-refactored/table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { TableFooter } from 'components/table-refactored/table-footer'
import { RowProps } from 'components/table/react-table'
import { difference } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValue, UseFormReturn, useWatch } from 'react-hook-form'
import { BiXCircle } from 'react-icons/bi'
import { currencyFormatter } from 'utils/string-formatters'
import { WORK_ORDER } from '../workOrder.i18n'
import { EditableField, InputField, LineItems, SelectCheckBox, selectedCell, SWOProject } from './assignedItems.utils'

type RemainingListType = {
  setSelectedItems: (items) => void
  selectedItems: LineItems[]
  remainingFieldArray: FieldValue<any>
  isLoading?: boolean
  formControl: UseFormReturn<any>
  updatedItems: number[]
  setUpdatedItems: (items) => void
  swoProject: SWOProject
}
type CellInputType = {
  row: { index: number }
  values: {
    remainingItems: LineItems[]
  }
  formControl: UseFormReturn<any>
  updatedItems: number[]
  setUpdatedItems: (items) => void
  fieldName: string
  handleChange?: (e, index) => void
  type?: string
  valueFormatter?: (value) => void
  selectedCell: selectedCell | null | undefined
  setSelectedCell: (val) => void
  rules?: any
  maxLength?: number
}
const renderInput = (props: CellInputType) => {
  const {
    row,
    values,
    formControl,
    updatedItems,
    setUpdatedItems,
    fieldName,
    handleChange,
    type,
    valueFormatter,
    selectedCell,
    setSelectedCell,
    rules,
    maxLength,
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
        ></InputField>
      ) : (
        <EditableField
          maxLength={maxLength}
          index={row?.index}
          fieldName={fieldName}
          formControl={formControl}
          inputType={type}
          fieldArray="remainingItems"
          updatedItems={updatedItems}
          setUpdatedItems={setUpdatedItems}
          onChange={handleChange}
          valueFormatter={valueFormatter}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          allowEdit={true}
        />
      )}
    </Box>
  )
}

export const LineItemsRow: React.FC<RowProps> = memo(({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
      }}
      onClick={e => {
        if (onRowClick) {
          onRowClick(e, row)
        }
      }}
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map(cell => {
        return <CellComp key={`row_${cell.column.id}`} cell={cell} row={row} />
      })}
    </Tr>
  )
})

const CellComp = ({ cell, row }) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <Td {...cell.getCellProps()} w={'100%'} h={'100%'} p="0">
      <Flex alignItems={'center'} h={'100%'} w={'100%'}>
        <Box
          title={cell.value ?? ''}
          color="gray.600"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="400"
          maxHeight={'60px'}
          width={'100%'}
          padding="0px 15px 0px 10px"
        >
          {cell.render('Cell', { isFocus, setIsFocus })}
        </Box>
      </Flex>
    </Td>
  )
}

const RemainingListTable = (props: RemainingListType) => {
  const {
    selectedItems,
    setSelectedItems,
    isLoading,
    remainingFieldArray,
    formControl,
    updatedItems,
    setUpdatedItems,
  } = props
  const { remove } = remainingFieldArray
  const { getValues, setValue, control } = formControl
  const values = getValues()
  const remainingItemsWatch = useWatch({ name: 'remainingItems', control })
  const [total, setTotal] = useState<any>({ index: '', value: 0 })
  const [selectedCell, setSelectedCell] = useState<selectedCell | null | undefined>(null)

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
        cell: ({ row }) =>
          renderInput({
            row: row,
            values,
            formControl,
            updatedItems,
            setUpdatedItems,
            fieldName: 'location',
            selectedCell,
            setSelectedCell,
          }),
        size: 200,
      },
      {
        header: `${WORK_ORDER}.sku`,
        accessorKey: 'sku',
        cell: ({ row }) =>
          renderInput({
            row: row,
            values,
            formControl,
            updatedItems,
            setUpdatedItems,
            fieldName: 'sku',
            selectedCell,
            setSelectedCell,
          }),
        size: 100,
      },
      {
        header: `${WORK_ORDER}.productName`,
        accessorKey: 'productName',
        cell: ({ row }) =>
          renderInput({
            row,
            values,
            formControl,
            updatedItems,
            setUpdatedItems,
            fieldName: 'productName',
            selectedCell,
            setSelectedCell,
            rules: { required: '*Required' },
          }),
        size: 200,
      },
      {
        header: `${WORK_ORDER}.details`,
        accessorKey: 'description',
        cell: ({ row }) =>
          renderInput({
            maxLength: 2000,
            row,
            values,
            formControl,
            updatedItems,
            setUpdatedItems,
            fieldName: 'description',
            selectedCell,
            setSelectedCell,
            rules: { required: '*Required' },
          }),
        size: 300,
      },
      {
        header: `${WORK_ORDER}.quantity`,
        accessorKey: 'quantity',
        cell: ({ row }) =>
          renderInput({
            row,
            values,
            formControl,
            updatedItems,
            setUpdatedItems,
            fieldName: 'quantity',
            type: 'number',
            selectedCell,
            setSelectedCell,
            handleChange: (e, index) => {
              handleQuantityChange(e, index)
            },
            rules: { required: '*Required' },
          }),
        size: 120,
      },
      {
        header: `${WORK_ORDER}.unitPrice`,
        accessorKey: 'unitPrice',
        cell: ({ row }) =>
          renderInput({
            row,
            values,
            formControl,
            updatedItems,
            setUpdatedItems,
            fieldName: 'unitPrice',
            valueFormatter: currencyFormatter,
            type: 'number',
            selectedCell,
            setSelectedCell,
            handleChange: (e, index) => {
              handleUnitPriceChange(e, index)
            },
            rules: { required: '*Required' },
          }),
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
  }, [selectedCell, setSelectedCell, selectedItems, setSelectedItems, values.remainingItems])

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
      <TableContextProvider
        totalPages={values?.remainingItems?.length ? Math.ceil(values?.remainingItems?.length / 10) : -1}
        data={values.remainingItems}
        columns={REMAINING_ITEMS_COLUMNS}
        manualPagination={false}
      >
        <Table
          handleOnDrag={handleOnDragEnd}
          isLoading={isLoading}
          isEmpty={!isLoading && !values.remainingItems?.length}
        />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <Box></Box>
          <TablePagination>
            <ShowCurrentRecordsWithTotalRecords dataCount={values?.remainingItems?.length} />
            <GotoFirstPage />
            <GotoPreviousPage />
            <GotoNextPage />
            <GotoLastPage />
          </TablePagination>
        </TableFooter>
      </TableContextProvider>
    </Box>
  )
}
export default RemainingListTable
