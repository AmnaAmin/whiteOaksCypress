import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import { AlertStatusModal } from 'features/alerts/alert-status'
import { ManagedAlertTable } from 'features/alerts/managed-alert-table'
import { TriggeredAlertsTable } from 'features/alerts/triggered-alerts-table'
import { ManagedAlertsModal } from 'features/alerts/managed-alerts-modal'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePlus } from 'react-icons/ai'
import { Card } from 'components/card/card'
import { useManagedAlert } from 'api/alerts'

const Alerts = () => {
  const { t } = useTranslation()
  const { isOpen: isOpenAlertModal, onClose: onAlertModalClose, onOpen: onAlertModalOpen } = useDisclosure()
  const { isOpen: isOpenNewAlertModal, onClose: onNewAlertModalClose, onOpen: onNewAlertModalOpen } = useDisclosure()
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [alertRow, selectedAlertRow] = useState(true)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const { data: managedAlerts, refetch, isLoading } = useManagedAlert()

  return (
    <Box>
      <Tabs variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
        <TabList whiteSpace="nowrap" border="none">
          <Tab>{t('triggeredAlert')}</Tab>
          <Tab>{t('managedAlert')}</Tab>
        </TabList>
        <Card rounded="0px" roundedRight={{ base: '0px', md: '6px' }} roundedBottom="6px" pr={{ base: 0, sm: '15px' }}>
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
              <ManagedAlertTable managedAlerts={managedAlerts} isLoading={isLoading} refetch={refetch}/>
            </TabPanel>
          </TabPanels>
        </Card>
      </Tabs>

      <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} />
      {isOpenNewAlertModal && (
        <ManagedAlertsModal isOpen={isOpenNewAlertModal} onClose={onNewAlertModalClose} selectedAlert={managedAlerts} />
      )}
    </Box>
  )
}

export default Alerts
