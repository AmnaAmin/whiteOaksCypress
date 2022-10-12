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
import React, { useState } from 'react'
import { useClients } from 'api/clients'
import { ClientDetailsTabs } from 'pages/client-details'

export const NewVendorTabs: React.FC<{ onClose: () => void }> = props => {
  const [clientId, setClientId] = useState(0)
  const { data: clients, refetch } = useClients()

  return (
    <ClientDetailsTabs
      clientModalType="editClient"
      clientDetails={clientId ? clients : undefined}
      refetch={refetch}
      onClose={props.onClose}
      updateClientId={setClientId}
    />
  )
}

type NewClientModalType = {
  isOpen: boolean
  onClose: () => void
}

const NewClientModal: React.FC<NewClientModalType> = props => {
  return (
    <Box>
      <Modal onClose={props.onClose} isOpen={props.isOpen} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb="5px" borderBottom="2px solid #E2E8F0">
            <FormLabel variant="strong-label" size="lg">
              {t('New Client')}
            </FormLabel>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody>
            <ClientDetailsTabs
              onClose={props.onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NewClientModal
