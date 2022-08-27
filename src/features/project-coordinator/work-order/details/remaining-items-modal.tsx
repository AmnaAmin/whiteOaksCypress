import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import RemainingListTable from 'features/project-coordinator/work-order/details/remaining-list-table'
import { t } from 'i18next'
import React, { useState } from 'react'
import { LineItems } from 'utils/work-order'
import { WORK_ORDER } from '../workOrder.i18n'

const RemainingItemsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  setAssignedItems: (items) => void
  remainingItems: LineItems[]
  isLoading: boolean
}> = props => {
  const { remainingItems, isLoading, setAssignedItems, onClose } = props
  const [selectedItems, setSelectedItems] = useState<LineItems[]>([])

  return (
    <Box>
      <Modal variant="custom" isOpen={props.isOpen} onClose={props.onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="16px" fontWeight={500} color="gray.600">
            {t(`${WORK_ORDER}.remainingList`)}
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody>
            <RemainingListTable
              remainingItems={remainingItems}
              isLoading={isLoading}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </ModalBody>
          <ModalFooter p="0">
            <HStack w="100%" justifyContent="end" my="16px" mr="32px" spacing="16px">
              <Button
                variant="outline"
                colorScheme="brand"
                onClick={() => {
                  setSelectedItems([])
                  props.onClose()
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="solid"
                colorScheme="brand"
                onClick={() => {
                  setAssignedItems(selectedItems)
                  setSelectedItems([])
                  onClose()
                }}
              >
                {t('save')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default RemainingItemsModal
