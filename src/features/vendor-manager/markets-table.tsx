import { Flex, Td, Text, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { Market } from 'types/vendor.types'
import { dateFormat } from 'utils/date-time-utils'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { MARKETS } from './vendor-manager.i18n'

type MarketsProps = {
  setTableInstance?: (tableInstance: any) => void
  isLoading: boolean
  markets?: Array<Market>
}

export const MarketsTable: React.FC<MarketsProps> = ({ setTableInstance, isLoading, markets }) => {
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
      Header: `${MARKETS}.metroServiceArea`,
      accessor: 'metropolitanServiceArea',
    },
    {
      Header: 'createdBy',
      accessor: 'createdBy',
    },
    {
      Header: 'createdDate',
      accessor: 'createdDate',
      Cell: ({ value }) => dateFormat(value),
    },
    {
      Header: 'modifiedBy',
      accessor: 'modifiedBy',
    },
    {
      Header: 'modifiedDateSubmit',
      accessor: 'modifiedDate',
      Cell: ({ value }) => dateFormat(value),
    },
    {
      Header: 'stateName',
      accessor: 'stateName',
    },
  ])
  return (
    <TableWrapper
      columns={columns}
      data={markets || []}
      TableRow={marketsRow}
      tableHeight="calc(100vh - 300px)"
      name="work-orders-table"
      isLoading={isLoading}
      disableFilter={true}
      setTableInstance={setTableInstance}
    />
  )
}
