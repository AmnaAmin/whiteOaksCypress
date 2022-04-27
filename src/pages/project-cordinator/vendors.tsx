import { AddIcon } from '@chakra-ui/icons'
import { HStack, Box, Icon, Button, Spacer } from '@chakra-ui/react'
import { VendorFilters } from 'features/project-coordinator/vendor/vendor-filter'
// import { VendorTable } from 'features/project-coordinator/vendor/vendorTable'
// import React, { useRef } from 'react'

const Vendors = () => {
  // const tabsContainerRef = useRef<HTMLDivElement>(null)
  // const { onOpen: onAlertModalOpen } = useDisclosure()
  return (
    <Box mt="5">
      <VendorFilters />

      <HStack mt="1" mb="1">
        <Button _focus={{ outline: 'none' }} variant="ghost" color="#4E87F8" fontSize="14px" fontWeight={600}>
          Clear Filter
        </Button>
        <Spacer />
        <Box pt="4">
          <Button
            _focus={{ outline: 'none' }}
            variant="ghost"
            color="#4E87F8"
            leftIcon={<Icon boxSize={3} as={AddIcon} />}
            fontSize="14px"
            fontWeight={600}
          >
            New Vendor
          </Button>
        </Box>
      </HStack>

      <Box>
        {/* <VendorTable
          onRowClick={(e, row) => {
            onAlertModalOpen()
          }}
          ref={tabsContainerRef}
        /> */}
      </Box>
    </Box>
  )
}

export default Vendors
