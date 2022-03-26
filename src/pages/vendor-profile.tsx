import { Details } from '../features/vendor-details/details'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useVendorProfile } from 'utils/vendor-details'
import { TradeList } from '../features/vendor-details/trades'
import { MarketList } from '../features/vendor-details/markets'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Box, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { License } from '../features/vendor-details/license'
import { DocumentsCard } from '../features/vendor-details/documents-card'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { Account } from 'types/account.types'
import { VendorProfile } from 'types/vendor.types'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

const profileTabStyle = {
  fontSize: '16px',
  fontWeight: 600,
  fontStyle: 'normal',
  color: 'gray.500',
}

export const VendorProfilePage: React.FC = props => {
  const { t } = useTranslation()
  const { vendorId } = useUserProfile() as Account
  const { data: vendorProfileData, isLoading } = useVendorProfile(vendorId)
  const [tabIndex, setTabIndex] = useState(0)

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  return (
    <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
      {isLoading ? (
        <BlankSlate width="60px" />
      ) : (
        <Tabs variant="enclosed" index={tabIndex} onChange={index => setTabIndex(index)}>
          <TabList>
            <Tab _selected={{ color: 'white', bg: 'button.300' }} _focus={{ border: 'none' }} sx={profileTabStyle}>
              {t('details')}
            </Tab>
            <Tab
              data-testid="documents"
              _selected={{ color: 'white', bg: 'button.300' }}
              _focus={{ border: 'none' }}
              sx={profileTabStyle}
            >
              {t('documents')}
            </Tab>
            <Tab
              data-testid="license"
              _selected={{ color: 'white', bg: 'button.300' }}
              _focus={{ border: 'none' }}
              sx={profileTabStyle}
            >
              {t('license')}
            </Tab>
            <Tab
              data-testid="tradetab"
              _selected={{ color: 'white', bg: 'button.300' }}
              _focus={{ border: 'none' }}
              sx={profileTabStyle}
            >
              {t('trade')}
            </Tab>
            <Tab
              data-testid="markettab"
              _selected={{ color: 'white', bg: 'button.300' }}
              _focus={{ border: 'none' }}
              sx={profileTabStyle}
            >
              {t('market')}
            </Tab>
          </TabList>

          <TabPanels mt="31px">
            <TabPanel p="0px">
              <Details vendorProfileData={vendorProfileData as VendorProfile} />
            </TabPanel>
            <TabPanel p="0px">
              <Box h="100%" w="100%">
                <DocumentsCard setNextTab={setNextTab} vendor={vendorProfileData as VendorProfile} />
              </Box>
            </TabPanel>
            <TabPanel p="0px">
              <Box h="100%" w="100%">
                <License setNextTab={setNextTab} vendor={vendorProfileData as VendorProfile} />
              </Box>
            </TabPanel>
            <TabPanel p="0px">
              <TradeList vendorProfileData={vendorProfileData as VendorProfile} />
            </TabPanel>
            <TabPanel p="0px">
              <MarketList vendorProfileData={vendorProfileData as VendorProfile} />
            </TabPanel>
            <TabPanel p="0px"></TabPanel>
            <TabPanel p="0px"></TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Stack>
  )
}
