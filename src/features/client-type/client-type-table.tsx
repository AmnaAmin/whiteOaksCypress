import { Box, useDisclosure } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { useState } from 'react'
import { CLIENT_TYPE_COLUMNS, useClientType } from 'api/client-type'
import { ClientTypeModal } from './client-type-modal'

export const ClientTypeTable = () => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [selectedProjectType, setSelectedProjectType] = useState()
  const { data: clientType, isLoading } = useClientType()

  return (
    <Box overflow="auto" roundedTop={6} border="1px solid #CBD5E0">
      <ClientTypeModal
        clientTypeDetails={selectedProjectType}
        onClose={() => {
          setSelectedProjectType(undefined)
          onCloseDisclosure()
        }}
        isOpen={isOpen}
      />

      <Box overflowX={'auto'} h="calc(100vh - 170px)" roundedTop={6}>
        <TableContextProvider data={clientType} columns={CLIENT_TYPE_COLUMNS}>
          <Table
            isLoading={isLoading}
            onRowClick={row => {
              setSelectedProjectType(row)
              onOpen()
            }}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
}
