import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from '../../utils/hooks/useColumnsWidthResize'
import { RowProps } from '../../components/table/react-table'
import { TableWrapper } from '../../components/table/table'
import { useVendorSkills } from 'utils/vendor-skills-api'

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
  const { data: VendorSkills } = useVendorSkills()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'skills',
        accessor: 'skill',
      },
      {
        Header: 'createdby',
        accessor: 'createdBy',
      },
      {
        Header: 'createdDate',
        accessor: 'createdDate',
      },
      {
        Header: 'modifiedby',
        accessor: 'modifiedBy',
      },
      {
        Header: 'modifiedDate',
        accessor: 'modifiedDate',
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <TableWrapper
        columns={columns}
        data={VendorSkills || []}
        TableRow={vendorSkillsRow}
        tableHeight="calc(100vh - 225px)"
        name="clients-table"
      />
    </Box>
  )
})
