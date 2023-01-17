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
import { useGetAddressVerification, useMarkets, useProperties, useStates } from 'api/pc-projects'
import { useTranslation } from 'react-i18next'
import { AddressVerificationModal } from './address-verification-modal'
import { useAddressShouldBeVerified, usePropertyInformationNextDisabled } from './hooks'
import NumberFormat from 'react-number-format'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { STATUS } from 'features/common/status'
import { validEmail } from 'utils/string-formatters'
import { CustomRequiredInput } from 'components/input/input'

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

  // API calls
  const { projects } = useProjects()
  const { propertySelectOptions } = useProperties()
  const { stateSelectOptions, states } = useStates()
  const { marketSelectOptions, markets } = useMarkets()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { data: isAddressVerified, refetch, isLoading } = useGetAddressVerification(addressInfo)

  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<ProjectFormValues>()

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
    setValue('state', { label: state?.name, value: state?.code })

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
    if (!validEmail(event.target.value)) {
      setError('invalid email address')
    } else {
      setError('')
    }

    setMessage(event.target.value)
  }

  return (
    <>
      <Flex flexDir="column">
        <Box px="6" minH="300px">
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
                    required: true,
                    onChange: e => {
                      setAddressInfo({ ...addressInfo, city: e.target.value })
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
                        {...field}
                        options={stateSelectOptions}
                        size="md"
                        value={field.value}
                        selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                        onChange={option => {
                          setAddressInfo({ ...addressInfo, state: option?.value })
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
              <FormControl isInvalid={!!errors?.zipCode}>
                <FormLabel htmlFor="zipCode" size="md">
                  {t(`${NEW_PROJECT}.zipCode`)}
                </FormLabel>
                <Input
                  id="zipCode"
                  variant="required-field"
                  {...register('zipCode', {
                    required: true,
                    onChange: e => {
                      setAddressInfo({ ...addressInfo, zipCode: e.target.value })
                    },
                  })}
                  type="number"
                />
                <FormErrorMessage>{errors?.zipCode && errors?.zipCode?.message}</FormErrorMessage>
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
                        {...field}
                        options={marketSelectOptions}
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
              <FormControl>
                <FormLabel htmlFor="gateCode" size="md">
                  {t(`${NEW_PROJECT}.gateCode`)}
                </FormLabel>
                <Input id="gateCode" {...register('gateCode')} type="number" />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel htmlFor="lockBoxCode" size="md">
                  {t(`${NEW_PROJECT}.lockBoxCode`)}
                </FormLabel>
                <Input id="lockBoxCode" {...register('lockBoxCode')} type="number" />
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
                          customInput={CustomRequiredInput}
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
              <FormControl>
                <FormLabel htmlFor="ext" size="md">
                  {t(`${NEW_PROJECT}.ext`)}
                </FormLabel>
                <Input id="ext" {...register('hoaPhoneNumberExtension')} type="number" />
              </FormControl>
            </GridItem>
            <GridItem pb={1}>
              <FormControl isInvalid={!!errors.hoaEmailAddress}>
                <FormLabel htmlFor="hoaContactEmail" size="md">
                  {t(`${NEW_PROJECT}.hoaContactEmail`)}
                </FormLabel>
                <Input
                  id="hoaContactEmail"
                  {...register('hoaEmailAddress')}
                  value={message}
                  onChange={handleEmailChange}
                />
                <Text color="red">{error ? error : ''}</Text>
              </FormControl>
            </GridItem>
          </Grid>
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
