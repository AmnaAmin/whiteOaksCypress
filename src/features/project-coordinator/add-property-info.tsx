import { Button, FormControl, Grid, GridItem, useDisclosure } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { verifyAddressValues } from 'types/project.type'
import { useCallback, useEffect, useState } from 'react'
import { useVerifyAddressApi } from 'utils/pc-projects'
import xml2js from 'xml2js'
import { ModalVerifyAddress } from 'features/project-coordinator/modal-verify-address'
import React from 'react'
import { ModalDuplicateAddress } from './modal-duplicate-address'

export const AddPropertyInfo = props => {
  // const { mutate: saveAddress, data: addressPayload } = useAddressSettings()
  // const { projectId } = useParams<{ projectId: string }>()
  // const { data: address } = useAddressDetails(projectId)
  const [streetAddress, setStreetAddress] = useState()
  const [city, setCity] = useState()
  const [state, setState] = useState()
  const [zipCode, setZipCode] = useState()
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false)

  const { data: addressData, refetch } = useVerifyAddressApi(streetAddress, city, state, zipCode)

  const states = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]

  const markets = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]

  // const addressDefaultValue = address => {
  //   const addressValues = {
  //     streetAddress: address.streetAddress,
  //     city: address.city,
  //     state: address.state,
  //     zipCode: address.zipCode,
  //   }
  //   return addressValues
  // }

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<verifyAddressValues>()

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
      }
      setStreetAddress(addressInfo.streetAddress)
      setCity(addressInfo.city)
      setState(addressInfo.state)
      setZipCode(addressInfo.zipCode)
      setIsDuplicateAddress(true)
    },
    [refetch, setStreetAddress, setCity, setState, setZipCode],
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

  const {
    isOpen: isAddressDuplicateModalOpen,
    onClose: onAddressDuplicateModalClose,
    onOpen: onOpenAddressDuplicateModalOpen,
  } = useDisclosure()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Address'}
              placeholder="Type Property Address . ."
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`streetAddress`}
              // onChange={s => onTypeAheadAddressChange(s)}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'City'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`city`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'State'}
              name={`state`}
              control={control}
              options={states}
              rules={{ required: 'This is required field' }}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Zip'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`zipCode`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'Markets'}
              name={`markets`}
              control={control}
              options={markets}
              rules={{ required: 'This is required field' }}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Gate Code'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`gateCode`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Lunch Box Code'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`lunchBoxCode`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'HOA Contact Phone'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`HOAContactPhone`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Ext.'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`ext`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'HOA Contact Email'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`HOAContactEmail`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid display="flex" alignItems="center">
        <Button // onClose={onAddressVerifyModalClose}
          variant="ghost"
          size="sm"
        >
          {'Close'}
        </Button>

        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          _hover={{ bg: 'blue' }}
          ml="3"
          size="sm"
          type="submit"
          onClick={() => {
            refetch()
            // onOpenAddressVerifyModalOpen()
            onOpenAddressDuplicateModalOpen()
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

      <ModalDuplicateAddress
        title="Address already exist"
        content="Address already exist"
        isOpen={isAddressDuplicateModalOpen}
        onClose={onAddressDuplicateModalClose}
        props={''} // onConfirm={onDeleteConfirmationModalClose}
        save={saveModalVerify}
        // addressVerificationStatus={addressVerificationStatus}
      />
    </form>
  )
}
