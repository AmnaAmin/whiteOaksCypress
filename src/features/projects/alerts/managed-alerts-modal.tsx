import {
  Button,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type NewAlertsTypes = {
  isOpen: boolean
  onClose: () => void
  alert: any
}

export const NewAlertsModal: React.FC<NewAlertsTypes> = ({ isOpen, onClose, alert }) => {
  const { t } = useTranslation()
  return (
    <>
      {alert && (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader borderBottom="1px solid #eee">
              <FormLabel variant="strong-label" size="lg">
                New Alert
              </FormLabel>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs variant="enclosed" colorScheme="brand">
                <TabList>
                  <Tab>{t('details')}</Tab>
                  <Tab>{t('notify')}</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <p>Details!</p>
                  </TabPanel>
                  <TabPanel>
                    <p>Notify!</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter>
              <Button variant="outline" colorScheme="brand" mr={3}>
                {t('save')}
              </Button>
              <Button colorScheme="brand">{t('next')}</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
