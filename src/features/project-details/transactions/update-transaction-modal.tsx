import { ModalProps } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { TransactionForm } from './transaction-form'
import { Card } from 'components/card/card'
import { boxShadow } from 'theme/common-style'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  selectedTransactionId: number
  projectId: string
  heading?: string
  projectStatus: string
}

const UpdateTransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  heading,
  selectedTransactionId,
  projectId,
  projectStatus,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader data-testid="update-transaction">{heading}</ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} />
        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            <TransactionForm
              onClose={onClose}
              selectedTransactionId={selectedTransactionId}
              projectId={projectId}
              projectStatus={projectStatus}
            />
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateTransactionModal
