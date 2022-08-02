import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import { AlertStatusModal } from 'features/projects/alerts/alert-status'
import { ManagedAlertTable } from 'features/projects/alerts/managed-alert-table'
import { TriggeredAlertsTable } from 'features/projects/alerts/triggered-alerts-table'
import { ManagedAlertsModal } from 'features/projects/modals/project-coordinator/managed-alerts-modal'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePlus } from 'react-icons/ai'

const Alerts = () => {
  const { t } = useTranslation()
  const { isOpen: isOpenAlertModal, onClose: onAlertModalClose, onOpen: onAlertModalOpen } = useDisclosure()
  const { isOpen: isOpenNewAlertModal, onClose: onNewAlertModalClose, onOpen: onNewAlertModalOpen } = useDisclosure()
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [alertRow, selectedAlertRow] = useState(true)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  return (
    <Box>
      <Tabs variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
        <TabList whiteSpace="nowrap">
          <Tab>{t('triggeredAlert')}</Tab>
          <Tab>{t('managedAlert')}</Tab>
          <Box w="100%" display="flex" justifyContent="end" position="relative">
            {tabIndex === 0 && (
              <Button colorScheme="brand" onClick={onAlertModalOpen}>
                {t('resolve')}
              </Button>
            )}

            {tabIndex === 1 && (
              <Button colorScheme="brand" onClick={onNewAlertModalOpen} leftIcon={<AiOutlinePlus />}>
                {t('newAlert')}
              </Button>
            )}
          </Box>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <TriggeredAlertsTable
              onRowClick={(e, row) => {
                selectedAlertRow(row.values)
                onAlertModalOpen()
              }}
              ref={tabsContainerRef}
            />
          </TabPanel>
          <TabPanel px={0}>
            <ManagedAlertTable
              onRowClick={(e, row) => {
                selectedAlertRow(row.values)
                onNewAlertModalOpen()
              }}
              ref={tabsContainerRef}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} />
      <ManagedAlertsModal isOpen={isOpenNewAlertModal} onClose={onNewAlertModalClose} alert={alertRow} />
    </Box>
  )
}

export default Alerts
