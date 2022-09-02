import { ModalProps } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { useTranslation } from 'react-i18next'
import { TransactionForm } from './transaction-form'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  projectId: string
}

const AddNewTransactionModal: React.FC<Props> = ({ isOpen, onClose, projectId }) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader>{t('newTransaction')}</ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} />

        <ModalBody>
          <TransactionForm onClose={onClose} projectId={projectId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddNewTransactionModal
