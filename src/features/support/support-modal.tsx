import {
  Box,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { SUPPORT } from 'features/support/support.i18n'
import { CreateATicketForm } from 'pages/vendor/create-a-ticket'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export type ProjectTypeFormTypes = {
  onClose: () => void
  supportDetail?: any
  isOpen: boolean
}

export const SupportModal: React.FC<ProjectTypeFormTypes> = ({ onClose: close, supportDetail, isOpen }) => {
  const { t } = useTranslation()
  const { onOpen, onClose: onCloseDisclosure } = useDisclosure()

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (supportDetail) {
      onOpen()
    } else {
      onCloseDisclosure()
    }
  }, [onCloseDisclosure, onOpen, supportDetail])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent borderTop="2px solid #4E87F8" rounded={0}>
        <ModalHeader borderBottom="1px solid #E2E8F0">
          <FormLabel variant="strong-label" m={0}>
            {supportDetail ? (
              <>
                {t(`${SUPPORT}.id`)} {supportDetail.id} | {t(`${SUPPORT}.editProjectType`)}
              </>
            ) : (
              t(`${SUPPORT}.newticket`)
            )}
          </FormLabel>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody p={0}>
          <Box>
            <CreateATicketForm onClose={onClose} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
