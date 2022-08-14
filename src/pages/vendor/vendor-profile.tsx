import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import 'components/translation/i18n'
import { Card } from 'features/login-form-centered/Card'
import PcDetails, { useVendorDetails } from 'features/project-coordinator/vendor/details'
import { Details } from 'features/vendor-details/details'
import { DocumentsCard } from 'features/vendor-details/documents-card'
import { License } from 'features/vendor-details/license'
import { MarketList } from 'features/vendor-details/markets'
import { TradeList } from 'features/vendor-details/trades'
import React, { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'
import { VendorProfile, VendorProfileDetailsFormData } from 'types/vendor.types'
import { useUserProfile } from 'utils/redux-common-selectors'
import {
  createVendorPayload,
  parseCreateVendorFormToAPIData,
  parseDocumentCardsValues,
  parseLicenseValues,
  parseMarketFormValuesToAPIPayload,
  parseTradeFormValuesToAPIPayload,
  parseVendorFormDataToAPIData,
  prepareVendorDocumentObject,
  useCreateVendorMutation,
  usePaymentMethods,
  useSaveVendorDetails,
  useVendorProfile,
} from 'utils/vendor-details'

type Props = {
  vendorProfileData?: VendorProfile
  onClose?: () => void
  refetch?: () => void
  updateVendorId?: (number) => void
  vendorModalType?: string
}
export const validateTrade = trades => {
  const checkedTrades = trades?.filter(t => t.checked)
  if (!(checkedTrades && checkedTrades.length > 0)) {
    return false
  }
  return true
}

export const validateMarket = markets => {
  const checkedMarkets = markets?.filter(t => t.checked)
  if (!(checkedMarkets && checkedMarkets.length > 0)) {
    return false
  }
  return true
}
export const VendorProfileTabs: React.FC<Props> = props => {
  const vendorProfileData = props.vendorProfileData
  const VendorType = props.vendorModalType
  const { t } = useTranslation()
  const toast = useToast()
  const { mutate: saveLicenses } = useSaveVendorDetails('LicenseDetails')
  const { mutate: saveDocuments } = useSaveVendorDetails('DocumentDetails')
  const { mutate: saveProfile } = useSaveVendorDetails('Profile')
  const { mutate: saveTrades } = useSaveVendorDetails('Trades')
  const { mutate: saveMarkets } = useSaveVendorDetails('Markets')
  const { mutate: createVendor } = useCreateVendorMutation()

  const { data: paymentsMethods } = usePaymentMethods()
  const [tabIndex, setTabIndex] = useState(0)
  const [reachTabIndex, setReachTabIndex] = useState(0)
  const formReturn = useForm<VendorProfileDetailsFormData>()
  const { control } = formReturn
  useVendorDetails({ form: formReturn, vendorProfileData })
  const showError = name => {
    toast({
      description: `Atleast one ${name} must be selected`,
      status: 'error',
      isClosable: true,
    })
  }
  useEffect(() => {
    setReachTabIndex(index => (tabIndex > index ? tabIndex : index))
  }, [tabIndex])
  const submitForm = useCallback(
    async (formData: VendorProfileDetailsFormData) => {
      if (vendorProfileData?.id) {
        switch (tabIndex) {
          case 0:
            //detail
            const profilePayload = parseVendorFormDataToAPIData(formData, paymentsMethods, vendorProfileData)
            saveProfile(profilePayload)
            break

          case 1:
            //document
            const documentsPayload = await parseDocumentCardsValues(formData)
            const updatedObject = prepareVendorDocumentObject(documentsPayload, formData)
            saveDocuments(createVendorPayload(updatedObject, vendorProfileData))
            break

          case 2:
            //license
            const licensePayload = await parseLicenseValues(formData, vendorProfileData?.licenseDocuments)
            saveLicenses(createVendorPayload({ licenseDocuments: licensePayload }, vendorProfileData))
            break

          case 3:
            //trade
            if (validateTrade(formData?.trades)) {
              const tradePayload = parseTradeFormValuesToAPIPayload(formData, vendorProfileData)
              saveTrades(tradePayload)
            } else {
              showError('Trade')
            }

            break

          case 4:
            //Market
            if (validateMarket(formData?.markets)) {
              const marketsPayload = parseMarketFormValuesToAPIPayload(formData, vendorProfileData)
              saveMarkets(marketsPayload)
            } else {
              showError('Market')
            }
            break

          default:
            break
        }
      } else {
        //Create Vendor
        switch (tabIndex) {
          case 4:
            //create vendor: market tab
            if (validateMarket(formData?.markets)) {
              const createPayload = await parseCreateVendorFormToAPIData(formData, paymentsMethods, vendorProfileData)
              createVendor(createPayload, {
                onSuccess() {
                  props.onClose?.()
                },
              })
            } else {
              showError('Market')
            }

            break
          case 3:
            //create vendor: trade
            if (validateTrade(formData?.trades)) {
              setTabIndex(i => i + 1)
            } else {
              showError('Trade')
            }
            break

          default:
            setTabIndex(i => i + 1)
            break
        }
      }
    },
    [toast, vendorProfileData, useSaveVendorDetails, paymentsMethods, tabIndex],
  )

  return (
    <FormProvider {...formReturn}>
      <form onSubmit={formReturn.handleSubmit(submitForm)}>
        <Tabs index={tabIndex} size="md" variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
          <TabList>
            <Tab>{t('details')}</Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              isDisabled={reachTabIndex <= 0 && !vendorProfileData?.id}
              data-testid="documents"
            >
              {t('documents')}
            </Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              isDisabled={reachTabIndex <= 1 && !vendorProfileData?.id}
              data-testid="license"
            >
              {t('license')}
            </Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              isDisabled={reachTabIndex <= 2 && !vendorProfileData?.id}
              data-testid="tradetab"
            >
              {t('trade')}
            </Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              isDisabled={reachTabIndex <= 3 && !vendorProfileData?.id}
              data-testid="markettab"
            >
              {t('market')}
            </Tab>
            {VendorType === 'detail' ? <Tab>{t('auditLogs')}</Tab> : null}
          </TabList>

          <TabPanels mt="31px">
            <TabPanel p="0px">
              {tabIndex === 0 ? (
                VendorType === 'editVendor' ? (
                  <PcDetails
                    isActive={tabIndex === 0}
                    vendorProfileData={vendorProfileData as VendorProfile}
                    onClose={props.onClose}
                  />
                ) : (
                  <Details
                    isActive={tabIndex === 0}
                    vendorProfileData={vendorProfileData as VendorProfile}
                    onClose={props.onClose}
                  />
                )
              ) : null}
            </TabPanel>
            <TabPanel p="0px">
              <Box h="100%" w="100%">
                {tabIndex === 1 && (
                  <DocumentsCard
                    isActive={tabIndex === 1}
                    VendorType={VendorType!}
                    vendor={vendorProfileData as VendorProfile}
                    onClose={props.onClose}
                  />
                )}
              </Box>
            </TabPanel>
            <TabPanel p="0px">
              <Box h="100%" w="100%">
                {tabIndex === 2 && (
                  <License
                    isActive={tabIndex === 2}
                    vendor={vendorProfileData as VendorProfile}
                    onClose={props.onClose}
                  />
                )}
              </Box>
            </TabPanel>
            <TabPanel p="0px">
              {tabIndex === 3 && (
                <TradeList
                  isActive={tabIndex === 3}
                  vendorProfileData={vendorProfileData as VendorProfile}
                  onClose={props.onClose}
                />
              )}
            </TabPanel>
            <TabPanel p="0px">
              {tabIndex === 4 && (
                <MarketList
                  isActive={tabIndex === 4}
                  vendorProfileData={vendorProfileData as VendorProfile}
                  onClose={props.onClose}
                />
              )}
            </TabPanel>
            {/* <TabPanel p="0px">
              <Box overflow="auto">
                <AuditLogs
                  isLoading={isLoading}
                  onClose={props.onClose}
                  resizeElementRef={resizeElementRef}
                  projectColumns={tableColumns}
                />
              </Box>
            </TabPanel> */}
            {/* <TabPanel p="0px"></TabPanel> */}
          </TabPanels>
        </Tabs>
      </form>
      <DevTool control={control} />
    </FormProvider>
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
        <Card pb="8px" pt="18px" px="18px">
          <VendorProfileTabs vendorProfileData={vendorProfileData} onClose={props.onClose} refetch={refetch} />
        </Card>
      )}
    </Stack>
  )
}

export default VendorProfilePage
