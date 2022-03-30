import React from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

interface ConfirmationBoxProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  content: string
}

export function ConfirmationBox({
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
  title,
  content,
}: ConfirmationBoxProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb="9">{title}</ModalHeader>

        <ModalCloseButton rounded="50%" bg="gray.400" color="white" w="5" h="5" _hover={{ bg: 'gray.500' }}>
          <CloseIcon w="2" h="2" />
        </ModalCloseButton>

        <ModalBody>
          <Text>Are you sure you want to {content}?</Text>
        </ModalBody>
        <Flex flexFlow="row-reverse">
          <ModalFooter py="8">
            <Button w="36" variant="outline" mr={3} onClick={onClose} rounded="3">
              No
            </Button>
            <Button onClick={onConfirm} isLoading={isLoading} w="36" colorScheme="red" rounded="3">
              Yes
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  )
}
