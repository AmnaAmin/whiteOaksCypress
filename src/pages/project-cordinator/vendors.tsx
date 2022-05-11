import { AddIcon } from '@chakra-ui/icons'
import { HStack, Box, Icon, Grid, GridItem, Button, Spacer, useDisclosure } from '@chakra-ui/react'
import NewVendorModal from 'features/project-coordinator/vendor/new-vendor-modal'
import VendorFilterCard from 'features/project-coordinator/vendor/vendor-filter-card'
import { VendorTable } from 'features/project-coordinator/vendor/vendorTable'
import React, { useRef } from 'react'
import { BiClipboard, BiHourglass, BiMessageSquareError, BiFile } from 'react-icons/bi'

const Vendors = () => {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const { isOpen: isOpenDetailsModal, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure()
  return (
    <Box mt="5">
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
        <GridItem>
          <VendorFilterCard
            icon={<Icon color="#4A5568" boxSize={7} as={BiFile} />}
            status="Active"
            num={25}
            bgColor="#F9F1DA"
          />
        </GridItem>

        <GridItem>
          <VendorFilterCard
            icon={<Icon color="#4A5568" boxSize={7} as={BiClipboard} />}
            status="Inactive"
            num={15}
            bgColor="#E5ECF9"
          />
        </GridItem>

        <GridItem>
          <VendorFilterCard
            icon={<Icon color="#4A5568" boxSize={7} as={BiMessageSquareError} />}
            status="Do Not Use"
            num={11}
            bgColor="#E6FFFA"
          />
        </GridItem>
        <GridItem>
          <VendorFilterCard
            icon={<Icon color="#4A5568" boxSize={7} as={BiHourglass} />}
            status="Expired"
            num={33}
            bgColor="#FCE8D8"
          />
        </GridItem>
      </Grid>
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
            onClick={onDetailsModalOpen}
          >
            New Vendor
          </Button>
        </Box>
      </HStack>

      <Box>
        <VendorTable ref={tabsContainerRef} />
      </Box>
      <NewVendorModal isOpen={isOpenDetailsModal} onClose={onDetailsModalClose} />
    </Box>
  )
}

export default Vendors
