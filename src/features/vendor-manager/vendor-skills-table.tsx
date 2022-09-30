import React, { useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from '../../utils/hooks/useColumnsWidthResize'
import { RowProps } from '../../components/table/react-table'
import { TableWrapper } from '../../components/table/table'
import { useTrades } from 'api/vendor-details'
import { NewVendorSkillsModal } from './new-vendor-skill-modal'
import { dateFormat } from 'utils/date-time-utils'
import { VENDOR_MANAGER } from './vendor-manager.i18n'
import { Market } from 'types/vendor.types'
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
  const [selectedVendorSkills, setSelectedVendorSkills] = useState<Market>()
  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: `${VENDOR_MANAGER}.skills`,
        accessor: 'skill',
      },
      {
        Header: `${VENDOR_MANAGER}.createdBy`,
        accessor: 'createdBy',
      },
      {
        Header: `${VENDOR_MANAGER}.createdDate`,
        accessor: 'createdDate',
        Cell: ({ value }) => dateFormat(value),
      },
      {
        Header: `${VENDOR_MANAGER}.modifiedBy`,
        accessor: 'modifiedBy',
      },
      {
        Header: `${VENDOR_MANAGER}.modifiedDate`,
        accessor: 'modifiedDate',
        Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )
  return (
    <Box ref={resizeElementRef}>
      {selectedVendorSkills && (
        <NewVendorSkillsModal
          isOpen={selectedVendorSkills ? true : false}
          onClose={() => {
            setSelectedVendorSkills(undefined)
          }}
          selectedVendorSkills={selectedVendorSkills}
        />
      )}
      <TableWrapper
        columns={columns}
        data={VendorSkills || []}
        TableRow={vendorSkillsRow}
        tableHeight="calc(100vh - 225px)"
        name="clients-table"
        isLoading={isLoading}
        disableFilter={true}
        onRowClick={(e, row) => setSelectedVendorSkills(row.original)}
      />
    </Box>
  )
})
