import { Box, Button, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import { ManagedAlertTable } from 'features/alerts/managed-alert-table'
import { Notifications } from 'features/alerts/view-notifications'
import { ManagedAlertsModal } from 'features/alerts/managed-alerts-modal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'
import { useManagedAlert } from 'api/alerts'
import { BiBookAdd } from 'react-icons/bi'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

const Alerts = () => {
  const { t } = useTranslation()
  const { isOpen: isOpenNewAlertModal, onClose: onNewAlertModalClose, onOpen: onNewAlertModalOpen } = useDisclosure()
  const [tabIndex, setTabIndex] = useState<number>(0)
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('ALERT.READ')
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
            {!isReadOnly && tabIndex === 1 && (
              <Button colorScheme="brand" onClick={onNewAlertModalOpen} leftIcon={<Icon boxSize={4} as={BiBookAdd} />}>
                {t('newAlert')}
              </Button>
            )}
          </Box>
          <TabPanels>
            <TabPanel px={0}>
              <Notifications />
            </TabPanel>
            <TabPanel px={0}>
              <ManagedAlertTable
                managedAlerts={managedAlerts && managedAlerts?.length > 1 ? managedAlerts : []}
                isLoading={isLoading}
                refetch={refetch}
                isReadOnly={isReadOnly}
              />
            </TabPanel>
          </TabPanels>
        </Card>
      </Tabs>

      {isOpenNewAlertModal && (
        <ManagedAlertsModal isOpen={isOpenNewAlertModal} onClose={onNewAlertModalClose} selectedAlert={null} />
      )}
    </Box>
  )
}

export default Alerts
