import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import { AlertStatusModal } from 'features/projects/alerts/alert-status'
import { AlertsTable } from 'features/projects/alerts/alerts-table'
import { NewAlerts } from 'features/projects/alerts/new-alerts'
import { NewAlertsModal } from 'features/projects/alerts/new-alerts-modal'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePlus } from 'react-icons/ai'

const Alerts = () => {
  const { t } = useTranslation()
  const { isOpen: isOpenAlertModal, onClose: onAlertModalClose, onOpen: onAlertModalOpen } = useDisclosure()
  const { isOpen: isOpenNewAlertModal, onClose: onNewAlertModalClose, onOpen: onNewAlertModalOpen } = useDisclosure()
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [alertRow, selectedAlertRow] = useState(true)
  return (
    <Box>
      <Tabs variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
        <TabList whiteSpace="nowrap">
          <Tab>{t('triggeredAlert')}</Tab>
          <Tab>{t('managedAlert')}</Tab>
          <Box w="100%" display="flex" justifyContent="end" position="relative">
            {tabIndex === 0 && (
              <Button colorScheme="brand" onClick={onAlertModalOpen}>
                {t('resloveAll')}
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
            <AlertsTable
              onRowClick={(e, row) => {
                selectedAlertRow(row.values)
                onAlertModalOpen()
              }}
            />
          </TabPanel>
          <TabPanel px={0}>
            <NewAlerts
              onRowClick={(e, row) => {
                selectedAlertRow(row.values)
                onNewAlertModalOpen()
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} />
      <NewAlertsModal isOpen={isOpenNewAlertModal} onClose={onNewAlertModalClose} alert={alertRow} />
    </Box>
  )
}

export default Alerts
