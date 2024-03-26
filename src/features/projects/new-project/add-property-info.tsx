import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  useDisclosure,
  FormErrorMessage,
  Text,
  Input,
  Flex,
  Box,
  VStack,
} from '@chakra-ui/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { AddressInfo, ProjectFormValues } from 'types/project.type'
import { useEffect, useState } from 'react'
import React from 'react'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import { useProjects } from 'api/projects'
import Select from 'components/form/react-select'
import { CreatableSelect } from 'components/form/react-select'
import { createFilter } from 'react-select'
import { useGetAddressVerification, useMarketStateWise, useMarkets, useProperties, useStates } from 'api/pc-projects'
import { useTranslation } from 'react-i18next'
import { AddressVerificationModal } from './address-verification-modal'
import { useAddressShouldBeVerified, usePropertyInformationNextDisabled } from './hooks'
import NumberFormat from 'react-number-format'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { STATUS } from 'features/common/status'
import { isValidEmail } from 'utils/string-formatters'

export const AddPropertyInfo: React.FC<{
  isLoading: boolean
  isDuplicateAddress: boolean
  setIsDuplicateAddress: (isDuplicate: boolean) => void
  setNextTab: () => void
  onClose: () => void
}> = props => {
  const { t } = useTranslation()

  const {
    isOpen: isAddressVerficationModalOpen,
    onOpen: onAddressVerificationModalOpen,
    onClose: onAddressVerificationModalClose,
  } = useDisclosure()
  const { isDuplicateAddress, setIsDuplicateAddress } = props
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [check, setCheck] = useState(false)
  const [existProperty, setExistProperty] = useState([{ id: 0, status: '' }])

  const {
    register,
    formState: { errors },
    control,
    setValue,
    setError,
    clearErrors,
  } = useFormContext<ProjectFormValues>()

  // API calls
  const { projects } = useProjects()
  const { propertySelectOptions } = useProperties()
  const { stateSelectOptions, states } = useStates()
  const { markets } = useMarkets()
  const [message, setMessage] = useState('')
  const [error, setErrors] = useState('')
  const { data: isAddressVerified, refetch, isLoading } = useGetAddressVerification(addressInfo)
  const isNextButtonDisabled = usePropertyInformationNextDisabled(control, isDuplicateAddress)
  const addressShouldBeVerified = useAddressShouldBeVerified(control)

  // Continue unverified Check
  const handleCheck = () => {
    setCheck(!check)
    setIsDuplicateAddress(false)
    setValue('acknowledgeCheck', true)
  }

  // Get all values of Address Info
  const watchAddress = useWatch({ name: 'streetAddress', control })
  const watchCity = useWatch({ name: 'city', control })
  const watchState = useWatch({ name: 'state', control })
  const watchZipCode = useWatch({ name: 'zipCode', control })
  const state = useWatch({ name: 'state', control })

  const { marketSelectOptionsStateWise } = useMarketStateWise(state?.id)

  // Set all values of Address Info
  useEffect(() => {
    setAddressInfo({
      address: watchAddress || '',
      city: watchCity || '',
      state: watchState?.label || '',
      zipCode: watchZipCode || '',
    })
  }, [watchAddress, watchCity, watchState, watchZipCode])

  // On Street Address change, set values of City, State and Zip
  const setAddressValues = option => {
    const property = option?.property
    const market = markets.find(m => m?.id === property?.marketId)

    const state = states.find(s => s?.code === property?.state)
    setValue('streetAddress', property?.streetAddress || option.label)
    setValue('city', property?.city)
    setValue('zipCode', property?.zipCode)
    setValue('propertyId', property?.id)
    setValue('property', property)
    setValue('newMarket', { label: market?.metropolitanServiceArea, value: market?.id })
    setValue('state', { label: state?.name, value: state?.code, id: state?.id })

    // Check for duplicate address
    const duplicatedInProjects =
      projects?.filter(
        p =>
          p.propertyId === property?.id &&
          [STATUS.New, STATUS.Active, STATUS.Punch, STATUS.Closed].includes(p.projectStatus?.toLowerCase() as STATUS),
      ) || []
    setIsDuplicateAddress(false)
    setValue('acknowledgeCheck', false)

    if (duplicatedInProjects?.length > 0) {
      setIsDuplicateAddress(true)
      setExistProperty(duplicatedInProjects.map(p => ({ id: p.id as number, status: p.projectStatus as string })))
    }
  }

  // Email Validation
  const handleEmailChange = event => {
    const enteredEmail = event.target.value

    if (enteredEmail.trim() === '') {
      // Clear the error message if the field is empty
      setErrors('')
      // Reset the value to an empty string
      event.target.value = ''
    } else if (!isValidEmail(enteredEmail)) {
      // Show "Invalid Email Address" error for invalid emails
      setErrors('Invalid Email Address')
    } else {
      // Clear the error if the entered email is valid
      setErrors('')
    }

    // Update the message variable with the entered value
    setMessage(enteredEmail.trim())
  }

  return (
    <>
      <Flex flexDir="column">
        <Box px="6" h="300px" overflow={'auto'}>
          {isDuplicateAddress && (
            <Alert status="info" mb={5} bg="#EBF8FF" rounded={6} width="75%">
              <AlertIcon />
              <AlertDescription>
                <Text color="red" fontSize="sm">
                  {existProperty &&
                    existProperty?.map(
                      p => 'Project ID ' + p.id + ' using this address already exist & is in ' + p.status + ' state. ',
                    )}
                </Text>
              </AlertDescription>
              <Divider orientation="vertical" h={6} marginLeft={6} />
              <Checkbox
                name={`acknowledgeCheck`}
                type="checkbox"
                marginTop={1}
                marginLeft={6}
                color="#4E87F8"
                onChange={handleCheck}
              >
                {t(`${NEW_PROJECT}.acknowledged`)}
              </Checkbox>
            </Alert>
          )}
          <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} pb="3">
            <GridItem>
              <FormControl>
                <FormLabel size="md">{t(`${NEW_PROJECT}.address`)}</FormLabel>
                <Controller
                  control={control}
                  name={`streetAddress`}
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <CreatableSelect
                       classNamePrefix={'streetAddressProject'}
                        id="streetAddress"
                        options={propertySelectOptions}
                        selected={field.value}
                        placeholder="Type address here.."
                        onChange={setAddressValues}
                        selectProps={{ isBorderLeft: true }}
                        inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
                        filterOption={createFilter({ ignoreAccents: false })}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
                <FormErrorMessage>{errors?.streetAddress && errors?.streetAddress?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isInvalid={!!errors?.city}>
                <FormLabel size="md" htmlFor="city">
                  {t(`${NEW_PROJECT}.city`)}
                </FormLabel>
                <Input
                  id="city"
                  variant="required-field"
                  {...register('city', {
                    maxLength: { value: 255, message: 'Please use 255 characters only.' },
                    required: true,
                    onChange: e => {
                      let city = e.target.value?.replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabet characters
                      setValue('city', city) // Update form value
                      setAddressInfo({ ...addressInfo, city }) // Update address info
                      if (city?.length > 255) {
                        setError('city', {
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors('city')
                      }
                    },
                  })}
                />
                <FormErrorMessage>{errors?.city && errors?.city?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel size="md">{t(`${NEW_PROJECT}.state`)}</FormLabel>
                <Controller
                  control={control}
                  name={`state`}
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                       classNamePrefix={'stateOptions'}
                        id="addressState"
                        {...field}
                        options={stateSelectOptions}
                        size="md"
                        value={field.value}
                        selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                        onChange={option => {
                          setAddressInfo({ ...addressInfo, state: option?.value })
                          field.onChange(option)
                          setValue('newMarket', null)
                        }}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isInvalid={!!errors?.zipCode}>
                <FormLabel htmlFor="zipCode" size="md">
                  {t(`${NEW_PROJECT}.zipCode`)}
                </FormLabel>
                <Input
                  id="zipCode"
                  variant="required-field"
                  {...register('zipCode', {
                    maxLength: { value: 255, message: 'Please use 255 characters only.' },
                    required: true,
                  })}
                  onChange={e => {
                    const zipCode = e?.target.value
                    setValue('zipCode', zipCode) // Update form value
                    setAddressInfo({ ...addressInfo }) // Update address info
                    if (zipCode?.length > 255) {
                      setError('zipCode', {
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('zipCode')
                    }
                  }}
                  type="number"
                />
                <FormErrorMessage>{errors?.zipCode && errors?.zipCode.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
          <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
            <GridItem>
              <FormControl>
                <FormLabel htmlFor="market" size="md">
                  {t(`${NEW_PROJECT}.market`)}
                </FormLabel>
                <Controller
                  control={control}
                  name={`newMarket`}
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                       classNamePrefix={'marketSelectOptions'}
                        id="addressMarket"
                        {...field}
                        options={marketSelectOptionsStateWise}
                        size="md"
                        value={field.value}
                        selectProps={{ isBorderLeft: true, menuHeight: '120px' }}
                        onChange={option => {
                          setValue('projectManager', null)
                          field.onChange(option)
                        }}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isInvalid={!!errors?.gateCode}>
                <FormLabel htmlFor="gateCode" size="md">
                  {t(`${NEW_PROJECT}.gateCode`)}
                </FormLabel>
                <Input
                  id="gateCode"
                  {...register('gateCode', {
                    maxLength: { value: 255, message: 'Please Use 255 Characters Only.' },
                  })}
                  onChange={e => {
                    const title = e?.target.value
                    setValue('gateCode', title)
                    if (title?.length > 255) {
                      setError('gateCode', {
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('gateCode')
                    }
                  }}
                  type="number"
                />
                <FormErrorMessage>{errors?.gateCode && errors?.gateCode.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isInvalid={!!errors?.lockBoxCode}>
                <FormLabel htmlFor="lockBoxCode" size="md">
                  {t(`${NEW_PROJECT}.lockBoxCode`)}
                </FormLabel>
                <Input
                  id="lockBoxCode"
                  {...register('lockBoxCode', {
                    maxLength: { value: 255, message: 'Please Use 255 Characters Only.' },
                  })}
                  onChange={e => {
                    const title = e?.target.value
                    setValue('lockBoxCode', title)
                    if (title?.length > 255) {
                      setError('lockBoxCode', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('lockBoxCode')
                    }
                  }}
                  type="number"
                />
                <FormErrorMessage>{errors?.lockBoxCode && errors?.lockBoxCode.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isInvalid={!!errors?.claimNumber}>
                <FormLabel htmlFor="claimNumber" size="md">
                  {t(`${NEW_PROJECT}.claimNumber`)}
                </FormLabel>
                <Input
                  id="claimNumber"
                  {...register('claimNumber', {
                    maxLength: { value: 50, message: 'Please Use 50 Characters Only.' },
                  })}
                  onChange={e => {
                    const title = e?.target.value
                    setValue('claimNumber', title)
                    if (title?.length > 50) {
                      setError('claimNumber', {
                        type: 'maxLength',
                        message: 'Please use 50 characters only.',
                      })
                    } else {
                      clearErrors('claimNumber')
                    }
                  }}
                />
                <FormErrorMessage>{errors?.claimNumber && errors?.claimNumber.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
            <GridItem>
              <FormControl isInvalid={!!errors?.hoaPhone}>
                <FormLabel htmlFor="hoaPhone" size="md">
                  {t(`${NEW_PROJECT}.hoaPhone`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="hoaPhone"
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <NumberFormat
                          id="hoaPhone"
                          customInput={Input}
                          value={field.value}
                          onChange={e => {
                            field.onChange(e)
                          }}
                          format="(###)-###-####"
                          mask="_"
                          placeholder="(___)-___-____"
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors?.hoaPhoneNumberExtension}>
                <FormLabel htmlFor="ext" size="md">
                  {t(`${NEW_PROJECT}.ext`)}
                </FormLabel>
                <Input
                  id="ext"
                  {...register('hoaPhoneNumberExtension', {
                    maxLength: { value: 20, message: 'Please Use 20 Characters Only.' },
                  })}
                  onChange={e => {
                    const title = e?.target.value
                    setValue('hoaPhoneNumberExtension', title)
                    if (title?.length > 20) {
                      setError('hoaPhoneNumberExtension', {
                        type: 'maxLength',
                        message: 'Please use 20 characters only.',
                      })
                    } else {
                      clearErrors('hoaPhoneNumberExtension')
                    }
                  }}
                  type="number"
                />
                <FormErrorMessage>
                  {errors?.hoaPhoneNumberExtension && errors?.hoaPhoneNumberExtension.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem pb={1}>
              <FormControl isInvalid={!!errors.hoaEmailAddress}>
                <FormLabel htmlFor="hoaContactEmail" size="md">
                  {t(`${NEW_PROJECT}.hoaContactEmail`)}
                </FormLabel>
                <Input
                  id="hoaContactEmail"
                  // {...register('hoaEmailAddress')}
                  {...register('hoaEmailAddress', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid Email Address',
                    },
                    maxLength: { value: 255, message: 'Please Use 255 Characters Only.' },
                  })}
                  value={message}
                  onChange={e => {
                    handleEmailChange(e)

                    const title = e.target.value
                    setValue('hoaEmailAddress', title)
                    if (title.length > 255) {
                      setError('hoaEmailAddress', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('hoaEmailAddress')
                    }
                  }}
                />
                <Text color="red" fontSize="14px" fontWeight="400">
                  {error ? error : ''}
                </Text>
                <FormErrorMessage>{errors?.hoaEmailAddress && errors?.hoaEmailAddress.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isInvalid={!!errors.reoNumber}>
                <FormLabel htmlFor="reoNumber" size="md">
                  {t(`${NEW_PROJECT}.reoNumber`)}
                </FormLabel>
                <Input id="reoNumber" {...register('reoNumber', {
                    maxLength: { value: 255, message: 'Please Use 255 Characters Only.' },
                  })} 
                  onChange={e => {
                    const title = e?.target.value
                    setValue('reoNumber', title)
                    if (title?.length > 255) {
                      setError('reoNumber', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('reoNumber')
                    }
                  }}/>
                  <FormErrorMessage>{errors?.reoNumber && errors?.reoNumber.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
          <VStack alignItems={'flex-start'} mt="10px">
            <FormLabel variant="bold-label" size="md">
              {t(`${NEW_PROJECT}.homeOwner`)}
            </FormLabel>
            <Grid templateColumns="repeat(3, 225px)" gap={'1rem 1.5rem'} m="0px">
              <GridItem>
                <FormControl isInvalid={!!errors?.homeOwnerName} height="100px">
                  <FormLabel isTruncated title={t(`${NEW_PROJECT}.name`)} size="md" htmlFor="name">
                    {t(`${NEW_PROJECT}.name`)}
                  </FormLabel>
                  <Input id="homeOwnerName" {...register('homeOwnerName', {
                    maxLength: { value: 255, message: 'Please Use 255 Characters Only.' },
                  })} 
                  onChange={e => {
                    const title = e?.target.value
                    setValue('homeOwnerName', title)
                    if (title?.length > 255) {
                      setError('homeOwnerName', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('homeOwnerName')
                    }
                  }} autoComplete="off" />
                    <FormErrorMessage>{errors?.homeOwnerName && errors?.homeOwnerName.message}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors?.hoaPhone}>
                  <FormLabel htmlFor="phone" size="md">
                    {t(`${NEW_PROJECT}.phone`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="homeOwnerPhone"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            id="homeOwnerPhone"
                            customInput={Input}
                            value={field.value}
                            onChange={e => {
                              field.onChange(e)
                            }}
                            format="(###)-###-####"
                            mask="_"
                            placeholder="(___)-___-____"
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors?.homeOwnerEmail} height="100px">
                  <FormLabel isTruncated title={t(`${NEW_PROJECT}.email`)} size="md" htmlFor="name">
                    {t(`${NEW_PROJECT}.email`)}
                  </FormLabel>
                  <Input
                    id="homeOwnerEmail"
                    {...register('homeOwnerEmail', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid Email Address',
                      },
                      maxLength: { value: 255, message: 'Please Use 255 Characters Only.' },
                    })}
                    onChange={e => {
                      const title = e.target.value
                      setValue('homeOwnerEmail', title)
                      if (title.length > 255) {
                        setError('homeOwnerEmail', {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors('homeOwnerEmail')
                      }
                    }}
                  />
                  <FormErrorMessage>{errors?.homeOwnerEmail?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>
          </VStack>
        </Box>

        <Flex display="flex" justifyContent="end" borderTop="1px solid #E2E8F0" pt="5" px="6">
          <Button onClick={props.onClose} variant="outline" size="md" colorScheme="brand">
            {t('cancel')}
          </Button>
          <Button
            colorScheme="brand"
            ml="3"
            size="md"
            disabled={isNextButtonDisabled}
            onClick={() => {
              if (addressShouldBeVerified) {
                refetch()
                onAddressVerificationModalOpen()
              } else {
                props.setNextTab()
              }
            }}
          >
            {t('next')}
          </Button>
        </Flex>
      </Flex>

      <AddressVerificationModal
        isOpen={isAddressVerficationModalOpen}
        onClose={onAddressVerificationModalClose}
        onSave={props.setNextTab}
        isAddressVerified={isAddressVerified}
        isLoading={isLoading}
      />
    </>
  )
}
