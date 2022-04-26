import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useProjectAlerts } from 'utils/projects'
import { useParams } from 'react-router-dom'
import { useAuth } from 'utils/auth-context'

const alertsRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
              <Text noOfLines={2} title={cell.value} padding="0 15px" color="blackAlpha.600">
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

export const VendorTable = React.forwardRef((props: any, ref) => {
  const { data } = useAuth()
  const account = data?.user

  const { projectId } = useParams<'projectId'>()

  const { data: alerts } = useProjectAlerts(projectId, account?.login)

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'Status',
        accessor: 'subject',
      },
      {
        Header: 'Name',
        accessor: 'triggeredType',
      },
      {
        Header: 'Region',
        accessor: 'attribute',
      },
      {
        Header: 'State',
        accessor: 'category',
      },
      {
        Header: 'Active Date',
        accessor: 'dateCreated',
      },
      {
        Header: 'COI-GL Expiration Date',
        accessor: 'date',
      },
      {
        Header: 'COI-WC Expiration Date',
        accessor: 'now',
      },
      {
        Header: 'EIN/SSN',
        accessor: 'ein/ssn',
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <ReactTable
        onRowClick={props.onRowClick}
        columns={columns}
        data={alerts || []}
        TableRow={alertsRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  )
})
