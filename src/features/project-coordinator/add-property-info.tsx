// import React, { useEffect, useState } from 'react'
import { Button, FormControl, Grid, GridItem, useDisclosure } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { defaultValue, PropertyType } from 'types/project.type'
import { useCallback, useEffect, useState } from 'react'
import { useAddressDetails, useAddressSettings, usePCProperties, useVerifyAddressApi } from 'utils/pc-projects'
//import ModalVerifyAddress from 'features/modal-verify-address'
// import { ref } from 'yup'
// import { verifyAddressApi } from 'utils/pc-projects'
import xml2js from 'xml2js'
import { ModalVerifyAddress } from 'features/modal-verify-address'
import { AddNewProjectModal } from './add-project'
import { ConfirmationBox } from 'components/Confirmation'

export const AddPropertyInfo = props => {
  //const { states, marketList, properties, close, open, clients, FPMUsers } = props
  const { mutate: saveAddress } = useAddressSettings()
  const { data: address, refetch } = useAddressDetails()
  const { propertiesData } = usePCProperties()
  console.log(propertiesData)

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
    const addressValues = {
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    }
    return addressValues
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
      const propertiesPayload = {
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
      }
      saveAddress(propertiesPayload)
      // console.log(addressData)
    },
    [saveAddress],
  )

  // const { isOpen: isOpenAddresstModal, onClose: onAddressModalClose, onOpen: onAddressModalOpen } = useDisclosure()

  // const [projectEntity, setProjectEntity] = useState(defaultValue)
  const [projectPayload, setProjectPayload] = useState({})
  // const [typeAheadProperties, setTypeAheadProperties] = useState()
  const [property, setProperty] = useState({})
  const [showVerificationUSPS, setShowVerificationUSPS] = useState(false)
  const [addressVerificationStatus, setAddressVerificationStatus] = useState('verifying')
  // const [isDuplicateAddress, setIsDuplicateAddress] = useState(false)
  // const [addressReadOnly, setAddressReadOnly] = useState(false)

  // useEffect(() => {
  //   props.getProperties()
  // }, [])

  // useEffect(() => {}, [states, clients, FPMUsers])

  // useEffect(() => {
  //   return setTypeAheadProperties(property)
  // }, [property])

  // const isLoading = () => {
  //   // const loading =   props.FPMUsersLoading && props.clientsLoading && props.propertiesLoading && props.marketLoading && props.statesLoading;
  //   const loading = props.marketLoading
  //   return loading
  // }

  // const onTypeAheadAddressBlur = e => {
  //   if (e.target.value !== property.streetAddress) {
  //     delete property.id;
  //     setProperty(property);
  //     setAddressReadOnly(false);
  //  1 }
  //   property.streetAddress = e.target.value;
  // };

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

  const useverifyAddress = (propertyInput, values) => {
    useVerifyAddressApi(propertyInput, values).then((response: { data: any }) => {
      const parser = new xml2js.Parser(/* options */)
      const array = []
      parser
        .parseStringPromise()
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
              values.property.streetAddress = address.streetAddress
              values.property.city = address.city
              values.property.state = address.state
              values.property.zipCode = address.zipCode
              // const projectUpdate = {
              //   ...projectEntity,
              //   ...values,
              //   documents: documentInput,
              //   newProperty: values.property,
              //   newMarketId: values.property.marketId,
              // };
              // props.createEntity(projectUpdate);
            }
          })
        })
        .catch(function (err) {
          // Failed
        })
    })
  }

  const save = (event, errors, values) => {
    if (errors.length > 0) return

    //  if (Object.keys(sowDocument).length === 0) return;

    // //  this means user typed something and tabbed out of it
    // if (document.getElementsByClassName('rbt-input-main')[0].value !== property.streetAddress) {
    //   delete property?.id;
    // }

    // values.clientDueDate = convertDateTimeToServer(values.clientDueDate);
    // values.clientStartDate = convertDateTimeToServer(values.clientStartDate);
    // values.clientWalkthroughDate = convertDateTimeToServer(values.clientWalkthroughDate);
    // values.woaCompletionDate = convertDateTimeToServer(values.woaCompletionDate);
    // values.woaStartDate = convertDateTimeToServer(values.woaStartDate);
    // values.projectClosedDate = convertDateTimeToServer(values.projectClosedDate);
    // values.projectExpectedCloseDate = convertDateTimeToServer(values.projectExpectedCloseDate);
    // values.projectStartDate = convertDateTimeToServer(values.projectStartDate);
    // values.clientSignoffDate = convertDateTimeToServer(values.clientSignoffDate);

    // values.sowOriginalContractAmount = removeCurrencyFormat(values.sowOriginalContractAmount);
    // values.clientName = clients.find(c => +c?.id === +values?.clientId)?.companyName;

    // const documents = [];
    // documents.push(documents);
    const projectUpdate = {
      ...values,
      propertyId: property,
      newMarketId: property,
      streetAddress: property,
      acknowledgeCheck: true,
    }
    if (property === undefined) {
      setAddressVerificationStatus('verifying')
      setShowVerificationUSPS(true)
      setProjectPayload(projectUpdate)
      setTimeout(function () {
        useverifyAddress(property, values)
      }, 2000)
    } else {
      // props.createEntity(projectUpdate)
    }
  }

  // const closeAddressVerificationModal = () => {
  //   setShowVerificationUSPS(false)
  // }

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

  return (
    <form>
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
      <Grid display="flex" alignItems="center">
        <Button // onClick={onClose}
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
          onClick={onOpenAddressVerifyModalOpen}
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
      {/* <ModalVerifyAddress
        isOpen={showVerificationUSPS}
        addressVerificationStatus={addressVerificationStatus}
        closeAddressVerificationModal={closeAddressVerificationModal}
        save={saveModalVerify}
      /> */}
    </form>
  )
}
