import {
  Box,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Button,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { VendorProfile, VendorProfileDetailsFormData, preventNumber } from 'types/vendor.types'
import { useStates } from 'api/pc-projects'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import {
  parseMarketAPIDataToFormValues,
  parseTradeAPIDataToFormValues,
  parseVendorAPIDataToFormData,
  PaymentMethods,
  useMarkets,
  usePaymentMethods,
  useTrades,
  useVendorNext,
} from 'api/vendor-details'
import { documentStatus, documentScore, portalAccess, useDocumentStatusSelectOptions } from 'api/vendor-projects'
import first from 'lodash/first'
import NumberFormat from 'react-number-format'
import { CustomInput, CustomRequiredInput } from 'components/input/input'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { validateWhitespace } from 'api/clients'

const validateTelePhoneNumber = (number: string): boolean => {
  return number ? number.match(/\d/g)?.length === 10 : false
}

const CreateVendorDetail: React.FC<{
  onClose?: () => void
  vendorProfileData: VendorProfile
  isActive: boolean
}> = ({ onClose, vendorProfileData, isActive }) => {
  const { t } = useTranslation()

  const { stateSelectOptions } = useStates()
  const {
    formState: { errors },
    control,
    register,
    setValue,
  } = useFormContext<VendorProfileDetailsFormData>()
  const { disableDetailsNext } = useVendorNext({ control })

  const { isFPM } = useUserRolesSelector()

  const capacityError = useWatch({ name: 'capacity', control })

  // Set Document Status dropdown if Status is Expired
  const [statusOptions, setStatusOptions] = useState<any>([])
  const documentStatusSelectOptions = useDocumentStatusSelectOptions(vendorProfileData)
  const { permissions } = useRoleBasedPermissions()
  const isReadOnly = permissions?.includes('VENDOR.READ')

  useEffect(() => {
    if (vendorProfileData?.status === 15) {
      setStatusOptions(documentStatusSelectOptions)
    } else {
      setStatusOptions(documentStatus)
    }
  })

  return (
    <Stack spacing={3}>
      <Box overflow="auto">
        <HStack spacing="16px">
          <FormControl w="215px" isInvalid={!!errors.companyName}>
            <FormLabel variant="strong-label" size="md">
              {t('businessName')}
            </FormLabel>
            <Input
              type="text"
              id="companyName"
              variant="required-field"
              {...register('companyName', {
                required: isActive && 'This is required',
                validate: {
                  whitespace: validateWhitespace,
                },
                onChange: e => {
                  setValue('companyName', e.target.value)
                },
              })}
              size="md"
              isDisabled={isReadOnly}
            />
            <FormErrorMessage pos="absolute">{errors.companyName && errors.companyName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px" isInvalid={!!errors.status}>
            <FormLabel variant="strong-label" size="md">
              {t('status')}
            </FormLabel>
            <Controller
              control={control}
              name="status"
              rules={{ required: isActive && 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    options={statusOptions}
                    {...field}
                    selectProps={{ isBorderLeft: true }}
                    isDisabled={isReadOnly}
                  />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
          <FormControl w="215px" isInvalid={!!errors.score}>
            <FormLabel variant="strong-label" size="md">
              {t('score')}
            </FormLabel>
            <Controller
              control={control}
              name="score"
              rules={{ required: isActive && 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    options={documentScore}
                    {...field}
                    selectProps={{ isBorderLeft: true }}
                    isDisabled={isReadOnly}
                  />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>

          <FormControl w="215px" isInvalid={!!errors.enableVendorPortal} display="none">
            <FormLabel variant="strong-label" size="md">
              {t('portalAccess')}
            </FormLabel>
            <Controller
              control={control}
              name="enableVendorPortal"
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    options={portalAccess}
                    {...field}
                    isDisabled={isReadOnly}
                    selectProps={{ isBorderLeft: true }}
                  />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </HStack>

        <Grid templateColumns="repeat(4,215px)" rowGap="30px" columnGap="16px" mt="30px">
          <GridItem>
            <FormControl isInvalid={!!errors.streetAddress}>
              <FormLabel variant="strong-label" size="md">
                {t('streetAddress')}
              </FormLabel>
              <Input
                type="text"
                data-testid="streetAddress"
                {...register('streetAddress', {
                  required: isActive && 'This is required',
                  validate: {
                    whitespace: validateWhitespace,
                  },
                  onChange: e => {
                    setValue('streetAddress', e.target.value)
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isReadOnly}
              />
              <FormErrorMessage pos="absolute">{errors.streetAddress?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.city}>
              <FormLabel variant="strong-label" size="md">
                {t('city')}
              </FormLabel>
              <Input
                type="text"
                {...register('city', {
                  required: isActive && 'This is required',
                  validate: {
                    whitespace: validateWhitespace,
                  },
                  onChange: e => {
                    setValue('city', e.target.value)
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                data-testid="vendorCity"
                isDisabled={isFPM}
                onKeyPress={preventNumber}
              />
              <FormErrorMessage pos="absolute">{errors.city?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.state}>
              <FormLabel variant="strong-label" size="md">
                {t('state')}
              </FormLabel>
              <Controller
                control={control}
                name="state"
                rules={{ required: isActive && 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      menuPosition="fixed"
                      options={stateSelectOptions}
                      {...field}
                      selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                      isDisabled={isReadOnly}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.zipCode}>
              <FormLabel variant="strong-label" size="md">
                {t('zip')}
              </FormLabel>
              <Input
                type="number"
                {...register('zipCode', {
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('zipCode', e.target.value)
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                data-testid="vendorZipCode"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.zipCode?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(3,215px)" rowGap="30px" columnGap="16px" mt="30px">
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.businessEmailAddress}>
              <FormLabel variant="strong-label" size="md">
                Business Email
              </FormLabel>
              <Input
                type="email"
                data-testid="businessEmailAddress"
                {...register('businessEmailAddress', {
                  onChange: e => {
                    setValue('businessEmailAddress', e.target.value)
                  },
                })}
                variant="required-field"
                size="md"
                isDisabled={isReadOnly}
              />
              <FormErrorMessage pos={'absolute'}>{errors.businessEmailAddress?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.businessPhoneNumber} h="70px">
              <FormLabel variant="strong-label" size="md" noOfLines={1}>
                {t('businessPhoneNo')}
              </FormLabel>
              <Controller
                control={control}
                rules={{
                  required: isActive && 'This is required',
                  validate: (number: string) => validateTelePhoneNumber(number),
                }}
                name="businessPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="businessphoneno"
                        value={field.value}
                        customInput={CustomRequiredInput}
                        format="(###)-###-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                        isDisabled={isReadOnly}
                      />
                      <FormErrorMessage>{fieldState.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl h="70px">
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input
                {...register('businessPhoneNumberExtension', {
                  onChange: e => {
                    setValue('businessPhoneNumberExtension', e.target.value)
                  },
                })}
                w="121px"
                variant="outline"
                size="md"
                isDisabled={isReadOnly}
                type="number"
              />
            </FormControl>
          </GridItem>
        </Grid>

        <HStack spacing="4" my="30px" display="none">
          <Box w="215px" display="none">
            <FormControl h="70px">
              <FormLabel variant="strong-label" size="md" noOfLines={1}>
                {t('secondaryPhoneNo')}
              </FormLabel>
              <Controller
                control={control}
                name="secondPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        value={field.value}
                        customInput={CustomInput}
                        format="(###)-###-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                        isDisabled={isReadOnly}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </Box>
          <Box w="109px" top="9px" pos="relative" display="none">
            <FormControl h="90px">
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input
                {...register('secondPhoneNumberExtension')}
                type="number"
                w="121px"
                variant="outline"
                size="md"
                isDisabled={isReadOnly}
              />
            </FormControl>
          </Box>
        </HStack>

        <Grid templateColumns="repeat(4,215px)" rowGap="30px" columnGap="16px" mt="30px">
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.ownerName}>
              <FormLabel variant="strong-label" size="md">
                {t('ownersName')}
              </FormLabel>
              <Input
                type="text"
                id="ownerName"
                data-testId="ownersName"
                variant="required-field"
                {...register('ownerName', {
                  required: isActive && 'This is required',
                  validate: {
                    whitespace: validateWhitespace,
                  },
                  onChange: e => {
                    setValue('ownerName', e.target.value)
                  },
                })}
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.ownerName && errors.ownerName?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.capacity}>
              <FormLabel variant="strong-label" size="md">
                {t('capacity')}
              </FormLabel>
              <Input
                type="number"
                {...register('capacity', {
                  required: isActive && 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isReadOnly}
              />
              <FormErrorMessage pos="absolute">{errors.capacity?.message}</FormErrorMessage>
            </FormControl>
            <Text fontSize="14px" color="red">
              {capacityError! > 500 ? 'capacity should not be greater than 500' : ''}
            </Text>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
        </Grid>

        <HStack spacing="16px" mt="30px" display="none">
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryContact')}
            </FormLabel>

            <Input type="text" {...register('secondName')} variant="outline" size="md" isDisabled={isReadOnly} />
          </FormControl>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryEmail')}
            </FormLabel>

            <Input
              type="email"
              {...register('secondEmailAddress', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email',
                },
              })}
              variant="outline"
              size="md"
              isDisabled={isReadOnly}
            />
          </FormControl>
          <GridItem></GridItem>
        </HStack>

        <Box>
          <Stack alignItems="center" direction="row" spacing="16px">
            {/* hiding payment terms */}
            <Box w="215px" display={'none'}>
              <FormControl isInvalid={!!errors.paymentTerm}>
                <FormLabel variant="strong-label" size="md">
                  {t('paymentTerms')}
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentTerm"
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        options={PAYMENT_TERMS_OPTIONS}
                        menuPosition="fixed"
                        maxMenuHeight="100%"
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        isDisabled={isReadOnly}
                      />
                      <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Flex
        height="72px"
        pt="8px"
        mt="30px"
        id="footer"
        borderTop="1px solid #E2E8F0"
        alignItems="center"
        justifyContent="end"
      >
        {onClose && (
          <Button variant={isReadOnly ? 'solid' : 'outline'} colorScheme="brand" onClick={onClose} mr="3">
            {t('cancel')}
          </Button>
        )}
        {!isReadOnly && (
          <Button
            disabled={disableDetailsNext}
            type="submit"
            data-testid="saveDocumentCards"
            variant="solid"
            colorScheme="brand"
          >
            {vendorProfileData?.id ? t('save') : t('next')}
          </Button>
        )}
      </Flex>
    </Stack>
  )
}

export const useVendorDetails = ({ form, vendorProfileData }) => {
  const { states } = useStates()
  const { setValue, reset } = form
  const { markets } = useMarkets()
  const { data: trades } = useTrades()
  const { data: paymentsMethods } = usePaymentMethods()
  useEffect(() => {
    if (!vendorProfileData) {
      setValue('score', first(documentScore))
      setValue('status', first(documentStatus))
      if (markets?.length) {
        const tradeFormValues = parseMarketAPIDataToFormValues(markets, vendorProfileData as VendorProfile)
        setValue('markets', tradeFormValues.markets)
      }

      if (trades?.length) {
        const tradeFormValues = parseTradeAPIDataToFormValues(trades, vendorProfileData as VendorProfile)
        setValue('trades', tradeFormValues.trades)
      }
    }
  }, [vendorProfileData, markets, trades])

  useEffect(() => {
    if (!vendorProfileData) return
    reset(parseVendorAPIDataToFormData(vendorProfileData))
    const state = states?.find(s => s.code === vendorProfileData.state)
    const bankState = states?.find(s => s.code === vendorProfileData.bankState)
    setValue(
      'score',
      documentScore.find(s => s.value === vendorProfileData.score),
    )
    setValue(
      'enableVendorPortal',
      portalAccess.find(s => s.value === vendorProfileData.enableVendorPortal),
    )
    setValue(
      'status',
      documentStatus.find(s => s.value === vendorProfileData.status),
    )
    setValue('state', { label: state?.name, value: state?.code })
    setValue('bankState', { label: bankState?.name, value: bankState?.code })
    //setValue('bankVoidedCheckStatus', vendorProfileData?.bankVoidedCheckStatus)
    setValue(
      'paymentTerm',
      PAYMENT_TERMS_OPTIONS.find(s => s.value === vendorProfileData.paymentTerm),
    )
    if (markets?.length && vendorProfileData) {
      const tradeFormValues = parseMarketAPIDataToFormValues(markets, vendorProfileData as VendorProfile)
      setValue('markets', tradeFormValues.markets)
    }

    if (trades?.length) {
      const tradeFormValues = parseTradeAPIDataToFormValues(trades, vendorProfileData as VendorProfile)
      setValue('trades', tradeFormValues.trades)
    }

    if (paymentsMethods?.length) {
      paymentsMethods?.forEach(pm => {
        const value = PaymentMethods.find(p => p.key === pm.lookupValueId)?.value
        if (vendorProfileData?.paymentOptions?.filter(op => op.lookupValueId === pm.lookupValueId)?.length > 0) {
          setValue(value, true)
        } else {
          setValue(value, false)
        }
      })
    }
  }, [
    reset,
    vendorProfileData,
    documentScore,
    documentStatus,
    states,
    PAYMENT_TERMS_OPTIONS,
    markets,
    trades,
    paymentsMethods,
  ])
}

export default CreateVendorDetail
