import { Box, Button, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { TriggeredAlertsTable } from 'features/project-coordinator/alerts/triggered-alerts'
import { useState } from 'react'

const Alerts = () => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <>
      <Stack w={{ base: '971px', xl: '100%' }}>
        <Tabs variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)} mt="7">
          <TabList>
            <Tab minW={180}>Triggered Alerts</Tab>
            <Tab minW={180}>Managed Alerts</Tab>
            <Box w="100%" display="flex" justifyContent="end" position="relative">
              {tabIndex === 0 && (
                <Button
                  variant="solid"
                  colorScheme="brand"
                  // onClick={resolveTriggered}
                  mb={2}
                >
                  {'Resolve All'}
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
                  {'Resolve All'}
                </Button>
              )}
            </Box>
          </TabList>

          <TabPanels h="100%">
            <TabPanel p="0px" h="100%" mt="7px">
              <Box h="100%">
                <TriggeredAlertsTable />
              </Box>
            </TabPanel>
            <TabPanel p="0px" h="100%" mt="7px">
              <Box h="100%">{/* <ManagedAlertsTable /> */}</Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </>
  )
}

export default Alerts
