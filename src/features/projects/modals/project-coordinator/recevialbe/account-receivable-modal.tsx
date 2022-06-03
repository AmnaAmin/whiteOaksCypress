import {
  Text,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Divider,
  Tag,
} from '@chakra-ui/react'
import ProjectDetailsTab from 'features/project-coordinator/project-details/project-details-tab'
import React from 'react'

const AccountReceivableModal: React.FC<{ isOpen: boolean; onClose: () => void }> = props => {
  return (
    <Modal onClose={props.onClose} size="5xl" isOpen={props.isOpen} variant="custom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing="3">
            <Text>ID 2702</Text>
            <Divider orientation="vertical" borderWidth="1px" borderColor="#E2E8F0" height="21px" />
            <Text>2504 STONE RD</Text>
            <Tag variant="subtle" color="#48BB78" bg="#E2EFDF">
              Invoice
            </Tag>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pl="3" pr="3">
          <ProjectDetailsTab id="Receivable" onClose={props.onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AccountReceivableModal
