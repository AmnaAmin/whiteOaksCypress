import { Box, Checkbox, Flex, Icon, Td, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { difference } from 'lodash'
import { useEffect, useState } from 'react'
import { FieldValue, UseFormReturn } from 'react-hook-form'
import { BiXCircle } from 'react-icons/bi'
import { currencyFormatter } from 'utils/string-formatters'
import { WORK_ORDER } from '../workOrder.i18n'
import { EditableField, InputField, LineItems, SelectCheckBox, SWOProject } from './assignedItems.utils'

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
  selectedCell: string
  setSelectedCell: (val) => void
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
  } = props
  const isNew = values?.remainingItems[row?.index].action === 'new'
  return (
    <Box pl={'5px'}>
      {isNew ? (
        <InputField
          index={row?.index}
          fieldName={fieldName}
          formControl={formControl}
          inputType={type}
          fieldArray="remainingItems"
          onChange={handleChange}
        ></InputField>
      ) : (
        <EditableField
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

const RemainingItemsRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.column.id}`} w={'100%'} h={'100%'} p="0">
            <Flex alignItems={'center'} h={'100%'} w={'100%'}>
              <Box
                title={cell.value}
                padding="0 15px 10px 10px"
                color="gray.600"
                fontSize="14px"
                fontStyle="normal"
                fontWeight="400"
                maxHeight={'60px'}
                overflow="hidden"
              >
                {cell.render('Cell')}
              </Box>
            </Flex>
          </Td>
        )
      })}
    </Tr>
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
  const { fields: remainingItems, remove } = remainingFieldArray
  const { getValues, setValue } = formControl
  const values = getValues()
  const [total, setTotal] = useState<any>({ index: '', value: 0 })
  const [selectedCell, setSelectedCell] = useState('')

  useEffect(() => {
    setValue(`remainingItems.${total.index}.totalPrice`, total.value)
  }, [total])

  const handleQuantityChange = (e, index) => {
    setTotal({ index, value: Number(e?.target?.value) * Number(values?.remainingItems[index]?.unitPrice) })
  }

  const handleUnitPriceChange = (e, index) => {
    setTotal({ index, value: Number(e?.target?.value) * Number(values?.remainingItems[index]?.quantity) })
  }

  const REMAINING_ITEMS_COLUMNS = [
    {
      Header: () => {
        return (
          <Checkbox
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
      disableSortBy: true,
      accessor: 'assigned',
      canFilter: false,
      Cell: ({ row }) => {
        const isNew = values?.remainingItems[row?.index].action === 'new'
        return (
          <Box paddingLeft={'6px'}>
            {!isNew ? (
              <SelectCheckBox
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                row={values?.remainingItems?.[row?.index]}
              />
            ) : (
              <Icon
                as={BiXCircle}
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
      disableExport: true,
      width: 50,
      sortable: false,
    },
    {
      Header: `${WORK_ORDER}.sku`,
      accessor: 'sku',
      Cell: ({ row }) =>
        renderInput({
          row,
          values,
          formControl,
          updatedItems,
          setUpdatedItems,
          fieldName: 'sku',
          selectedCell,
          setSelectedCell,
        }),
      width: 100,
    },
    {
      Header: `${WORK_ORDER}.productName`,
      accessor: 'productName',
      Cell: ({ row }) =>
        renderInput({
          row,
          values,
          formControl,
          updatedItems,
          setUpdatedItems,
          fieldName: 'productName',
          selectedCell,
          setSelectedCell,
        }),
      minWidth: 250,
    },
    {
      Header: `${WORK_ORDER}.details`,
      accessor: 'description',
      Cell: ({ row }) =>
        renderInput({
          row,
          values,
          formControl,
          updatedItems,
          setUpdatedItems,
          fieldName: 'description',
          selectedCell,
          setSelectedCell,
        }),
      minWidth: 300,
    },
    {
      Header: `${WORK_ORDER}.quantity`,
      accessor: 'quantity',
      Cell: ({ row }) =>
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
        }),
      width: 100,
    },
    {
      Header: `${WORK_ORDER}.unitPrice`,
      accessor: 'unitPrice',
      Cell: ({ row }) =>
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
        }),
      width: 150,
    },
    {
      Header: `${WORK_ORDER}.total`,
      Cell: ({ row }) => {
        return (
          <>
            <Box pl={'7px'} minW={'100px'} minH={'20px'}>
              {currencyFormatter(values?.remainingItems[row?.index].totalPrice)}
            </Box>
          </>
        )
      },
      width: 150,
    },
  ]

  return (
    <Box width="100%" height={'100%'}>
      <TableWrapper
        columns={REMAINING_ITEMS_COLUMNS}
        data={remainingItems ?? []}
        isLoading={isLoading}
        TableRow={RemainingItemsRow}
        tableHeight="calc(100vh - 325px)"
        name="remaining-items-table"
        defaultFlexStyle={false}
        disableFilter={true}
        rowHeight={80}
      />
    </Box>
  )
}
export default RemainingListTable
