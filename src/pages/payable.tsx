import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@chakra-ui/react'
import { ConstructionPortalPayable } from 'features/payable/construction-portal-payable'
import { EstimatesPortalPayable } from 'features/payable/estimates-portal-payable'
import { MaintenancePortalPayable } from 'features/payable/maintenance-portal-payable'
import { useState } from 'react'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const Payable = () => {
  const [, setTabIndex] = useState(0)
  const { permissions } = useRoleBasedPermissions()
  const isPayableReadOrEditEst = permissions.some(p => ['ESTPAYABLE.READ', 'ESTPAYABLE.EDIT', 'ALL'].includes(p))
  const isPayableReadOrEditConst = permissions.some(p => ['PAYABLE.READ', 'PAYABLE.EDIT', 'ALL'].includes(p))
  const isPayableReadOrEditMaint = permissions.some(p =>
    ['MAINTENANCEPAYABLE.READ', 'MAINTENANCEPAYABLE.EDIT', 'ALL'].includes(p),
  )
  const handleTabsChange = index => {
    setTabIndex(index)
  }
  return (
    <>
      <Tabs variant="enclosed" colorScheme="brand" onChange={handleTabsChange}>
        <TabList>
          {isPayableReadOrEditConst && <Tab>Construction</Tab>}
          {isPayableReadOrEditEst && <Tab>Estimates</Tab>}
          {isPayableReadOrEditMaint && <Tab>Maintenance</Tab>}
        </TabList>
        <TabPanels>
          {isPayableReadOrEditConst && (
            <TabPanel padding="5px 0px 0px 0px">
              <ConstructionPortalPayable />
            </TabPanel>
          )}
          {isPayableReadOrEditEst && (
            <TabPanel h="100vh" padding="5px 0px 0px 0px">
              <EstimatesPortalPayable />
            </TabPanel>
          )}
          {isPayableReadOrEditMaint && (
            <TabPanel h="100vh" padding="5px 0px 0px 0px">
              <MaintenancePortalPayable />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  )
}
