import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { ProjectInfo } from 'types/project.type'
import { useCallback, useEffect, useState } from 'react'
import { useMarkets, useProperties, useSaveProjectDetails, useStates, useVerifyAddressApi } from 'utils/pc-projects'
import xml2js from 'xml2js'
import { ModalVerifyAddress } from 'features/project-coordinator/modal-verify-address'
import React from 'react'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
// import { Typeahead } from 'react-bootstrap-typeahead'

export const AddPropertyInfo = props => {
  const [streetAddress, setStreetAddress] = useState()
  const [city, setCity] = useState()
  const [state, setState] = useState()
  const [zipCode, setZipCode] = useState()
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false)
  const [check, setCheck] = useState(false)
  const { data: properties } = useProperties()
  console.log(properties)
  const { data: addressData, refetch } = useVerifyAddressApi(streetAddress, city, state, zipCode)
  const { data: statesData } = useStates()
  const { mutate: saveProjectDetails } = useSaveProjectDetails()
  const ref = React.createRef()

  // const { data: markets } = useMarkets()
  // console.log(markets)

  const states = statesData
    ? statesData?.map(state => ({
        label: state?.name,
        value: state?.id,
      }))
    : null

  const market = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]
  // const market = markets
  //   ? markets?.map(market => ({
  //       label: market?.metropolitanServiceArea,
  //       value: market?.id,
  //     }))
  //   : null

  const typeAheadProperties = properties
    ? properties?.map(property => ({
        id: property?.id,
        streetAddress: property?.streetAddress,
        city: property?.city,
        state: property?.state,
        zip: property?.zip,
      }))
    : null

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<ProjectInfo>()

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

  const onSubmit = useCallback(
    async values => {
      setTimeout(() => {
        refetch()
      }, 2000)
      const addressInfo = {
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        market: values.market,
        gateCode: values.gateCode,
        lockBoxCode: values.lockBoxCode,
        hoaPhone: values.hoaPhone,
        hoaPhoneNumberExtension: values.hoaPhoneNumberExtension,
        hoaEmailAddress: values.hoaEmailAddress,
      }
      setStreetAddress(addressInfo.streetAddress)
      setCity(addressInfo.city)
      setState(addressInfo.state)
      setZipCode(addressInfo.zipCode)
      setIsDuplicateAddress(true)
      console.log('payload', addressInfo)
      saveProjectDetails(addressInfo, {
        onSuccess() {
          props.setNextTab()
        },
      })
    },
    [refetch, setStreetAddress, setCity, setState, setZipCode, saveProjectDetails],
  )

  // Parse XML
  useEffect(() => {
    if (addressData) {
      const parser = new xml2js.Parser()
      parser
        .parseStringPromise(addressData.data)
        .then(function (result) {
          result.AddressValidateResponse.Address.forEach(record => {
            if (record.Error !== undefined) {
              setAddressVerificationStatus('failed')
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
            }
          })
        })
        .catch(function (err) {
          // Failed
        })

      // const defaultAddress = addressDefaultValue(addressData)
      // reset(defaultAddress)
    }
  }, [addressData])

  const [showModal, setShowModal] = useState(false)
  const [projectPayload, setProjectPayload] = useState({})
  const [property, setProperty] = useState({})
  const [showVerificationUSPS, setShowVerificationUSPS] = useState(false)
  const [addressVerificationStatus, setAddressVerificationStatus] = useState('verifying')

  const saveModalVerify = () => {
    const property = {
      ...projectPayload,
      streetAddress: projectPayload,
    }
    const p = { ...projectPayload, ...{ property }, newProperty: property }

    props.createEntity({ ...p })
  }

  const {
    isOpen: isAddressVerifyModalOpen,
    onClose: onAddressVerifyModalClose,
    onOpen: onOpenAddressVerifyModalOpen,
  } = useDisclosure()

  const onClose = () => {
    setShowModal(false)
  }

  const handleCheck = () => {
    setCheck(!check)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            {/* <FormLabel>Address</FormLabel>
            <Typeahead
              required
              maxHeight={400}
              maxResults={10000}
              align="left"
              ref={ref}
              shouldSelect={true}
              allowNew
              labelKey="streetAddress"
              id="project-streetAddress"
              newSelectionPrefix="(click to select)"
              options={typeAheadProperties}
              name={`streetAddress`}
              // name="property.streetAddress"
              //  onBlur={s => onTypeAheadAddressBlur(s)}
              //  onChange={s => onTypeAheadAddressChange(s)}
              placeholder="type property address..."
            /> */}
            <FormInput
              errorMessage={errors.streetAddress && errors.streetAddress?.message}
              label={'Address'}
              placeholder="Type Property Address . ."
              register={register}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`streetAddress`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.city && errors.city?.message}
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
            <FormSelect
              errorMessage={errors.state && errors.state?.message}
              label={'State'}
              name={`state`}
              control={control}
              options={states}
              rules={{ required: 'This is required field' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.zipCode && errors.zipCode?.message}
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
            <FormSelect
              errorMessage={errors.market && errors.market?.message}
              label={'Markets'}
              name={`market`}
              control={control}
              options={market}
              rules={{ required: 'This is required field' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.gateCode && errors.gateCode?.message}
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
              errorMessage={errors.lockBoxCode && errors.lockBoxCode?.message}
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
              errorMessage={errors.hoaPhone && errors.hoaPhone?.message}
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
              errorMessage={errors.hoaPhoneNumberExtension && errors.hoaPhoneNumberExtension?.message}
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
              errorMessage={errors.hoaEmailAddress && errors.hoaEmailAddress?.message}
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
        <Button onClick={onClose} variant="outline" size="md" color="#4E87F8" border="2px solid #4E87F8">
          {'Cancel'}
        </Button>
        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          _hover={{ bg: 'blue' }}
          ml="3"
          size="md"
          type="submit"
          disabled={!check && isDuplicateAddress}
          onClick={() => {
            refetch()
            onOpenAddressVerifyModalOpen()
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
        props={''} // onConfirm={onDeleteConfirmationModalClose}
        save={saveModalVerify}
        addressVerificationStatus={addressVerificationStatus}
      />
    </form>
  )
}
