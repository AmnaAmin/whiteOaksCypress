import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@chakra-ui/react'
import { ConstructionPortalPayable } from 'features/payable/construction-portal-payable'
import { EstimatesPortalPayable } from 'features/payable/estimates-portal-payable'
import { useState } from 'react'

export const Payable = () => {
  const [, setTabIndex] = useState(0)
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
            <ConstructionPortalPayable />
          </TabPanel>
          <TabPanel h="100vh" padding="5px 0px 0px 0px">
            <EstimatesPortalPayable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
