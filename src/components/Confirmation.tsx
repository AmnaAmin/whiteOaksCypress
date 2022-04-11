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
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnEsc={false} closeOnOverlayClick={false} size="lg">
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
          {title}
        </ModalHeader>
        <ModalCloseButton color="gray.700" _focus={{ border: 'none' }} />

        <ModalBody>
          <Text color="gray.500" fontSize="14px" fontWeight={400} fontStyle="normal" mb="2">
            Are you sure you want to {content}?
          </Text>
        </ModalBody>
        <Flex flexFlow="row-reverse">
          <ModalFooter>
            <Button variant="unstyled" mr={5} onClick={onClose}>
              <Text color="gray.600" fontSize="14px" fontWeight={400}>
                Cancel
              </Text>
            </Button>
            <Button
              size="md"
              onClick={onConfirm}
              isLoading={isLoading}
              colorScheme="CustomPrimaryColor"
              rounded="6px"
              fontSize="14px"
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
