import { Details } from 'features/vendor-details/details'
import { useUserProfile } from 'utils/redux-common-selectors'
import { TradeList } from 'features/vendor-details/trades'
import { MarketList } from 'features/vendor-details/markets'
import { Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from '@chakra-ui/react'
import { Box, Stack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { License } from 'features/vendor-details/license'
import { DocumentsCard } from 'features/vendor-details/documents-card'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { Account } from 'types/account.types'
import { VendorProfile, VendorProfileDetailsFormData, VendorProfilePayload } from 'types/vendor.types'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import PcDetails, { useVendorDetails } from 'features/project-coordinator/vendor/details'
import { AuditLogs, AUDIT_LOGS_COLUMNS } from 'features/vendor-details/audit-logs'
import { useTableColumnSettings } from 'utils/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { Card } from 'features/login-form-centered/Card'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import {
  parseVendorAPIDataToFormData,
  parseVendorFormDataToAPIData,
  useVendorProfile,
  useCreateVendorMutation,
  usePaymentMethods,
  useVendorProfileUpdateMutation,
  parseMarketFormValuesToAPIPayload,
  parseTradeFormValuesToAPIPayload,
  useSaveVendorDetails,
  parseLicenseValues,
  createVendorPayload,
  parseDocumentCardsValues,
} from 'utils/vendor-details'
import keys from 'lodash/keys'
import intersection from 'lodash/intersection'
import { DevTool } from '@hookform/devtools'
import { convertDateTimeToServer } from 'utils/date-time-utils'

type Props = {
  vendorProfileData?: VendorProfile
  onClose?: () => void
  refetch?: () => void
  updateVendorId?: (number) => void
  vendorModalType?: string
}

export const VendorProfileTabs: React.FC<Props> = props => {
  const vendorProfileData = props.vendorProfileData
  const VendorType = props.vendorModalType
  const { t } = useTranslation()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { mutate: createVendorProfileDetails } = useCreateVendorMutation()
  const { mutate: updateVendorProfile } = useVendorProfileUpdateMutation()
  const { mutate: saveLicenses } = useSaveVendorDetails('License')
  const { mutate: saveDocuments } = useSaveVendorDetails('Document')

  const { data: paymentsMethods } = usePaymentMethods()
  const [tabIndex, setTabIndex] = useState(0)
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  //   setValue,
  //   reset,
  // } = useForm<VendorProfileDetailsFormData>({
  //   defaultValues: {
  //     ownerName: '',
  //     secondName: '',
  //     businessPhoneNumber: '',
  //     businessPhoneNumberExtension: '',
  //     secondPhoneNumber: '',
  //     secondPhoneNumberExtension: '',
  //     businessEmailAddress: '',
  //     secondEmailAddress: '',
  //     companyName: '',
  //     score: undefined,
  //     status: undefined,
  //     state: undefined,
  //     paymentTerm: undefined,
  //     streetAddress: '',
  //     city: '',
  //     zipCode: '',
  //     capacity: null,
  //     einNumber: '',
  //     ssnNumber: '',
  //   },
  // })
  const formReturn = useForm<VendorProfileDetailsFormData>()
  const { control, clearErrors } = formReturn
  useVendorDetails({ form: formReturn, vendorProfileData })
  // const { tableColumns, resizeElementRef, isLoading } = useTableColumnSettings(AUDIT_LOGS_COLUMNS, TableNames.vendors)
  const submitForm = useCallback(
    async (formData: VendorProfileDetailsFormData) => {
      console.log('submiting...', tabIndex)
      let vendorProfilePayload
      if (vendorProfileData?.id) {
        switch (tabIndex) {
          case 0:
            //detail
            const payload = parseVendorFormDataToAPIData(formData, paymentsMethods, vendorProfileData)
            updateVendorProfile(payload, {
              onSuccess() {
                queryClient.invalidateQueries('vendorProfile')
                toast({
                  title: t('updateProfile'),
                  description: t('updateProfileSuccess'),
                  status: 'success',
                  isClosable: true,
                })
              },
              onError(error: any) {
                toast({
                  title: 'Update Vendor',
                  description: (error.title as string) ?? 'Unable to save project.',
                  status: 'error',
                  isClosable: true,
                })
              },
            })
            break

          case 1:
            //document
            vendorProfilePayload = await parseDocumentCardsValues(formData)
            const updatedObject = {
              documents: vendorProfilePayload,
              agreementSignedDate: convertDateTimeToServer(formData.agreementSignedDate!),
              autoInsuranceExpirationDate: convertDateTimeToServer(formData.autoInsuranceExpDate!),
              coiglExpirationDate: convertDateTimeToServer(formData.coiGlExpDate!),
              coiWcExpirationDate: convertDateTimeToServer(formData.coiWcExpDate!),
            }
            saveDocuments(createVendorPayload(updatedObject, vendorProfileData))
            break

          case 2:
            //license
            vendorProfilePayload = await parseLicenseValues(formData, vendorProfileData?.licenseDocuments)
            saveLicenses(createVendorPayload({ licenseDocuments: vendorProfilePayload }, vendorProfileData))
            break

          case 3:
            //trade
            vendorProfilePayload = parseTradeFormValuesToAPIPayload(formData, vendorProfileData)
            updateVendorProfile(vendorProfilePayload, {
              onSuccess() {
                queryClient.invalidateQueries('vendorProfile')
                toast({
                  title: t('updateTrades'),
                  description: t('updateTradesSuccess'),
                  status: 'success',
                  isClosable: true,
                })
              },
            })
            break

          case 4:
            //Market
            vendorProfilePayload = parseMarketFormValuesToAPIPayload(formData, vendorProfileData)
            updateVendorProfile(vendorProfilePayload, {
              onSuccess() {
                queryClient.invalidateQueries('vendorProfile')
                props.onClose?.()
                toast({
                  title: t('updateMarkets'),
                  description: t('updateMarketsSuccess'),
                  status: 'success',
                  isClosable: true,
                })
              },
            })
            break

          default:
            break
        }
      } else {
        //Create Vendor
        switch (tabIndex) {
          case 4:
            console.log(formData)
            //refactor detail, licse , doc, ...
            const payload = parseVendorFormDataToAPIData(formData, paymentsMethods, vendorProfileData)
            createVendorProfileDetails(payload, {
              onSuccess(res: any) {
                props.updateVendorId?.(res?.data?.id)
                toast({
                  title: 'Create Vendor',
                  description: t('updateProfileSuccess'),
                  status: 'success',
                  isClosable: true,
                })
              },
              onError(error: any) {
                toast({
                  title: 'Create Vendor',
                  description: (error.title as string) ?? 'Unable to create project.',
                  status: 'error',
                  isClosable: true,
                })
              },
            })
            break

          default:
            setTabIndex(i => i + 1)
            break
        }
      }
    },
    [toast, updateVendorProfile, vendorProfileData, paymentsMethods, tabIndex],
  )
  const detailErrors = [
    'businessEmailAddress',
    'capacity',
    'city',
    'companyName',
    'ownerName',
    'paymentTerm',
    'state',
    'streetAddress',
    'zipCode',
    'einNumber',
    'ssnNumber',
  ]
  const documentErrors = ['w9Document']
  const licenseErrors = []
  const tradeError = []
  const marketError = []
  const onError = (errors, e) => {
    errors = keys(errors)
    console.log(errors)
    switch (tabIndex) {
      case 0:
        //detail
        if (!intersection(errors, detailErrors).length) {
          setTabIndex(i => i + 1)
          clearErrors()
        }
        break

      case 1:
        if (!intersection(errors, documentErrors).length) {
          setTabIndex(i => i + 1)
          clearErrors()
        }
        break

      case 2:
        if (!intersection(errors, licenseErrors).length) {
          setTabIndex(i => i + 1)
          clearErrors()
        }
        break

      case 3:
        if (!intersection(errors, tradeError).length) {
          setTabIndex(i => i + 1)
          clearErrors()
        }
        break

      default:
        break
    }
  }
  return (
    <FormProvider {...formReturn}>
      <form onSubmit={formReturn.handleSubmit(submitForm, onError)}>
        <Tabs index={tabIndex} size="md" variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
          <TabList>
            <Tab>{t('details')}</Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              isDisabled={tabIndex <= 0 && !vendorProfileData?.id}
              data-testid="documents"
            >
              {t('documents')}
            </Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              isDisabled={tabIndex <= 1 && !vendorProfileData?.id}
              data-testid="license"
            >
              {t('license')}
            </Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              // isDisabled={tabIndex <= 2 && !vendorProfileData?.id}
              data-testid="tradetab"
            >
              {t('trade')}
            </Tab>
            <Tab
              _disabled={{ cursor: 'not-allowed' }}
              isDisabled={tabIndex <= 3 && !vendorProfileData?.id}
              data-testid="markettab"
            >
              {t('market')}
            </Tab>
            {VendorType === 'detail' ? <Tab>{t('auditLogs')}</Tab> : null}
          </TabList>

          <TabPanels mt="31px">
            <TabPanel p="0px">
              {VendorType === 'editVendor' ? (
                <PcDetails
                  vendorProfileData={vendorProfileData as VendorProfile}
                  // VendorType={VendorType!}
                  onClose={props.onClose}
                  // updateVendorId={props.updateVendorId}
                />
              ) : (
                <Details vendorProfileData={vendorProfileData as VendorProfile} onClose={props.onClose} />
              )}
            </TabPanel>
            <TabPanel p="0px">
              <Box h="100%" w="100%">
                <DocumentsCard
                  VendorType={VendorType!}
                  vendor={vendorProfileData as VendorProfile}
                  onClose={props.onClose}
                />
              </Box>
            </TabPanel>
            <TabPanel p="0px">
              <Box h="100%" w="100%">
                <License vendor={vendorProfileData as VendorProfile} onClose={props.onClose} />
              </Box>
            </TabPanel>
            <TabPanel p="0px">
              <TradeList vendorProfileData={vendorProfileData as VendorProfile} onClose={props.onClose} />
            </TabPanel>
            <TabPanel p="0px">
              <MarketList vendorProfileData={vendorProfileData as VendorProfile} onClose={props.onClose} />
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
