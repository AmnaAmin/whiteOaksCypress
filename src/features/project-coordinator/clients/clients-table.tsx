import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import { usePcClients } from 'utils/clients-table-api'

const clientsTableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
                isTruncated
                title={cell.value}
                padding="0 15px"
                fontSize="14px"
                color="#4A5568"
                fontWeight={400}
                fontStyle="normal"
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

export const ClientsTable = React.forwardRef((props: any, ref) => {
  const { data: PcData, isLoading } = usePcClients()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'Name',
        accessor: 'companyName',
      },
      {
        Header: 'Contact',
        accessor: 'contacts[0].contact',
      },
      {
        Header: 'Address',
        accessor: 'streetAddress',
      },
      {
        Header: 'Phone',
        accessor: 'contacts[0].phoneNumber',
      },
      {
        Header: 'Email',
        accessor: 'contacts[0].emailAddress',
        // Cell: ({ value }) => PROJECT_CATEGORY[value],
      },
      {
        Header: 'Contact',
        accessor: 'accountPayableContactInfos[0].contact',
      },
      {
        Header: 'Email',
        accessor: 'accountPayableContactInfos[0].emailAddress',
      },

      {
        Header: 'Phone',
        accessor: 'accountPayableContactInfos[0].phoneNumber',
        // Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <ReactTable
        isLoading={isLoading}
        onRowClick={props.onRowClick}
        columns={columns}
        data={PcData || []}
        TableRow={clientsTableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  )
})
