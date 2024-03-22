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
  contentMsg?: string
  idValues?: Array<string>
  extraContent?: string
  showCrossButton?: boolean
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
  contentMsg,
  idValues,
  extraContent,
  showCrossButton,
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
      <ModalContent rounded={3} borderTop="3px solid #345EA6">
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
        {showCrossButton && <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />}
        <ModalBody>
          <Text
            data-testid="confirmation-message"
            color="gray.500"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            mb="2"
          >
            {content}
            <Text color="#345EA6">{extraContent}</Text>
          </Text>
          {idValues?.map(e => (
            <Text>{`${contentMsg} WorkorderID: ${e}`}</Text>
          ))}
        </ModalBody>
        <Flex flexFlow="row-reverse" borderTop="2px solid #E2E8F0">
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
