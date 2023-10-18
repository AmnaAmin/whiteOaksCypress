import { ModalProps, useMediaQuery } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'
import { boxShadow } from 'theme/common-style'
import { useState, useEffect } from 'react'
import { InvoiceForm } from './invoice-form'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'>

const InvoiceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('3xl')

  useEffect(() => {
    if (isMobile) {
      setModalSize('sm')
    } else {
      setModalSize('3xl')
    }
  }, [isMobile])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader data-testid="new_transaction">{t(`project.projectDetails.invoice`)}</ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} _focus={{ outline: 'none' }} />
        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            <InvoiceForm />
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default InvoiceModal
