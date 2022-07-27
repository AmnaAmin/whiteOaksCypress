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
import { t } from 'i18next'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { VendorProfile, VendorProfileDetailsFormData } from 'types/vendor.types'
import { parseAPIDataToFormData, parseFormDataToAPIData, useVendorProfileUpdateMutation } from 'utils/vendor-details'

const PcDetails: React.FC<{
  onClose?: () => void
  VendorType?: string

  vendorProfileData: VendorProfile
}> = ({ onClose, VendorType, vendorProfileData }) => {
  const toast = useToast()
  const { t } = useTranslation()
  const { mutate: updateVendorProfileDetails } = useVendorProfileUpdateMutation()
  const queryClient = useQueryClient()

  const submitForm = useCallback(
    (formData: VendorProfileDetailsFormData) => {
      const payload = parseFormDataToAPIData(vendorProfileData, formData)
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
      })
    },
    [toast, updateVendorProfileDetails, vendorProfileData],
  )
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<VendorProfileDetailsFormData>({
    defaultValues: {
      primaryContact: '',
      secondaryContact: '',
      businessPhoneNumber: '',
      businessNumberExtention: '',
      secondaryNumber: '',
      secondaryNumberExtenstion: '',
      primaryEmail: '',
      secondaryEmail: '',
      companyName: '',
      score: '',
      status: null,
      streetAddress: '',
      state: '',
      city: '',
      zipCode: null,
      capacity: '',
      einNumber: '',
      ssnNumber: '',
    },
  })

  useEffect(() => {
    if (!vendorProfileData) return
    reset(parseAPIDataToFormData(vendorProfileData))
  }, [reset, vendorProfileData])

  // const {
  //   handleSubmit,
  //   register,
  //   control,
  //   watch,
  //   formState: { errors },
  // } = useForm<{
  //   businessName: string
  //   score: string
  //   status: string
  //   primaryContact: string
  //   primaryEmail: string
  //   businessPhoneNumber: string
  //   streetAddress: string
  //   zipCode: string
  //   capacity: string
  //   ein: string
  //   city: string
  //   state: string
  //   sin: string
  //   paymentTerms: string
  //   creditCard: boolean
  //   check: boolean
  //   ach: boolean
  // }>()

  // const onSubmit = values => {
  //   console.log(values)
  // }

  // const fields = watch()
  // const isEnabled = useMemo(() => {
  //   const {
  //     businessName,
  //     score,
  //     status,
  //     primaryContact,
  //     primaryEmail,
  //     businessPhoneNumber,
  //     streetAddress,
  //     zipCode,
  //     capacity,
  //     ein,
  //     city,
  //     state,
  //     sin,
  //     paymentTerms,
  //     creditCard,
  //     check,
  //     ach,
  //   } = fields

  //   return !!(
  //     (businessName &&
  //       score &&
  //       status &&
  //       primaryContact &&
  //       primaryEmail &&
  //       businessPhoneNumber &&
  //       streetAddress &&
  //       zipCode &&
  //       capacity &&
  //       ein &&
  //       city &&
  //       state &&
  //       sin &&
  //       paymentTerms) ||
  //     check ||
  //     creditCard ||
  //     ach
  //   )
  // }, [fields])

  const documentTypes = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
    { value: 4, label: 'Option 4' },
  ]

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(submitForm)}>
        <HStack spacing="16px">
          <FormControl w="215px" isInvalid={!!errors.companyName}>
            <FormLabel variant="strong-label" size="md">
              {t('companyName')}
            </FormLabel>
            <Input
              type="text"
              {...register('companyName', {
                required: 'This is required',
              })}
              variant="required-field"
              size="md"
            />
            <FormErrorMessage pos="absolute">{errors.companyName?.message}</FormErrorMessage>
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
                  <ReactSelect options={documentTypes} {...field} selectProps={{ isBorderLeft: true }} />
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
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect options={documentTypes} {...field} selectProps={{ isBorderLeft: true }} />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </HStack>
        <HStack spacing="16px" mt="30px">
          <FormControl w="215px" isInvalid={!!errors.primaryContact}>
            <FormLabel variant="strong-label" size="md">
              {t('primaryContact')}
            </FormLabel>
            <Input
              type="number"
              {...register('primaryContact', {
                required: 'This is required',
              })}
              variant="required-field"
              size="md"
            />
            <FormErrorMessage pos="absolute">{errors.primaryContact?.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px" isInvalid={!!errors.primaryEmail}>
            <FormLabel variant="strong-label" size="md">
              {t('primaryEmail')}
            </FormLabel>
            <Input
              type="email"
              {...register('primaryEmail', {
                required: 'This is required',
              })}
              variant="required-field"
              size="md"
            />
            <FormErrorMessage pos="absolute">{errors.primaryEmail?.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryContact')}
            </FormLabel>

            <Input variant="outline" size="md" />
          </FormControl>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryEmail')}
            </FormLabel>

            <Input variant="outline" size="md" />
          </FormControl>
          <GridItem></GridItem>
        </HStack>

        <HStack spacing="4" my="30px">
          <Box w="215px">
            <FormControl isInvalid={!!errors.businessPhoneNumber}>
              <FormLabel variant="strong-label" size="md">
                {t('businessPhoneNumber')}
              </FormLabel>
              <Input
                type="number"
                {...register('businessPhoneNumber', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
              />
              <FormErrorMessage pos="absolute">{errors.businessPhoneNumber?.message}</FormErrorMessage>
            </FormControl>
          </Box>
          <Flex>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input w="121px" variant="outline" size="md" />
            </FormControl>
            <Spacer w="95px" />
          </Flex>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('secondaryPhoneNo')}
              </FormLabel>

              <Input w="215px" variant="outline" size="md" />
            </FormControl>
          </Box>
          <Box w="109px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input w="121px" variant="outline" size="md" />
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
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect options={documentTypes} {...field} selectProps={{ isBorderLeft: true }} />
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
                type="text"
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
              <FormErrorMessage pos="absolute">{errors.ein?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.sin}>
              <FormLabel variant="strong-label" size="md">
                {t('sin')}
              </FormLabel>
              <Input
                type="text"
                {...register('sin', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
              />
              <FormErrorMessage pos="absolute">{errors.sin?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
        </Grid>
        <Box>
          <Stack alignItems="center" direction="row" spacing="16px">
            <Box w="215px">
              <FormControl isInvalid={!!errors.paymentTerms}>
                <FormLabel variant="strong-label" size="md">
                  {t('paymentTerms')}
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentTerms"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect options={documentTypes} {...field} selectProps={{ isBorderLeft: true }} />
                      <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>
            <VStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
              <Text>{t('paymentMethods')}</Text>
              <HStack spacing="16px">
                <Checkbox {...register('creditCard')} colorScheme="brand">
                  Credit Card
                </Checkbox>
                <Checkbox {...register('check')} colorScheme="brand">
                  {t('check')}
                </Checkbox>
                <Checkbox {...register('ach')} colorScheme="brand">
                  ACH
                </Checkbox>
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
          {VendorType === 'detail' ? (
            <Button
              // isDisabled={!isEnabled}
              type="submit"
              data-testid="saveDocumentCards"
              variant="solid"
              colorScheme="brand"
            >
              {t('save')}
            </Button>
          ) : (
            <Button
              // isDisabled={!isEnabled}
              type="submit"
              data-testid="saveDocumentCards"
              variant="solid"
              colorScheme="brand"
            >
              {t('next')}
            </Button>
          )}
        </HStack>
      </form>
    </Stack>
  )
}

export default PcDetails
