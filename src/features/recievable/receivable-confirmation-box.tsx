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
  Box,
  Divider,
  Icon,
  HStack,
  Center,
  Spinner,
} from '@chakra-ui/react'
import { ACCOUNTS } from 'pages/accounts.i18n'
import { useTranslation } from 'react-i18next'
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi'

interface ReceivableConfirmationBoxProps {
  isOpen?: any
  onClose: any
  title: string
  batchData?: any
  isLoading: boolean
}

export function ReceivableConfirmationBox({
  isOpen,
  onClose,
  title,
  batchData,
  isLoading,
}: ReceivableConfirmationBoxProps) {
  const batchRunFailed = batchData?.filter(br => br?.statusId === 2) || []
  const batchRunSuccess = batchData?.filter(br => br?.statusId === 3) || []
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnEsc={false} closeOnOverlayClick={false} size="xl">
      <ModalOverlay />
      <ModalContent rounded="6">
        <ModalHeader
          borderBottom="2px solid #E2E8F0"
          fontWeight={400}
          color="gray.600"
          fontSize="16px"
          fontStyle="normal"
          mb="5"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} />
        <ModalBody>
          {isLoading && batchData.length < 0 ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <>
              {batchRunSuccess?.length > 0 && (
                <Box mb={2}>
                  <Text color="gray.600" fontSize="14px" fontWeight={600} fontStyle="normal" mb="2">
                    {t(`${ACCOUNTS}.batchSuccess`)}
                  </Text>
                  {batchRunSuccess?.length > 0 &&
                    batchRunSuccess?.map(b => (
                      <HStack mb={1}>
                        <Icon as={BiCheckCircle} fontSize="18px" color={'green.400'} />
                        <HStack color="gray.500" fontSize="12px" fontWeight={400}>
                          <Text>{t(`${ACCOUNTS}.batchSuccessMsg`)}</Text>
                          <Text color="#345EA6">
                            {t(`${ACCOUNTS}.projectID`) + 'C' + b.value + '.'}
                            <br></br>
                          </Text>
                        </HStack>
                      </HStack>
                    ))}
                </Box>
              )}
              {batchRunFailed?.length > 0 && batchRunSuccess.length > 0 && <Divider mb={5} mt={5} />}
              {batchRunFailed?.length > 0 && (
                <Box mb={2}>
                  <Text color="gray.600" fontSize="14px" fontWeight={600} fontStyle="normal" mb="2">
                    {t(`${ACCOUNTS}.batchError`)}
                  </Text>
                  {batchRunFailed.length > 0 &&
                    batchRunFailed?.map(b => (
                      <HStack mb={1}>
                        <Icon as={BiErrorCircle} fontSize="18px" color={'red.400'} />
                        <HStack color="gray.500" fontSize="12px" fontWeight={400}>
                          <Text>{batchRunFailed[0].description}</Text>
                          <Text color="#345EA6">
                            {t(`${ACCOUNTS}.projectID`) + b.value + '.'}
                            <br></br>
                          </Text>
                        </HStack>
                      </HStack>
                    ))}
                </Box>
              )}
            </>
          )}
        </ModalBody>

        <Divider mt={3} />
        <ModalFooter>
          <Button colorScheme="brand" variant="solid" onClick={onClose}>
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
