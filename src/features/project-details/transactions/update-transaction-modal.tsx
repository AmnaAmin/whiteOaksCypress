import { ModalProps, useMediaQuery } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { TransactionForm } from './transaction-form'
import { Card } from 'components/card/card'
import { boxShadow } from 'theme/common-style'
import { useEffect, useState } from 'react'

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
        <ModalHeader data-testid="update-transaction">{heading}</ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} />
        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            <TransactionForm
              heading={heading}
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
