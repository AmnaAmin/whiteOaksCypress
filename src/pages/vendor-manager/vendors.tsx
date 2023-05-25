import { HStack, Box, Icon, Button, Spacer, useDisclosure } from '@chakra-ui/react'
import { VendorFilters } from 'features/vendors/vendor-filter'
import { VendorTable } from 'features/vendors/vendor-table'
import NewVendorModal from 'features/vendor-manager/new-vendor-modal'
import { useState } from 'react'
import { BiBookAdd } from 'react-icons/bi'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { Card } from 'components/card/card'
import { FPMVendors } from 'features/vendors/vendor-table-fpm'
import { FPMVendorFilters } from 'features/vendors/vendor-filters-fpm'

const Vendors = () => {
  const { isOpen: isOpenNewVendorModal, onOpen: onNewVendorModalOpen, onClose: onNewVendorModalClose } = useDisclosure()
  const [selectedCard, setSelectedCard] = useState<string>('')
  const { t } = useTranslation()
  // change this logic based on access control requirements
  const { isFPM } = useUserRolesSelector()

  return (
    <Box pb="2">
      {!isFPM ? (
        <VendorFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />
      ) : (
        <FPMVendorFilters onSelectCard={setSelectedCard} selectedCard={selectedCard}></FPMVendorFilters>
      )}

      <Card px="12px" py="16px" mt="12px">
        <HStack mb="16px">
          {/* <Button variant="ghost" colorScheme="brand" onClick={() => setSelectedCard('')}>
          {t('clearFilter')}
        </Button> */}
          <Spacer />
          {!isFPM && (
            <Box>
              <Button onClick={onNewVendorModalOpen} colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />}>
                {t(`${VENDOR_MANAGER}.newVendor`)}
              </Button>
            </Box>
          )}
        </HStack>
        {!isFPM ? (
          <VendorTable selectedCard={selectedCard as string} />
        ) : (
          <FPMVendors selectedCard={selectedCard as string}></FPMVendors>
        )}
      </Card>

      <NewVendorModal isOpen={isOpenNewVendorModal} onClose={onNewVendorModalClose} />
    </Box>
  )
}

export default Vendors
