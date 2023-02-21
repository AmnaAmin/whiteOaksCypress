import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@chakra-ui/react'
import { ConstructionPortalReceiveable } from 'features/recievable/construction-portal-receiveable';
import { EstimatesPortalReceiveable } from 'features/recievable/estimates-portal-receiveable';
import { useState } from 'react';

export const Receivable = () => {
  const [ , setTabIndex ] = useState(0);
  const handleTabsChange = index => {
    setTabIndex(index)
  }
  return (
    <>
      <Tabs variant="enclosed" colorScheme="brand" onChange={handleTabsChange}>
        <TabList>
          <Tab>Construction</Tab>
          <Tab>Estimates</Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding="5px 0px 0px 0px">
            <ConstructionPortalReceiveable />
          </TabPanel>
          <TabPanel h="100vh" padding="5px 0px 0px 0px">
            <EstimatesPortalReceiveable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
