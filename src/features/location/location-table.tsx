import { Box, useDisclosure } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { useState } from 'react'
import { CLIENT_TYPE_COLUMNS } from 'api/client-type'
import { LocationModal } from './location-modal'
import { useLocation } from 'api/location'

export const LocationTable = () => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [selectedLocation, setSelectedLocation] = useState()
  const { data: locations, isLoading } = useLocation()

  return (
    <Box overflow="auto" roundedTop={6} border="1px solid #CBD5E0">
      <LocationModal
        location={selectedLocation}
        onClose={() => {
          setSelectedLocation(undefined)
          onCloseDisclosure()
        }}
        isOpen={isOpen}
      />

      <Box overflowX={'auto'} h="calc(100vh - 170px)" roundedTop={6}>
        <TableContextProvider data={locations} columns={CLIENT_TYPE_COLUMNS}>
          <Table
            isLoading={isLoading}
            onRowClick={row => {
              console.log(row)
              setSelectedLocation(row)
              onOpen()
            }}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
}
