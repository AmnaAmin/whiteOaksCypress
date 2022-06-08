import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { dateFormat } from 'utils/date-time-utils'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useProjectAlerts } from 'utils/projects'
import { useParams } from 'react-router-dom'
import { useAuth } from 'utils/auth-context'
import { useTranslation } from 'react-i18next'

enum PROJECT_CATEGORY {
  WARNING = 1,
  INFO = 2,
  ERROR = 3,
}

const triggeredAlertsRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
  const { projectId } = useParams<'projectId'>()
  const { data: alerts } = useProjectAlerts(projectId, account?.login)
  const { t } = useTranslation()

  const { columns, resizeElementRef } = useColumnWidthResize(
    [
      {
        Header: <input type="checkbox"></input>,
        accessor: 'checkbox',
        Cell: () => <input type="checkbox"></input>,
        width: 60,
      },
      {
        Header: t('name') as string,
        accessor: 'subject',
        width: 275,
      },
      {
        Header: t('type') as string,
        accessor: 'triggeredType',
        width: 275,
      },
      {
        Header: t('value') as string,
        accessor: 'attribute',
        width: 275,
      },
      {
        Header: t('category') as string,
        accessor: 'category',
        Cell: ({ value }) => PROJECT_CATEGORY[value],
        width: 275,
      },
      {
        Header: t('dateTriggered') as string,
        accessor: 'dateCreated',
        Cell: ({ value }) => dateFormat(value),
        width: 275,
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
        TableRow={triggeredAlertsRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  )
})
