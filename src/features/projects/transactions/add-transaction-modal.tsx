import { ModalProps } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { useTranslation } from 'react-i18next'
import { TransactionForm } from './transaction-form'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'>

const AddNewTransactionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader>{t('newTransaction')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <TransactionForm onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddNewTransactionModal
