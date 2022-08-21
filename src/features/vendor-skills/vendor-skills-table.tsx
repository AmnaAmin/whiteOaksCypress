import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from '../../utils/hooks/useColumnsWidthResize'
import { RowProps } from '../../components/table/react-table'
// import { Clients } from '../../types/client.type'
import { TableWrapper } from '../../components/table/table'
// import { useTranslation } from 'react-i18next'
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
  // const [selectedClient, setSelectedClient] = useState<Clients>()
  console.log('vendorSkills', VendorSkills)

  // const { t } = useTranslation()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: 'Skills',
        accessor: 'skill',
      },
      {
        Header: 'Created by',
        accessor: 'createdBy',
      },
      {
        Header: 'Created date',
        accessor: 'createdDate',
      },
      {
        Header: 'Modified by',
        accessor: 'modifiedBy',
      },
      {
        Header: 'Modified date',
        accessor: 'modifiedDate',
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      {/* <Client
        clientDetails={selectedClient as Clients}
        onClose={() => {
          setSelectedClient(undefined)
        }}
      /> */}

      <TableWrapper
        columns={columns}
        data={VendorSkills || []}
        TableRow={vendorSkillsRow}
        tableHeight="calc(100vh - 225px)"
        name="clients-table"
        // onRowClick={(e, row) => setSelectedClient(row.original)}
      />
    </Box>
  )
})
