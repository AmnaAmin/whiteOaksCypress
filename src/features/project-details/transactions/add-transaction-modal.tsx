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
  currentWorkOrderId?: number
  setCreatedTransaction?: (val) => void
  isVendorExpired?: boolean
}

const AddNewTransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  projectId,
  projectStatus,
  screen,
  currentWorkOrderId,
  setCreatedTransaction,
  isVendorExpired,
}) => {
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
      <ModalContent minH="400px">
        <ModalHeader data-testid="new_transaction">{t(`${TRANSACTION}.newTransaction`)}</ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} _focus={{ outline: 'none' }} />

        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            <TransactionForm
              currentWorkOrderId={currentWorkOrderId}
              onClose={onClose}
              setCreatedTransaction={setCreatedTransaction}
              projectId={projectId}
              projectStatus={projectStatus}
              screen={screen}
              isVendorExpired={isVendorExpired}
            />
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddNewTransactionModal
