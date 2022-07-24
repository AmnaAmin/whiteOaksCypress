import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { t } from 'i18next'

import { ClientDetailsTabs } from 'pages/project-cordinator/client-details'
import { useCallback, useEffect } from 'react'
import { Clients } from 'types/client.type'

const Client = ({ clientDetails, onClose: close }: { clientDetails: Clients; onClose: () => void }) => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (clientDetails) {
      onOpen()
    } else {
      onCloseDisclosure()
    }
  }, [onCloseDisclosure, onOpen, clientDetails])
  return (
    <div>
      <Modal size="none" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
          <ModalHeader h="63px" borderBottom="1px solid #E2E8F0" color="gray.600" fontSize={16} fontWeight={500}>
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                  {t('Details')}
                </Text>
                <Text lineHeight="22px" h="22px">
                  ** A Chimney Sweep **
                </Text>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody justifyContent="center">
            <Box mt="18px">
              <ClientDetailsTabs clientModalType="detail" onClose={onClose} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Client
