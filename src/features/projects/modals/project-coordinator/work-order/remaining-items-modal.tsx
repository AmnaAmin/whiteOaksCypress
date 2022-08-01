import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  HStack,
  Button,
} from '@chakra-ui/react'
import RemainingListTable from 'features/project-coordinator/vendor-work-order/remaining-list-table'
import React from 'react'

const RemainingItemsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = props => {
  return (
    <Box>
      <Modal variant="custom" isOpen={props.isOpen} onClose={props.onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="16px" fontWeight={500} color="gray.600">
            Remaining List
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody>
            <RemainingListTable />
          </ModalBody>
          <ModalFooter p="0">
            <HStack w="100%" justifyContent="end" my="16px" mr="32px" spacing="16px">
              <Button variant="outline" colorScheme="brand" onClick={props.onClose}>
                Cancel
              </Button>
              <Button variant="solid" colorScheme="brand">
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default RemainingItemsModal
