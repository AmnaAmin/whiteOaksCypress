import React from 'react'
import { Box, Center, Spinner } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { AUDIT_LOGS_COLUMNS } from './audit-logs.constants'

export const AuditLogsTable = ({ auditLogs, isLoading }) => {
  const onRowClick = row => {}
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
          <TableContextProvider data={auditLogs} columns={AUDIT_LOGS_COLUMNS}>
            <Table onRowClick={onRowClick} isLoading={isLoading} isEmpty={!isLoading && !auditLogs?.length} />
          </TableContextProvider>
        </Box>
      )}
    </>
  )
}
