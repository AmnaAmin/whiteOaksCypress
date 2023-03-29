import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback, useEffect } from 'react'
import { BiText } from 'react-icons/bi'
import { SignatureTab } from './signature-type-tab'
import { useTranslation } from 'react-i18next'

const SignatureModal = ({
  open,
  onClose: close,
  setSignature,
}: {
  open: boolean
  onClose: () => void
  setSignature: (string) => void
}) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  // const [tabIndex, setTabIndex] = useState(0);

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (open) {
      onOpen()
    } else {
      onCloseDisclosure()
    }
  }, [open, onOpen, onCloseDisclosure])

  return (
    <Modal data-testid="signature-modal" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent h="400px" mt="200px">
        <ModalHeader color="gray.600" fontWeight={500} fontSize="16px" fontStyle="normal">
          {t('addSignature')}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />
        <Divider mb={3} />
        <ModalBody h="50vh">
          <Stack spacing={5}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab
                  // minW={105}
                  _focus={{ outline: 'none' }}
                  pl={0}
                  _selected={{
                    color: '#345EA6',
                    borderBottom: '2.5px solid',
                    borderBottomColor: '#345EA6',
                  }}
                >
                  <BiText size={22} />
                  {t('type')}
                </Tab>
              </TabList>

              <TabPanels mt="31px">
                <TabPanel p="0px">
                  <SignatureTab onClose={onClose} setSignature={setSignature} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SignatureModal
