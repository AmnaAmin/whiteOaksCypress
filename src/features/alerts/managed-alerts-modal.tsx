import {
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { AlertsDetailsTab } from 'features/alerts/alerts-details-tab'
import { AlertsNotifyTab } from 'features/alerts/alerts-notify-tab'
import { useTranslation } from 'react-i18next'

type ManagedAlertsTypes = {
  isOpen: boolean
  onClose: () => void
  selectedAlert: any
}

export const ManagedAlertsModal: React.FC<ManagedAlertsTypes> = ({ isOpen, onClose, selectedAlert }) => {
  const { t } = useTranslation()
  console.log('selectedAlert', selectedAlert)
  return (
    <>
      {selectedAlert && (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader borderBottom="1px solid #eee">
              <FormLabel variant="strong-label" size="lg">
                {t('newAlert')}
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
                  <TabPanel p={0}>
                    <AlertsDetailsTab selectedAlert={selectedAlert} isOpen={false} onClose={onClose} />
                  </TabPanel>
                  <TabPanel p={0}>
                    {/* <AlertsNotifyTab selectedAlert = {selectedAlert} onClose={onClose} /> */}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
