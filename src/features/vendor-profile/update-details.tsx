import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { BiBriefcase, BiCreditCardFront, BiMapPin, BiTrip, BiUser } from 'react-icons/bi'
import { HiOutlineLocationMarker, HiOutlineMap } from 'react-icons/hi'
import { VendorProfile } from 'types/vendor.types'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { CustomInput, CustomRequiredInput } from 'components/input/input'

const textStyle = {
  color: '#2D3748',
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
  onClose?: () => void
  isActive?: boolean
}

const FieldInfoCard: React.FC<FieldInfoCardProps> = ({ value, title, icon, testid }) => {
  return (
    <Box>
      <HStack alignItems="start">
        {icon && <Icon as={icon} boxSize={7} color="gray.600" mr={3} />}
        <VStack spacing={1} alignItems="start">
          <Text color="#2D3748" fontWeight={500} fontSize="14px" lineHeight="20px" fontStyle="normal">
            {title}
          </Text>
          <Text data-testid={testid} color="#718096" fontSize="14px" fontWeight={400} fontStyle="normal">
            {value}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}

export const UpdateDetails: React.FC<{
  vendorProfileData: VendorProfile
  onClose?: () => void
  isActive: boolean
}> = props => {
  const { vendorProfileData, isActive } = props
  const { t } = useTranslation()

  return (
    <>
      <Flex direction="column">
        <Grid templateColumns={{ base: 'repeat(auto-fit, minmax(215px, 1fr))', sm: '' }} gap="20px" w="90%" mb="30px">
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
        <Divider border="1px solid" borderColor="gray.200" mb="27px" />

        <Grid templateColumns={{ base: 'repeat(auto-fit, minmax(215px, 1fr))', sm: '' }} gap="20px" w="90%" mb="40px">
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
        <DetailsForm isActive={isActive} vendorProfileData={vendorProfileData} onClose={props.onClose} />
      </Flex>
    </>
  )
}

export const DetailsForm = ({ vendorProfileData, onClose, isActive }: detailsFormProps) => {
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      {!vendorProfileData ? (
        <BlankSlate />
      ) : (
        <Box data-testid="detailForm" id="details">
          <Flex direction="column" h="100%">
            <VStack alignItems="start" spacing="32px" h={{ sm: '', md: '353px' }}>
              <Box>
                <Stack spacing={4} direction={['column', 'row']}>
                  <FormControl w="215px" isInvalid={!!errors.ownerName}>
                    <FormLabel sx={textStyle}>{t('primaryContact')}</FormLabel>
                    <Input
                      data-testid="primaryContact"
                      id="primaryContact"
                      type="text"
                      variant="required-field"
                      {...register('ownerName', {
                        required: isActive && 'This is required',
                      })}
                    />
                    <FormErrorMessage>{errors.ownerName && errors.ownerName.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.secondName} w="215px">
                    <FormLabel sx={textStyle}>{t('secondaryContact')}</FormLabel>
                    <Input bg="white" {...register('secondName')} id="secondaryContact" type="text" />
                    <FormErrorMessage>{errors.secondName && errors.secondName.message}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              <Box>
                <Stack direction={['column', 'row']} spacing={4}>
                  {/* Primary Email => Input */}

                  <FormControl isInvalid={!!errors.businessEmailAddress} w="215px">
                    <FormLabel sx={textStyle}>{t('primaryEmail')}</FormLabel>
                    <Input
                      variant="required-field"
                      {...register('businessEmailAddress', {
                        required: isActive && 'This is required',
                      })}
                      id="primaryEmail"
                      data-testid="primaryEmail"
                      type="text"
                    />
                    <FormErrorMessage>
                      {errors.businessEmailAddress && errors.businessEmailAddress.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.secondEmailAddress} w="215px">
                    <FormLabel sx={textStyle}>{t('secondaryEmail')}</FormLabel>
                    <Input {...register('secondEmailAddress')} id="secondaryEmail" type="text" />
                    <FormErrorMessage>
                      {errors.secondEmailAddress && errors.secondEmailAddress.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              <Box>
                <Stack direction={['column', 'row']} spacing={4}>
                  <FormControl isInvalid={!!errors.businessPhoneNumber} w="215px">
                    <FormLabel isTruncated sx={textStyle}>
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
                              format="(###) ###-####"
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
                    <FormErrorMessage>
                      {errors.businessPhoneNumber && errors.businessPhoneNumber.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl w="100px" isInvalid={!!errors.businessPhoneNumberExtension}>
                    <FormLabel sx={textStyle}>Ext</FormLabel>
                    <Input
                      {...register('businessPhoneNumberExtension')}
                      id="businessPhoneNumberExtension"
                      type="text"
                    />
                    <FormErrorMessage>
                      {errors.businessPhoneNumberExtension && errors.businessPhoneNumberExtension.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.secondPhoneNumber} w="215px">
                    <FormLabel sx={textStyle}>{t('secondaryNo')}</FormLabel>
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
                    <FormErrorMessage>{errors.secondPhoneNumber && errors.secondPhoneNumber.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl w="100px" isInvalid={!!errors.secondPhoneNumberExtension}>
                    <FormLabel sx={textStyle}>Ext</FormLabel>
                    <Input id="Ext" {...register('secondPhoneNumberExtension')} type="text" />
                    <FormErrorMessage>
                      {errors.secondPhoneNumberExtension && errors.secondPhoneNumberExtension.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
            </VStack>
            <Flex
              height="72px"
              pt="8px"
              mt="50px"
              w="100%"
              alignItems="center"
              justifyContent="end"
              borderTop="2px solid"
              borderTopColor="#CBD5E0"
            >
              {onClose && (
                <Button variant="outline" colorScheme="darkPrimary" onClick={onClose} mr="3">
                  Cancel
                </Button>
              )}

              <Button type="submit" data-testid="saveDetails" variant="solid" colorScheme="darkPrimary">
                {t('save')}
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  )
}
