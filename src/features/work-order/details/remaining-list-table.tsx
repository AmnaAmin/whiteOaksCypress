import { Box, Checkbox, Flex, Td, Text, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { difference } from 'lodash'
import { FieldValue, UseFormReturn } from 'react-hook-form'
import { currencyFormatter } from 'utils/string-formatters'
import { WORK_ORDER } from '../workOrder.i18n'
import { EditableCell, LineItems } from './assignedItems.utils'

type RemainingListType = {
  setSelectedItems: (items) => void
  selectedItems: LineItems[]
  remainingFieldArray: FieldValue<any>
  isLoading?: boolean
  formControl: UseFormReturn<any>
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
          <Td {...cell.getCellProps()} key={`row_${cell.column.id}`} p="0">
            <Flex alignItems="center" h="60px">
              <Text
                noOfLines={1}
                title={cell.value}
                padding="0 15px"
                color="gray.600"
                mb="20px"
                mt="10px"
                fontSize="14px"
                fontStyle="normal"
                fontWeight="400"
              >
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}
const RemainingListTable = (props: RemainingListType) => {
  const { selectedItems, setSelectedItems, isLoading, remainingFieldArray, formControl } = props
  const { fields: remainingItems } = remainingFieldArray
  const { getValues } = formControl
  const values = getValues()

  const REMAINING_ITEMS_COLUMNS = [
    {
      Header: () => {
        return (
          <Flex justifyContent="end">
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
          </Flex>
        )
      },
      disableSortBy: true,
      accessor: 'assigned',
      Cell: ({ row }) => (
        <Flex justifyContent="end">
          <Checkbox
            isChecked={selectedItems?.map(s => s.id).includes(values?.remainingItems[row?.index]?.id)}
            onChange={e => {
              if (e.currentTarget?.checked) {
                if (!selectedItems?.map(s => s.id).includes(values?.remainingItems[row?.index].id)) {
                  setSelectedItems([...selectedItems, values?.remainingItems[row?.index]])
                }
              } else {
                setSelectedItems([...selectedItems.filter(s => s.id !== values?.remainingItems[row?.index].id)])
              }
            }}
          />
        </Flex>
      ),
      disableExport: true,
    },
    {
      Header: `${WORK_ORDER}.sku`,
      accessor: 'sku',
      Cell: ({ row }) => (
        <EditableCell
          index={row.index}
          fieldName="sku"
          fieldArray="remainingItems"
          formControl={formControl}
          inputType="text"
        />
      ),
    },
    {
      Header: `${WORK_ORDER}.productName`,
      accessor: 'productName',
      Cell: ({ row }) => (
        <EditableCell
          index={row.index}
          fieldName="productName"
          fieldArray="remainingItems"
          formControl={formControl}
          inputType="text"
        />
      ),
    },
    {
      Header: `${WORK_ORDER}.details`,
      accessor: 'description',
      Cell: ({ row }) => (
        <EditableCell
          index={row.index}
          fieldName="description"
          fieldArray="remainingItems"
          formControl={formControl}
          inputType="text"
        />
      ),
    },
    {
      Header: `${WORK_ORDER}.quantity`,
      accessor: 'quantity',
      Cell: ({ row }) => (
        <EditableCell
          index={row.index}
          fieldName="quantity"
          fieldArray="remainingItems"
          formControl={formControl}
          inputType="number"
        />
      ),
    },
    {
      Header: `${WORK_ORDER}.price`,
      accessor: 'unitPrice',
      Cell: ({ row }) => (
        <EditableCell
          index={row.index}
          fieldName="unitPrice"
          fieldArray="remainingItems"
          formControl={formControl}
          inputType="number"
          valueFormatter={currencyFormatter}
        />
      ),
    },
    {
      Header: `${WORK_ORDER}.total`,
      accessor: 'totalPrice',
      Cell: ({ row }) => (
        <EditableCell
          index={row.index}
          fieldName="totalPrice"
          fieldArray="remainingItems"
          formControl={formControl}
          inputType="number"
          valueFormatter={currencyFormatter}
        />
      ),
    },
  ]

  return (
    <Box overflow="auto" width="100%">
      <TableWrapper
        columns={REMAINING_ITEMS_COLUMNS}
        data={remainingItems ?? []}
        isLoading={isLoading}
        TableRow={RemainingItemsRow}
        tableHeight="calc(100vh - 300px)"
        name="remaining-items-table"
        defaultFlexStyle={false}
      />
    </Box>
  )
}
export default RemainingListTable
