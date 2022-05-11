import { ModalProps } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { TransactionForm } from './transaction-form'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  selectedTransactionId: number
}

const UpdateTransactionModal: React.FC<Props> = ({ isOpen, onClose, selectedTransactionId }) => {
  // const { transaction } = useTransaction(selectedTransactionIdd);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader>Update Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TransactionForm onClose={onClose} selectedTransactionId={selectedTransactionId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateTransactionModal
