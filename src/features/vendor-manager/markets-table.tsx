import { Flex, Td, Text, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { dateFormat } from 'utils/date-time-utils'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { useMarketsData } from 'utils/projects'

type MarketsProps = {
  setTableInstance: (tableInstance: any) => void
}

export const MarketsTable: React.FC<MarketsProps> = ({ setTableInstance }) => {
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
  const { data, isLoading } = useMarketsData()

  const { columns } = useColumnWidthResize([
    {
      Header: 'Metropolitan Service Area ',
      accessor: 'metropolitanServiceArea',
      // @ts-ignore
      //   Cell: ({ value, row }) => <Status value={value} id={row.original?.statusLabel} />,
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
      data={data || []}
      TableRow={marketsRow}
      tableHeight="calc(100vh - 300px)"
      name="work-orders-table"
      isLoading={isLoading}
      disableFilter={true}
      setTableInstance={setTableInstance}
      // onRowClick={(e, row) => setSelectedWorkOrder(row.original)}
    />
  )
}
