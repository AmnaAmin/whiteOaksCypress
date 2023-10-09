import React from 'react'
import { Box, Center, Spinner } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { AUDIT_LOGS_COLUMNS } from './audit-logs.constants'
import { ExportButton } from 'components/table-refactored/export-button'
import { TableFooter, ButtonsWrapper, CustomDivider } from 'components/table-refactored/table-footer'
import TableColumnSettings from 'components/table/table-column-settings'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'

export const AuditLogsTable = ({ auditLogs, isLoading, refetch, isReadOnly }) => {
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.auditLogs)
  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(AUDIT_LOGS_COLUMNS, TableNames.auditLogs)

  const onRowClick = row => {}
  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <>
      {isLoading && (
        <Center minH="calc(100vh - 450px)">
          <Spinner size="lg" />
        </Center>
      )}
      {auditLogs && !isLoading && (
        <Box
          overflow={'auto'}
          w="100%"
          h="auto"
          position="relative"
          border="1px solid #CBD5E0"
          borderRadius="6px"
          roundedRight={{ base: '0px', sm: '6px' }}
          minH={{ sm: 'auto', md: 'calc(100vh - 450px)' }}
        >
          <TableContextProvider data={auditLogs} columns={tableColumns}>
            <Table onRowClick={onRowClick} isLoading={isLoading} isEmpty={!isLoading && !auditLogs?.length} />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportButton
                  columns={tableColumns}
                  refetch={refetch}
                  isLoading={isLoading}
                  colorScheme="darkPrimary.400"
                  fileName="transactions"
                />
                <CustomDivider />
                {settingColumns && (
                  <TableColumnSettings
                    refetch={refetchColumns}
                    disabled={isLoading}
                    onSave={onSave}
                    columns={settingColumns}
                    tableName={TableNames.auditLogs}
                    isReadOnly={isReadOnly}
                  />
                )}
              </ButtonsWrapper>
            </TableFooter>
          </TableContextProvider>
        </Box>
      )}
    </>
  )
}
