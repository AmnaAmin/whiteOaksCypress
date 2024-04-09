// Revisit, Separate the vendor profile forms from vendor profile page.

import { Box, Divider, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

import { Card } from 'features/login-form-centered/Card'
import CreateDetails, { useVendorDetails } from 'features/vendor-profile/create-details'
import { UpdateDetails } from 'features/vendor-profile/update-details'
import { License } from 'features/vendor-profile/license-vendor-portal'
import { MarketList } from 'features/vendor-profile/markets'
import { TradeList } from 'features/vendor-profile/trades'
import React, { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'
import { VendorProfile, VendorProfileDetailsFormData } from 'types/vendor.types'
import { useUserProfile, useUserRolesSelector } from 'utils/redux-common-selectors'
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
import { ExpirationAlertMessage } from 'features/common/expiration-alert-message'
import { VendorUsersTab } from 'features/vendors/vendor-users-table'
import { useAuth } from 'utils/auth-context'
import { VendorAccounts } from 'features/vendors/vendor-accounts'
import { DocumentsCard } from 'features/vendor-profile/documents-card'

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
    async (formData: VendorProfileDetailsFormData) => {
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
          case 6:
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

  const { data: userInfo } = useAuth()

  const { state } = useLocation()

  useEffect(() => {
    if (state) {
      setTabIndex(state)
    }
  }, [state])

  return (
    <FormProvider {...formReturn}>
      <Stack width={{ base: '100%', lg: '1200px' }}>
        <Box display={{ base: 'none', sm: 'block' }}>
          <ExpirationAlertMessage data={vendorProfileData} tabIndex={tabIndex} />
        </Box>

        <form onSubmit={formReturn.handleSubmit(submitForm)}>
          <Tabs
            index={tabIndex}
            variant="enclosed"
            colorScheme="darkPrimary"
            onChange={index => setTabIndex(index)}
            w="100%"
          >
            <Card
              bg={{ base: 'white', sm: 'transparent' }}
              p={{ base: '12px', sm: '0px !important' }}
              rounded={'6px 6px 0px 0px'}
              boxShadow={{ sm: 'none' }}
              pt="0"
            >
              <Box display={{ base: 'block', sm: 'none' }}>
                <ExpirationAlertMessage data={vendorProfileData} tabIndex={tabIndex} />
              </Box>
              <TabList border="none" w="100%" flexDir={{ base: 'column', sm: 'row' }} height={{ sm: '', lg: '40px' }}>
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
                {!isVendor && <Tab>{t('prjt')}</Tab>}
                {(userInfo?.user as any)?.vendorAdmin ? <Tab>Users</Tab> : null}
                {(userInfo?.user as any)?.vendorAdmin ? <Tab>{t('vendorProfileAccount')}</Tab> : null}
              </TabList>
            </Card>
            <Box pt="21px" bg="white" px="16px" display={{ base: 'block', sm: 'none' }}>
              <Divider borderWidth="1px" color="#E2E8F0" />
            </Box>

            <Card
              pb="8px"
              pt="15px"
              px="18px"
              roundedLeft="0px"
              mt="2px"
              roundedTopRight={{ base: '0px', sm: '8px' }}
              mb={isVendor ? 5 : { base: '4', sm: '0' }}
              width={isVendor ? { base: '100%', lg: 'calc(96vw - var(--sidebar-width))' } : '100%'}
              marginTop="1.7px"
              marginLeft="1px"
            >
              <fieldset disabled={!(userInfo?.user as any)?.vendorAdmin}>
                <Box
                  sx={{
                    'input:disabled': {
                      bg: 'gray.100',
                      color: 'gray.400',
                      opacity: 0.8,
                      cursor: 'not-allowed',
                      borderColor: 'gray.200',
                    },
                    ...(!(userInfo?.user as any)?.vendorAdmin && {
                      'button[type="submit"]:disabled': {
                        display: 'none !important',
                      },
                    }),
                    ...(!(userInfo?.user as any)?.vendorAdmin && {
                      'button[type="submit"]:disabled': {
                        display: 'none !important',
                      },
                    }),
                    ...(!(userInfo?.user as any)?.vendorAdmin && {
                      ':disabled .fileUploader p, .fileUploader button': {
                        color: 'gray.400',
                        bg: 'gray.100',
                      },
                    }),
                    ...(!(userInfo?.user as any)?.vendorAdmin && {
                      '.fileUploader': {
                        bg: 'gray.100',
                        color: 'gray.400',
                        opacity: 0.8,
                        cursor: 'not-allowed',
                        borderColor: 'gray.200',
                      },
                    }),
                    ...(!(userInfo?.user as any)?.vendorAdmin && {
                      '.marketCheckBoxCont .checkboxButton': {
                        cursor: 'not-allowed',
                      },
                    }),
                    ...(!(userInfo?.user as any)?.vendorAdmin && {
                      '.tradeCheckBoxCont .checkboxButton': {
                        cursor: 'not-allowed',
                      },
                    }),
                  }}
                >
                  <TabPanels mt={{ base: '0', sm: '30px' }}>
                    <TabPanel p="0px">
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
                    <TabPanel p="0px" className="tradeCheckBoxCont">
                      {tabIndex === 3 && (
                        <TradeList
                          isActive={tabIndex === 3}
                          vendorProfileData={vendorProfileData as VendorProfile}
                          onClose={props.onClose}
                        />
                      )}
                    </TabPanel>
                    <TabPanel p="0px" className="marketCheckBoxCont">
                      {tabIndex === 4 && (
                        <MarketList
                          isActive={tabIndex === 4}
                          vendorProfileData={vendorProfileData as VendorProfile}
                          onClose={props.onClose}
                        />
                      )}
                    </TabPanel>
                    {(userInfo?.user as any)?.vendorAdmin && (
                      <TabPanel p="0px">
                        <VendorUsersTab
                          vendorProfileData={vendorProfileData as VendorProfile}
                          onClose={props.onClose}
                        />
                      </TabPanel>
                    )}

                    {!isVendor && (
                      <TabPanel p="0px">
                        {tabIndex === 5 && (
                          <VendorProjects vendorProfileData={vendorProfileData} onClose={props.onClose} />
                        )}
                      </TabPanel>
                    )}

                    {(userInfo?.user as any)?.vendorAdmin && (
                      <TabPanel p="0px">
                        <VendorAccounts
                          isActive={tabIndex === 6}
                          vendorProfileData={vendorProfileData as VendorProfile}
                          onClose={props.onClose}
                          isUserVendorAdmin={true}
                          isVendorAccountSaveLoading={isSaveAccountLoading}
                          isModal={false}
                        />
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
                  </TabPanels>
                </Box>
              </fieldset>
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
