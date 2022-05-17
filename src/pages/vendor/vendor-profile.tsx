import { Details } from 'features/vendor-details/details'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useVendorProfile } from 'utils/vendor-details'
import { TradeList } from 'features/vendor-details/trades'
import { MarketList } from 'features/vendor-details/markets'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from '@chakra-ui/react'
import { Box, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { License } from 'features/vendor-details/license'
import { DocumentsCard } from 'features/vendor-details/documents-card'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { Account } from 'types/account.types'
import { VendorProfile } from 'types/vendor.types'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

type Props = {
  vendorPropfileData?: VendorProfile
  onClose?: () => void
}

export const VendorProfileTabs: React.FC<Props> = props => {
  const vendorProfileData = props.vendorPropfileData
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  return (
    <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
      <TabList>
        <Tab>{t('details')}</Tab>
        <Tab data-testid="documents">{t('documents')}</Tab>
        <Tab data-testid="license">{t('License')}</Tab>
        <Tab data-testid="tradetab">{t('trade')}</Tab>
        <Tab data-testid="markettab">{t('market')}</Tab>
      </TabList>

      <TabPanels mt="31px">
        <TabPanel p="0px">
          {vendorProfileData && <Details vendorProfileData={vendorProfileData as VendorProfile} />}
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

        <Box as="span" w="100%" justifyContent="end" display="inline-flex">
          {props.onClose && (
            <Button variant="outline" colorScheme="brand" onClick={props.onClose}>
              Cancel
            </Button>
          )}
        </Box>

        {/* <Box>
          <Flex w="100%" h="100px" alignItems="center" justifyContent="end" borderTop="2px solid #E2E8F0" mt="30px">
            {props.onClose && (
              <Button variant="outline" colorScheme="brand" mr="3" onClick={props.onClose}>
                Cancel
              </Button>
            )}
            {tabIndex === 0 && (
              <Button type="submit" data-testid="saveDetails" colorScheme="brand" form="details">
                {t('save')}
              </Button>
            )}

            {tabIndex === 1 && (
              <Button colorScheme="brand" type="submit" data-testid="saveDocumentCards" form="documentForm">
                {t('next')}
              </Button>
            )}
            {tabIndex === 2 && (
              <Button colorScheme="brand" data-testid="saveLicenses" type="submit" form="licenseForm">
                {t('next')}
              </Button>
            )}
            {tabIndex === 3 && (
              <Button
                type="submit"
                colorScheme="brand"
                _focus={{ outline: 'none' }}
                data-testid="saveVendorSkills"
                form="trade"
              >
                {t('save')}
              </Button>
            )}
            {tabIndex === 4 && (
              <Button
                type="submit"
                colorScheme="brand"
                _focus={{ outline: 'none' }}
                data-testid="saveMarkets"
                form="market"
              >
                {t('save')}
              </Button>
            )}
          </Flex>
        </Box> */}
      </TabPanels>
    </Tabs>
  )
}

const VendorProfilePage: React.FC<Props> = props => {
  // const [buttonIndex,setButtonIndex] = useState(0)
  const { vendorId } = useUserProfile() as Account
  const { data: vendorProfileData, isLoading } = useVendorProfile(vendorId)

  return (
    <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
      {isLoading ? (
        <BlankSlate width="60px" />
      ) : (
        <VendorProfileTabs vendorPropfileData={vendorProfileData} onClose={props.onClose} />
      )}
    </Stack>
  )
}

export default VendorProfilePage
