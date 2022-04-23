import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button } from '@chakra-ui/react'
import IdleTimer from 'react-idle-timer'
import { useAuth } from 'utils/auth-context'

const USER_INACTIVITY_TIMEOUT = 1000 * 60 * 30 // 30 mins
const TIME_TO_LOGOUT = 1000 * 60 * 1.5 // 1 minute 30 seconds = 1.5

export const IdleTimeOutModal = () => {
  const { logout, data } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [idleTimer, setIdleTimer] = useState<IdleTimer>()
  const [timeout, setTimeout] = useState(USER_INACTIVITY_TIMEOUT)

  const _onActive = () => {
    setIsTimedOut(false)
  }

  const _onIdle = () => {
    if (data?.token) {
      if (isTimedOut) {
        setShowModal(false)
        if (logout) logout()
      } else {
        if (idleTimer) {
          idleTimer.reset()
          setShowModal(true)
          setTimeout(TIME_TO_LOGOUT)
          setIsTimedOut(true)
        }
      }
    }
  }

  const onClose = () => {
    setShowModal(false)
    setTimeout(USER_INACTIVITY_TIMEOUT)
  }

  return (
    <>
      <IdleTimer
        ref={ref => setIdleTimer(ref)}
        element={document}
        onActive={_onActive}
        onIdle={_onIdle}
        onAction={_onActive}
        debounce={250}
        timeout={timeout}
      />
      <Modal
        isOpen={showModal}
        onClose={onClose}
        isCentered={true}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent rounded="6">
          <ModalHeader
            borderBottom="2px solid #E2E8F0"
            fontWeight={500}
            color="gray.600"
            fontSize="16px"
            fontStyle="normal"
            mb="5"
          >
            Are you still there ?
          </ModalHeader>
          <ModalBody>
            <div>We have not seen activity in a while.</div>
            <div>For your security, we will sign you out in 1 minute 30 seconds.</div>
            <br />
            <div>Select OK to stay signed in.</div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
