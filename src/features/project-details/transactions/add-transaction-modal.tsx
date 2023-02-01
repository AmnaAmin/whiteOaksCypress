import { ModalProps, useMediaQuery } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { useTranslation } from 'react-i18next'
import { TransactionForm } from './transaction-form'
import { TRANSACTION } from './transactions.i18n'
import { Card } from 'components/card/card'
import { boxShadow } from 'theme/common-style'
import { useState, useEffect } from 'react'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  projectId: string
  projectStatus: string
  screen?: string
}

const AddNewTransactionModal: React.FC<Props> = ({ isOpen, onClose, projectId, projectStatus, screen }) => {
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
        <ModalHeader>{t(`${TRANSACTION}.newTransaction`)}</ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} />

        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            <TransactionForm onClose={onClose} projectId={projectId} projectStatus={projectStatus} screen={screen} />
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddNewTransactionModal
