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
import React, { useState } from 'react'
import { useAssignLineItems } from 'utils/work-order'

const RemainingItemsModal: React.FC<{ isOpen: boolean; onClose: () => void; workOrder: any }> = props => {
  const [selectedLineItems, setSelectedLineItems] = useState<Array<any>>([])
  const { mutate: updateWorkOrder } = useAssignLineItems(props?.workOrder?.projectId)

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
            <RemainingListTable
              workOrder={props.workOrder}
              selectedLineItems={selectedLineItems}
              setSelectedLineItems={setSelectedLineItems}
            />
          </ModalBody>
          <ModalFooter p="0">
            <HStack w="100%" justifyContent="end" my="16px" mr="32px" spacing="16px">
              <Button variant="outline" colorScheme="brand" onClick={props.onClose}>
                Cancel
              </Button>
              <Button
                variant="solid"
                colorScheme="brand"
                onClick={() => {
                  updateWorkOrder(selectedLineItems.join(','))
                }}
              >
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
