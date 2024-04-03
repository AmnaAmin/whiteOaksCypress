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
  VStack,
  Divider,
  Checkbox,
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
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
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
    clearErrors,
    setValue,
    setError,
  } = useFormContext<VendorProfileDetailsFormData>()
  const { disableDetailsNext } = useVendorNext({ control })
  const capacityError = useWatch({ name: 'capacity', control })
  const formValues = useWatch({ control })

  const validatePayment = PaymentMethods?.filter(payment => formValues[payment.value])
  const einNumber = useWatch({ name: 'einNumber', control })
  const ssnNumber = useWatch({ name: 'ssnNumber', control })

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
  const handleInputChange = event => {
    const { key } = event

    // Check if the pressed key is a digit (0-9)
    const isDigit = /^\d$/.test(key)

    // Allow backspace and delete keys
    const isSpecialKey = key === 'Backspace' || key === 'Delete'

    // Allow navigation keys (arrows, home, end, etc.)
    const isNavigationKey = ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(key) !== -1

    // Allow only if the key is a digit, a special key, or a navigation key
    if (!(isDigit || isSpecialKey || isNavigationKey) || key === '-') {
      event.preventDefault()
    }
  }
  return (
    <Stack spacing={3}>
      <Box h="596px" overflow="auto">
        <HStack spacing="16px">
          <FormControl w="215px" isInvalid={!!errors.companyName}>
            <FormLabel variant="strong-label" size="md">
              {t('businessName')}
            </FormLabel>
            <Input
              type="text"
              id="companyName"
              variant="required-field"
              data-testid="companyName"
              {...register('companyName', {
                required: isActive && 'This is required',
                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                validate: {
                  whitespace: validateWhitespace,
                },
              })}
              size="md"
              isDisabled={isReadOnly}
              onChange={e => {
                const title = e?.target.value
                setValue('companyName', title)
                if (title?.length > 255) {
                  setError('companyName', {
                    type: 'maxLength',
                    message: 'Please use 255 characters only.',
                  })
                } else {
                  clearErrors('companyName')
                }
              }}
            />
            {!!errors?.companyName && (
              <FormErrorMessage data-testid="businessEmailAddress">{errors?.companyName?.message}</FormErrorMessage>
            )}
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
                    classNamePrefix={'statusOptions'}
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
                    classNamePrefix={'documentScore'}
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
                    classNamePrefix={'portalAccess'}
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
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  validate: {
                    whitespace: validateWhitespace,
                  },
                })}
                onChange={e => {
                  const title = e?.target.value
                  setValue('streetAddress', title)
                  if (title?.length > 255) {
                    setError('streetAddress', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('streetAddress')
                  }
                }}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isReadOnly}
              />
              {!!errors.streetAddress && <FormErrorMessage> {errors?.streetAddress?.message} </FormErrorMessage>}
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
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  validate: {
                    whitespace: validateWhitespace,
                  },
                  onChange: e => {
                    setValue('city', e.target.value)
                    if (e.target.value?.length > 255) {
                      setError('city', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('city')
                    }
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                data-testid="vendorCity"
                isDisabled={isReadOnly}
                onKeyPress={preventNumber}
              />
              {!!errors.city && <FormErrorMessage> {errors?.city?.message} </FormErrorMessage>}
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
                      classNamePrefix={'stateDropdown'}
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
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  onChange: e => {
                    setValue('zipCode', e.target.value)
                    if (e.target.value?.length > 255) {
                      setError('zipCode', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('zipCode')
                    }
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                data-testid="vendorZipCode"
                isDisabled={isReadOnly}
              />
              {!!errors.zipCode && <FormErrorMessage> {errors?.zipCode?.message} </FormErrorMessage>}
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
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                })}
                onChange={e => {
                  const title = e?.target.value
                  setValue('businessEmailAddress', title)
                  if (title?.length > 255) {
                    setError('businessEmailAddress', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('businessEmailAddress')
                  }
                }}
                variant="required-field"
                size="md"
                isDisabled={isReadOnly}
              />
              {!!errors?.businessEmailAddress && (
                <FormErrorMessage data-testid="businessEmailAddress">
                  {errors?.businessEmailAddress?.message}
                </FormErrorMessage>
              )}
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
            <FormControl h="70px" isInvalid={!!errors.businessPhoneNumberExtension}>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input
                {...register('businessPhoneNumberExtension', {
                  maxLength: { value: 21, message: 'Character limit reached (maximum 20 characters)' },
                  onChange: e => {
                    setValue('businessPhoneNumberExtension', e.target.value)
                    const title = e?.target.value
                    if (title?.length > 20) {
                      setError('businessPhoneNumberExtension', {
                        type: 'maxLength',
                        message: 'Please use 20 characters only.',
                      })
                    } else {
                      clearErrors('businessPhoneNumberExtension')
                    }
                  },
                })}
                w="121px"
                variant="outline"
                data-testid="ext"
                size="md"
                isDisabled={isReadOnly}
                type="number"
              />
              {!!errors.businessPhoneNumberExtension && (
                <FormErrorMessage> {errors?.businessPhoneNumberExtension?.message} </FormErrorMessage>
              )}
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
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  validate: {
                    whitespace: validateWhitespace,
                  },
                })}
                onChange={e => {
                  const title = e?.target.value
                  setValue('ownerName', title)
                  if (title?.length > 255) {
                    setError('ownerName', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('ownerName')
                  }
                }}
                size="md"
                isDisabled={isReadOnly}
              />
              {!!errors?.ownerName && (
                <FormErrorMessage data-testid="businessEmailAddress">{errors?.ownerName?.message}</FormErrorMessage>
              )}
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
                onKeyDown={handleInputChange}
                data-testid="capacity"
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

        <Grid templateColumns="repeat(4,215px)" rowGap="30px" columnGap="16px" mt="28px">
          <GridItem colSpan={4}>
            <Divider border="1px solid" />
          </GridItem>
          <GridItem colSpan={4}>
            <FormLabel variant="strong-label" color={'gray.500'}>
              Work Order Payment
            </FormLabel>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.einNumber} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('ein')}
              </FormLabel>
              <Controller
                control={control}
                name="einNumber"
                rules={{
                  required: ssnNumber ? '' : isActive && 'This is required',
                  validate: value => {
                    if (!value) {
                      return true
                    }

                    // Regular expression pattern to match EIN format: ##-#######
                    const einPattern = /^\d{2}-?\d{7}$/

                    if (!einPattern.test(value)) {
                      return 'Invalid EIN format. Please use the format ##-#######'
                    }

                    return true // Validation passed
                  },
                }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="einnum"
                        value={field.value}
                        isDisabled={isReadOnly}
                        customInput={ssnNumber ? CustomInput : CustomRequiredInput}
                        format="##-#######"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.ssnNumber} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('sin')}
              </FormLabel>
              <Controller
                control={control}
                name="ssnNumber"
                rules={{
                  required: einNumber ? '' : isActive && 'This is required',
                  pattern: {
                    value: /^$|^\d{9}$/,
                    message: 'Invalid SSN number format',
                  },
                }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="ssnnum"
                        value={field.value}
                        isDisabled={isReadOnly}
                        customInput={einNumber ? CustomInput : CustomRequiredInput}
                        format="###-##-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <VStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
              <FormLabel variant="strong-label" size="md">
                {t('paymentMethods')}
              </FormLabel>
              <FormControl isInvalid={!!errors.check?.message && !validatePayment?.length} isDisabled={isReadOnly}>
                <HStack spacing="16px">
                  {PaymentMethods.map(payment => {
                    return (
                      <Controller
                        control={control}
                        // @ts-ignore
                        name={payment.value as string}
                        rules={{
                          required: !validatePayment?.length && isActive && 'This is required',
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <div data-testid="payment_checkbox_check">
                              <Checkbox
                                colorScheme="brand"
                                isDisabled={isReadOnly}
                                isChecked={field.value as boolean}
                                onChange={event => {
                                  const isChecked = event.target.checked
                                  field.onChange(isChecked)
                                }}
                                mr="2px"
                              >
                                {t(payment.value)}
                              </Checkbox>
                            </div>
                          </>
                        )}
                      />
                    )
                  })}
                </HStack>
                <FormErrorMessage pos="absolute">{errors.check?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </GridItem>
        </Grid>

        <HStack spacing="16px" mt="30px" display="none">
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryContact')}
            </FormLabel>

            <Input
              type="text"
              {...register('secondName')}
              data-testid="secondName"
              variant="outline"
              size="md"
              isDisabled={isReadOnly}
            />
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
              data-testid="email"
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
                        options={PAYMENT_TERMS_OPTIONS.filter(option => option.value !== 60)}
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

      <Flex height="72px" pt="8px" id="footer" borderTop="1px solid #E2E8F0" alignItems="center" justifyContent="end">
        {onClose && (
          <Button variant={'outline'} colorScheme="brand" onClick={onClose} mr="3">
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
