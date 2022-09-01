import { Box, Checkbox, Flex, Icon, Td, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { difference } from 'lodash'
import { FieldValue, UseFormReturn } from 'react-hook-form'
import { BiXCircle } from 'react-icons/bi'
import { WORK_ORDER } from '../workOrder.i18n'
import { EditableField, InputField, LineItems, SelectCheckBox } from './assignedItems.utils'
type RemainingListType = {
  setSelectedItems: (items) => void
  selectedItems: LineItems[]
  remainingFieldArray: FieldValue<any>
  isLoading?: boolean
  formControl: UseFormReturn<any>
  updatedItems: number[]
  setUpdatedItems: (items) => void
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
  const { getValues } = formControl
  const values = getValues()

  const REMAINING_ITEMS_COLUMNS = [
    {
      Header: () => {
        return (
          <Checkbox
            isChecked={
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
          <Flex justifyContent="end" paddingLeft={'10px'}>
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
          </Flex>
        )
      },
      disableExport: true,
      width: 50,
      sortable: false,
    },
    {
      Header: `${WORK_ORDER}.sku`,
      accessor: 'sku',
      Cell: ({ row }) => {
        const isNew = values?.remainingItems[row?.index].action === 'new'
        return (
          <>
            {isNew ? (
              <InputField
                index={row?.index}
                fieldName="sku"
                formControl={props.formControl}
                inputType="text"
                fieldArray="remainingItems"
              ></InputField>
            ) : (
              <EditableField
                index={row?.index}
                fieldName="sku"
                formControl={props.formControl}
                inputType="text"
                fieldArray="remainingItems"
                updatedItems={updatedItems}
                setUpdatedItems={setUpdatedItems}
              />
            )}
          </>
        )
      },
      width: 100,
    },
    {
      Header: `${WORK_ORDER}.productName`,
      accessor: 'productName',
      Cell: ({ row }) => {
        const isNew = values?.remainingItems[row?.index].action === 'new'
        return (
          <>
            {isNew ? (
              <InputField
                index={row?.index}
                fieldName="productName"
                formControl={props.formControl}
                inputType="text"
                fieldArray="remainingItems"
              ></InputField>
            ) : (
              <EditableField
                index={row?.index}
                fieldName="productName"
                formControl={props.formControl}
                inputType="text"
                fieldArray="remainingItems"
                updatedItems={updatedItems}
                setUpdatedItems={setUpdatedItems}
              />
            )}
          </>
        )
      },
      width: 250,
    },
    {
      Header: `${WORK_ORDER}.details`,
      accessor: 'description',
      Cell: ({ row }) => {
        const isNew = values?.remainingItems[row?.index].action === 'new'
        return (
          <>
            {isNew ? (
              <InputField
                index={row?.index}
                fieldName="description"
                formControl={props.formControl}
                inputType="text"
                fieldArray="remainingItems"
              ></InputField>
            ) : (
              <EditableField
                index={row?.index}
                fieldName="description"
                formControl={props.formControl}
                inputType="text"
                fieldArray="remainingItems"
                updatedItems={updatedItems}
                setUpdatedItems={setUpdatedItems}
              />
            )}
          </>
        )
      },
    },
    {
      Header: `${WORK_ORDER}.quantity`,
      accessor: 'quantity',
      Cell: ({ row }) => {
        const isNew = values?.remainingItems[row?.index].action === 'new'
        return (
          <>
            {isNew ? (
              <InputField
                index={row?.index}
                fieldName="quantity"
                formControl={props.formControl}
                inputType="number"
                fieldArray="remainingItems"
              ></InputField>
            ) : (
              <EditableField
                index={row?.index}
                fieldName="quantity"
                formControl={props.formControl}
                inputType="number"
                fieldArray="remainingItems"
                updatedItems={updatedItems}
                setUpdatedItems={setUpdatedItems}
              />
            )}
          </>
        )
      },
    },
    {
      Header: `${WORK_ORDER}.price`,
      accessor: 'unitPrice',
      Cell: ({ row }) => {
        const isNew = values?.remainingItems[row?.index].action === 'new'
        return (
          <>
            {isNew ? (
              <InputField
                index={row?.index}
                fieldName="unitPrice"
                formControl={props.formControl}
                inputType="number"
                fieldArray="remainingItems"
              ></InputField>
            ) : (
              <EditableField
                index={row?.index}
                fieldName="unitPrice"
                formControl={props.formControl}
                inputType="number"
                fieldArray="remainingItems"
                updatedItems={updatedItems}
                setUpdatedItems={setUpdatedItems}
              />
            )}
          </>
        )
      },
    },
    {
      Header: `${WORK_ORDER}.total`,
      accessor: 'totalPrice',
      Cell: ({ row }) => {
        const isNew = values?.remainingItems[row?.index].action === 'new'
        return (
          <>
            {isNew ? (
              <InputField
                index={row?.index}
                fieldName="totalPrice"
                formControl={props.formControl}
                inputType="number"
                fieldArray="remainingItems"
              ></InputField>
            ) : (
              <EditableField
                index={row?.index}
                fieldName="totalPrice"
                formControl={props.formControl}
                inputType="number"
                fieldArray="remainingItems"
                updatedItems={updatedItems}
                setUpdatedItems={setUpdatedItems}
              />
            )}
          </>
        )
      },
    },
  ]

  return (
    <Box width="100%" height={'100%'}>
      <TableWrapper
        columns={REMAINING_ITEMS_COLUMNS}
        data={remainingItems ?? []}
        isLoading={isLoading}
        TableRow={RemainingItemsRow}
        tableHeight="calc(100vh - 300px)"
        name="remaining-items-table"
        defaultFlexStyle={false}
        disableFilter={true}
        rowHeight={80}
      />
    </Box>
  )
}
export default RemainingListTable
