import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@chakra-ui/react'
import { ConstructionPortalReceiveable } from 'features/recievable/construction-portal-receiveable'
import { EstimatesPortalReceiveable } from 'features/recievable/estimates-portal-receiveable'
import { MaintenancePortalReceiveable } from 'features/recievable/maintenance-portal-receiveable'
import { useState } from 'react'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const Receivable = () => {
  const [, setTabIndex] = useState(0)
  const { permissions } = useRoleBasedPermissions()
  const isRecievableReadOrEditEst = permissions.some(p =>
    ['ESTRECEIVABLE.READ', 'ESTRECEIVABLE.EDIT', 'ALL'].includes(p),
  )
  const isRecievableReadOrEditCons = permissions.some(p => ['RECEIVABLE.READ', 'RECEIVABLE.EDIT', 'ALL'].includes(p))
  const isPayableReadOrEditMaint = permissions.some(p =>
    ['MAINTENANCERECEIVABLE.READ', 'MAINTENANCERECEIVABLE.EDIT', 'ALL'].includes(p),
  )
  const handleTabsChange = index => {
    setTabIndex(index)
  }
  return (
    <>
      <Tabs variant="enclosed" colorScheme="brand" onChange={handleTabsChange}>
        <TabList>
          {isRecievableReadOrEditCons && <Tab>Construction</Tab>}
          {isRecievableReadOrEditEst && <Tab>Estimates</Tab>}
          {isPayableReadOrEditMaint && <Tab>Maintenance</Tab>}
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
          {isPayableReadOrEditMaint && (
            <TabPanel h="100vh" padding="5px 0px 0px 0px">
              <MaintenancePortalReceiveable />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  )
}
