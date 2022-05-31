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
import Select from 'react-select'
// import Creatable from 'react-select/creatable' //check for input on select

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

  // API calls
  const { data: properties } = useProperties()
  const { data: addressData, refetch } = useVerifyAddressApi(streetAddress, city, state, zipCode)
  const { data: statesData } = useStates()
  const { data: markets } = useMarkets()

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
  }

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'gray.600',
  }

  const inputStyle = {
    color: 'gray.500',
    fontSize: '14px',
    fontWeight: '400',
    type: 'text',
    bg: 'white',
    size: 'md',
    borderLeft: '1.5px solid #4E87F8',
    lineHeight: 2,
  }

  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<ProjectFormValues>()

  // On Street Address change, set values of City, State and Zip
  const setAddressValues = e => {
    properties.find(property => {
      if (e.label === property?.streetAddress) {
        setValue('streetAddress', property.streetAddress)
        setValue('city', property.city)
        setValue('state', property.state)
        setValue('zipCode', property.zipCode)
        setIsDuplicateAddress(true)
      }
      return streetAddress
    })
    setIsDuplicateAddress(false)
  }

  const setStates = e => {
    setValue('state', e.label)
  }

  const setMarket = e => {
    setValue('market', e.value)
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
              const address = {
                streetAddress: record.Address2[0],
                city: record.City[0],
                state: record.State[0],
                zipCode: record.Zip5[0],
              }
              record.streetAddress = address.streetAddress
              record.city = address.city
              record.state = address.state
              record.zipCode = address.zipCode
              setStreetAddress(address.streetAddress)
              setCity(address.city)
              setState(address.state)
              setZipCode(address.zipCode)
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
          <AlertDescription color="red">
            Project ID xxx using this address already exist & is in xxx state.
          </AlertDescription>
          <Divider orientation="vertical" h={6} marginLeft={6} />
          <Checkbox type="checkbox" marginTop={1} marginLeft={6} color="#4E87F8" onChange={handleCheck}>
            Acknowledged
          </Checkbox>
        </Alert>
      )}
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Address</FormLabel>
            <Controller
              control={control}
              name={`streetAddress`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <Select
                    id="streetAddress"
                    options={addressOptions}
                    selected={value}
                    elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
                    sx={inputStyle}
                    placeholder="Type address here.."
                    onChange={setAddressValues}
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
            <FormLabel sx={labelStyle}>State</FormLabel>
            <Controller
              control={control}
              name={`state`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <Select
                    id="state"
                    options={states}
                    selected={value}
                    elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
                    sx={inputStyle}
                    onChange={setStates}
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
            <FormLabel sx={labelStyle}>Market</FormLabel>
            <Controller
              control={control}
              name={`market`}
              // rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <Select
                    id="market"
                    options={market}
                    selected={value}
                    elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
                    sx={inputStyle}
                    onChange={setMarket}
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
              rules={{ required: 'This is required field' }}
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
              rules={{ required: 'This is required field' }}
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
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
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
              rules={{ required: 'This is required field' }}
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
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
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
            props.setNextTab()
          }}
        >
          {'Next'}
        </Button>
      </Grid>
      <ModalVerifyAddress
        title="Address Verification"
        content="Address Verification"
        isOpen={isAddressVerifyModalOpen}
        onClose={onAddressVerifyModalClose}
        props={''}
        addressVerificationStatus={addressVerificationStatus}
      />
    </>
  )
}
