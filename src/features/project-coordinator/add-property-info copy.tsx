// import React, { useEffect, useState } from 'react'
import { Button, FormControl, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { PropertyType } from 'types/project.type'
import { useCallback, useEffect } from 'react'
import { useAddressDetails, useAddressSettings } from 'utils/pc-projects'
// import { ref } from 'yup'
// import ModalVerifyAddress from './modal-verify-address'
// import { verifyAddressApi } from 'utils/pc-projects'
// import xml2js from 'xml2js'

export const AddPropertyInfo = props => {
  // const { states, marketList, properties, close, open, clients, FPMUsers } = props
  const { mutate: saveAddress } = useAddressSettings()
  const { data: address, refetch } = useAddressDetails()

  const { register, control } = useForm({})

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

  const addressDefaultValue = address => {
    const settings = {
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    }
    return settings
  }

  const {
    // register,
    formState: { errors },
    handleSubmit,
    // control,
    reset,
  } = useForm<PropertyType>()

  useEffect(() => {
    if (address) {
      const defaultSettings = addressDefaultValue(address)
      reset(defaultSettings)
    }
  }, [address, reset])

  const onSubmit = useCallback(
    async values => {
      // let fileContents: any = null
      // if (values.profilePicture && values.profilePicture[0]) {
      //   fileContents = await readFileContent(values.profilePicture[0])
      // }
      const propertiesPayload = {
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
      }
      saveAddress(propertiesPayload)
      // setTimeout(() => {
      //   refetch()
      // }, 2000) // call for refetch because we are getting no response from current api. Needs to change when correct response is receieved
    },
    [saveAddress],
  )

  // const [projectEntity, setProjectEntity] = useState() //defaultValue);
  // const [projectPayload, setProjectPayload] = useState({})
  // const [typeAheadProperties, setTypeAheadProperties] = useState()
  // const [property, setProperty] = useState({})
  // const [showVerificationUSPS, setShowVerificationUSPS] = useState(false)
  // const [addressVerificationStatus, setAddressVerificationStatus] = useState('verifying')
  // const [isDuplicateAddress, setIsDuplicateAddress] = useState(false)
  // const [addressReadOnly, setAddressReadOnly] = useState(false)

  // useEffect(() => {
  //   props.fetchMarkets()
  //   props.getProperties()
  //   props.ptListFetch('', '', 'value,ac') // HK|WOA 1960
  //   props.getFPMUsers()
  //   props.getClients('', '', 'companyName,asc') // HK|WOA 1960
  // }, [])

  // useEffect(() => {}, [states, clients, FPMUsers])

  // useEffect(() => {
  //   setTypeAheadProperties(properties)
  // }, [properties])

  // const isLoading = () => {
  //   // const loading =   props.FPMUsersLoading && props.clientsLoading && props.propertiesLoading && props.marketLoading && props.statesLoading;
  //   const loading = props.marketLoading
  //   return loading
  // }

  // // const onTypeAheadAddressBlur = e => {
  // //   if (e.target.value !== property.streetAddress) {
  // //     delete property.id;
  // //     setProperty(property);
  // //     setAddressReadOnly(false);
  // //  1 }
  // //   property.streetAddress = e.target.value;
  // // };

  // useEffect(() => {
  //   if (props.projectByProperty.length > 0) {
  //     setIsDuplicateAddress(true)
  //   }
  // }, [props.projectByProperty])

  // const onTypeAheadAddressChange = e => {
  //   setIsDuplicateAddress(false)
  //   // const a = typeAheadProperties.filter(f => f.streetAddress === e[0]?.streetAddress)
  //   // if (a && a.length > 0) {
  //   //   props.getProjectByPropertyId(a[0].id)
  //   // }
  //   const x = 1
  //   if (e.length > 0) {
  //     if (e[0].customOption === undefined) {
  //       const newProperty = e[0]
  //       setProperty(newProperty)
  //       setAddressReadOnly(true)
  //     } else {
  //       // delete property.id;
  //       // property.streetAddress = e[0].streetAddress;
  //       setProperty(property)
  //       setAddressReadOnly(false)
  //     }
  //   }
  // }

  // const verifyAddress = (propertyInput, values) => {
  //   verifyAddressApi(propertyInput, values).then(response => {
  //     const parser = new xml2js.Parser(/* options */)
  //     const array = []
  //     parser
  //       .parseStringPromise(response.data)
  //       .then(function (result) {
  //         result.AddressValidateResponse.Address.forEach(record => {
  //           if (record.Error !== undefined) {
  //             setAddressVerificationStatus('failed')
  //           } else {
  //             setAddressVerificationStatus('success')
  //             const address = {
  //               streetAddress: record.Address2[0],
  //               city: record.City[0],
  //               state: record.State[0],
  //               zipCode: record.Zip5[0],
  //             }
  //             values.property.streetAddress = address.streetAddress
  //             values.property.city = address.city
  //             values.property.state = address.state
  //             values.property.zipCode = address.zipCode
  //             // const projectUpdate = {
  //             //   ...projectEntity,
  //             //   ...values,
  //             //   documents: documentInput,
  //             //   newProperty: values.property,
  //             //   newMarketId: values.property.marketId,
  //             // };
  //             // props.createEntity(projectUpdate);
  //           }
  //         })
  //       })
  //       .catch(function (err) {
  //         // Failed
  //       })
  //   })
  // }

  // const save = (event, errors, values) => {
  //   if (errors.length > 0) return

  //   // if (Object.keys(sowDocument).length === 0) return;

  //   // //  this means user typed something and tabbed out of it
  //   // if (document.getElementsByClassName('rbt-input-main')[0].value !== property.streetAddress) {
  //   //   delete property?.id;
  //   // }

  //   // values.clientDueDate = convertDateTimeToServer(values.clientDueDate);
  //   // values.clientStartDate = convertDateTimeToServer(values.clientStartDate);
  //   // values.clientWalkthroughDate = convertDateTimeToServer(values.clientWalkthroughDate);
  //   // values.woaCompletionDate = convertDateTimeToServer(values.woaCompletionDate);
  //   // values.woaStartDate = convertDateTimeToServer(values.woaStartDate);
  //   // values.projectClosedDate = convertDateTimeToServer(values.projectClosedDate);
  //   // values.projectExpectedCloseDate = convertDateTimeToServer(values.projectExpectedCloseDate);
  //   // values.projectStartDate = convertDateTimeToServer(values.projectStartDate);
  //   // values.clientSignoffDate = convertDateTimeToServer(values.clientSignoffDate);

  //   // values.sowOriginalContractAmount = removeCurrencyFormat(values.sowOriginalContractAmount);
  //   // values.clientName = clients.find(c => +c?.id === +values?.clientId)?.companyName;

  //   // const documents = [];
  //   // documents.push(sowDocument);
  //   const projectUpdate = {
  //     ...values,
  //     propertyId: property,
  //     newMarketId: property,
  //     streetAddress: property,
  //     acknowledgeCheck: true,
  //   }
  //   if (property === undefined) {
  //     setAddressVerificationStatus('verifying')
  //     setShowVerificationUSPS(true)
  //     setProjectPayload(projectUpdate)
  //     setTimeout(function () {
  //       verifyAddress(property, values)
  //     }, 2000)
  //   } else {
  //     props.createEntity(projectUpdate)
  //   }
  // }

  // const closeAddressVerificationModal = () => {
  //   setShowVerificationUSPS(false)
  // }

  // const saveModalVerify = () => {
  //   const property = {
  //     ...projectPayload,
  //     streetAddress: projectPayload,
  //   }
  //   const p = { ...projectPayload, ...{ property }, newProperty: property }

  //   props.createEntity({ ...p })
  // }

  return (
    <form>
      {/* <ModalVerifyAddress
          isOpen={showVerificationUSPS}
          addressVerificationStatus={addressVerificationStatus}
          closeAddressVerificationModal={closeAddressVerificationModal}
          save={saveModalVerify}
        /> */}
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Address'}
              placeholder="Type Address Here"
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
              name={`zip`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
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
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
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
      <Button
        colorScheme="CustomPrimaryColor"
        _focus={{ outline: 'none' }}
        _hover={{ bg: 'blue' }}
        type="submit"
        form="newProjectForm"
        ml="3"
        size="sm"
        disabled={true}
        onClick={onSubmit}
      >
        {'Save'}
      </Button>
    </form>
  )
}
