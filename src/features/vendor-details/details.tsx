import React, { useCallback, useEffect } from 'react'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Stack,
  Text,
  Divider,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  useToast,
  Button,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { BiBriefcase, BiCreditCardFront, BiMapPin, BiTrip, BiUser } from 'react-icons/bi'
import { HiOutlineLocationMarker, HiOutlineMap } from 'react-icons/hi'
import { Controller, useForm } from 'react-hook-form'
import { VendorProfile, VendorProfileDetailsFormData } from 'types/vendor.types'
import { parseAPIDataToFormData, parseFormDataToAPIData, useVendorProfileUpdateMutation } from 'utils/vendor-details'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

const textStyle = {
  color: '#4A5568',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '24px',
  mb: '5px',
}

type FieldInfoCardProps = {
  title: string
  value: string
  icon?: React.ElementType
  testid?: string
}

type detailsFormProps = {
  vendorProfileData: VendorProfile
  submitForm: (values: any) => void
  onClose?: () => void
}

const FieldInfoCard: React.FC<FieldInfoCardProps> = ({ value, title, icon, testid }) => {
  return (
    <Box>
      <HStack alignItems="start">
        {icon && <Icon as={icon} boxSize={7} color="#718096" mr={2} />}
        <VStack spacing={1} alignItems="start">
          <Text color="#4A5568" fontWeight={500} fontSize="14px" lineHeight="20px" fontStyle="normal">
            {title}
          </Text>
          <Text data-testid={testid} color="#718096" fontSize="14px" fontWeight={400} fontStyle="normal" pb="20px">
            {value}
          </Text>
        </VStack>
      </HStack>
      <Box w="95%">
        <Divider />
      </Box>
    </Box>
  )
}

export const Details: React.FC<{
  vendorProfileData: VendorProfile
  onClose?: () => void
}> = props => {
  const { vendorProfileData } = props
  const toast = useToast()
  const { t } = useTranslation()
  const { mutate: updateVendorProfileDetails } = useVendorProfileUpdateMutation()
  // const { data: payments, isLoading } = usePaymentMethods()

  const submitForm = useCallback(
    (formData: VendorProfileDetailsFormData) => {
      const payload = parseFormDataToAPIData(vendorProfileData, formData)

      updateVendorProfileDetails(payload, {
        onSuccess() {
          toast({
            title: 'Update Vendor Profile Details',
            description: 'Vendor profile details has been saved successfully.',
            status: 'success',
            isClosable: true,
            position: 'top-left',
          })
        },
      })
    },
    [toast, updateVendorProfileDetails, vendorProfileData],
  )

  return (
    <Flex h="100%" direction="column">
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="20px" w="100%" mb="30px">
        <GridItem>
          <FieldInfoCard
            testid="businessName"
            title={t('businessName')}
            value={`${vendorProfileData?.companyName}`}
            icon={BiBriefcase}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard title={t('capacity')} value={`${vendorProfileData?.capacity}`} icon={BiUser} />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t('last4digits')}
            value={`${vendorProfileData?.einNumber?.slice(-4)}`}
            icon={BiCreditCardFront}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t('paymentMethods')}
            value={
              vendorProfileData?.paymentOptions?.length > 0
                ? vendorProfileData.paymentOptions.map(po => po.name).toString()
                : 'none'
            }
            icon={BiCreditCardFront}
          />
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="20px" w="100%" mb="40px">
        <GridItem>
          <FieldInfoCard
            testid="streetAddress"
            title={t('streetAddress')}
            value={`${vendorProfileData?.streetAddress}`}
            icon={BiMapPin}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard title={t('state')} value={`${vendorProfileData?.state}`} icon={BiTrip} />
        </GridItem>
        <GridItem>
          <FieldInfoCard title={t('city')} value={`${vendorProfileData?.city}`} icon={HiOutlineLocationMarker} />
        </GridItem>
        <GridItem>
          <FieldInfoCard title={t('zip')} value={`${vendorProfileData?.zipCode}`} icon={HiOutlineMap} />
        </GridItem>
      </Grid>
      <DetailsForm vendorProfileData={vendorProfileData} submitForm={submitForm} onClose={props.onClose} />
    </Flex>
  )
}

export const DetailsForm = ({ submitForm, vendorProfileData, onClose }: detailsFormProps) => {
  const { t } = useTranslation()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
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
    },
  })

  useEffect(() => {
    if (!vendorProfileData) return
    reset(parseAPIDataToFormData(vendorProfileData))
  }, [reset, vendorProfileData])

  return (
    <>
      {!vendorProfileData ? (
        <BlankSlate />
      ) : (
        <Box as="form" onSubmit={handleSubmit(submitForm)} data-testid="detailForm" id="details">
          <Flex direction="column" h="100%">
            <Box flex="1">
              <Box mb="22px">
                <Stack spacing={4} direction={['row']}>
                  <FormControl w="215px" isInvalid={!!errors.primaryContact}>
                    <FormLabel sx={textStyle}>{t('primaryContact')}</FormLabel>
                    <Input
                      data-testid="primaryContact"
                      id="primaryContact"
                      type="text"
                      variant="reguired-field"
                      {...register('primaryContact', {
                        required: 'This is required',
                      })}
                    />
                    <FormErrorMessage>{errors.primaryContact && errors.primaryContact.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.secondaryContact} w="215px">
                    <FormLabel sx={textStyle}>{t('secondaryContact')}</FormLabel>
                    <Input bg="white" {...register('secondaryContact')} id="secondaryContact" type="text" />
                    <FormErrorMessage>{errors.secondaryContact && errors.secondaryContact.message}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              <Box mb="22px">
                <Stack direction="row" spacing={4}>
                  <FormControl isInvalid={!!errors.businessPhoneNumber} w="215px">
                    <FormLabel sx={textStyle}>{t('businessPhoneName')}</FormLabel>
                    <Input
                      id="businessPhoneNumber"
                      type="text"
                      data-testid="businessPhoneNumber"
                      variant="reguired-field"
                      {...register('businessPhoneNumber', {
                        required: 'This is required',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.businessPhoneNumber && errors.businessPhoneNumber.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl w="100px" isInvalid={!!errors.businessNumberExtention}>
                    <FormLabel sx={textStyle}>Ext</FormLabel>
                    <Input {...register('businessNumberExtention')} id="businessNumberExtention" type="text" />
                    <FormErrorMessage>
                      {errors.businessNumberExtention && errors.businessNumberExtention.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.secondaryNumber} w="215px">
                    <FormLabel sx={textStyle}>{t('secondaryNo')}</FormLabel>
                    <Controller
                      name="secondaryNumber"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            id="SecondaryNo"
                            placeholder="(___)-___-____"
                            autoComplete="cc-number"
                            type="text"
                            inputMode="text"
                            onChange={event => {
                              const value = event.currentTarget.value
                              const denormarlizedValue = value.split('-').join('')

                              const maskValue = denormarlizedValue
                                ?.replace(/\D/g, '')
                                .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
                              const actualValue = `(${maskValue?.[1] || '___'})-${maskValue?.[2] || '___'}-${
                                maskValue?.[3] || '____'
                              }`
                              field.onChange(actualValue)
                            }}
                          />
                        )
                      }}
                    />
                    <FormErrorMessage>{errors.secondaryNumber && errors.secondaryNumber.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl w="100px" isInvalid={!!errors.secondaryNumberExtenstion}>
                    <FormLabel sx={textStyle}>Ext</FormLabel>
                    <Input id="Ext" {...register('secondaryNumberExtenstion')} type="text" />
                    <FormErrorMessage>
                      {errors.secondaryNumberExtenstion && errors.secondaryNumberExtenstion.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              <Box mb="22px">
                <Stack direction="row" spacing={4}>
                  {/* Primary Email => Input */}

                  <FormControl isInvalid={!!errors.primaryEmail} w="215px">
                    <FormLabel sx={textStyle}>{t('primaryEmail')}</FormLabel>
                    <Input
                      variant="reguired-field"
                      {...register('primaryEmail', {
                        required: 'This is required',
                      })}
                      id="primaryEmail"
                      data-testid="primaryEmail"
                      type="text"
                    />
                    <FormErrorMessage>{errors.primaryEmail && errors.primaryEmail.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.secondaryEmail} w="215px">
                    <FormLabel sx={textStyle}>{t('secondaryEmail')}</FormLabel>
                    <Input {...register('secondaryEmail')} id="secondaryEmail" type="text" />
                    <FormErrorMessage>{errors.secondaryEmail && errors.secondaryEmail.message}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
            </Box>

            <Flex w="100%" h="100px" alignItems="center" justifyContent="end" borderTop="2px solid #E2E8F0" mt="30px">
              {onClose && (
                <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
                  Cancel
                </Button>
              )}
              <Button type="submit" data-testid="saveDetails" variant="solid" colorScheme="brand">
                {t('save')}
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  )
}
