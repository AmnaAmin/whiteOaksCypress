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
import { AlertsDetailsTab } from 'features/project-coordinator/alerts/alerts-details-tab'
import { AlertsNotifyTab } from 'features/project-coordinator/alerts/alerts-notify-tab'
import { useTranslation } from 'react-i18next'

type NewAlertsTypes = {
  isOpen: boolean
  onClose: () => void
  alert: any
}

export const ManagedAlertsModal: React.FC<NewAlertsTypes> = ({ isOpen, onClose, alert }) => {
  const { t } = useTranslation()
  return (
    <>
      {alert && (
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
                    <AlertsDetailsTab />
                  </TabPanel>
                  <TabPanel p={0}>
                    <AlertsNotifyTab onClose={onClose} />
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
