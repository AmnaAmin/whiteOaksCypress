import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormLabelProps,
  GridItem,
  HStack,
  Input,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import { SelectOption } from 'types/transaction.type'
import NumberFormat from 'react-number-format'
import { useGetUsersByType } from 'api/project-details'
import { useEffect, useState } from 'react'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { t } from 'i18next'
import Select from 'components/form/react-select'
import { useFPMsByMarket } from 'api/pc-projects'
import { validateTelePhoneNumber } from 'utils/form-validation'
import { useParams } from 'react-router'
import { usePCProject } from 'api/pc-projects'
import { ConfirmationBox } from 'components/Confirmation'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { Text } from '@chakra-ui/react';
const InputLabel: React.FC<FormLabelProps> = ({ title, htmlFor }) => {
  const { t } = useTranslation()

  return (
    <FormLabel title={t(title as string)} isTruncated variant="strong-label" size="md" htmlFor={htmlFor}>
      {t(title as string)}
    </FormLabel>
  )
}

type ContactProps = {
  projectCoordinatorSelectOptions: SelectOption[]
  clientSelectOptions: SelectOption[]
  clientTypesSelectOptions: SelectOption[]
  carrierSelected: SelectOption[] | any
}
const Contact: React.FC<ContactProps> = ({
  projectCoordinatorSelectOptions,
  clientSelectOptions,
  clientTypesSelectOptions,
  carrierSelected,
}) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext<ProjectDetailsFormValues>()
  const { projectId } = useParams<{ projectId: string }>()
  const { projectData } = usePCProject(projectId)
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [clientOption, setClientOption] = useState<SelectOption>()
  const marketWatch = useWatch({ name: 'market', control })
  const clientWatch = useWatch({ name: 'client', control })
  const [carrierOption, setCarrierOption] = useState<SelectOption[] | null | undefined>()
  const [selectedOption, setSelectedOption] = useState({})

  const {
    fieldProjectManagerByMarketOptions,
    isLoading,
    fieldProjectMangersByMarket: fpmUsers,
  } = useFPMsByMarket(marketWatch?.value)

  const handleChange = selected => {
    setSelectedOption(selected)
  }

  const agentPhoneValue = watch('agentPhone')
  const superPhoneNumberExtensionValue = watch('superPhoneNumberExtension')
  const superPhoneNumberSuper = watch('superPhoneNumber')
  const homeOwnerPhoneValue = watch('homeOwnerPhone')
  
  useEffect(() => {
    setCarrierOption(
      clientWatch?.carrier?.map(c => {
        return {
          label: c.name,
          value: c.id,
        }
      }),
    )
  }, [clientWatch])

  const {
    isProjectCoordinatorDisabled,
    isProjectCoordinatorPhoneNumberDisabled,
    isProjectCoordinatorExtensionDisabled,
    isFieldProjectManagerDisabled,
    isFieldProjectManagerPhoneNumberDisabled,
    isFieldProjectManagerExtensionDisabled,
    isClientDisabled,
  } = useFieldsDisabled(control)

  const { users: pcUsers } = useGetUsersByType(112)
const contactFormValue = watch()

  useEffect(() => {
    if (fieldProjectManagerByMarketOptions.length === 0 && !isLoading && getValues('fieldProjectManager') !== null) {
      setValue('fieldProjectManager', null)
    }
  }, [fieldProjectManagerByMarketOptions])
  const [extensionValue, setExtensionValue] = useState('')

  const handleExtensionChange = event => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '') // Remove non-numeric characters
    setExtensionValue(inputValue)
  }

  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')

  useEffect(() => {
    if (carrierSelected) {
      setSelectedOption({ label: carrierSelected[0]?.name, value: carrierSelected[0]?.id })
    }  
  }, [carrierSelected?.length])
  return (
    <Stack spacing={14} minH="624px">
      <HStack spacing="32px" >
        <Box h="40px" >
          <FormControl w="215px" isInvalid={!!errors.projectCoordinator}>
            <InputLabel title={'project.projectDetails.projectCoordinator'} htmlFor={'projectCoordinator'} />
            <Controller
              control={control}
              name="projectCoordinator"
              rules={{ required: !isProjectCoordinatorDisabled && 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    {...field}
                    classNamePrefix={'projectCordinator'}
                    selectProps={{ isBorderLeft: !isProjectCoordinatorDisabled, menuHeight: '180px' }}
                    options={projectCoordinatorSelectOptions}
                    isDisabled={isProjectCoordinatorDisabled}
                    onChange={(e: any) => {
                      field.onChange(e)
                      const user = pcUsers?.filter(v => v.id === e.value)[0]

                      setValue('projectCoordinatorPhoneNumber', user?.telephoneNumber as string)
                      setValue('projectCoordinatorExtension', user?.telephoneNumberExtension as string)
                    }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors?.projectCoordinatorPhoneNumber}>
            <InputLabel title={'project.projectDetails.phone'} htmlFor={'projectCoordinatorPhoneNumber'} />
            <Input
              size="md"
              datatest-id="pc-Phone"
              placeholder="098-987-2233"
              id="projectCoordinatorPhoneNumber"
              isDisabled={isProjectCoordinatorPhoneNumberDisabled}
              {...register('projectCoordinatorPhoneNumber')}
              w="215px"
            />
            <FormErrorMessage>{errors?.projectCoordinatorPhoneNumber?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors.projectCoordinatorExtension}>
            <InputLabel title={'project.projectDetails.ext'} htmlFor={'projectCoordinatorExtension'}>
              Ext
            </InputLabel>
            <Input
              size="md"
              datatest-id="pc-Phone-Ext"
              id="projectCoordinatorExtension"
              isDisabled={isProjectCoordinatorExtensionDisabled}
              {...register('projectCoordinatorExtension')}
              w="124px"
            />
            <FormErrorMessage>{errors?.projectCoordinatorExtension?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>

      <HStack spacing="32px">
        <Box h="40px">
          <FormControl w="215px" isInvalid={!!errors.fieldProjectManager}>
            <InputLabel title={'project.projectDetails.fieldProjectManager'} htmlFor={'fieldProjectManager'} />
            <Controller
              control={control}
              name="fieldProjectManager"
              rules={{ required: 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    {...field}
                    classNamePrefix={'fieldProjectManager'}
                    selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                    options={fieldProjectManagerByMarketOptions}
                    isDisabled={isFieldProjectManagerDisabled}
                    onChange={(e: any) => {
                      field.onChange(e)
                      const user = fpmUsers?.filter(v => v.id === e.value)[0]

                      setValue('fieldProjectManagerPhoneNumber', user?.telephoneNumber as string)
                      setValue('fieldProjectManagerExtension', user?.telephoneNumberExtension as string)
                    }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors?.fieldProjectManagerPhoneNumber}>
            <InputLabel title={'project.projectDetails.phone'} htmlFor={'fieldProjectManagerPhoneNumber'} />
            <Input
              size="md"
              datatest-id="fpm-Phone"
              placeholder="098-987-2233"
              isDisabled={isFieldProjectManagerPhoneNumberDisabled}
              id="fieldProjectManagerPhoneNumber"
              {...register('fieldProjectManagerPhoneNumber')}
              w="215px"
            />
            <FormErrorMessage>{errors?.fieldProjectManagerPhoneNumber?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors?.fieldProjectManagerExtension}>
            <InputLabel title={'project.projectDetails.ext'} htmlFor={'fieldProjectManagerExtension'} />
            <Input
              size="md"
              datatest-id="fpm-Phone-Ext"
              id="fieldProjectManagerExtension"
              isDisabled={isFieldProjectManagerExtensionDisabled}
              {...register('fieldProjectManagerExtension')}
              w="124px"
            />
            <FormErrorMessage>{errors?.fieldProjectManagerExtension?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>

      <HStack spacing="32px">
        <Box h="40px">
          <FormControl isInvalid={!!errors?.superName}>
            <InputLabel title={'project.projectDetails.superName'} htmlFor={'superName'} />
            <Input size="md" id="superName" 
            {...register('superName', {
              maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },           
            })}
            w="215px" 
            autoComplete="off"
            maxLength={255}/>
             {contactFormValue.superName !== undefined && contactFormValue.superName?.length === 255 && (
  <Text color="red" fontSize="xs" w="215px">
    Please use 255 characters only.
  </Text>
)}
            <FormErrorMessage>{errors?.superName?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!(errors?.superPhoneNumber && superPhoneNumberSuper)}>
            <InputLabel title={'project.projectDetails.superPhone'} htmlFor={'superPhoneNumber'} />
            <Controller
              control={control}
              name="superPhoneNumber"
              rules={{
                validate: (number: string | null) => {
                  if (!number) {
                    return true // No error message if no value
                  }
                  if (number.length < 10) {
                    return 'Valid Phone Number Is Required'
                  }
                  return validateTelePhoneNumber(number) || 'Invalid phone number'
                },
              }}
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
                    <FormErrorMessage>{fieldState?.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>
        </Box>
        <Box h="40px">
          <FormControl isInvalid={!!errors?.superPhoneNumberExtension}>
            <InputLabel title={'project.projectDetails.ext'} htmlFor={'superPhoneNumberExtension'} />
            <Input
              size="md"
              id="superPhoneNumberExtension"
              {...register('superPhoneNumberExtension', {
                maxLength: { value: 20, message: 'Character limit reached (maximum 20 characters)' },
              })}
              w="124px"
              autoComplete="off"
              maxLength={20}
              value={extensionValue}
              onChange={handleExtensionChange}
              type="text"
            />
             
           {contactFormValue.superPhoneNumberExtension && contactFormValue.superPhoneNumberExtension?.length === 20 && (
  <Text color="red" fontSize="10px" w="215px">
    Please Use 20 Characters Only.
  </Text>
)}


            <FormErrorMessage>{errors?.superPhoneNumberExtension?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors.superEmail}>
            <InputLabel title={'project.projectDetails.superEmail'} htmlFor={'superEmail'} />
            <Input size="md" id="superEmail" 
            {...register('superEmail', {
              maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
            })}
            w="215px" 
            autoComplete="off"
            maxLength={255}/>
             {contactFormValue.superEmail !== undefined && contactFormValue.superEmail?.length ===  255 && (
                <Text color="red" fontSize="10px" w="215px">
                 Please Use 255 Characters Only.
                </Text>
              )}
            
            <FormErrorMessage>{errors?.superEmail?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>

      <HStack spacing="32px" >
        <GridItem>
          <FormControl w="215px" isInvalid={!!errors.client}>
            <InputLabel title={'project.projectDetails.client'} htmlFor={'client'} />
            <Controller
              control={control}
              name="client"
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                  classNamePrefix={'clientsContact'}
                    menuPlacement="top"
                    {...field}
                    options={clientSelectOptions}
                    selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                    isDisabled={isClientDisabled}
                    onChange={option => {
                      if ((projectData as any)?.estimateId !== null) {
                        if ((projectData as any)?.estimateClientId !== option.value) {
                          onOpen()
                          setClientOption(option)
                        } else {
                          field.onChange(option)
                          setValue('carrier', null)
                        }
                      } else {
                        field.onChange(option)
                        setValue('carrier', null)
                      }
                    }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px" mt={'6px'} isInvalid={!!errors.clientType}>
            <FormLabel isTruncated title={t(`${NEW_PROJECT}.clientType`)} size="md">
              {t(`${NEW_PROJECT}.clientType`)}
            </FormLabel>
            <Controller
              control={control}
              name={`clientType`}
              rules={{ required: 'This is required field' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                  classNamePrefix={'clientType'}
                    menuPlacement="top"
                    id="clientType"
                    {...field}
                    options={clientTypesSelectOptions}
                    isDisabled={isReadOnly}
                    selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
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
      </HStack>

      <HStack spacing="32px">
        <Box h="40px">
          <FormControl w="215px" isInvalid={!!errors?.superName}>
            <InputLabel title={t(`${NEW_PROJECT}.carrier`)} htmlFor={'carrier'} />
            <Controller
              control={control}
              name={`carrier`}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    classNamePrefix={'carrierOptions'}
                    value={selectedOption}
                    isDisabled={isFieldProjectManagerDisabled}
                    options={carrierOption}
                    onChange={e => {
                      field.onChange(e)
                      handleChange(e)
                    }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
            <FormErrorMessage>{errors?.superName?.message}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box h="40px">
          <FormControl w="215px" isInvalid={!!errors?.agentName}>
            <InputLabel title={t(`${NEW_PROJECT}.agentName`)} htmlFor={'agentName'} />
            <Input size="md" isDisabled={isFieldProjectManagerDisabled} id="agentName"
             {...register('agentName', {
              maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
            })}
            w="215px" 
            autoComplete="off"
            maxLength={255}/>
            {contactFormValue.agentName !== undefined && contactFormValue.agentName?.length ===  255 && (
                <Text color="red" fontSize="10px" w="215px">
                 Please Use 255 Characters Only.
                </Text>
              )}
            <FormErrorMessage>{errors?.agentName?.message}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box h="40px">
          <FormControl isInvalid={!!(errors?.agentPhone && agentPhoneValue)}>
            <InputLabel title={t(`${NEW_PROJECT}.phone`)} htmlFor={'agentPhone'} />
            <Controller
              control={control}
              name="agentPhone"
              rules={{
                validate: (number: string | null) => {
                  if (!number) {
                    return true // No error message if no value
                  }
                  if (number.length < 10) {
                    return 'Valid Phone Number Is Required'
                  }
                  return validateTelePhoneNumber(number) || 'Invalid phone number'
                },
              }}
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
                    <FormErrorMessage>{fieldState?.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>
        </Box>
        <Box h="40px">
          <FormControl isInvalid={!!(errors?.superPhoneNumberExtension && superPhoneNumberExtensionValue)}>
            <InputLabel title={'project.projectDetails.ext'} htmlFor={'superPhoneNumberExtension'} />
            <Input
              size="md"
              id="superPhoneNumberExtension"
              {...register('superPhoneNumberExtension')}
              w="124px"
              value={extensionValue}
              onChange={handleExtensionChange}
              type="text"
            />
            <FormErrorMessage>
              {errors?.superPhoneNumberExtension?.message && <span>{errors.superPhoneNumberExtension.message}</span>}
            </FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>

      <HStack spacing="32px">
        <Box h="40px">
          <FormControl w="215px" isInvalid={!!errors?.homeOwnerName}>
            <InputLabel title={t(`${NEW_PROJECT}.homeOwner`)} htmlFor={'homeOwnerName'} />
            <Input
              size="md"
              isDisabled={isFieldProjectManagerDisabled}
              id="homeOwnerName"
              {...register('homeOwnerName', {
                maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
              })}
              w="215px" 
              autoComplete="off"
              maxLength={255}/>
             {contactFormValue.homeOwnerName !== undefined && contactFormValue.homeOwnerName?.length ===  255 && (
                <Text color="red" fontSize="10px" w="215px">
                 Please Use 255 Characters Only.
                </Text>
              )}
            <FormErrorMessage>{errors?.homeOwnerName?.message}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box h="40px">
          <FormControl isInvalid={!!(errors?.homeOwnerPhone && homeOwnerPhoneValue)}>
            <InputLabel title={t(`${NEW_PROJECT}.phone`)} htmlFor={'homeOwnerPhone'} />
            <Controller
              control={control}
              name="homeOwnerPhone"
              rules={{
                validate: (number: string | null) => {
                  if (!number) {
                    return true // No error message if no value
                  }
                  if (number.length < 10) {
                    return 'Valid Phone Number Is Required'
                  }
                  return validateTelePhoneNumber(number) || 'Invalid phone number'
                },
              }}
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
                    <FormErrorMessage>{fieldState?.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>
        </Box>
        <Box h="40px">
          <FormControl w="215px" isInvalid={!!errors?.homeOwnerEmail}>
            <InputLabel title={t(`${NEW_PROJECT}.email`)} htmlFor={'homeOwnerEmail'} />
            <Input
              size="md"
              isDisabled={isFieldProjectManagerDisabled}
              id="homeOwnerEmail"
              {...register('homeOwnerEmail', {
                maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
              })}
              w="215px" 
              autoComplete="off"
              maxLength={255}
            />
            {contactFormValue.homeOwnerEmail !== undefined && contactFormValue.homeOwnerEmail?.length ===  255 && (
                <Text color="red" fontSize="10px" w="215px">
                 Please Use 255 Characters Only.
                </Text>
              )}
            <FormErrorMessage>{errors?.homeOwnerEmail?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>
      <ConfirmationBox
        title="Transaction"
        content={t(`${NEW_PROJECT}.clientNameAlertMessage`)}
        isOpen={isOpen}
        onClose={onCloseDisclosure}
        isLoading={false}
        onConfirm={() => {
          if (clientOption) {
            setValue('client', clientOption)
            setValue('carrier', null)
            onCloseDisclosure()
          }
        }}
      />
    </Stack>
  )
}

export default Contact
