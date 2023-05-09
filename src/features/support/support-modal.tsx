import {
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  useDisclosure,
} from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { SUPPORT } from 'features/support/support.i18n'
import { CreateATicketForm } from 'pages/vendor/create-a-ticket-form'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { boxShadow } from 'theme/common-style'

export type ProjectTypeFormTypes = {
  onClose: () => void
  supportDetail?: any
  isOpen: boolean
  supportPage?: string
}

export const SupportModal: React.FC<ProjectTypeFormTypes> = ({
  onClose: close,
  supportDetail,
  isOpen,
  supportPage,
}) => {
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
  const [isLoading, setLoading] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered variant="custom">
      <ModalOverlay />
      <ModalContent borderTop="2px solid #4E87F8" rounded={0}>
        <ModalHeader borderBottom="1px solid #E2E8F0">
          <FormLabel variant="strong-label" m={0}>
            {supportDetail ? (
              <>
                {t(`${SUPPORT}.id`)} {supportDetail.id} | {t(`${SUPPORT}.editTicket`)}
              </>
            ) : (
              t(`${SUPPORT}.newticket`)
            )}
          </FormLabel>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        {isLoading && <Progress isIndeterminate colorScheme="brand" aria-label="loading" size="xs" />}

        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            <CreateATicketForm
              onClose={onClose}
              supportPage={supportPage}
              supportDetail={supportDetail}
              setLoading={setLoading}
            />
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
