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
  useToast,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { emailPattern } from 'components/layout/constants'
import { t } from 'i18next'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { VendorProfile, VendorProfileDetailsFormData } from 'types/vendor.types'
import { useStates } from 'utils/pc-projects'
import { PAYMENT_TERMS_OPTIONS } from 'utils/transactions'
import {
  parseAPIDataToFormData,
  parseVendorAPIDataToFormData,
  parseVendorFormDataToAPIData,
  useCreateVendorMutation,
  usePaymentMethods,
  useVendorProfileUpdateMutation,
} from 'utils/vendor-details'
import { documentStatus, documentScore } from 'utils/vendor-projects'

const PcDetails: React.FC<{
  onClose?: () => void
  VendorType?: string
  updateVendorId?: (number) => void

  vendorProfileData: VendorProfile
}> = ({ onClose, VendorType, vendorProfileData, updateVendorId }) => {
  const toast = useToast()
  const { t } = useTranslation()
  const { mutate: updateVendorProfileDetails } = useVendorProfileUpdateMutation()
  const { mutate: createVendorProfileDetails } = useCreateVendorMutation()
  const queryClient = useQueryClient()
  const { data: paymentsMethods } = usePaymentMethods()
  const { data: statesData } = useStates()

  const submitForm = useCallback(
    (formData: VendorProfileDetailsFormData) => {
      console.log('formData', formData)
      const payload = parseVendorFormDataToAPIData(vendorProfileData, formData, paymentsMethods)
      if (vendorProfileData?.id) {
        updateVendorProfileDetails(payload, {
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
      } else {
        createVendorProfileDetails(payload, {
          onSuccess(res: any) {
            updateVendorId?.(res?.data?.id)
            toast({
              title: t('updateProfile'),
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
      }
    },
    [toast, updateVendorProfileDetails, vendorProfileData, paymentsMethods],
  )
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendorProfileDetailsFormData>({
    defaultValues: {
      ownerName: '',
      secondName: '',
      businessPhoneNumber: '',
      businessPhoneNumberExtension: '',
      secondPhoneNumber: '',
      secondPhoneNumberExtension: '',
      businessEmailAddress: '',
      secondEmailAddress: '',
      companyName: '',
      score: {},
      status: {},
      state: {},
      paymentTerm: {},
      streetAddress: '',
      city: '',
      zipCode: '',
      capacity: null,
      einNumber: '',
      ssnNumber: '',
    },
  })

  useEffect(() => {
    if (!vendorProfileData) return
    reset(parseVendorAPIDataToFormData(vendorProfileData))
    console.log('parseVendorAPIDataToFormData(vendorProfileData)', parseVendorAPIDataToFormData(vendorProfileData))
  }, [reset, vendorProfileData])

  const states = statesData?.map(state => ({
    label: state?.name,
    value: state?.code,
  }))

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(submitForm)}>
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
                required: 'This is required',
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
              rules={{ required: 'This is required' }}
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
              rules={{ required: 'This is required' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect options={documentStatus} selected={value} selectProps={{ isBorderLeft: true }} />
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
                required: 'This is required',
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
                required: 'This is required',
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
                name="businessPhoneNumber"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      // {...register('businessPhoneNumber')}
                      w="215px"
                      variant="outline"
                      size="md"
                      onChange={event => {
                        const value = event.currentTarget.value
                        const denormarlizedValue = value.split('-').join('')

                        const maskValue = denormarlizedValue?.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
                        const actualValue = `(${maskValue?.[1] || '___'})-${maskValue?.[2] || '___'}-${
                          maskValue?.[3] || '____'
                        }`
                        field.onChange(actualValue)
                      }}
                    />
                  )
                }}
              />
              {/* <Input
                type="text"
                {...register('businessPhoneNumber', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
              />
              <FormErrorMessage pos="absolute">{errors.businessPhoneNumber?.message}</FormErrorMessage> */}
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
                name="secondPhoneNumber"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      // {...register('secondPhoneNumber')}
                      w="215px"
                      variant="outline"
                      size="md"
                      onChange={event => {
                        const value = event.currentTarget.value
                        const denormarlizedValue = value.split('-').join('')

                        const maskValue = denormarlizedValue?.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
                        const actualValue = `(${maskValue?.[1] || '___'})-${maskValue?.[2] || '___'}-${
                          maskValue?.[3] || '____'
                        }`
                        field.onChange(actualValue)
                      }}
                    />
                  )
                }}
              />
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
                  required: 'This is required',
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
                  required: 'This is required',
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
                rules={{ required: 'This is required' }}
                render={({ field: { value }, fieldState }) => (
                  <>
                    <ReactSelect
                      options={states}
                      // {...field}
                      selected={value}
                      // onChange={setStates}
                      // selectProps={{ isBorderLeft: true }}
                    />

                    {/* <ReactSelect options={documentTypes} {...field} selectProps={{ isBorderLeft: true }} /> */}
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
                  required: 'This is required',
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
                  required: 'This is required',
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
                EIN
              </FormLabel>
              <Input
                type="number"
                {...register('einNumber', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
              />
              <FormErrorMessage pos="absolute">{errors.einNumber?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.ssnNumber}>
              <FormLabel variant="strong-label" size="md">
                {t('sin')}
              </FormLabel>
              <Input
                type="text"
                {...register('ssnNumber', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
              />
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
                  rules={{ required: 'This is required' }}
                  render={({ field: { value }, fieldState }) => (
                    <>
                      <ReactSelect
                        options={PAYMENT_TERMS_OPTIONS}
                        selected={value}
                        // {...field}
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
              <HStack spacing="16px">
                {paymentsMethods?.map(payment => (
                  <Checkbox {...register(payment.name)} colorScheme="brand">
                    {payment.name}
                  </Checkbox>
                ))}
                {/* <Checkbox {...register('check')} colorScheme="brand">
                  {t('check')}
                </Checkbox>
                <Checkbox {...register('ach')} colorScheme="brand">
                  ACH
                </Checkbox> */}
              </HStack>
            </VStack>
          </Stack>
        </Box>
        <HStack height="80px" mt="30px" id="footer" borderTop="2px solid #E2E8F0" justifyContent="end" spacing="16px">
          {onClose && (
            <Button variant="outline" colorScheme="brand" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}
          {/* {VendorType === 'detail' ? ( */}
          <Button
            // isDisabled={!isEnabled}
            type="submit"
            data-testid="saveDocumentCards"
            variant="solid"
            colorScheme="brand"
          >
            {t('save')}
          </Button>
          {/* ) */}
          {/* //  : (
          //   <Button
          //     // isDisabled={!isEnabled}
          //     type="submit"
          //     data-testid="saveDocumentCards"
          //     variant="solid"
          //     colorScheme="brand"
          //   >
          //     {t('next')}
          //   </Button>
          // )} */}
        </HStack>
      </form>
    </Stack>
  )
}

export default PcDetails
