import { Box, Text, useMediaQuery, Heading, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import ConstructionDashboard from 'features/vendor/construction portal/construction-dashboard'
import { EstimatesPortalDashboard } from 'features/vendor/construction portal/estimates-dashboard'
import { t } from 'i18next'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
const Dashboard: React.FC = () => {
  const [isLessThanOrEq320] = useMediaQuery('(max-width: 320px)')
  const { permissions } = useRoleBasedPermissions()
  const isVendorDashboardReadOrEdit = permissions.some(p =>
    ['VENDORDASHBOARD.READ', 'VENDORDASHBOARD.EDIT'].includes(p),
  )
  const isVendorEstDashboardReadOrEdit = permissions.some(p =>
    ['VENDORDASHBOARDEST.READ', 'VENDORDASHBOARDESTEST.EDIT'].includes(p),
  )
  if (isLessThanOrEq320) {
    return (
      <Box mt="50%">
        <Heading as="h3" size="sm">
          Sorry !
        </Heading>
        <Text fontSize="sm">
          {t(
            'Your resolution is reached at a limit, please switch to a better resolution or change your device orientation from vertical to horizontal',
          )}
          .
        </Text>
      </Box>
    )
  }

  return (
    <Tabs variant="enclosed" colorScheme="brand">
      <TabList>
        {isVendorDashboardReadOrEdit && <Tab data-testid="construction-tab">Construction</Tab>}
        {isVendorEstDashboardReadOrEdit && <Tab data-testid="estimates-tab">Estimates</Tab>}
      </TabList>
      <TabPanels h={'100%'}>
        {isVendorDashboardReadOrEdit && (
          <TabPanel h="100vh" padding="5px 0px 0px 0px">
            <ConstructionDashboard />
          </TabPanel>
        )}
        {isVendorEstDashboardReadOrEdit && (
          <TabPanel h="100vh" padding="5px 0px 0px 0px">
            <EstimatesPortalDashboard />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  )
}

export default Dashboard
