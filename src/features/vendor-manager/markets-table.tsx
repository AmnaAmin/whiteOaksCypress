import { Box, Flex, Td, Text, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { t } from 'i18next'
import { useState } from 'react'
import { Market } from 'types/vendor.types'
import { dateFormat } from 'utils/date-time-utils'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { NewMarketModal } from './new-market-modal'
import { VENDOR_MANAGER } from './vendor-manager.i18n'

type MarketsProps = {
  setTableInstance?: (tableInstance: any) => void
  isLoading: boolean
  markets?: Array<Market>
}

export const MarketsTable: React.FC<MarketsProps> = ({ setTableInstance, isLoading, markets }) => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState()

  const marketsRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
            <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
              <Flex alignItems="center" h="60px">
                <Text
                  noOfLines={2}
                  title={cell.value}
                  padding="0 15px"
                  color="#4A5568"
                  fontStyle="normal"
                  mt="10px"
                  mb="10px"
                  fontSize="14px"
                  fontWeight={400}
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

  const { columns } = useColumnWidthResize([
    {
      Header: t(`${VENDOR_MANAGER}.metroServiceArea`),
      accessor: 'metropolitanServiceArea',
    },
    {
      Header: t(`${VENDOR_MANAGER}.createdBy`),
      accessor: 'createdBy',
    },
    {
      Header: t(`${VENDOR_MANAGER}.createdDate`),
      accessor: 'createdDate',
      Cell: ({ value }) => dateFormat(value),
      getCellExportValue(row) {
        return dateFormat(row.original.createdDate)
      },
    },
    {
      Header: t(`${VENDOR_MANAGER}.modifiedBy`),
      accessor: 'modifiedBy',
    },

    {
      Header: t(`${VENDOR_MANAGER}.modifiedDateSubmit`),
      accessor: 'modifiedDate',
      Cell({ value }) {
        return <Box>{dateFormat(value)}</Box>
      },
      getCellExportValue(row) {
        return dateFormat(row.original.modifiedDate)
      },
    },

    {
      Header: t(`${VENDOR_MANAGER}.stateName`),
      accessor: 'stateName',
    },
  ])
  return (
    <>
      {selectedWorkOrder && (
        <NewMarketModal
          isOpen={selectedWorkOrder ? true : false}
          onClose={() => {
            setSelectedWorkOrder(undefined)
          }}
          selectedWorkOrder={selectedWorkOrder}
        />
      )}
      <TableWrapper
        columns={columns}
        data={markets || []}
        TableRow={marketsRow}
        tableHeight="calc(100vh - 300px)"
        name="work-orders-table"
        isLoading={isLoading}
        disableFilter={true}
        setTableInstance={setTableInstance}
        onRowClick={(e, row) => setSelectedWorkOrder(row.original)}
      />
    </>
  )
}
