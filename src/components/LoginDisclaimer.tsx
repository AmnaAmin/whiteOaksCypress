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

interface DisclaimerModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: any
  onConfirm?: () => void
}

export function DisclaimerModal({ isOpen, isLoading = false, onClose, onConfirm }: DisclaimerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size={'5xl'}
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
          {'Disclaimer: Proprietary Software Usage'}
        </ModalHeader>
        <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />
        <ModalBody>
          <Text
            data-testid="disclaimer-message"
            color="#2D3748"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            mb="2"
            p="10px"
            h="450px"
            overflowY={'scroll'}
            paddingLeft={'20px'}
          >
            <p>
              Please read this disclaimer carefully before accessing or using the proprietary software ("Software"). By
              accessing or using the Software, you agree to comply with the terms and conditions outlined in this
              disclaimer. If you do not agree with these terms, refrain from using the Software.
            </p>
            &nbsp;
            <ul>
              <li>
                No Personal Use or Unauthorized Access: The Software is intended solely for authorized users in
                compliance with applicable laws and regulations. It is strictly prohibited to download, install, or use
                the Software for personal use or any other unauthorized purposes. Non-Disclosure Agreement (NDA): The
                Software may be protected by a Non-Disclosure Agreement. Unauthorized disclosure, reproduction,
                distribution, or sharing of any part of the Software is strictly prohibited. Violation of the NDA may
                result in legal consequences.
              </li>
              <li>
                Non-Compete Clause: The use of the Software may be subject to a non-compete clause, which prohibits
                users from developing, distributing, or using similar software or technology that competes with the
                Software. Users must comply with this clause to avoid potential legal ramifications.
              </li>
              <li>
                Compliance with Applicable Laws: Users must use the Software in compliance with all applicable local,
                national, and international laws, rules, and regulations. Any unlawful or unauthorized use of the
                Software is strictly prohibited and may result in legal action.
              </li>
              <li>
                Intellectual Property Rights: The Software and all associated intellectual property rights, including
                but not limited to copyright, trademarks, and patents, are owned by the respective owner(s). Users are
                prohibited from infringing upon these rights or engaging in any unauthorized use or modification of the
                Software.
              </li>
              <li>
                Limitation of Liability: In no event shall the owner(s) of the Software be liable for any direct,
                indirect, incidental, consequential, or special damages arising out of or in connection with the use or
                inability to use the Software.
              </li>
            </ul>
            &nbsp;
            <p>
              By accessing or using the Software, you acknowledge and agree to be bound by the terms and conditions of
              this disclaimer. If you do not agree with any provision of this disclaimer, refrain from accessing or
              using the Software.
            </p>
          </Text>
        </ModalBody>
        <Flex flexFlow="row-reverse">
          <ModalFooter>
            <Button colorScheme="brand" data-testid="confirmation-no" variant="outline" mr={3} onClick={onClose}>
              {'Cancel'}
            </Button>

            <Button
              size="md"
              onClick={onConfirm}
              isLoading={isLoading}
              colorScheme="brand"
              rounded="6px"
              fontSize="14px"
              data-testid="agreeDisclaimer"
              fontWeight={500}
              w="6px"
            >
              {'I Agree'}
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  )
}
