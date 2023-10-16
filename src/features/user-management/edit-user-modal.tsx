import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { UserForm } from 'types/user.types'
import { UserManagementForm } from './user-management-form'
import { USER_MANAGEMENT } from './user-management.i8n'

type EditUser = {
  isOpen: boolean
  onClose: () => void
  user?: UserForm
  tabIndex?: number
}

export const EditUserModal: React.FC<EditUser> = ({ user, isOpen, onClose, tabIndex }) => {
  const { t } = useTranslation()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom="1px solid #E2E8F0" fontSize="16px" fontWeight={500} color="#4A5568">
            {user ? (user?.authorities?.[0] ?? 'Edit') + ' User' : t(`${USER_MANAGEMENT}.modal.newUser`)}
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <UserManagementForm user={user} onClose={onClose} tabIndex={tabIndex} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
