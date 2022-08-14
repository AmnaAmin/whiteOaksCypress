import React from 'react'
import {
  useDisclosure,
  Box,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'

export default {
  title: 'UI/Modal',
}

export const ModalMedium = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = React.useState('md')

  const handleSizeClick = newSize => {
    setSize(newSize)
    onOpen()
  }

  const sizes = ['3xl', '5xl', 'full']

  return (
    <>
      {sizes.map(size => (
        <Button
          onClick={() => handleSizeClick(size)}
          key={size}
          m={4}
          colorScheme="brand"
        >{`Open ${size} Modal`}</Button>
      ))}

      <Modal onClose={onClose} size={size} isOpen={isOpen} variant="custom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box h="400px">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="outline" colorScheme="brand" size="lg">
              Close
            </Button>
            <Button onClick={onClose} variant="solid" colorScheme="brand" size="lg">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

// export const AddressVerfication = () => {
//   return <AddressVerificationModal isOpen={true} onClose={() => {}} />
// }
