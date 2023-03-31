import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Box,
  Heading,
  Text,
  BoxProps,
  Button,
  Checkbox,
} from '@chakra-ui/react'
import React from 'react'
import { AiOutlineInfoCircle, AiOutlineCheckCircle } from 'react-icons/ai'

const StatusIconWrapper: React.FC<BoxProps> = ({ children }) => {
  return (
    <Box
      display="flex"
      bg="brand.300"
      alignContent="center"
      alignItems="center"
      py="3"
      px="6"
      borderLeftRadius="6px"
      borderLeftWidth="1px"
      borderStyle="solid"
      borderLeftColor="brand.300"
    >
      {children}
    </Box>
  )
}

const MessageWrapper: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box p="5" flex="1" {...props}>
      {children}
    </Box>
  )
}

type AddressVerificationModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  isAddressVerified: boolean
  isLoading: boolean
}

// create chakra modal for address verification confirmation
export const AddressVerificationModal: React.FC<AddressVerificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isAddressVerified,
  isLoading,
}) => {
  const [isContinue, setIsContinue] = React.useState(false)

  const onCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsContinue(e.target.checked)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="transparent" size="auto">
      <ModalOverlay />
      <ModalContent mt="250px">
        <ModalBody minW="400px">
          {isLoading && (
            <Flex>
              <StatusIconWrapper>
                <Spinner colorScheme="white" size="lg" />
              </StatusIconWrapper>
              <MessageWrapper>
                <Heading size="sm" fontWeight="600" mb="2">
                  Address Verification
                </Heading>
                <Text fontSize="14px">Verifying address with USPS</Text>
              </MessageWrapper>
            </Flex>
          )}

          {!isLoading && !isAddressVerified && (
            <Flex>
              <StatusIconWrapper>
                <AiOutlineInfoCircle color="white" fontSize="30px" />
              </StatusIconWrapper>
              <MessageWrapper>
                <Heading size="sm" fontWeight="600" mb="2">
                  Address Verification
                </Heading>
                <Text fontSize="14px">Address verification failed. Please fix the address & try again</Text>
                <Flex justifyContent="end" alignItems="center" mt="15px">
                  <Button
                  data-testid="usps_save"
                    variant="outline"
                    colorScheme="brand"
                    size="sm"
                    mr="4"
                    isDisabled={!isContinue}
                    onClick={() => {
                      onSave()
                      onClose()
                      setIsContinue(false)
                    }}
                  >
                    Save
                  </Button>
                  <Checkbox size="sm" colorScheme="brand" variant="error" onChange={onCheckBoxChange}>
                    Continue with unverified address
                  </Checkbox>
                </Flex>
              </MessageWrapper>
            </Flex>
          )}

          {!isLoading && isAddressVerified && (
            <Flex minW="400px">
              <StatusIconWrapper>
                <AiOutlineCheckCircle color="white" fontSize="30px" />
              </StatusIconWrapper>
              <MessageWrapper display="flex" justifyContent="space-between">
                <Box>
                  <Heading size="sm" fontWeight="600" mb="2">
                    Address Verification
                  </Heading>
                  <Text fontSize="14px">Verified by USPS</Text>
                </Box>
                <Flex justifyContent="end" alignItems="center" ml="7">
                  <Button
                    variant="outline"
                    colorScheme="brand"
                    size="sm"
                    mr="4"
                    onClick={() => {
                      onSave()
                      onClose()
                    }}
                  >
                    Continue
                  </Button>
                </Flex>
              </MessageWrapper>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
