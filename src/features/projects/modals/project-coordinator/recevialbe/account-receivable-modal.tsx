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

const AccountReceivableModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  rowData: any
}> = props => {
  const data = props?.rowData

  return (
    <Modal onClose={props.onClose} size="5xl" isOpen={props.isOpen} variant="custom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing="3">
            <Text>ID {data?.id} </Text>
            <Divider orientation="vertical" borderWidth="1px" borderColor="#E2E8F0" height="21px" />
            <Text>{data?.streetAddress}</Text>
            <Tag variant="subtle" color="#48BB78" bg="#E2EFDF">
              Invoice
            </Tag>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="1.7px">
          <ProjectDetailsTab
            style={{ marginLeft: '32px', marginRight: '32px', backgroundColor: '#F7FAFC', height: '430px' }}
            tabVariant="enclosed"
            onClose={props.onClose}
            selectedData={data}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AccountReceivableModal
