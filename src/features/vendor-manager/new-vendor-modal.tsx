import {
  Box,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { t } from 'i18next'
import { VendorProfileTabs } from 'pages/vendor/vendor-profile'
import React, { useState } from 'react'
import { useVendorProfile } from 'api/vendor-details'

export const NewVendorTabs: React.FC<{ onClose: () => void }> = props => {
  const [vendorId, setVendorId] = useState(0)
  const { data: vendorProfileData, refetch } = useVendorProfile(vendorId)

  return (
    <VendorProfileTabs
      vendorModalType="editVendor"
      vendorProfileData={vendorId ? vendorProfileData : undefined}
      refetch={refetch}
      onClose={props.onClose}
      updateVendorId={setVendorId}
    />
  )
}

type NewVendorModalType = {
  isOpen: boolean
  onClose: () => void
}

const NewVendorModal: React.FC<NewVendorModalType> = props => {
  return (
    <Box>
      <Modal onClose={props.onClose} isOpen={props.isOpen} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom="2px solid #E2E8F0">
            <FormLabel variant="strong-label" size="lg">
              {t('newVendor')}
            </FormLabel>
          </ModalHeader>
          <ModalCloseButton data-testid="new-vendor-close-btn" _hover={{ bg: 'blue.50' }} />
          <ModalBody bg="#F2F3F4" py="10px">
            <NewVendorTabs onClose={props.onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NewVendorModal
