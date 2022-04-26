import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent as ChakraModalContent,
  ModalBody as ChakraModalBody,
  ModalHeader as ChakraModalHeader,
  ModalCloseButton as ChakraModalCloseButton,
  ModalFooter as ChakraModalFooter,
  ModalProps,
  ModalContentProps,
  ModalBodyProps,
  ModalHeaderProps,
  ModalFooterProps,
} from '@chakra-ui/react'

const Modal: React.FC<ModalProps> = props => {
  return <ChakraModal {...props}>{props.children}</ChakraModal>
}

const ModalContent: React.FC<ModalContentProps> = props => {
  return (
    <ChakraModalContent rounded="0" borderTopWidth="3px" borderStyle="solid" borderTopColor="brand.300" {...props}>
      {props.children}
    </ChakraModalContent>
  )
}

const ModalBody: React.FC<ModalBodyProps> = props => {
  return (
    <ChakraModalBody px="24px" py="15px" {...props}>
      {props.children}
    </ChakraModalBody>
  )
}

const ModalHeader: React.FC<ModalHeaderProps> = props => {
  return (
    <ChakraModalHeader
      color="gray.600"
      fontWeight="500"
      fontSize="16px"
      px="24px"
      py="20px"
      borderBottom="1px solid #eee"
      {...props}
    >
      {props.children}
    </ChakraModalHeader>
  )
}

const ModalFooter: React.FC<ModalFooterProps> = props => {
  return (
    <ChakraModalFooter px="24px" py="17px" borderTop="1px solid #eee" {...props}>
      {props.children}
    </ChakraModalFooter>
  )
}

const ModalCloseButton: React.FC = props => {
  return (
    <ChakraModalCloseButton fontSize="12px" top="4" _focus={{ outline: 'none' }} {...props}>
      {props.children}
    </ChakraModalCloseButton>
  )
}

export { Modal, ModalOverlay, ModalBody, ModalContent, ModalHeader, ModalCloseButton, ModalFooter }
