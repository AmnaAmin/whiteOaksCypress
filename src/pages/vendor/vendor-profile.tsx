// Revisit, Separate the vendor profile forms from vendor profile page.

import { Box, Divider, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

import { Card } from 'features/login-form-centered/Card'
import CreateDetails, { useVendorDetails } from 'features/vendor-profile/create-details'
import { UpdateDetails } from 'features/vendor-profile/update-details'
import { DocumentsCard } from 'features/vendor-profile/documents-card'
import { License } from 'features/vendor-profile/license'
import { MarketList } from 'features/vendor-profile/markets'
import { TradeList } from 'features/vendor-profile/trades'
import React, { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'
import { VendorProfile, VendorProfileDetailsFormData } from 'types/vendor.types'
import { useRoleBasedPermissions, useUserProfile, useUserRolesSelector } from 'utils/redux-common-selectors'
import {
  createVendorPayload,
  parseAccountsFormDataToAPIData,
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
} from 'api/vendor-details'
import { useLocation } from 'react-router-dom'
import { VendorProjects } from 'features/vendor-profile/vendor-projects'
import { VendorUsersTab } from 'features/vendors/vendor-users-table'
import { VendorAccounts } from 'features/vendors/vendor-accounts'
import { Messages } from 'features/messages/messages'
import { useVendorSubFormErrors } from './vendor-hooks'
import { TabCustom } from 'features/work-order/work-order-edit'

type Props = {
  vendorId?: number | string | undefined
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

const tabStyle = {
  h: { base: '52px', sm: 'unset' },
}
export const VendorProfileTabs: React.FC<Props> = props => {
  const vendorProfileData = props.vendorProfileData
  const VendorType = props.vendorModalType
  const { isVendor } = useUserRolesSelector()
  const { permissions } = useRoleBasedPermissions()
  const enableVendorAccounts = (permissions.some(p => ['VENDOR.ACCOUNTS.EDIT','ALL'].includes(p)) && vendorProfileData?.id)
  const { t } = useTranslation()
  const toast = useToast()
  const { mutate: saveLicenses } = useSaveVendorDetails('LicenseDetails')
  const { mutate: saveDocuments } = useSaveVendorDetails('DocumentDetails')
  const { mutate: saveProfile } = useSaveVendorDetails('Profile')
  const { mutate: saveTrades } = useSaveVendorDetails('Trades')
  const { mutate: saveMarkets } = useSaveVendorDetails('Markets')
  const { mutate: saveAccounts, isLoading: isSaveAccountLoading } = useSaveVendorDetails('Accounts')
  const { mutate: createVendor } = useCreateVendorMutation()

  const { data: paymentsMethods } = usePaymentMethods()
  const [tabIndex, setTabIndex] = useState<any>(0)
  const [reachTabIndex, setReachTabIndex] = useState(0)
  const formReturn = useForm<VendorProfileDetailsFormData>()
  const { formState: { errors } } = formReturn;
  const { isAccountFormErrors } = useVendorSubFormErrors(errors);

  useVendorDetails({ form: formReturn, vendorProfileData })
  const showError = name => {
    toast({
      description: `Atleast one ${name} must be selected`,
      status: 'error',
      isClosable: true,
      position: 'top-left',
    })
  }
  useEffect(() => {
    setReachTabIndex(index => (tabIndex > index ? tabIndex : index))
  }, [tabIndex])

  const submitForm = useCallback(
    async formData => {
      if (vendorProfileData?.id) {
        switch (tabIndex) {
          case 0:
            //detail
            const profilePayload = parseVendorFormDataToAPIData(formData, vendorProfileData)
            saveProfile(profilePayload)
            break

          case 1:
            //document
            const documentsPayload = await parseDocumentCardsValues(formData)
            const updatedObject = await prepareVendorDocumentObject(documentsPayload, formData)

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

          case 7:
            //Accounts
            const accountsPayload = await parseAccountsFormDataToAPIData(formData, paymentsMethods, vendorProfileData)
            saveAccounts(accountsPayload)
            break

          default:
            break
        }
      } else {
        //Create Vendor
        switch (tabIndex) {
          case 5:
            const createPayload = await parseCreateVendorFormToAPIData(formData, paymentsMethods, vendorProfileData)
            createVendor(createPayload, {
              onSuccess() {
                props.onClose?.()
              },
            })
            break
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

  const { state } = useLocation()

  useEffect(() => {
    if (state) {
      setTabIndex(state)
    }
  }, [state])

  return (
    <FormProvider {...formReturn}>
      <Stack width={{ base: '100%' }}>
        <form onSubmit={formReturn.handleSubmit(submitForm, err => console.log('err..', err))}>
          <Tabs index={tabIndex} variant="enclosed" colorScheme="darkPrimary" onChange={index => setTabIndex(index)}>
            <TabList border="none" w="100%" flexDir={{ base: 'column', sm: 'row' }} height="40px">
              <Tab py={{ base: '14px', sm: '0' }}>{t('details')}</Tab>
              <Tab
                _disabled={{ cursor: 'not-allowed' }}
                isDisabled={reachTabIndex <= 0 && !vendorProfileData?.id}
                data-testid="documents"
                {...tabStyle}
              >
                {t('documents')}
              </Tab>
              <Tab
                _disabled={{ cursor: 'not-allowed' }}
                isDisabled={reachTabIndex <= 1 && !vendorProfileData?.id}
                data-testid="license"
                {...tabStyle}
              >
                {t('license')}
              </Tab>
              <Tab
                _disabled={{ cursor: 'not-allowed' }}
                isDisabled={reachTabIndex <= 2 && !vendorProfileData?.id}
                data-testid="tradetab"
                {...tabStyle}
              >
                {t('trade')}
              </Tab>
              <Tab
                _disabled={{ cursor: 'not-allowed' }}
                isDisabled={reachTabIndex <= 3 && !vendorProfileData?.id}
                data-testid="markettab"
                {...tabStyle}
              >
                {t('market')}
              </Tab>
              {VendorType === 'detail' ? <Tab>{t('auditLogs')}</Tab> : null}
              {!isVendor && vendorProfileData?.id && <Tab>{t('prjt')}</Tab>}
              {!!vendorProfileData?.id && <Tab>Users</Tab>}
              {(enableVendorAccounts) && (
                <TabCustom isError={isAccountFormErrors} isDisabled={reachTabIndex <= 4 && !vendorProfileData?.id} >
                  {t('vendorProfileAccount')}
                </TabCustom>
              )}
              {!isVendor && vendorProfileData?.id && <Tab data-testid="vendor_messages">{t('messages')}</Tab>}
            </TabList>

            <Box py="21px" px="16px" display={{ base: 'block', sm: 'none' }}>
              <Divider borderWidth="1px" color="#E2E8F0" />
            </Box>

            <Card
              pb="8px"
              pt="18px"
              px="18px"
              roundedTopLeft="0px"
              mb={isVendor ? 5 : { base: '4', sm: '0' }}
              width={isVendor ? '1250px' : '100%'}
              borderTopRightRadius="6px"
              roundedBottom="6px"
              marginTop="1.7px"
              marginLeft="1px"
            >
              <TabPanels>
                <TabPanel p="0px" mt="30px">
                  <Box h="680" w="100%">
                    {tabIndex === 0 ? (
                      VendorType === 'editVendor' ? (
                        <CreateDetails
                          isActive={tabIndex === 0}
                          vendorProfileData={vendorProfileData as VendorProfile}
                          onClose={props.onClose}
                        />
                      ) : (
                        <UpdateDetails
                          isActive={tabIndex === 0}
                          vendorProfileData={vendorProfileData as VendorProfile}
                          onClose={props.onClose}
                        />
                      )
                    ) : null}
                  </Box>
                </TabPanel>
                <TabPanel p="0px" mt="30px">
                  <Box h="680" w="100%">
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
                <TabPanel p="0px" mt="30px">
                  <Box h="680" w="100%">
                    {tabIndex === 2 && (
                      <License
                        isActive={tabIndex === 2}
                        vendor={vendorProfileData as VendorProfile}
                        onClose={props.onClose}
                      />
                    )}
                  </Box>
                </TabPanel>
                <TabPanel p="0px" mt="30px">
                  <Box h="680" w="100%" overflow="auto">
                    {tabIndex === 3 && (
                      <TradeList
                        isActive={tabIndex === 3}
                        vendorProfileData={vendorProfileData as VendorProfile}
                        onClose={props.onClose}
                      />
                    )}
                  </Box>
                </TabPanel>
                <TabPanel p="0px" mt="30px">
                  <Box h="680" w="100%">
                    {tabIndex === 4 && (
                      <MarketList
                        isActive={tabIndex === 4}
                        vendorProfileData={vendorProfileData as VendorProfile}
                        onClose={props.onClose}
                      />
                    )}
                  </Box>
                </TabPanel>

                {!isVendor && vendorProfileData?.id && (
                  <TabPanel p="0px">
                    <Box h="710" w="100%">
                      {tabIndex === 5 && (
                        <VendorProjects
                          vendorProfileData={vendorProfileData as VendorProfile}
                          onClose={props.onClose}
                        />
                      )}
                    </Box>
                  </TabPanel>
                )}
                {!!vendorProfileData?.id && (
                  <TabPanel p="0px">
                    <Box h="710px" w="100%" overflow="auto">
                      <VendorUsersTab vendorProfileData={vendorProfileData as VendorProfile} onClose={props.onClose} />
                    </Box>
                  </TabPanel>
                )}

                {(enableVendorAccounts) && (
                  <TabPanel p="0px">
                    <Box h="710" w="100%" overflow="auto">
                      <VendorAccounts
                        isActive={vendorProfileData?.id ? tabIndex === 7 : tabIndex === 5}
                        vendorProfileData={vendorProfileData as VendorProfile}
                        onClose={props.onClose}
                        isUserVendorAdmin={false}
                        isVendorAccountSaveLoading={isSaveAccountLoading}
                      />
                    </Box>
                  </TabPanel>
                )}

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
                {!!vendorProfileData && (
                  <TabPanel p={0}>
                    <Box w="100%" h="710px">
                      <Messages id={vendorProfileData?.id} entity="vendor" value={vendorProfileData} />
                    </Box>
                  </TabPanel>
                )}
              </TabPanels>
            </Card>
          </Tabs>
        </form>
      </Stack>
    </FormProvider>
  )
}

const VendorProfilePage: React.FC<Props> = props => {
  // const [buttonIndex,setButtonIndex] = useState(0)
  const { vendorId } = useUserProfile() as Account
  const { data: vendorProfileData, isLoading, refetch } = useVendorProfile(vendorId)
  return (
    <Stack w="100%" spacing={0}>
      {isLoading ? (
        <BlankSlate width="60px" />
      ) : (
        <VendorProfileTabs vendorProfileData={vendorProfileData} onClose={props.onClose} refetch={refetch} />
      )}
    </Stack>
  )
}

export default VendorProfilePage
