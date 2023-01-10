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
  useBreakpointValue,
} from '@chakra-ui/react'

interface ConfirmationBoxProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: any
  onConfirm?: () => void
  title: string
  content: string
  yesButtonText?: string
  showNoButton?: boolean
}

export function ConfirmationBox({
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
  title,
  content,
  yesButtonText = 'Yes',
  showNoButton = true,
}: ConfirmationBoxProps) {
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'lg',
  })
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent rounded="6">
        <ModalHeader
          borderBottom="2px solid #E2E8F0"
          fontWeight={500}
          color="#2D3748"
          fontSize="16px"
          fontStyle="normal"
          mb="5"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />

        <ModalBody>
          <Text
            data-testid="confirmation-message"
            color="#2D3748"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            mb="2"
          >
            {content}
          </Text>
        </ModalBody>
        <Flex flexFlow="row-reverse">
          <ModalFooter>
            {showNoButton && (
              <Button colorScheme="brand" data-testid="confirmation-no" variant="outline" mr={3} onClick={onClose}>
                No
              </Button>
            )}
            <Button
              size="md"
              onClick={onConfirm}
              isLoading={isLoading}
              colorScheme="brand"
              rounded="6px"
              fontSize="14px"
              data-testid="confirmation-yes"
              fontWeight={500}
              w="6px"
            >
              {yesButtonText}
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  )
}
