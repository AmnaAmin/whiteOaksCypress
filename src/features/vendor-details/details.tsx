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
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  useToast,
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
      <DetailsForm vendorProfileData={vendorProfileData} submitForm={submitForm} />
    </Flex>
  )
}

export const DetailsForm = ({ submitForm, vendorProfileData }) => {
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
        <Box as="form" onSubmit={handleSubmit(submitForm)} data-testid="detailForm">
          <Flex direction="column" h="100%">
            <Box flex="1">
              <Box mb="22px">
                <Stack spacing={4} direction={['row']}>
                  <FormControl w="215px" isInvalid={!!errors.primaryContact}>
                    <FormLabel sx={textStyle}>{t('primaryContact')}</FormLabel>
                    <Input
                      w="215px"
                      h="40px"
                      bg="#FFFFFF"
                      color="#718096"
                      fontSize="14px"
                      borderLeft="2px solid #4E87F8"
                      {...register('primaryContact', {
                        required: 'This is required',
                      })}
                      id="primaryContact"
                      type="text"
                      data-testid="primaryContact"
                    />
                    <FormErrorMessage>{errors.primaryContact && errors.primaryContact.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.secondaryContact}>
                    <FormLabel sx={textStyle}>{t('secondaryContact')}</FormLabel>
                    <Input
                      w="215px"
                      h="40px"
                      bg="#FFFFFF"
                      color="#718096"
                      fontSize="14px"
                      {...register('secondaryContact')}
                      id="secondaryContact"
                      type="text"
                    />
                    <FormErrorMessage>{errors.secondaryContact && errors.secondaryContact.message}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              <Box mb="22px">
                <Stack direction="row" spacing={4}>
                  <FormControl isInvalid={!!errors.businessPhoneNumber} w="215px">
                    <FormLabel sx={textStyle}>{t('businessPhoneName')}</FormLabel>
                    <Input
                      w="215px"
                      h="40px"
                      bg="#FFFFFF"
                      color="#718096"
                      fontSize="14px"
                      borderLeft="2px solid #4E87F8"
                      mb="5px"
                      {...register('businessPhoneNumber', {
                        required: 'This is required',
                      })}
                      id="businessPhoneNumber"
                      type="text"
                      data-testid="businessPhoneNumber"
                    />
                    <FormErrorMessage>
                      {errors.businessPhoneNumber && errors.businessPhoneNumber.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl w="100px" isInvalid={!!errors.businessNumberExtention}>
                    <FormLabel sx={textStyle}>Ext</FormLabel>
                    <Input
                      w="96px"
                      h="40px"
                      bg="#FFFFFF"
                      color="#718096"
                      fontSize="14px"
                      {...register('businessNumberExtention')}
                      id="businessNumberExtention"
                      type="text"
                    />
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
                            w="215px"
                            h="40px"
                            bg="#FFFFFF"
                            color="#718096"
                            fontSize="14px"
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
                    <Input
                      bg="#FFFFFF"
                      w="96px"
                      h="40px"
                      color="#718096"
                      fontSize="14px"
                      id="Ext"
                      {...register('secondaryNumberExtenstion')}
                      type="text"
                    />
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
                      w="215px"
                      h="40px"
                      bg="#FFFFFF"
                      color="#718096"
                      fontSize="14px"
                      borderLeft="2px solid #4E87F8"
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
                    <Input
                      w="215px"
                      h="40px"
                      bg="#FFFFFF"
                      color="#718096"
                      fontSize="14px"
                      {...register('secondaryEmail')}
                      id="secondaryEmail"
                      type="text"
                    />
                    <FormErrorMessage>{errors.secondaryEmail && errors.secondaryEmail.message}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
            </Box>

            <Stack mt="100px" w="100%">
              <Box>
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" minH="60px">
                <Button
                  mt="10px"
                  mr="60px"
                  float={'right'}
                  colorScheme="CustomPrimaryColor"
                  size="md"
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight={600}
                  type="submit"
                  data-testid="saveDetails"
                >
                  {t('save')}
                </Button>
              </Box>
            </Stack>
          </Flex>
        </Box>
      )}
    </>
  )
}
