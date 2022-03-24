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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent rounded="6">
        <ModalHeader
          borderBottom="2px solid #E2E8F0"
          fontWeight={500}
          color="gray.600"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton _focus={{ border: 'none' }} />

        <ModalBody>
          <Text color="gray.500" mb="3">
            Are you sure you want to {content}?
          </Text>
        </ModalBody>
        <Flex flexFlow="row-reverse">
          <ModalFooter py="5">
            <Button
              variant="unstyled"
              mr={5}
              onClick={onClose}
              color="gray.600"
              fontSize="16px"
              fontWeight={500}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              isLoading={isLoading}
              colorScheme="CustomPrimaryColor"
              rounded="8px"
              fontSize="16px"
              fontWeight={500}
            >
              Delete
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  )
}
