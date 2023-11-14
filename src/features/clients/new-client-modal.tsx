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
import React from 'react'
import { ClientDetailsTabs } from 'pages/client-details'
import { CLIENTS } from './clients.i18n'

type NewClientModalType = {
  isOpen: boolean
  onClose: () => void
  setCreatedClientId: (val) => void
  createdClient: any
}

const NewClientModal: React.FC<NewClientModalType> = props => {
  return (
    <Box>
      <Modal
        closeOnOverlayClick={false}
        onClose={() => {
          props.setCreatedClientId(null)
          props.onClose()
        }}
        isOpen={props.isOpen}
        size="none"
      >
        <ModalOverlay />
        <ModalContent w="1190px" rounded={6} borderTop="2px solid #4E87F8" >
          <ModalHeader h="63px" borderBottom="2px solid #E2E8F0">
            <FormLabel variant="strong-label" size="lg">
              {t(`${CLIENTS}.newClient`)}
            </FormLabel>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody bg='#F2F3F4' px='12px'>
            <ClientDetailsTabs
              clientDetails={props.createdClient}
              setCreatedClientId={props.setCreatedClientId}
              onClose={() => {
                props.setCreatedClientId(null)
                props.onClose()
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NewClientModal
