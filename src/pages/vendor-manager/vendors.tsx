import { HStack, Box, Icon, Button, Spacer, useDisclosure } from '@chakra-ui/react'
import { VendorFilters } from 'features/vendors/vendor-filter'
import { VendorTable } from 'features/vendors/vendor-table'
import NewVendorModal from 'features/vendor-manager/new-vendor-modal'
import { useState } from 'react'
import { BiBookAdd } from 'react-icons/bi'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useTranslation } from 'react-i18next'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { Card } from 'components/card/card'

const Vendors = () => {
  const { isOpen: isOpenNewVendorModal, onOpen: onNewVendorModalOpen, onClose: onNewVendorModalClose } = useDisclosure()
  const [selectedCard, setSelectedCard] = useState<string>('')
  const { t } = useTranslation()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('VENDOR.READ')

  return (
    <Box pb="2">
      <VendorFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />
      <Card px="12px" py="16px" mt="12px">
        <HStack mb="16px">
          <Spacer />
          {!isReadOnly && (
            <Box>
              <Button onClick={onNewVendorModalOpen} colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />}>
                {t(`${VENDOR_MANAGER}.newVendor`)}
              </Button>
            </Box>
          )}
        </HStack>
        <VendorTable selectedCard={selectedCard as string} isReadOnly={isReadOnly} />
      </Card>

      <NewVendorModal isOpen={isOpenNewVendorModal} onClose={onNewVendorModalClose} />
    </Box>
  )
}

export default Vendors
