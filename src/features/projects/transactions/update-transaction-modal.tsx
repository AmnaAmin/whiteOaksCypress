import { ModalProps } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { TransactionForm } from './transaction-form'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  selectedTransactionId: number
  projectId: string
  heading?: string
}

const UpdateTransactionModal: React.FC<Props> = ({ isOpen, onClose, heading, selectedTransactionId, projectId }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader data-testid="update-transaction">{heading}</ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} />
        <ModalBody>
          <TransactionForm onClose={onClose} selectedTransactionId={selectedTransactionId} projectId={projectId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateTransactionModal
