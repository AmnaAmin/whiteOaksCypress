import React from 'react'
import { Box } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { AUDIT_LOGS_COLUMNS } from './audit-logs.constants'
import { useProjectAuditLogs } from 'api/project-details'

export const AuditLogsTable = React.forwardRef((_, ref) => {
  const { data: auditLogs, isFetching } = useProjectAuditLogs()
  const onRowClick = row => {}
  console.log('audit/...', auditLogs)

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
        <TableContextProvider data={auditLogs} columns={AUDIT_LOGS_COLUMNS}>
          <Table isLoading={isFetching} isEmpty={!isFetching && !auditLogs?.length} onRowClick={onRowClick} />
        </TableContextProvider>
      </Box>
    </Box>
  )
})
