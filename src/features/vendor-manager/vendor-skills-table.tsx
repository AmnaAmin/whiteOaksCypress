import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from '../../utils/hooks/useColumnsWidthResize'
import { RowProps } from '../../components/table/react-table'
import { TableWrapper } from '../../components/table/table'
import { useTrades } from 'utils/vendor-details'
import { NewVendorSkillsModal } from './new-vendor-skill-modal'
import { dateFormat } from 'utils/date-time-utils'
import { MARKETS } from './vendor-manager.i18n'
const vendorSkillsRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
export const VendorSkillsTable = React.forwardRef((props: any, ref) => {
  const { data: VendorSkills, isLoading } = useTrades()
  const [selectedWorkOrder, setSelectedWorkOrder] = useState()
  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: `${MARKETS}.skills`,
        accessor: 'skill',
      },
      {
        Header: `${MARKETS}.createdBy`,
        accessor: 'createdBy',
      },
      {
        Header: `${MARKETS}.createdDate`,
        accessor: 'createdDate',
        Cell: ({ value }) => dateFormat(value),
      },
      {
        Header: `${MARKETS}.modifiedBy`,
        accessor: 'modifiedBy',
      },
      {
        Header: `${MARKETS}.modifiedDate`,
        accessor: 'modifiedDate',
        Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )
  return (
    <Box ref={resizeElementRef}>
      {selectedWorkOrder && (
        <NewVendorSkillsModal
          isOpen={selectedWorkOrder ? true : false}
          onClose={() => {
            setSelectedWorkOrder(undefined)
          }}
          selectedWorkOrder={selectedWorkOrder}
        />
      )}
      <TableWrapper
        columns={columns}
        data={VendorSkills || []}
        TableRow={vendorSkillsRow}
        tableHeight="calc(100vh - 225px)"
        name="clients-table"
        isLoading={isLoading}
        onRowClick={(e, row) => setSelectedWorkOrder(row.original)}
      />
    </Box>
  )
})
