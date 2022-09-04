import {
  Box,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Button,
  Flex,
  FormErrorMessage,
  Spacer,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React, { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { VendorProfile, VendorProfileDetailsFormData } from 'types/vendor.types'
import { useStates } from 'api/pc-projects'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import {
  parseMarketAPIDataToFormValues,
  parseTradeAPIDataToFormValues,
  parseVendorAPIDataToFormData,
  useMarkets,
  usePaymentMethods,
  useTrades,
  useVendorNext,
} from 'api/vendor-details'
import { documentStatus, documentScore } from 'api/vendor-projects'
import first from 'lodash/first'
import NumberFormat from 'react-number-format'
import { CustomInput, CustomRequiredInput } from 'components/input/input'
const CreateVendorDetail: React.FC<{
  onClose?: () => void
  vendorProfileData: VendorProfile
  isActive: boolean
}> = ({ onClose, vendorProfileData, isActive }) => {
  const { t } = useTranslation()

  const { data: paymentsMethods } = usePaymentMethods()
  const { stateSelectOptions } = useStates()
  const {
    formState: { errors },
    control,
    register,
  } = useFormContext<VendorProfileDetailsFormData>()
  const { disableDetailsNext } = useVendorNext({ control })
  const einNumber = useWatch({ name: 'einNumber', control })
  const ssnNumber = useWatch({ name: 'ssnNumber', control })
  const formValues = useWatch({ control })

  const validatePayment = paymentsMethods?.filter(payment => formValues[payment.name])
  return (
    <Stack spacing={3}>
      <Box height="498px" overflow="auto">
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
              })}
              size="md"
            />
            <FormErrorMessage pos="absolute">{errors.companyName && errors.companyName.message}</FormErrorMessage>
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
                  <ReactSelect options={documentScore} {...field} selectProps={{ isBorderLeft: true }} />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
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
                  <ReactSelect options={documentStatus} {...field} selectProps={{ isBorderLeft: true }} />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </HStack>
        <HStack spacing="16px" mt="30px">
          <FormControl w="215px" isInvalid={!!errors.ownerName}>
            <FormLabel variant="strong-label" size="md">
              {t('primaryContact')}
            </FormLabel>
            <Input
              type="text"
              {...register('ownerName', {
                required: isActive && 'This is required',
              })}
              variant="required-field"
              size="md"
            />
            <FormErrorMessage pos="absolute">{errors.ownerName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px" isInvalid={!!errors.businessEmailAddress}>
            <FormLabel variant="strong-label" size="md">
              {t('primaryEmail')}
            </FormLabel>
            <Input
              type="email"
              {...register('businessEmailAddress', {
                required: isActive && 'This is required',
              })}
              variant="required-field"
              size="md"
            />
            <FormErrorMessage pos="absolute">{errors.businessEmailAddress?.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryContact')}
            </FormLabel>

            <Input type="text" {...register('secondName')} variant="outline" size="md" />
          </FormControl>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryEmail')}
            </FormLabel>

            <Input {...register('secondEmailAddress')} variant="outline" size="md" />
          </FormControl>
          <GridItem></GridItem>
        </HStack>

        <HStack spacing="4" my="30px">
          <Box w="215px">
            <FormControl isInvalid={!!errors.businessPhoneNumber}>
              <FormLabel variant="strong-label" size="md">
                {t('businessPhoneNo')}
              </FormLabel>
              <Controller
                control={control}
                rules={{ required: isActive && 'This is required' }}
                name="businessPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        value={field.value}
                        customInput={CustomRequiredInput}
                        format="(###)-###-####"
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
          </Box>
          <Flex>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input {...register('businessPhoneNumberExtension')} w="121px" variant="outline" size="md" />
            </FormControl>
            <Spacer w="95px" />
          </Flex>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
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
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </Box>
          <Box w="109px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input {...register('secondPhoneNumberExtension')} w="121px" variant="outline" size="md" />
            </FormControl>
          </Box>
        </HStack>

        <Grid templateColumns="repeat(4,215px)" rowGap="30px" columnGap="16px">
          <GridItem>
            <FormControl isInvalid={!!errors.streetAddress}>
              <FormLabel variant="strong-label" size="md">
                {t('streetAddress')}
              </FormLabel>
              <Input
                type="text"
                {...register('streetAddress', {
                  required: isActive && 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
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
                })}
                w="215px"
                variant="required-field"
                size="md"
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
                      selectProps={{ isBorderLeft: true }}
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
                })}
                w="215px"
                variant="required-field"
                size="md"
              />
              <FormErrorMessage pos="absolute">{errors.zipCode?.message}</FormErrorMessage>
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
              />
              <FormErrorMessage pos="absolute">{errors.capacity?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.einNumber}>
              <FormLabel variant="strong-label" size="md">
                {t('ein')}
              </FormLabel>
              <Controller
                control={control}
                name="einNumber"
                rules={{ required: ssnNumber ? '' : isActive && 'This is required' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        value={field.value}
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
              <FormErrorMessage pos="absolute">{errors.einNumber?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.ssnNumber}>
              <FormLabel variant="strong-label" size="md">
                {t('sin')}
              </FormLabel>
              <Controller
                control={control}
                name="ssnNumber"
                rules={{ required: einNumber ? '' : isActive && 'This is required' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        value={field.value}
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
              <FormErrorMessage pos="absolute">{errors.ssnNumber?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
        </Grid>
        <Box>
          <Stack alignItems="center" direction="row" spacing="16px">
            <Box w="215px">
              <FormControl isInvalid={!!errors.paymentTerm}>
                <FormLabel variant="strong-label" size="md">
                  {t('paymentTerms')}
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentTerm"
                  rules={{ required: isActive && 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        options={PAYMENT_TERMS_OPTIONS}
                        menuPosition="fixed"
                        maxMenuHeight={80}
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                      />
                      <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>
            <VStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
              <Text>{t('paymentMethods')}</Text>
              <FormControl isInvalid={!!errors.Check?.message && !validatePayment?.length}>
                <HStack spacing="16px">
                  {paymentsMethods?.map(payment => (
                    <Checkbox
                      {...register(payment.name, {
                        required: !validatePayment?.length && 'This is required',
                      })}
                      colorScheme="brand"
                    >
                      {payment.name}
                    </Checkbox>
                  ))}
                </HStack>
                <FormErrorMessage pos="absolute">{errors.Check?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </Stack>
        </Box>
      </Box>

      <Flex
        height="72px"
        pt="8px"
        mt="30px"
        id="footer"
        borderTop="2px solid #E2E8F0"
        alignItems="center"
        justifyContent="end"
      >
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            {t('cancel')}
          </Button>
        )}
        <Button
          disabled={disableDetailsNext}
          type="submit"
          data-testid="saveDocumentCards"
          variant="solid"
          colorScheme="brand"
        >
          {vendorProfileData?.id ? t('save') : t('next')}
        </Button>
      </Flex>
    </Stack>
  )
}

export const useVendorDetails = ({ form, vendorProfileData }) => {
  const { states } = useStates()
  const { setValue, reset } = form
  const { markets } = useMarkets()
  const { data: trades } = useTrades()

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
    setValue(
      'score',
      documentScore.find(s => s.value === vendorProfileData.score),
    )
    setValue(
      'status',
      documentStatus.find(s => s.value === vendorProfileData.status),
    )
    setValue('state', { label: state?.name, value: state?.code })
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
  }, [reset, vendorProfileData, documentScore, documentStatus, states, PAYMENT_TERMS_OPTIONS, markets, trades])
}

export default CreateVendorDetail
