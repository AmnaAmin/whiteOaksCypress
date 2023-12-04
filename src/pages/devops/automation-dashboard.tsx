import { Box, Button } from '@chakra-ui/react'
import {  Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'

import DBRestoreWorkflow from '../../features/automation/db_restore'

const AutomationDashboard = () => {
  const onButtonClick = () => {
    // Replace 'yourURL' with the actual URL you want to navigate to
    const urlToNavigate = 'https://cloudwatch.amazonaws.com/dashboard.html?dashboard=constructionDashboard&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTU4MzU4NTg2ODgxNyIsIlUiOiJ1cy1lYXN0LTFfRWlKeDBiTWdWIiwiQyI6IjRiZ29ndTNpaTR2cDh1bDIwMG5ka2ZzMDEwIiwiSSI6InVzLWVhc3QtMTpjZThiZjAxMi0yYWUzLTQ2NjUtYWFkZC01YTE1ZDg2NjgyYTMiLCJPIjoiYXJuOmF3czppYW06OjU4MzU4NTg2ODgxNzpyb2xlL3NlcnZpY2Utcm9sZS9DV0RCU2hhcmluZy1SZWFkT25seUFjY2Vzcy0yS0JGREJDVyIsIk0iOiJVc3JQd1NpbmdsZSJ9';

    // Open a new tab with the specified URL
    window.open(urlToNavigate, '_blank');
  };

  return (
    <Box>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <Button onClick={onButtonClick} colorScheme="brand" fontSize="14px" minW={'140px'}>
      CloudWatch Dashboard
    </Button>
    </div>

    <Tabs variant="enclosed" colorScheme="brand">
    <TabList>
      <Tab>Restore DB</Tab>
      <Tab>Merge Window</Tab>
      <Tab>Infra Deployment</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
      <DBRestoreWorkflow />
      </TabPanel>
      <TabPanel>
        <h1>in progress</h1>
      </TabPanel>
      <TabPanel>
      <h1>in progress</h1>
      </TabPanel>
    </TabPanels>
  </Tabs>
    
    </Box>
  )

  
}

export default AutomationDashboard