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
import React from 'react'

export const NewVendorTabs: React.FC<{ onClose: () => void }> = props => {
  return <VendorProfileTabs onClose={props.onClose} />
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
          <ModalHeader mb="5px" borderBottom="2px solid #E2E8F0">
            <FormLabel variant="strong-label" size="lg">
              {t('newVendor')}
            </FormLabel>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody>
            <NewVendorTabs onClose={props.onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NewVendorModal
