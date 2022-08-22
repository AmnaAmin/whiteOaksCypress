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
import RemainingListTable from 'features/project-coordinator/work-order/remaining-list-table'
import { t } from 'i18next'
import React, { useState } from 'react'
import { useAssignLineItems } from 'utils/work-order'
import { WORK_ORDER } from './workOrder.i18n'

const RemainingItemsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  swoProjectId: any
  workOrder: any
}> = props => {
  const [selectedLineItems, setSelectedLineItems] = useState<Array<any>>([])
  const { mutate: assignLineItems } = useAssignLineItems(props.swoProjectId?.id, props?.workOrder)

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
              swoProjectId={props.swoProjectId}
              selectedLineItems={selectedLineItems}
              setSelectedLineItems={setSelectedLineItems}
            />
          </ModalBody>
          <ModalFooter p="0">
            <HStack w="100%" justifyContent="end" my="16px" mr="32px" spacing="16px">
              <Button variant="outline" colorScheme="brand" onClick={props.onClose}>
                {t('cancel')}
              </Button>
              <Button
                variant="solid"
                colorScheme="brand"
                onClick={() => {
                  assignLineItems(
                    [
                      ...selectedLineItems.map(s => {
                        return { ...s, isAssigned: true }
                      }),
                    ],
                    {
                      onSuccess: () => {
                        props.onClose()
                      },
                    },
                  )
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
