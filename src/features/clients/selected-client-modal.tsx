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
import { useTranslation } from 'react-i18next'

import { ClientDetailsTabs } from 'pages/client-details'
import { useCallback, useEffect } from 'react'
import { useGetClient } from 'api/clients'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

const Client = ({
  clientId,
  onClose: close,
  isOpen: open,
}: {
  clientId: number
  onClose: () => void
  isOpen: boolean
}) => {
  const { t } = useTranslation()
  const { data: clientDetails, isLoading } = useGetClient(clientId)
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
        <ModalContent w="1210px" rounded={6} borderTop="2px solid #4E87F8" pb='15px'>
          <ModalHeader h="63px" borderBottom="1px solid #E2E8F0" color="gray.600" fontSize={16} fontWeight={500}>
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                  {t('details')}
                </Text>
                {!isLoading && <Text lineHeight="22px" h="22px">
                  {clientDetails?.companyName}
                </Text>}
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody justifyContent="center">
            <Box mt="18px" >
              {isLoading ? <BlankSlate width="60px" /> :
                <ClientDetailsTabs clientModalType="editClient" clientDetails={clientDetails} onClose={onClose} />}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Client
