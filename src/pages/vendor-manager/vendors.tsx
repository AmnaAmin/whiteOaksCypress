import { HStack, Box, Icon, Button, Spacer, useDisclosure } from '@chakra-ui/react'
import { VendorFilters } from 'features/vendors/vendor-filter'
import { VendorTable } from 'features/vendors/vendor-table'
import NewVendorModal from 'features/vendor-manager/new-vendor-modal'
import { useState } from 'react'
import { BiBookAdd } from 'react-icons/bi'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useTranslation } from 'react-i18next'

const Vendors = () => {
  const { isOpen: isOpenNewVendorModal, onOpen: onNewVendorModalOpen, onClose: onNewVendorModalClose } = useDisclosure()
  const [selectedCard, setSelectedCard] = useState<string>('')
  const { t } = useTranslation()

  return (
    <Box mt="5">
      <VendorFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />

      <HStack mb="10px">
        {/* <Button variant="ghost" colorScheme="brand" onClick={() => setSelectedCard('')}>
          {t('clearFilter')}
        </Button> */}
        <Spacer />
        <Box pt="4">
          <Button onClick={onNewVendorModalOpen} colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />}>
          {t(`${VENDOR_MANAGER}.newVendor`)}
          </Button>
        </Box>
      </HStack>

      <Box>
        <VendorTable selectedCard={selectedCard as string} />
      </Box>

      <NewVendorModal isOpen={isOpenNewVendorModal} onClose={onNewVendorModalClose} />
    </Box>
  )
}

export default Vendors
