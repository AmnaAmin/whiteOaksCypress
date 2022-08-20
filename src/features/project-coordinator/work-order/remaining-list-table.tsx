import { Box, Checkbox, Flex, Td, Text, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import React from 'react'
import { useRmainingLineItems } from 'utils/work-order'
import { WORK_ORDER } from './workOrder.i18n'

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

const RemainingListTable = props => {
  const { workOrder, selectedLineItems, setSelectedLineItems } = props
  const { remainingItems, isLoading } = useRmainingLineItems(workOrder?.projectId)
  const { t } = useTranslation()
  const REMAINING_ITEMS_COLUMNS = [
    {
      Header: 'Check',
      accessor: 'assigned',
      Cell: ({ row }) => (
        <Flex justifyContent="end">
          <Checkbox
            isChecked={selectedLineItems.includes(row?.original?.sku)}
            onChange={e => {
              if (e.currentTarget?.checked) {
                if (!selectedLineItems.includes(row?.original?.sku)) {
                  setSelectedLineItems([...selectedLineItems, row?.original?.sku])
                }
              } else {
                setSelectedLineItems([...selectedLineItems.filter(sku => sku !== row?.original?.sku)])
              }
            }}
            value={(row.original as any).sku}
          />
        </Flex>
      ),
      disableExport: true,
    },
    {
      Header: t(`${WORK_ORDER}.sku`),
      accessor: 'sku',
    },
    {
      Header: t(`${WORK_ORDER}.sku`),
      accessor: 'productName',
    },
    {
      Header: t(`${WORK_ORDER}.details`),
      accessor: 'details',
    },
    {
      Header: t(`${WORK_ORDER}.quantity`),
      accessor: 'quantity',
    },
    {
      Header: t(`${WORK_ORDER}.price`),
      accessor: 'price',
      Cell(cellInfo) {
        return numeral(cellInfo.value).format('$0,0.00')
      },
      getCellExportValue(row) {
        return numeral(row.original.amount).format('$0,0.00')
      },
    },
    {
      Header: t(`${WORK_ORDER}.total`),
      accessor: 'total',
      Cell(cellInfo) {
        return numeral(cellInfo.value).format('$0,0.00')
      },
      getCellExportValue(row) {
        return numeral(row.original.amount).format('$0,0.00')
      },
    },
  ]

  return (
    <Box overflow="auto" width="100%">
      <TableWrapper
        columns={REMAINING_ITEMS_COLUMNS}
        data={
          remainingItems ?? [
            {
              sku: '123',
              productName: 'Product A',
              details: 'Solid product',
              quantity: 12,
              price: '123',
              status: true,
              images: null,
              verification: true,
            },
            {
              sku: '456',
              productName: 'Product B',
              details: 'Solid product',
              quantity: 12,
              price: '123',
              status: true,
              images: null,
              verification: true,
            },
          ]
        }
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
