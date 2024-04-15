import React from 'react'
import {
  Box,
  Flex,
  Button,
  VStack,
  FormControl,
  FormLabel,
  HStack,
  Grid,
  GridItem,
  Input,
  FormErrorMessage,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { VendorAccountsFormValues, VendorProfile, StripePayment } from 'types/vendor.types'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { datePickerFormat } from 'utils/date-time-utils'
import { VENDORPROFILE } from 'features/vendor-profile/vendor-profile.i18n'
import { getNextMonthFirstDate } from 'components/table/util'
import { NumberInput } from 'components/input/input'
import UserPaymentAccountsTable from 'features/user-management/user-payment-accounts-table'
import { AccountType, VendorFinancialAccountType } from './vendor-payments/vendor-financial-account-type'
import VendorCCAddModal from './vendor-payments/vendor-cc-add-modal'
import { Elements } from '@stripe/react-stripe-js'
import getStripe from 'utils/stripe'
import VendorCCUpdateModal from './vendor-payments/vendor-cc-update-modal'
import { createTableDataForAch, useFetchPaymentMethods, getIsPaymentServiceEnabled } from 'api/payment'
import VendorACHModal from './vendor-payments/vendor-ach-modal'
import SubscriptionRadioGroup from 'components/radio/subscription-radio-group'

type UserProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile
  isActive
  isUserVendorAdmin?: boolean
  isVendorAccountSaveLoading?: boolean
  isModal?: boolean
}
export const VendorAccounts: React.FC<UserProps> = ({ vendorProfileData, onClose, isActive, isUserVendorAdmin = false, isVendorAccountSaveLoading, isModal = true }) => {
  const isPaymentServiceEnabled = getIsPaymentServiceEnabled();
  const formReturn = useFormContext<VendorAccountsFormValues>()
  const { data: stripePaymentMethods } = useFetchPaymentMethods(vendorProfileData?.id);
  const { isOpen: isAccountTypeOpen, onOpen: onAccountTypeOpen, onClose: onAccountTypeClose } = useDisclosure();
  const { isOpen: isCCModalOpen, onOpen: onCCModalOpen, onClose: onCCModalClose } = useDisclosure();
  const { isOpen: isACHModalOpen, onOpen: onACHModalOpen, onClose: onACHModalClose } = useDisclosure();
  const {
    control,
    setValue,
    register,
    watch,
  } = formReturn
  const { t } = useTranslation()
  const isReadOnly = !useRoleBasedPermissions().permissions.some(e =>
    ['VENDOR.EDIT', 'VENDORPROFILE.EDIT', 'ALL'].includes(e),
  )
  const { isAdmin, isVendorManager, isVendor } = useUserRolesSelector()
  const adminRole = isAdmin || isVendorManager
  const watchVoidCheckDate = watch('bankVoidedCheckDate')
  const watchVoidCheckFile = watch('voidedCheckFile')
  const enableSubscriptionField = !!stripePaymentMethods?.stripeResponse?.data?.length;

  const isVoidedCheckChange =
    watchVoidCheckDate !== datePickerFormat(vendorProfileData?.bankVoidedCheckDate) || watchVoidCheckFile
  const resetFields = () => {
    setValue('bankVoidedCheckDate', datePickerFormat(vendorProfileData?.bankVoidedCheckDate!))
    setValue('bankVoidedCheckStatus', vendorProfileData?.bankVoidedCheckStatus)
    setValue('voidedCheckFile', undefined)
  }
  const showDiscardChangeBtn = isVoidedCheckChange && adminRole && vendorProfileData?.id;
  const achPaymentMethod = createTableDataForAch(vendorProfileData) as (StripePayment | undefined);
  const isSubscriptionOn = vendorProfileData?.isSubscriptionOn;
  console.log("🚀 ~ isSubscriptionOn:", isSubscriptionOn)

  const onNewBtnClick = () => onAccountTypeOpen();

  const onAccountTypeConfirm = (selectedValue: string | null) => {
    onAccountTypeClose();
    if (selectedValue === AccountType.CREDIT_CARD) onCCModalOpen();
    else if (selectedValue === AccountType.ACH_BANK) onACHModalOpen();
  };

  return (
    <>
      {isPaymentServiceEnabled && <StripeCreditCardModalForm isReadOnly={isReadOnly} isCCModalOpen={isCCModalOpen} onCCModalClose={onCCModalClose} vendorProfileData={vendorProfileData} />}
      <VendorACHModal isReadOnly={isReadOnly} isOpen={isACHModalOpen} onClose={onACHModalClose} vendorProfileData={vendorProfileData} isActive={isActive} isVendorAccountSaveLoading={isVendorAccountSaveLoading} />
      <VendorFinancialAccountType isOpen={isAccountTypeOpen} onClose={onAccountTypeClose} onConfirm={onAccountTypeConfirm} achPaymentMethod={achPaymentMethod} />
      <Box maxH={'632px'} overflowY={'auto'}>
        <Grid templateColumns={isModal ? "repeat(4,265px)" : "repeat(4, 1fr)"} rowGap="30px" columnGap="16px">
          {isPaymentServiceEnabled && <>
            <GridItem colSpan={4}>
              <FormLabel variant="strong-label" color={'gray.500'}>
                Subscription Details
              </FormLabel>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('monthlySubscriptionFee')}
                </FormLabel>
                <Controller
                  control={control}
                  name="monthlySubscriptionFee"
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <NumberInput
                          datatest-id="monthlySubscriptionFee"
                          value={field.value}
                          disabled={isUserVendorAdmin}
                          onValueChange={values => {
                            const { floatValue } = values
                            field.onChange(floatValue)
                          }}
                          customInput={Input}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )
                  }} />
              </FormControl>
            </GridItem>
            {/* HN | Commenting out the setup fee field for now, eventually it will be use later */}
            {/* <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('setupFee')}
                </FormLabel>
                <Controller
                  control={control}
                  name="oneTimeSetupFee"
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <NumberInput
                          datatest-id="setupFee"
                          value={field.value}
                          disabled={isUserVendorAdmin}
                          onValueChange={values => {
                            const { floatValue } = values
                            field.onChange(floatValue)
                          }}
                          customInput={Input}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )
                  }}
                ></Controller>
              </FormControl>
            </GridItem> */}
            {isSubscriptionOn && <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('billingDate')}
                </FormLabel>
                <Input
                  type="date"
                  {...register('billingDate')}
                  data-testid="billingDate"
                  value={getNextMonthFirstDate()}
                  disabled={true}
                />
              </FormControl>
            </GridItem>}
            <GridItem colSpan={2}>
              <VStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600" w="full">
                <FormLabel variant="strong-label" size="md">
                  <Flex w='full' alignItems={"start"} justifyContent={"center"} direction="column">
                    <Box>
                      {t('subscription')}
                    </Box>
                    {!enableSubscriptionField && <Box>
                      <Text fontSize={"12px"}>
                        (Add a Credit Card to enable subscription)
                      </Text>
                    </Box>}
                  </Flex>
                </FormLabel>
                <SubscriptionRadioGroup formReturn={formReturn} vendorProfileData={vendorProfileData} enableSubscriptionField={enableSubscriptionField && !isVendor} />
              </VStack>
            </GridItem>
          </>}
          <GridItem colSpan={4}>
            <UserPaymentAccountsTable vendorProfile={vendorProfileData} isActive={isActive} isVendorAccountSaveLoading={isVendorAccountSaveLoading} achPaymentMethod={achPaymentMethod} onNewBtnClick={onNewBtnClick} isReadOnly={isReadOnly} />
          </GridItem>
        </Grid>
      </Box>
      <Flex
        height="72px"
        pt="8px"
        id="footer"
        borderTop="1px solid #E2E8F0"
        alignItems="center"
        justifyContent="end"
      >
        <HStack>
          {showDiscardChangeBtn && (
            <Button variant="outline" colorScheme="darkPrimary" onClick={() => resetFields()}>
              {t(`${VENDORPROFILE}.discardChanges`)}
            </Button>
          )}

          {onClose && (
            <Button colorScheme="brand" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}

          {!isReadOnly && <Button type="submit" data-testid="saveVendorAccounts" variant="solid" colorScheme="brand" isLoading={isVendorAccountSaveLoading}>
            {t('save')}
          </Button>}
        </HStack>
      </Flex>
    </>
  )
}

export const StripeCreditCardModalForm = ({ isCCModalOpen, onCCModalClose, vendorProfileData, creditCardData, isReadOnly }: { isCCModalOpen: boolean, onCCModalClose: () => void, vendorProfileData: VendorProfile, creditCardData?: StripePayment | null, isReadOnly: boolean }) => {
  if (!creditCardData) {
    return (
      <Elements stripe={getStripe()}>
        <VendorCCAddModal isReadOnly={isReadOnly} isOpen={isCCModalOpen} onClose={onCCModalClose} vendorProfileData={vendorProfileData} />
      </Elements>
    )
  } else {
    return (
      <Elements stripe={getStripe()}>
        <VendorCCUpdateModal isReadOnly={isReadOnly} isOpen={isCCModalOpen} onClose={onCCModalClose} vendorProfileData={vendorProfileData} creditCardData={creditCardData} />
      </Elements>
    )
  }
};