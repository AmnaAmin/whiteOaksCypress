import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'utils/auth-context'
import { dateFormat } from 'utils/date-time-utils'
import { useFetchUserAlerts } from 'api/alerts'

enum PROJECT_CATEGORY {
  WARNING = 1,
  INFO = 2,
  ERROR = 3,
}

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

export const TriggeredAlertsTable = React.forwardRef((props: any, ref) => {
  const { data } = useAuth()
  const account = data?.user
  const { data: alerts } = useFetchUserAlerts()
  const userAlerts = alerts?.filter(a => a.login === account?.login)
  const { t } = useTranslation()

  const { columns, resizeElementRef } = useColumnWidthResize([
    {
      Header: <input type="checkbox"></input>,
      Cell: () => <input type="checkbox"></input>,
      accessor: 'checkbox',
      width: 60,
    },
    {
      Header: 'Name',
      accessor: 'subject',
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
      Cell: ({ value }) => PROJECT_CATEGORY[value],
    },
    {
      Header: t('dateTriggered') as string,
      accessor: 'dateCreated',
      Cell: ({ value }) => dateFormat(value),
    },
  ])

  return (
    <Box ref={resizeElementRef}>
      <TableWrapper
        onRowClick={props.onRowClick}
        columns={columns}
        data={userAlerts || []}
        TableRow={alertsRow}
        tableHeight="calc(100vh - 407px)"
        name="alerts-table"
      />
    </Box>
  )
})
