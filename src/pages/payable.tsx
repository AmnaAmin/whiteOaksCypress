import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@chakra-ui/react'
import { useAccountDetails } from 'api/vendor-details'
import { ConstructionPortalPayable } from 'features/payable/construction-portal-payable'
import { EstimatesPortalPayable } from 'features/payable/estimates-portal-payable'
import { MaintenancePortalPayable } from 'features/payable/maintenance-portal-payable'
import { useState } from 'react'

export const Payable = () => {
  const [, setTabIndex] = useState(0)
  const { data: account } = useAccountDetails()
  const isSystemRole = account?.authorityList?.[0]?.systemRole
  const handleTabsChange = index => {
    setTabIndex(index)
  }
  return (
    <>
      <Tabs variant="enclosed" colorScheme="brand" onChange={handleTabsChange}>
        <TabList>
          <Tab>Construction</Tab>
          {isSystemRole && <Tab>Estimates</Tab>}
          {isSystemRole && <Tab>Maintenance</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel padding="5px 0px 0px 0px">
            <ConstructionPortalPayable />
          </TabPanel>
          {isSystemRole && (
            <TabPanel h="100vh" padding="5px 0px 0px 0px">
              <EstimatesPortalPayable />
            </TabPanel>
          )}
          {isSystemRole && (
            <TabPanel h="100vh" padding="5px 0px 0px 0px">
              <MaintenancePortalPayable />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  )
}
