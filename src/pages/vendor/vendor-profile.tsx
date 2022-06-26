import { Details } from 'features/vendor-details/details'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useVendorProfile } from 'utils/vendor-details'
import { TradeList } from 'features/vendor-details/trades'
import { MarketList } from 'features/vendor-details/markets'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Box, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { License } from 'features/vendor-details/license'
import { DocumentsCard } from 'features/vendor-details/documents-card'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
// import 'components/translation/i18n'
import { Account } from 'types/account.types'
import { VendorProfile } from 'types/vendor.types'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import PcDetails from 'features/project-coordinator/vendor/details'
import { AuditLogs, AUDIT_LOGS_COLUMNS } from 'features/vendor-details/audit-logs'
import { useTableColumnSettings } from 'utils/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { Card } from 'features/login-form-centered/Card'

type Props = {
  vendorPropfileData?: VendorProfile
  onClose?: () => void
  refetch?: () => void
  vendorModalType?: string
}

export const VendorProfileTabs: React.FC<Props> = props => {
  const vendorProfileData = props.vendorPropfileData
  const VendorType = props.vendorModalType
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
    props.refetch?.()
  }
  const { tableColumns, resizeElementRef, isLoading } = useTableColumnSettings(AUDIT_LOGS_COLUMNS, TableNames.vendors)

  return (
    <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
      <TabList>
        <Tab>{t('details')}</Tab>
        <Tab data-testid="documents">{t('documents')}</Tab>
        <Tab data-testid="license">{t('license')}</Tab>
        <Tab data-testid="tradetab">{t('trade')}</Tab>
        <Tab data-testid="markettab">{t('market')}</Tab>
        {VendorType === 'detail' ? <Tab>{t('auditLogs')}</Tab> : null}
      </TabList>

      <TabPanels mt="31px">
        <TabPanel p="0px">
          {vendorProfileData ? (
            <Details vendorProfileData={vendorProfileData as VendorProfile} onClose={props.onClose} />
          ) : (
            <PcDetails VendorType={VendorType!} onClose={props.onClose} />
          )}
        </TabPanel>
        <TabPanel p="0px">
          <Box h="100%" w="100%">
            <DocumentsCard
              VendorType={VendorType!}
              setNextTab={setNextTab}
              vendor={vendorProfileData as VendorProfile}
              onClose={props.onClose}
            />
          </Box>
        </TabPanel>
        <TabPanel p="0px">
          <Box h="100%" w="100%">
            <License setNextTab={setNextTab} vendor={vendorProfileData as VendorProfile} onClose={props.onClose} />
          </Box>
        </TabPanel>
        <TabPanel p="0px">
          <TradeList vendorProfileData={vendorProfileData as VendorProfile} onClose={props.onClose} />
        </TabPanel>
        <TabPanel p="0px">
          <MarketList vendorProfileData={vendorProfileData as VendorProfile} onClose={props.onClose} />
        </TabPanel>
        <TabPanel p="0px">
          <Box overflow="auto">
            <AuditLogs
              isLoading={isLoading}
              onClose={props.onClose}
              resizeElementRef={resizeElementRef}
              projectColumns={tableColumns}
            />
          </Box>
        </TabPanel>
        <TabPanel p="0px"></TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const VendorProfilePage: React.FC<Props> = props => {
  // const [buttonIndex,setButtonIndex] = useState(0)
  const { vendorId } = useUserProfile() as Account
  const { data: vendorProfileData, isLoading, refetch } = useVendorProfile(vendorId)

  return (
    <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
      {isLoading ? (
        <BlankSlate width="60px" />
      ) : (
        <Card p="18px" px="0">
          <VendorProfileTabs vendorPropfileData={vendorProfileData} onClose={props.onClose} refetch={refetch} />
        </Card>
      )}
    </Stack>
  )
}

export default VendorProfilePage
