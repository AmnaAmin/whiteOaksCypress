import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { useTranslation } from 'react-i18next'
import Data from './alerts-data.json'
import { TableWrapper } from 'components/table/table'

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

export const ManagedAlertTable = React.forwardRef((props: any, ref) => {
  const { t } = useTranslation()

  const { columns, resizeElementRef } = useColumnWidthResize([
    {
      Header: t('name'),
      accessor: 'title',
    },

    {
      Header: t('type') as string,
      accessor: 'triggeredType',
    },
    {
      Header: t('value') as string,
      accessor: 'attribute',
    },
    {
      Header: t('category') as string,
      accessor: 'category',
    },
    {
      Header: t('dateTriggered') as string,
      accessor: 'dateCreated',
    },
  ])

  return (
    <Box ref={resizeElementRef}>
      <TableWrapper
        onRowClick={props.onRowClick}
        columns={columns}
        data={Data}
        TableRow={alertsRow}
        tableHeight="calc(100vh - 250px)"
        name="alerts-table"
      />
    </Box>
  )
})
