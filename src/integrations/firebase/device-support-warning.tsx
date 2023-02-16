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
  useBreakpointValue,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ERROR } from 'translation/errors.i18n'

interface DeviceSupportedProps {
  isOpen: boolean
  onClose: any
}

export function DeviceSupported({ isOpen, onClose }: DeviceSupportedProps) {
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'lg',
  })
  const { t } = useTranslation()
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
          color="gray.600"
          fontSize="16px"
          fontStyle="normal"
          mb="5"
        >
          {t(`${ERROR}.alertBrowserWarningTitle`)}
        </ModalHeader>
        <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />

        <ModalBody>
          <Text
            data-testid="device-support-message"
            color="#2D3748"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            mb="2"
          >
            {t(`${ERROR}.alertBrowserWarning`)}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="brand" variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
