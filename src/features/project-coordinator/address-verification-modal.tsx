import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'

// create chakra modal for address verification confirmation
export const AddressVerificationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  )
}
