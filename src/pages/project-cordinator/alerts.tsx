import { Box, Button, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { ManagedAlertsTable } from 'features/project-coordinator/alerts/managed-alerts'
import { TriggeredAlertsTable } from 'features/project-coordinator/alerts/triggered-alerts'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Alerts = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  return (
    <>
      <Stack w={{ base: '971px', xl: '100%' }}>
        <Tabs variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)} mt="7">
          <TabList>
            <Tab minW={200}>{t('triggeredAlerts')}</Tab>
            <Tab minW={200}>{t('managedAlerts')}</Tab>
            <Box w="100%" display="flex" justifyContent="end" position="relative">
              {tabIndex === 0 && (
                <Button
                  variant="solid"
                  colorScheme="brand"
                  // onClick={resolveTriggered}
                  mb={2}
                >
                  {t('resolveAll')}
                </Button>
              )}
              {tabIndex === 1 && (
                <Button
                  // onClick={resolveManaged}
                  color="white"
                  size="md"
                  bg="#4e87f8"
                  _hover={{ bg: '#2A61CE' }}
                  mb={2}
                >
                  {t('resolveAll')}
                </Button>
              )}
            </Box>
          </TabList>

          <TabPanels h="100%">
            <TabPanel p="0px" h="100%" mt="7px">
              <Box h="100%">
                <TriggeredAlertsTable ref={tabsContainerRef} />
              </Box>
            </TabPanel>
            <TabPanel p="0px" h="100%" mt="7px">
              <Box h="100%">
                <ManagedAlertsTable ref={tabsContainerRef} />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </>
  )
}

export default Alerts
