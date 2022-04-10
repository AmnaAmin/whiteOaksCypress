import React, { useRef, useState, useCallback } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Box,
  FormErrorMessage,
  VStack,
  ModalCloseButton,
  Progress,
} from '@chakra-ui/react'

import { MdOutlineCancel } from 'react-icons/md'
import { documentTypes, useUploadDocument } from 'utils/vendor-projects'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'
import { Document } from 'types/vendor.types'

import ReactSelect from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'

export const UploadDocumentModal: React.FC<any> = ({ isOpen, onClose, projectId }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [document, setDocument] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<SelectOption | undefined>()
  const [isError, setError] = useState(false)
  const { vendorId } = useUserProfile() as Account
  const { mutate: saveDocument, isLoading } = useUploadDocument()

  const onFileChange = useCallback(
    e => {
      const files = e.target.files
      if (files[0]) {
        setDocument(files[0])
      }
    },
    [setDocument],
  )

  const resetUpload = useCallback(() => {
    setDocument(null)
    setDocumentType(undefined)
    setError(false)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [setDocument, setDocumentType, setError, inputRef])

  const onDocumentTypeChange = useCallback(
    option => {
      if (option) {
        setError(false)
      } else {
        setError(true)
      }
      setDocumentType(option)
    },
    [setError, setDocumentType],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function readFile(event: any) {
    const blob = event.target.result.split(',')[1]
    const doc: Document = {
      documentType: documentType?.value?.toString() || '',
      fileObject: blob,
      fileObjectContentType: document?.type || '',
      fileType: document?.name || '',
      path: document?.name,
      projectId,
      vendorId,
    }
    saveDocument(doc, {
      onSuccess() {
        resetUpload()
        onClose()
      },
    })
  }

  const uploadDocument = useCallback(
    e => {
      if (!documentType) {
        setError(true)
        return
      }
      if (document) {
        const reader = new FileReader()
        reader.addEventListener('load', readFile)
        reader.readAsDataURL(document)
      } else {
        return
      }
    },
    [documentType, document, setError, readFile],
  )

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        resetUpload()
        onClose()
      }}
      size="md"
    >
      <ModalOverlay />
      <ModalContent minW="700px" minH="317px">
        <ModalHeader
          fontSize="16px"
          fontWeight={500}
          fontStyle="normal"
          color="gray.600"
          borderBottom="1px solid #E2E8F0"
          borderTop="2px solid #4E87F8"
        >
          {t('upload')}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />
        {isLoading && <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />}
        <ModalBody>
          <FormControl mt="35px" isInvalid={isError} data-testid="document-type">
            <VStack align="start">
              <FormLabel fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600" htmlFor="documentType">
                {t('documentType')}{' '}
              </FormLabel>
              <HStack spacing="20px" w="100%">
                <Box w={215}>
                  <ReactSelect options={documentTypes} value={documentType} onChange={onDocumentTypeChange} />
                </Box>

                <input
                  aria-labelledby="upload-document-field"
                  type="file"
                  ref={inputRef}
                  style={{ display: 'none' }}
                  onChange={onFileChange}
                ></input>
                {document ? (
                  <Box
                    color="barColor.100"
                    border="1px solid #e2e8f0"
                    // a
                    borderRadius="3px"
                    fontSize="14px"
                  >
                    <HStack spacing="5px" h="37px" padding="10px" align="center">
                      <Box as="span" maxWidth="400px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                        {document.name}
                      </Box>
                      <MdOutlineCancel
                        cursor="pointer"
                        onClick={() => {
                          setDocument(null)
                          if (inputRef.current) inputRef.current.value = ''
                        }}
                      />
                    </HStack>
                  </Box>
                ) : (
                  <Button
                    id="upload-document-field"
                    onClick={e => {
                      if (inputRef.current) {
                        inputRef.current.click()
                      }
                    }}
                    fontSize="14px"
                    fontWeight={500}
                    fontStyle="normal"
                    bg="none"
                    color="#4E87F8"
                  >
                    {t('chooseFile')}{' '}
                  </Button>
                )}
              </HStack>
              {isError && <FormErrorMessage>Document type is required</FormErrorMessage>}
            </VStack>
          </FormControl>
        </ModalBody>
        <ModalFooter display="flex" alignItems="center" borderTop="1px solid #E2E8F0">
          <Button
            variant="ghost"
            onClick={() => {
              resetUpload()
              onClose()
            }}
            fontStyle="normal"
            fontWeight={500}
            fontSize="14px"
            color="gray.700"
          >
            {t('close')}
          </Button>
          <Button
            fontStyle="normal"
            fontWeight={500}
            fontSize="14px"
            onClick={uploadDocument}
            colorScheme="CustomPrimaryColor"
            _hover={{ bg: 'blue' }}
            _focus={{ outline: 'none' }}
            type="submit"
            ml="3"
          >
            {t('save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
