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
  Box,
} from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { Controller, useFormContext } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import { useEffect, useState } from 'react'
import { useMarkets, useProperties, useStates, useVerifyAddressApi } from 'utils/pc-projects'
import xml2js from 'xml2js'
import { ModalVerifyAddress } from 'features/project-coordinator/modal-verify-address'
import React from 'react'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { useProjects } from 'utils/projects'

export const AddPropertyInfo: React.FC<{
  isLoading: boolean
  setNextTab: () => void
  onClose: () => void
}> = props => {
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [addressVerificationStatus, setAddressVerificationStatus] = useState('verifying')
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false)
  const [verificationInProgress, setVerificationInProgress] = useState(false)
  const [check, setCheck] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [existProperty, setExistProperty] = useState([{ id: 0, status: '' }])

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  // API calls
  const { projects } = useProjects()
  const { data: properties } = useProperties()
  const { data: addressData, refetch } = useVerifyAddressApi(streetAddress, city, state, zipCode)
  const { data: statesData } = useStates()
  const { data: markets } = useMarkets()

  // Fill Dropdowns
  const states = statesData
    ? statesData?.map(state => ({
        label: state?.name,
        value: state?.code,
      }))
    : null

  const market = markets
    ? markets?.map(market => ({
        label: market?.metropolitanServiceArea,
        value: market?.id,
      }))
    : null

  const addressOptions = properties
    ? properties?.map(property => ({
        label: property?.streetAddress,
        value: property?.id,
      }))
    : null

  // Continue unverified Check
  const handleCheck = () => {
    setCheck(!check)
    setIsDuplicateAddress(false)
    setValue('acknowledgeCheck', true)
  }

  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<ProjectFormValues>()

  // On Street Address change, set values of City, State and Zip
  const setAddressValues = e => {
    setIsDuplicateAddress(false)
    properties.map(property => {
      if (e.label === property?.streetAddress) {
        setValue('streetAddress', property.streetAddress)
        setValue('city', property.city)
        setValue('state', property.state)
        setValue('zipCode', property.zipCode)
        setValue('propertyId', property.id)
        setValue('property', property)
        setStreetAddress(property.streetAddress)
        setCity(property.city)
        setZipCode(property.zipCode)
        setState(property.state)

        // Check for duplicate address
        projects?.map(p => {
          if (p.propertyId === property.id) {
            setExistProperty(existProperty)
            existProperty?.push({ id: p.id, status: p.projectStatus })
            delete existProperty[0]
            if (existProperty) {
              setIsDuplicateAddress(true)
            } else {
              setIsDuplicateAddress(false)
            }
          }
        })
      }
      return property
    })
  }

  const setStates = e => {
    setValue('state', e.label)
    setState(e.value)
  }

  const setMarket = e => {
    setValue('newMarketId', e.value)
  }

  // Parse XML to Verify Address
  useEffect(() => {
    if (addressData) {
      const parser = new xml2js.Parser()
      parser
        .parseStringPromise(addressData.data)
        .then(function (result) {
          result.AddressValidateResponse.Address.forEach(record => {
            if (record.Error !== undefined) {
              setAddressVerificationStatus('failed')
              setVerificationInProgress(true)
            } else {
              setAddressVerificationStatus('success')
              setVerificationInProgress(true)
            }
          })
        })
        .catch(function (err) {
          // Failed
        })
    }
  }, [addressData])

  const {
    isOpen: isAddressVerifyModalOpen,
    onClose: onAddressVerifyModalClose,
    onOpen: onOpenAddressVerifyModalOpen,
  } = useDisclosure()

  return (
    <>
      {isDuplicateAddress && (
        <Alert status="info" mb={5} bg="#EBF8FF" rounded={6} width="75%">
          <AlertIcon />
          <AlertDescription>
            <Box color="red">
              {existProperty &&
                existProperty?.map(
                  p => 'Project ID ' + p.id + ' using this address already exist & is in ' + p.status + ' state. ',
                )}
            </Box>
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
            Acknowledged
          </Checkbox>
        </Alert>
      )}
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Address
            </FormLabel>
            <Controller
              control={control}
              name={`streetAddress`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect
                    id="streetAddress"
                    options={addressOptions}
                    selected={value}
                    placeholder="Type address here.."
                    onChange={setAddressValues}
                    selectProps={{ isBorderLeft: true }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
            <FormErrorMessage>{errors?.streetAddress && errors?.streetAddress?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors?.city && errors?.city?.message}
              label={'City'}
              placeholder=""
              register={register}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`city`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              State
            </FormLabel>
            <Controller
              control={control}
              name={`state`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect
                    id="state"
                    options={states}
                    selected={value}
                    onChange={setStates}
                    selectProps={{ isBorderLeft: true }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors?.zipCode && errors?.zipCode?.message}
              label={'Zip'}
              placeholder=""
              register={register}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`zipCode`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Market
            </FormLabel>
            <Controller
              control={control}
              name={`newMarketId`}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect
                    id="market"
                    options={market}
                    selected={value}
                    onChange={setMarket}
                    selectProps={{ isBorderLeft: true }}
                    rules={{ required: 'This is required field' }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors?.gateCode && errors?.gateCode?.message}
              label={'Gate Code'}
              placeholder=""
              register={register}
              name={`gateCode`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors?.lockBoxCode && errors?.lockBoxCode?.message}
              label={'Lock Box Code'}
              placeholder=""
              register={register}
              name={`lockBoxCode`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors?.hoaPhone && errors?.hoaPhone?.message}
              label={'HOA Contact Phone'}
              placeholder=""
              register={register}
              name={`hoaPhone`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors?.hoaPhoneNumberExtension && errors?.hoaPhoneNumberExtension?.message}
              label={'Ext.'}
              placeholder=""
              register={register}
              name={`hoaPhoneNumberExtension`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors?.hoaEmailAddress && errors?.hoaEmailAddress?.message}
              label={'HOA Contact Email'}
              placeholder=""
              register={register}
              name={`hoaEmailAddress`}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid display="flex" position={'absolute'} right={10} bottom={5}>
        <Button onClick={props.onClose} variant="outline" size="md" color="#4E87F8" border="2px solid #4E87F8">
          {'Cancel'}
        </Button>
        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          _hover={{ bg: 'blue' }}
          ml="3"
          size="md"
          disabled={!check && isDuplicateAddress && !verificationInProgress}
          onClick={() => {
            setTimeout(() => {
              refetch()
            }, 2000)
            onOpenAddressVerifyModalOpen()
          }}
        >
          {'Next'}
        </Button>
      </Grid>
      <ModalVerifyAddress
        title="Address Verification"
        isOpen={isAddressVerifyModalOpen}
        onClose={onAddressVerifyModalClose}
        addressVerificationStatus={addressVerificationStatus}
        setNextTab={setNextTab}
        props={props}
      />
    </>
  )
}
