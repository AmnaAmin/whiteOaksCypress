import {  Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'
import CypressReport from 'features/cypress-reports/CypressReports';
import DevCypressReport from 'features/cypress-reports/DevCypressReports'



const Reports = () =>
  <Tabs variant="enclosed" colorScheme="brand">
    <TabList>
      <Tab>Report</Tab>
      <Tab>Dev Report</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <CypressReport />
      </TabPanel>
      <TabPanel>
        <DevCypressReport />
      </TabPanel>
    </TabPanels>
  </Tabs>



export default Reports;
