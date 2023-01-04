import React from 'react'
import { Box } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { AUDIT_LOGS_COLUMNS } from './audit-logs.constants'
import { useProjectAuditLogs } from 'api/project-details'
import { ExportButton } from 'components/table-refactored/export-button'
import { TableFooter, ButtonsWrapper, CustomDivider } from 'components/table-refactored/table-footer'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'

export const AuditLogsTable = React.forwardRef((_, ref) => {
  const { data: auditLogs, isFetching, refetch } = useProjectAuditLogs()
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.auditLogs)
  const { tableColumns, settingColumns } = useTableColumnSettings(AUDIT_LOGS_COLUMNS, TableNames.auditLogs)

  const onRowClick = row => {}

  const onSave = columns => {
    postGridColumn(columns)
  }

  console.log('settingColumns', settingColumns)

  return (
    <Box>
      <Box
        w="100%"
        minH="calc(100vh - 450px)"
        position="relative"
        borderRadius="6px"
        border="1px solid #CBD5E0"
        overflowX="auto"
        roundedRight={{ base: '0px', sm: '6px' }}
      >
        <TableContextProvider data={auditLogs} columns={tableColumns}>
          <Table isLoading={isFetching} isEmpty={!isFetching && !auditLogs?.length} onRowClick={onRowClick} />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                refetch={refetch}
                isLoading={isFetching}
                colorScheme="darkPrimary.400"
                fileName="transactions"
              />
              <CustomDivider />
              {settingColumns && <TableColumnSettings disabled={isFetching} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
})
