import {
  Box,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Flex,
  FormLabel,
} from '@chakra-ui/react'

import ReactSelect from '../../../../components/form/react-select'

import React, { useState } from 'react'
import { BiXCircle } from 'react-icons/bi'
import { documentTypes } from 'utils/vendor-projects'
import { Button } from 'components/button/button'

export const UploadModal = ({ isOpen, onClose }) => {
  const [value, setValue] = useState<File>()

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setValue(file)
  }

  const UploadFile = () => {
    document.getElementById('file')?.click()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="none">
        <ModalOverlay />
        <ModalContent w="700px" h="326px" rounded={3} borderTop="2px solid #4E87F8">
          <ModalHeader h="63px" borderBottom="1px solid #CBD5E0" color="gray.600" fontSize={16} fontWeight={500}>
            Upload
          </ModalHeader>
          <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />
          <ModalBody justifyContent="center">
            <HStack h="100%" alignItems="center">
              <Box w={215}>
                <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                  Document Type
                </FormLabel>
                <ReactSelect selectProps={{ isLeftBorder: true }} options={documentTypes} />
              </Box>
              <Box pt={7}>
                <Input
                  //  input(type='file', name='videoFile', title = "Choose a video please")
                  p={2}
                  pl={4}
                  color="blue"
                  type="file"
                  css={{
                    '&::-webkit-file-upload-button': {
                      background: 'none',
                      color: 'blue',
                      border: 'none',
                      padding: '8px',
                      display: 'none',
                    },
                  }}
                  onChange={onChange}
                  id="file"
                  hidden
                />

                {value && (
                  <Flex alignItems="center" color="brand.400" ml={4} fontSize="14px" fontWeight={500}>
                    <Text maxW="300px" overflow="hidden" whiteSpace="nowrap" isTruncated>
                      {value.name}
                    </Text>
                    <Button
                      variant="unstyled"
                      px="5"
                      ml="3"
                      _focus={{ outline: 'none' }}
                      onClick={() => setValue(undefined)}
                    >
                      <BiXCircle fontSize="20px" />
                    </Button>
                  </Flex>
                )}

                {!value && (
                  <Button variant="ghost" color="#4E87F8" onClick={UploadFile} fontSize="14px" fontWeight={500}>
                    Choose File
                  </Button>
                )}
              </Box>
            </HStack>
          </ModalBody>

          <ModalFooter borderTop="1px solid #CBD5E0" h="94px">
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              h="48px"
              w="130px"
              fontSize="14px"
              fontWeight={600}
              color="#4E87F8"
              border="1px solid #4E87F8"
            >
              Close
            </Button>
            <Button h="48px" w="130px" fontSize="14px" fontWeight={600} colorScheme="brand" color="white">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
