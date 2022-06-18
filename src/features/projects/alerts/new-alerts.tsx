import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useTranslation } from 'react-i18next'
import Data from './alerts-data.json'

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

export const NewAlerts = React.forwardRef((props: any, ref) => {
  const { t } = useTranslation()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: t('name'),
        accessor: 'checkbox',
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
        // Cell: ({ value }) => PROJECT_CATEGORY[value],
      },
      {
        Header: t('dateTriggered') as string,
        accessor: 'dateCreated',
        // Cell: ({ value }) => dateFormat(value),
      },
    ],
    ref,
  )

  return (
    <Box ref={resizeElementRef}>
      <ReactTable
        onRowClick={props.onRowClick}
        columns={columns}
        data={Data}
        TableRow={alertsRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  )
})
