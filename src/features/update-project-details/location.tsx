import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'

import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import Select, { CreatableSelect } from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'
import { useState } from 'react'

import { STATUS } from 'features/common/status'
import { useProjects } from 'api/projects'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { useMarketStateWise } from 'api/pc-projects'

type Market = [
  {
    active: boolean
    id: number
    metropolitanServiceArea: string
    createdBy: string
    createdDate: string
    modifiedBy: string
    modifiedDate: string
    stateId: number
    stateName: string
  },
]

type State = [
  {
    id: number
    name: string
    region: string
    code: string
    createdBy: string
    createdDate: string
    modifiedBy: string
    modifiedDate: string
  },
]

type LocationProps = {
  stateSelectOptions: SelectOption[]
  marketSelectOptions: SelectOption[]
  propertySelectOptions: SelectOption[]
  markets: Market
  states: State
  setVerifiedAddress: (val: boolean) => void
}

const Location: React.FC<LocationProps> = ({
  stateSelectOptions,
  marketSelectOptions,
  propertySelectOptions,
  markets,
  states,
  setVerifiedAddress,
}) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ProjectDetailsFormValues>()
  const { projects } = useProjects()
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false)
  const [existProperty, setExistProperty] = useState([{ id: 0, status: '' }])
  const [check, setCheck] = useState(false)

  const {
    isAddressDisabled,
    isCityDisabled,
    isZipDisabled,
    isStateDisabled,
    isGateCodeDisabled,
    isMarketDisabled,
    isLockBoxCodeDisabled,
  } = useFieldsDisabled(control)

  const { t } = useTranslation()

  // Continue unverified Check
  const handleCheck = () => {
    setCheck(!check)
    setIsDuplicateAddress(false)
    setValue('acknowledgeCheck', true)
  }

  const setAddressValues = option => {
    const property = option?.property
    const market = markets.find(m => m?.id === property?.marketId)
    const state = states.find(s => s?.code === property?.state)

    setVerifiedAddress(!!property)
    setValue('address', property?.streetAddress || option.label)
    setValue('city', property?.city)
    setValue('zip', property?.zipCode)
    setValue('market', { label: market?.metropolitanServiceArea, value: market?.id })
    setValue('state', { label: state?.name, value: state?.code, id: state?.id })
    setValue('property', property)
    setValue('newMarket', { label: market?.metropolitanServiceArea, value: market?.id })

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

  const state = useWatch({ name: 'state', control })
  const contactFormValue = watch()
  const { marketSelectOptionsStateWise } = useMarketStateWise(state?.id)

  return (
    <Stack minH="624px">
      <Box px="6" h="310px" overflow={'auto'}>
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
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="32px" w="908px" ml="-22px">
          <GridItem>
            <FormControl isInvalid={!!errors.address} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="address">
                {t(`project.projectDetails.address`)}
              </FormLabel>
              <Controller
                control={control}
                name={`address`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <CreatableSelect
                     classNamePrefix={'addressDetails'}
                      color="#2D3748 !important"
                      id="address"
                      isDisabled={isAddressDisabled}
                      options={propertySelectOptions}
                      // selected={field.value}
                      placeholder="Type address here.."
                      value={field.value}
                      onChange={option => {
                        setAddressValues(option)
                        field.onChange(option)
                      }}
                      // onChange={setAddressValues}
                      selectProps={{ isBorderLeft: true }}
                      inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.city} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="city">
                {t(`project.projectDetails.city`)}
              </FormLabel>
              <Input
                size="md"
                variant="required-field"
                isDisabled={isCityDisabled}
                id="city"
                {...register('city', {
                  required: 'This is a required field',
                  validate: {
                    notOnlyWhitespace: value =>
                      value !== null && !/^\s+$/.test(value) ? true : 'This is a required field',
                  },
                  onChange: e => {
                    setVerifiedAddress(false)
                  },
                })}
              />
              <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.state} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="state">
                {t(`project.projectDetails.state`)}
              </FormLabel>
              <Controller
                control={control}
                name={`state`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      classNamePrefix={'stateDropdown'}
                      options={stateSelectOptions}
                      size="md"
                      value={field.value}
                      isDisabled={isStateDisabled}
                      selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                      onChange={option => {
                        setVerifiedAddress(false)
                        field.onChange(option)
                        setValue('market', null)
                      }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
              {/* <Input isDisabled={isCityDisabled} id="state" {...register('state')} /> */}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.zip} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="zip">
                {t(`project.projectDetails.zip`)}
              </FormLabel>
              <Input
                size="md"
                variant="required-field"
                isDisabled={isZipDisabled}
                id="zip"
                {...register('zip', {
                  required: 'This is required field',
                  maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
                  validate: {
                    notOnlyWhitespace: value =>
                      value !== null && !/^\s+$/.test(value) ? true : 'Cannot be whitespaces only.',
                  },
                  onChange: e => {
                    setVerifiedAddress(false)
                  },
                })}
                autoComplete="off"
                maxLength={255}
              />
              {contactFormValue.zip !== undefined && contactFormValue.zip?.length === 255 && (
                <Text color="red" fontSize="xs" w="215px">
                  Please use 255 characters only.
                </Text>
              )}
              <FormErrorMessage>{errors.zip && errors.zip.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.market} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="market">
                {t(`project.projectDetails.market`)}
              </FormLabel>
              {/* <Input isDisabled={isMarketDisabled} id="market" {...register('market')} /> */}
              <Controller
                control={control}
                name={`market`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      classNamePrefix={'marketSelectOptions'}
                      options={marketSelectOptionsStateWise}
                      size="md"
                      value={field.value}
                      selectProps={{ isBorderLeft: true, menuHeight: '120px' }}
                      isDisabled={isMarketDisabled}
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
            <FormControl isInvalid={!!errors.gateCode} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="gateCode">
                {t(`project.projectDetails.gateCode`)}
              </FormLabel>
              <Input
                size="md"
                datatest-id="gate-Code"
                border=" 1px solid #E2E8F0"
                disabled={isGateCodeDisabled}
                id="gateCode"
                {...register('gateCode', {
                  maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
                })}
                autoComplete="off"
                maxLength={255}
              />
              {contactFormValue.gateCode !== undefined && contactFormValue.gateCode?.length === 255 && (
                <Text color="red" fontSize="xs" w="215px">
                  Please use 255 characters only.
                </Text>
              )}
              <FormErrorMessage>{errors.gateCode && errors.gateCode.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.lockBoxCode} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="lockBoxCode" noOfLines={1}>
                {t(`project.projectDetails.lockBoxCode`)}
              </FormLabel>
              <Input
                size="md"
                datatest-id="lock-Box-Code"
                border=" 1px solid #E2E8F0"
                disabled={isLockBoxCodeDisabled}
                id="lockBoxCode"
                {...register('lockBoxCode', {
                  maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
                })}
                autoComplete="off"
                maxLength={255}
              />
              {contactFormValue.lockBoxCode !== undefined && contactFormValue.lockBoxCode?.length === 255 && (
                <Text color="red" fontSize="xs" w="215px">
                  Please use 255 characters only.
                </Text>
              )}
              <FormErrorMessage>{errors.lockBoxCode && errors.lockBoxCode.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.hoaContactPhoneNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="hoaContactPhoneNumber" noOfLines={1}>
                {t(`project.projectDetails.hoaContactPhone`)}
              </FormLabel>
              <Controller
                control={control}
                name="hoaContactPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        size="md"
                        customInput={Input}
                        value={field.value}
                        onChange={e => field.onChange(e)}
                        format="(###)-###-####"
                        mask="_"
                        placeholder="(___)-___-____"
                      />
                      <FormErrorMessage>{fieldState?.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.hoaContactExtension} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="hoaContactExtension">
                {t(`project.projectDetails.ext`)}
              </FormLabel>
              <Input
                size="md"
                border=" 1px solid #E2E8F0"
                id="hoaContactExtension"
                {...register('hoaContactExtension', {
                  maxLength: { value: 20, message: 'Character limit reached (maximum 20 characters)' },
                })}
                autoComplete="off"
                maxLength={20}
              />
              {contactFormValue.hoaContactExtension !== undefined && contactFormValue.hoaContactExtension?.length === 20 && (
                <Text color="red" fontSize="xs" w="215px">
                  Please use 20 characters only.
                </Text>
              )}

              <FormErrorMessage>{errors?.hoaContactExtension?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.hoaContactEmail} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="hoaContactEmail" noOfLines={1}>
                {t(`project.projectDetails.hoaContactEmail`)}
              </FormLabel>
              <Input
                size="md"
                border=" 1px solid #E2E8F0"
                id="hoaContactEmail"
                {...register('hoaContactEmail', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid Email Address',
                  },
                  maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
                })}
                autoComplete="off"
                maxLength={255}
              />
              {contactFormValue.hoaContactEmail !== undefined && contactFormValue.hoaContactEmail?.length === 255 && (
                <Text color="red" fontSize="xs" w="215px">
                  Please use 255 characters only.
                </Text>
              )}

              <FormErrorMessage>{errors.hoaContactEmail && errors.hoaContactEmail.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
        </Grid>
      </Box>
    </Stack>
  )
}

export default Location
