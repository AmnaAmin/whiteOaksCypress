import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@chakra-ui/react'
import { useAccountDetails } from 'api/vendor-details'
import { ConstructionPortalReceiveable } from 'features/recievable/construction-portal-receiveable'
import { EstimatesPortalReceiveable } from 'features/recievable/estimates-portal-receiveable'
import { MaintenancePortalReceiveable } from 'features/recievable/maintenance-portal-receiveable'
import { useState } from 'react'

export const Receivable = () => {
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
            <ConstructionPortalReceiveable />
          </TabPanel>
          {isSystemRole && (
            <TabPanel h="100vh" padding="5px 0px 0px 0px">
              <EstimatesPortalReceiveable />
            </TabPanel>
          )}
          {isSystemRole && (
            <TabPanel h="100vh" padding="5px 0px 0px 0px">
              <MaintenancePortalReceiveable />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  )
}
