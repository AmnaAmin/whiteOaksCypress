import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@chakra-ui/react'
import { useAccountDetails } from 'api/vendor-details'
import { ConstructionPortalReceiveable } from 'features/recievable/construction-portal-receiveable'
import { EstimatesPortalReceiveable } from 'features/recievable/estimates-portal-receiveable'
import { MaintenancePortalReceiveable } from 'features/recievable/maintenance-portal-receiveable'
import { useState } from 'react'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const Receivable = () => {
  const [, setTabIndex] = useState(0)
  const { data: account } = useAccountDetails()
  const isSystemRole = account?.authorityList?.[0]?.systemRole
  const { permissions } = useRoleBasedPermissions()
  const isRecievableReadOrEditEst = permissions.some(p => ['ESTRECEIVABLE.READ', 'ESTRECEIVABLE.EDIT'].includes(p))
  const isRecievableReadOrEditCons = permissions.some(p => ['RECEIVABLE.READ', 'RECEIVABLE.EDIT'].includes(p))
  const handleTabsChange = index => {
    setTabIndex(index)
  }
  return (
    <>
      <Tabs variant="enclosed" colorScheme="brand" onChange={handleTabsChange}>
        <TabList>
          {isRecievableReadOrEditCons && <Tab>Construction</Tab>}
          {isRecievableReadOrEditEst && <Tab>Estimates</Tab>}
          {isSystemRole && <Tab>Maintenance</Tab>}
        </TabList>
        <TabPanels>
          {isRecievableReadOrEditCons && (
            <TabPanel padding="5px 0px 0px 0px">
              <ConstructionPortalReceiveable />
            </TabPanel>
          )}
          {isRecievableReadOrEditEst && (
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
