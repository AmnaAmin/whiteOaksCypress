import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
// import { Clients } from 'types/client.type'
// import Client from 'features/clients/client-modal'
import { TableWrapper } from 'components/table/table'
import { useTranslation } from 'react-i18next'
import { usePerformance } from 'api/performance'

const performanceTableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
              <Text isTruncated title={cell.value} padding="0 15px">
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

export const PerformanceTable = React.forwardRef((props: any, ref) => {
  const { data : performance } = usePerformance()
//   const [selectedClient, setSelectedClient] = useState<Clients>()
  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header:'Name' as string,
        accessor: 'name',
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
      },
      {
        Header: 'Profit',
        accessor: 'profit',
      },
      {
        Header: 'Target',
        accessor: 'target',
      },
      {
        Header: 'Badge',
        accessor: 'badge',
      },
      {
        Header: 'Disqualified Revenue',
        accessor: 'disqualifiedRevenue',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
     {/* <Client 
    //     clientDetails={selectedClient as Clients}
    //     onClose={() => {
    //       setSelectedClient(undefined)
    //     }}
    //   /> */}

      <TableWrapper
        columns={columns}
        data={performance || []}
        TableRow={performanceTableRow}
        tableHeight="calc(100vh - 225px)"
        name="performance-table"
        // onRowClick={(e, row) => setSelectedClient(row.original)}
      />
    </Box>
  )
})
