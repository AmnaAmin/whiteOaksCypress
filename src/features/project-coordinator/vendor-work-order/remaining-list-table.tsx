import { Box, Checkbox, Flex, Td, Text, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { t } from 'i18next'
import numeral from 'numeral'
import React, { useState } from 'react'
import { useRmainingLineItems } from 'utils/work-order'

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
  const [tableInstance, setInstance] = useState<any>(null)
  const { workOrder, selectedLineItems, setSelectedLineItems } = props
  const { remainingItems, isLoading } = useRmainingLineItems(workOrder?.projectId)
  const REMAINING_ITEMS_COLUMNS = [
    {
      Header: t('checkbox'),
      accessor: 'checkbox',
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
      Header: t('sku'),
      accessor: 'sku',
    },
    {
      Header: t('productName'),
      accessor: 'productName',
    },
    {
      Header: t('details'),
      accessor: 'details',
    },
    {
      Header: t('quantity'),
      accessor: 'quantity',
    },
    {
      Header: t('price'),
      accessor: 'price',
      Cell(cellInfo) {
        return numeral(cellInfo.value).format('$0,0.00')
      },
      getCellExportValue(row) {
        return numeral(row.original.amount).format('$0,0.00')
      },
    },
    {
      Header: t('total'),
      accessor: 'total',
      Cell(cellInfo) {
        return numeral(cellInfo.value).format('$0,0.00')
      },
      getCellExportValue(row) {
        return numeral(row.original.amount).format('$0,0.00')
      },
    },
  ]

  const setTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  return (
    <Box overflow="auto" width="100%">
      <TableWrapper
        columns={REMAINING_ITEMS_COLUMNS}
        setTableInstance={setTableInstance}
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
