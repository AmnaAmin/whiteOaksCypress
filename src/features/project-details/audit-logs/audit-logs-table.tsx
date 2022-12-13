import React from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useProjectWorkOrders } from 'api/projects'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { AUDIT_LOGS_COLUMNS } from './audit-logs.constants'

export const AuditLogsTable = React.forwardRef((_, ref) => {
  const { projectId } = useParams<'projectId'>()
  const { data: auditLogs, isFetching } = useProjectWorkOrders(projectId)
  const onRowClick = row => {}

  return (
    <Box>
      <Box overflow={'auto'} w="100%" h="calc(100vh - 350px)" position="relative" roundedTop={6}>
        <TableContextProvider data={auditLogs} columns={AUDIT_LOGS_COLUMNS}>
          <Table isLoading={isFetching} isEmpty={!isFetching && !auditLogs?.length} onRowClick={onRowClick} />
        </TableContextProvider>
      </Box>
    </Box>
  )
})
