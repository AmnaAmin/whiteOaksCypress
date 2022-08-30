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
import { Controller, useFormContext } from 'react-hook-form'
import { AddressInfo, ProjectFormValues } from 'types/project.type'
import { useState } from 'react'
import React from 'react'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import { useProjects } from 'api/projects'
import Select from 'components/form/react-select'
import { CreatableSelect } from 'components/form/react-select'
import { useGetAddressVerification, useMarkets, useProperties, useStates } from 'api/pc-projects'
import { useTranslation } from 'react-i18next'
import { AddressVerificationModal } from './address-verification-modal'
import { useAddressShouldBeVerified, usePropertyInformationNextDisabled } from './hooks'
import NumberFormat from 'react-number-format'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { STATUS } from 'features/common/status'

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
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({ address: '', city: '', state: '', zipCode: '' })
  const [check, setCheck] = useState(false)
  const [existProperty, setExistProperty] = useState([{ id: 0, status: '' }])

  // API calls
  const { projects } = useProjects()
  const { propertySelectOptions } = useProperties()
  const { stateSelectOptions } = useStates()
  const { marketSelectOptions, markets } = useMarkets()

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

  // On Street Address change, set values of City, State and Zip
  const setAddressValues = option => {
    const property = option?.property
    const market = markets.find(m => m?.id === property?.marketId)

    setValue('streetAddress', property?.streetAddress || option.label)
    setValue('city', property?.city)
    setValue('zipCode', property?.zipCode)
    setValue('propertyId', property?.id)
    setValue('property', property)
    setValue('newMarket', { label: market?.metropolitanServiceArea, value: market?.id })
    setValue('state', { label: market?.stateName, value: market?.stateId })

    setAddressInfo({
      address: property?.streetAddress,
      city: property?.city,
      state: market?.state,
      zipCode: property?.zipCode,
    })

    // Check for duplicate address
    const duplicatedInProjects =
      projects?.filter(
        p =>
          p.propertyId === property?.id &&
          [STATUS.New, STATUS.Active, STATUS.Punch, STATUS.Closed].includes(
            p.projectStatus?.toLowerCase() as STATUS,
          ),
      ) || []
    setIsDuplicateAddress(false)
    setValue('acknowledgeCheck', false)

    if (duplicatedInProjects?.length > 0) {
      setIsDuplicateAddress(true)
      setExistProperty(duplicatedInProjects.map(p => ({ id: p.id as number, status: p.projectStatus as string })))
    }
  }

  return (
    <>
      <Flex flexDir="column" minH="420px">
        <Box flex="1">
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
                <FormLabel variant="strong-label" size="md">
                  {t(`${NEW_PROJECT}.address`)}
                </FormLabel>
                <Controller
                  control={control}
                  name={`streetAddress`}
                  rules={{ required: 'This is required field' }}
                  render={({ field: { value }, fieldState }) => (
                    <>
                      <CreatableSelect
                        id="streetAddress"
                        options={propertySelectOptions}
                        selected={value}
                        placeholder="Type address here.."
                        onChange={setAddressValues}
                        selectProps={{ isBorderLeft: true }}
                        inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
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
                  {...register('city', { required: 'This is required field.' })}
                />
                <FormErrorMessage>{errors?.city && errors?.city?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t(`${NEW_PROJECT}.state`)}
                </FormLabel>
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
                        selectProps={{ isBorderLeft: true }}
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
                        selectProps={{ isBorderLeft: true }}
                        onChange={option => {
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
                <Input id="gateCode" {...register('gateCode')} />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel htmlFor="lockBoxCode" size="md">
                  {t(`${NEW_PROJECT}.lockBoxCode`)}
                </FormLabel>
                <Input id="lockBoxCode" {...register('lockBoxCode')} />
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
                          onChange={e => field.onChange(e)}
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
                <Input id="ext" {...register('hoaPhoneNumberExtension')} />
              </FormControl>
            </GridItem>
            <GridItem pb={1}>
              <FormControl>
                <FormLabel htmlFor="hoaContactEmail" size="md">
                  {t(`${NEW_PROJECT}.hoaContactEmail`)}
                </FormLabel>
                <Input id="hoaContactEmail" {...register('hoaEmailAddress')} />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>

        <Flex display="flex" justifyContent="end" borderTop="1px solid #E2E8F0" pt="5">
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
