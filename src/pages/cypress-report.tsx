import {  Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'
import ConstructionPreprodCypressReports from 'features/cypress-reports/construction/preprodCypressReports';
import ConstructionDevCypressReports from 'features/cypress-reports/construction/devCypressReports';
import EstimatesPreprodCypressReports from 'features/cypress-reports/estimates/preprodCypressReports';
import EstimatesDevCypressReports from 'features/cypress-reports/estimates/devCypressReports';



const Reports = () =>
  <Tabs variant="enclosed" colorScheme="brand">
    <TabList>
      <Tab>Construction: Pre-Prod </Tab>
      <Tab>Construction: Dev. </Tab>
      <Tab>Estimates: Pre-Prod </Tab>
      <Tab>Estimates: Dev. </Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <ConstructionPreprodCypressReports />
      </TabPanel>
      <TabPanel>
        <ConstructionDevCypressReports />
      </TabPanel>
      <TabPanel>
        <EstimatesPreprodCypressReports />
      </TabPanel>
      <TabPanel>
        <EstimatesDevCypressReports />
      </TabPanel>
    </TabPanels>
  </Tabs>



export default Reports;
