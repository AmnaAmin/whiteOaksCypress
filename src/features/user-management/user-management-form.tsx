import {
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useStates } from 'api/pc-projects'

import {
  useCreateUserMutation,
  useDeleteUserDetails,
  userMangtPayload,
  useSaveUserDetails,
  useUser,
  useUserDetails,
  useUserDirectReportsAllList,
  useViewVendor,
} from 'api/user-management'
import { languageOptions } from 'api/vendor-details'
import { ConfirmationBox } from 'components/Confirmation'
import { CheckboxButton } from 'components/form/checkbox-button'
import ReactSelect from 'components/form/react-select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiErrorCircle } from 'react-icons/bi'
import NumberFormat from 'react-number-format'
import { UserForm } from 'types/user.types'
import { parseMarketFormValuesToAPIPayload } from 'utils/markets'
import { PasswordField } from './password-field'
import { USER_MANAGEMENT } from './user-management.i8n'
import { validateTelePhoneNumber } from 'utils/form-validation'
import { useFetchRoles } from 'api/access-control'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

enum UserTabs {
  WOA = 0,
  VENDOR = 1,
  DEVTEK = 2,
}

type UserManagement = {
  onClose: () => void
  user?: UserForm
  tabIndex?: number
}

const validateMarket = markets => {
  const checkedMarkets = markets?.filter(t => t.checked)
  if (!(checkedMarkets && checkedMarkets.length > 0)) {
    return false
  }
  return true
}
const validateState = states => {
  const checkedStates = states?.filter(state => state.checked)

  if (!(checkedStates && checkedStates.length > 0)) {
    return false
  }
  return true
}
const validateRegions = regions => {
  const checkedRegions = regions?.filter(region => region.checked)
  if (!(checkedRegions && checkedRegions.length > 0)) {
    return false
  }
  return true
}

export const UserManagementForm: React.FC<UserManagement> = ({ user, onClose, tabIndex }) => {
  const { t } = useTranslation()
  const form = useForm<UserForm>()
  const { stateSelectOptions: stateOptions, states: statesDTO } = useStates()
  const [isDeleteBtnClicked, setIsDeleteBtnClicked] = useState(false)
  const [selectedOption, setSelectedOption] = useState([]) // HN-PSWOA-6382| This state contains the data of the selected user that has a parent
  const { options: roles } = useFetchRoles()

  const queryString = useMemo(() => {
    let queryString = ''
    switch (tabIndex) {
      case UserTabs.WOA: {
        queryString = 'userType.notIn=6&devAccount.equals=false'
        break
      }
      case UserTabs.VENDOR: {
        queryString = 'userType.equals=6&devAccount.equals=false'
        break
      }
      case UserTabs.DEVTEK: {
        queryString = 'devAccount.equals=true'
        break
      }
    }
    return queryString
  }, [tabIndex])

  const { options: usersList, isLoading: loadingUsersList, userMgt: userData } = useUserDirectReportsAllList(user?.id)
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('USERMANAGER.READ')
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
  } = form

  const { data: userInfo } = useUser(user?.email)
  const { mutate: updateUser, isError, error: updateUserError } = useSaveUserDetails()
  const [isModalOpen, setModalOpen] = useState(false)
  useEffect(() => {
    if (isError) {
      setModalOpen(true)
    }
  }, [isError])
  const { mutate: addUser } = useCreateUserMutation()
  const { mutate: deleteUser } = useDeleteUserDetails()
  const { options: vendorTypes, isLoading: loadingVendors } = useViewVendor()

  useUserDetails({ form, userInfo, queryString })

  const formValues = watch()

  const accountType: any = formValues?.accountType
  const managerSelected = formValues?.parentFieldProjectManagerId
  // const directReportsSelected = formValues?.directReports

  const isEditUser = !!(user && user.id)
  const isVendor = accountType?.assignment === 'VENDOR'

  const showMarkets = useMemo(() => {
    if (accountType?.location === 'MARKET') {
      return true
    }
    return false
  }, [accountType])

  const showStates = useMemo(() => {
    if (accountType?.location === 'STATE') {
      return true
    }
    return false
  }, [accountType])

  const showRegions = useMemo(() => {
    if (accountType?.location === 'REGION') {
      return true
    }
    return false
  }, [accountType])

  const noMarketsSelected = !validateMarket(formValues?.markets)
  const noStatesSelected = !validateState(formValues?.states)

  const noRegionSelected = !validateRegions(formValues?.regions)
  const invalidTelePhone =
    validateTelePhoneNumber(formValues?.telephoneNumber as string) || !formValues?.telephoneNumber

  const handleChangeAccountType = target => {
    setValue(
      'markets',
      formValues.markets?.map(market => ({ ...market, checked: false })),
    )
    setValue(
      'states',
      formValues.states?.map(state => ({ ...state, checked: false })),
    )
    setValue(
      'regions',
      formValues.regions?.map(region => ({ ...region, checked: false })),
    )
    setValue('vendorId', undefined)

    setValue('directReports' as any, [])

    setValue('directStates' as any, [])
    setValue('directRegions' as any, [])
    setValue('directMarkets' as any, [])
  }

  const clearSelectedManager = () => {
    setValue('parentFieldProjectManagerId', null)
  }

  const onSubmit = useCallback(
    async formData => {
      let formattedPayload = userMangtPayload(formData, statesDTO, userData)
      const mutation = userInfo?.id ? updateUser : addUser
      mutation(parseMarketFormValuesToAPIPayload(formattedPayload), {
        onSuccess() {
          onClose()
        },
        onError() {
          // onClose()
        },
      })
    },
    [userInfo, isVendor, addUser, updateUser, userMangtPayload, statesDTO, userData?.length],
  )

  const isPrimaryDisabled = !formValues.vendorAdmin

  const watchRequiredField =
    !formValues?.email ||
    !formValues?.state ||
    formValues?.email.trim() === '' ||
    !formValues?.firstName ||
    formValues?.firstName.trim() === '' ||
    !formValues?.lastName ||
    formValues?.lastName.trim() === '' ||
    (!isEditUser && !formValues?.newPassword) ||
    !formValues?.accountType ||
    !formValues?.streetAddress ||
    formValues?.streetAddress.trim() === '' ||
    !formValues?.city ||
    formValues?.city.trim() === '' ||
    !formValues?.zipCode ||
    formValues?.zipCode.trim() === '' ||
    !formValues?.telephoneNumber ||
    formValues.telephoneNumber?.trim() === '' ||
    !formValues?.langKey ||
    (isVendor && !formValues.vendorId) ||
    (showMarkets && noMarketsSelected) ||
    (showStates && !validateState(formValues?.states)) ||
    (showRegions && !validateRegions(formValues?.regions))

  useEffect(() => {
    if (showRegions && noRegionSelected) {
      setValue('directReports', [])

      clearSelectedManager()
    }
    if (showMarkets && noMarketsSelected) {
      setValue('directReports', [])

      clearSelectedManager()
    }
    if (showStates && noStatesSelected) {
      setValue('directReports', [])

      clearSelectedManager()
    }
  }, [noRegionSelected, noMarketsSelected, noStatesSelected])

  const watchMultiStates = useWatch({ control, name: 'directStates' as any })
  const watchMultiRegions = useWatch({ control, name: 'directRegions' as any })
  const watchMultiMarkets = useWatch({ control, name: 'directMarkets' as any })
  useEffect(() => {
    if (!showStates || !watchMultiStates) return

    setValue(
      'states',
      formValues?.states?.map(s => {
        if (watchMultiStates?.find(ms => ms.label === s.state.label)) s.checked = true
        else s.checked = false

        return s
      }),
    )
  }, [watchMultiStates, showStates])

  useEffect(() => {
    if (!showRegions || !watchMultiRegions) return

    setValue(
      'regions',
      formValues?.regions?.map(r => {
        if (watchMultiRegions?.find(mr => mr.value === r.region.value)) r.checked = true
        else r.checked = false

        return r
      }),
    )
  }, [watchMultiRegions, showRegions])

  useEffect(() => {
    if (!showMarkets || !watchMultiMarkets) return

    setValue(
      'markets',
      formValues?.markets?.map(m => {
        if (watchMultiMarkets?.find(mm => mm.value === m.market.id)) m.checked = true
        else m.checked = false

        return m
      }),
    )
  }, [watchMultiMarkets, showMarkets])

  useEffect(() => {
    if (isReadOnly) {
      Array.from(document.querySelectorAll('input')).forEach(input => {
        if (input.getAttribute('data-testid') !== 'tableFilterInputField') {
          input.setAttribute('disabled', 'true')
        }
      })
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      action="#"
    >
      <HStack mt="30px" spacing={15}>
        {isEditUser && (
          <FormControl w={215}>
            <FormLabel variant="strong-label" size="md">
              {t(`${USER_MANAGEMENT}.modal.id`)}
            </FormLabel>
            <Input isDisabled={isEditUser} variant="required-field" type="id" {...register('id')} />
          </FormControl>
        )}
        <FormControl w={215} isInvalid={!!errors.email} h="77px">
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.email`)}
          </FormLabel>
          <Input
            isDisabled={isEditUser}
            variant="required-field"
            type="email"
            {...register('email', {
              required: 'This is required',
              maxLength: { value: 50, message: 'Please use 50 characters only.' },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid Email Address',
                
              },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('email', title)
              if (title?.length > 50) {
                setError('email', {
                  type: 'maxLength',
                  message: 'Please use 50 characters only.',
                })
              } else {
                clearErrors('email')
              }
            }}
          />
          <FormErrorMessage pos={'absolute'}>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl w={215} isInvalid={!!errors.firstName}  h="77px">
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.firstName`)}
          </FormLabel>
          <Input variant="required-field" type="text" {...register('firstName', { 
              maxLength: { value: 50, message: 'Please use 50 characters only.' },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('firstName', title)
              if (title?.length > 50) {
                setError('firstName', {
                  type: 'maxLength',
                  message: 'Please use 50 characters only.',
                })
              } else {
                clearErrors('firstName')
              }
            }}/>
             <FormErrorMessage pos={'absolute'}>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl w={215} isInvalid={!!errors.lastName}  h="77px">
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.lastName`)}
          </FormLabel>
          <Input autoComplete="off" variant="required-field" type="text" {...register('lastName', { 
              maxLength: { value: 50, message: 'Please use 50 characters only.' },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('lastName', title)
              if (title?.length > 50) {
                setError('lastName', {
                  type: 'maxLength',
                  message: 'Please use 50 characters only.',
                })
              } else {
                clearErrors('lastName')
              }
            }} />
             <FormErrorMessage pos={'absolute'}>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>
      </HStack>

      <HStack mt="30px">
        <PasswordField errors={errors} register={register} isRequired={!isEditUser} />
      </HStack>

      <HStack mt="30px" spacing={15}>
        <FormControl
          w="215px"
          sx={{
            '.collapsed': {
              display: 'none',
            },
            '.sub-menu-item:before': {
              content: '""',
              ml: '10px',
            },
          }}
        >
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.accountType`)}
          </FormLabel>

          <Controller
            control={control}
            name="accountType"
            render={({ field: { onChange, ...rest } }) => (
              <ReactSelect
                {...rest}
                classNamePrefix={'accountTypeDropdown'}
                isDisabled={(userInfo && userInfo.userTypeLabel === 'Vendor') || isReadOnly}
                selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                options={roles}
                onChange={target => {
                  onChange(target)
                  handleChangeAccountType(target)
                }}
              />
            )}
          />
        </FormControl>

        <FormControl w="215px">
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.language`)}
          </FormLabel>
          <Controller
            control={control}
            name="langKey"
            render={({ field }) => (
              <ReactSelect
              classNamePrefix={'languageDropdown'}
                selectProps={{ isBorderLeft: true }}
                {...field}
                options={languageOptions}
                isDisabled={isReadOnly}
              />
            )}
          />
        </FormControl>

        <FormControl w={215}>
          <Checkbox
            mt="25px"
            isChecked={formValues.activated}
            fontSize="16px"
            fontWeight={400}
            color="#718096"
            colorScheme="brand"
            {...register('activated')}
          >
            {t(`${USER_MANAGEMENT}.modal.activated`)}
          </Checkbox>
        </FormControl>
      </HStack>

      {showMarkets ? (
        <VStack mt="30px" spacing={15} alignItems="start" display="none">
          <Flex alignItems="center">
            <FormLabel variant="strong-label" size="md" alignSelf="start" margin="0">
              {t(`${USER_MANAGEMENT}.modal.markets`)}
            </FormLabel>
            {noMarketsSelected && (
              <Flex alignItems="center">
                <Icon as={BiErrorCircle} width="12px" height="12px" color="red.400" ml="10px" mr="2px" />
                <Text as="span" color="red.400" fontSize="12px">
                  Select one market atleast
                </Text>
              </Flex>
            )}
          </Flex>
          <Flex wrap="wrap" gridGap={3}>
            {formValues?.markets?.map((market, index) => {
              return (
                <Controller
                  name={`markets.${index}`}
                  control={control}
                  key={market.market.id}
                  render={({ field: { name, onChange, value } }) => {
                    return (
                      <CheckboxButton
                        name={name}
                        key={value.market.id}
                        isChecked={market?.checked}
                        onChange={event => {
                          const checked = event.target.checked
                          onChange({ ...market, checked })
                          //clearSelectedManager()
                        }}
                      >
                        {value.market?.metropolitanServiceArea}
                      </CheckboxButton>
                    )
                  }}
                />
              )
            })}
          </Flex>
        </VStack>
      ) : null}

      {showMarkets && (
        <FormControl w="81.9%">
          <Flex alignItems="center" mt="30px">
            <FormLabel variant="strong-label" size="md" alignSelf="start" margin="0">
              {t(`${USER_MANAGEMENT}.modal.markets`)}
            </FormLabel>
            {noMarketsSelected && (
              <Flex alignItems="center">
                <Icon as={BiErrorCircle} width="12px" height="12px" color="red.400" ml="10px" mr="2px" />
                <Text as="span" color="red.400" fontSize="12px">
                  Select one market atleast
                </Text>
              </Flex>
            )}
          </Flex>

          <Controller
            control={control}
            name={'directMarkets' as any}
            render={({ field }) => (
              <ReactSelect
              classNamePrefix={'directMarketDropdown'}
                placeholder="Select or Search"
                selectProps={{ isBorderLeft: false }}
                closeMenuOnSelect={false}
                isMulti={true}
                {...field}
                options={formValues?.markets?.map(s => {
                  return { value: s.market.id, label: s.market.metropolitanServiceArea }
                })}
              />
            )}
          />
        </FormControl>
      )}

      {showStates ? (
        <VStack mt="30px" spacing={15} alignItems="start" display="none">
          <Flex alignItems="center">
            <FormLabel variant="strong-label" size="md" alignSelf="start" margin="0">
              {t(`${USER_MANAGEMENT}.modal.state`)}
            </FormLabel>
            {noStatesSelected && (
              <Flex alignItems="center">
                <Icon as={BiErrorCircle} width="12px" height="12px" color="red.400" ml="10px" mr="2px" />
                <Text as="span" color="red.400" fontSize="12px">
                  Select one state atleast
                </Text>
              </Flex>
            )}
          </Flex>
          <Flex wrap="wrap" gridGap={3}>
            {formValues?.states?.map((state, index) => {
              return (
                <Controller
                  name={`states.${index}`}
                  control={control}
                  key={state.state.id}
                  render={({ field: { name, onChange, value } }) => {
                    return (
                      <CheckboxButton
                        name={name}
                        key={value.state.id}
                        isDisabled={isReadOnly}
                        isChecked={state?.checked}
                        onChange={event => {
                          const checked = event.target.checked
                          onChange({ ...state, checked })
                          //clearSelectedManager()
                        }}
                      >
                        {value.state?.label}
                      </CheckboxButton>
                    )
                  }}
                />
              )
            })}
          </Flex>
        </VStack>
      ) : null}

      {showStates && (
        <FormControl w="81.9%">
          <Flex alignItems="center" mt="30px">
            <FormLabel variant="strong-label" size="md" alignSelf="start" margin="0">
              {t(`${USER_MANAGEMENT}.modal.state`)}
            </FormLabel>
            {noStatesSelected && (
              <Flex alignItems="center">
                <Icon as={BiErrorCircle} width="12px" height="12px" color="red.400" ml="10px" mr="2px" />
                <Text as="span" color="red.400" fontSize="12px">
                  Select one state atleast
                </Text>
              </Flex>
            )}
          </Flex>

          <Controller
            control={control}
            name={'directStates' as any}
            render={({ field }) => (
              <ReactSelect
              classNamePrefix={'directStatesDropdown'}
                placeholder="Select or Search"
                isDisabled={isReadOnly}
                selectProps={{ isBorderLeft: false }}
                closeMenuOnSelect={false}
                isMulti={true}
                {...field}
                options={formValues?.states?.map(s => {
                  return { value: s.state.id, label: s.state.label }
                })}
              />
            )}
          />
        </FormControl>
      )}

      {showRegions ? (
        <VStack mt="30px" spacing={15} alignItems="start" display="none">
          <Flex alignItems="center">
            <FormLabel variant="strong-label" size="md" alignSelf="start" margin="0">
              {t(`${USER_MANAGEMENT}.modal.regions`)}
            </FormLabel>
            {noRegionSelected && (
              <Flex alignItems="center">
                <Icon as={BiErrorCircle} width="12px" height="12px" color="red.400" ml="10px" mr="2px" />
                <Text as="span" color="red.400" fontSize="12px">
                  Select one region atleast
                </Text>
              </Flex>
            )}
          </Flex>
          <Flex wrap="wrap" gridGap={3}>
            {formValues?.regions?.map((region, index) => {
              return (
                <Controller
                  name={`regions.${index}`}
                  control={control}
                  key={region.value}
                  render={({ field: { name, onChange, value } }) => {
                    return (
                      <CheckboxButton
                        name={name}
                        key={region.region.value}
                        isChecked={region?.checked}
                        onChange={event => {
                          const checked = event.target.checked
                          onChange({ ...region, checked })
                          //clearSelectedManager()
                        }}
                      >
                        {value.region?.value}
                      </CheckboxButton>
                    )
                  }}
                />
              )
            })}
          </Flex>
        </VStack>
      ) : null}

      {showRegions && (
        <FormControl w="81.9%">
          <Flex alignItems="center" mt="30px">
            <FormLabel variant="strong-label" size="md" alignSelf="start" margin="0">
              {t(`${USER_MANAGEMENT}.modal.regions`)}
            </FormLabel>
            {noRegionSelected && (
              <Flex alignItems="center">
                <Icon as={BiErrorCircle} width="12px" height="12px" color="red.400" ml="10px" mr="2px" />
                <Text as="span" color="red.400" fontSize="12px">
                  Select one region atleast
                </Text>
              </Flex>
            )}
          </Flex>

          <Controller
            control={control}
            name={'directRegions' as any}
            render={({ field }) => (
              <ReactSelect
              classNamePrefix={'directRegions'}
                placeholder="Select or Search"
                selectProps={{ isBorderLeft: false }}
                closeMenuOnSelect={false}
                isMulti={true}
                {...field}
                options={formValues?.regions?.map(s => {
                  return { value: s.region.value, label: s.region.value }
                })}
              />
            )}
          />
        </FormControl>
      )}

      {!isVendor && (
        <HStack mt="30px" spacing={15}>
          <FormControl w="81.9%">
            <FormLabel variant="strong-label" size="md">
              {t(`${USER_MANAGEMENT}.modal.directReports`)}
            </FormLabel>
            <Controller
              control={control}
              name={'directReports' as any}
              render={({ field }) => (
                <ReactSelect
                classNamePrefix={'directReportss'}
                  placeholder="Select or Search"
                  selectProps={{ isBorderLeft: false }}
                  closeMenuOnSelect={false}
                  isMulti={true}
                  loadingCheck={loadingUsersList}
                  isDisabled={isReadOnly}
                  value={field?.value}
                  onChange={(option: any) => {
                    const lastSelectedOption = option[option.length - 1]
                    const isUserBeingAdd = field?.value?.length < option?.length
                    if (lastSelectedOption?.parentId && isUserBeingAdd) return setSelectedOption(option) // HN-PSWOA-6382| Only show confirmation modal if the selected user has a parent and it is selected not removed from dropdown
                    field.onChange(option)
                  }}
                  options={usersList?.filter(ul => ul.value !== managerSelected?.value)} //Donot include in direct reports the users selected for managers
                />
              )}
            />
          </FormControl>
        </HStack>
      )}
      {/*!isVendor && (
        <HStack mt="30px" spacing={15}>
          <FormControl w="81.9%">
            <FormLabel variant="strong-label" size="md">
              {t(`${USER_MANAGEMENT}.modal.manager`)}
            </FormLabel>
            <Controller
              control={control}
              name={'parentFieldProjectManagerId'}
              render={({ field }) => (
                <ReactSelect
                  placeholder="Select or Search"
                  selectProps={{ isBorderLeft: false }}
                  closeMenuOnSelect={false}
                  {...field}
                  loadingCheck={loadingUsersList}
                  options={usersList?.filter(
                    ul => !directReportsSelected?.map(d => d.value)?.some(s => s === ul.value),
                  )} //Donot include in managers the users selected for direct reports
                />
              )}
            />
          </FormControl>
        </HStack>
      )*/}

      {isVendor ? (
        <>
          <HStack mt="30px" spacing={15}>
            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                Vendor
              </FormLabel>
              <Controller
                control={control}
                name="vendorId"
                render={({ field }) => (
                  <ReactSelect
                  classNamePrefix={'vendorId'}
                    selectProps={{ isBorderLeft: true }}
                    {...field}
                    options={vendorTypes}
                    loadingCheck={loadingVendors}
                  />
                )}
              />
            </FormControl>
            <Box>
              <HStack mt="30px" w="300px">
                <FormControl>
                  <Checkbox
                    isChecked={formValues?.vendorAdmin}
                    {...register('vendorAdmin', {
                      onChange: e => {
                        if (!e.target.checked) setValue('primaryAdmin', false)
                      },
                    })}
                  >
                    Admin
                  </Checkbox>
                </FormControl>
                <FormControl>
                  <Checkbox
                    isChecked={formValues.primaryAdmin}
                    isDisabled={isPrimaryDisabled}
                    {...register('primaryAdmin')}
                  >
                    <chakra.span position="relative">Primary</chakra.span>
                  </Checkbox>
                </FormControl>
              </HStack>
            </Box>
          </HStack>
        </>
      ) : null}
      <HStack mt="30px" spacing={15}>
        <FormControl w={215} isInvalid={!!errors.streetAddress} h='77px'>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.address`)}
          </FormLabel>
          <Input variant="required-field" type="text" {...register('streetAddress', { 
              maxLength: { value: 200, message: 'Please use 200 characters only.' },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('streetAddress', title)
              if (title?.length > 200) {
                setError('streetAddress', {
                  type: 'maxLength',
                  message: 'Please use 200 characters only.',
                })
              } else {
                clearErrors('streetAddress')
              }
            }}  />
             <FormErrorMessage pos={'absolute'}>{errors.streetAddress?.message}</FormErrorMessage>
        </FormControl>

        <FormControl w={215} isInvalid={!!errors.city} h='77px'>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.city`)}
          </FormLabel>
          <Input type="text" {...register('city', { 
              maxLength: { value: 45, message: 'Please use 45 characters only.' },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('city', title)
              if (title?.length > 45) {
                setError('city', {
                  type: 'maxLength',
                  message: 'Please use 45 characters only.',
                })
              } else {
                clearErrors('city')
              }
            }} variant="required-field" />
            <FormErrorMessage pos={'absolute'}>{errors.city?.message}</FormErrorMessage>
        </FormControl>

        <FormControl w={215} h='77px'>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.state`)}
          </FormLabel>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <ReactSelect
                id="state"
                {...field}
                classNamePrefix={'stateDropdown'}
                isDisabled={isReadOnly}
                options={stateOptions}
                selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
              />
            )}
          />
        </FormControl>

        <FormControl w={215}  isInvalid={!!errors.zipCode} h='77px'>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.zipcode`)}
          </FormLabel>
          <Input type="number" {...register('zipCode', { 
              maxLength: { value: 45, message: 'Please use 45 characters only.' },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('zipCode', title)
              if (title?.length > 45) {
                setError('zipCode', {
                  type: 'maxLength',
                  message: 'Please use 45 characters only.',
                })
              } else {
                clearErrors('zipCode')
              }
            }} 
            variant="required-field" />
            <FormErrorMessage pos={'absolute'}>{errors.zipCode?.message}</FormErrorMessage>
        </FormControl>
      </HStack>

      <HStack mt="30px" spacing={15}>
        <FormControl w={215} isInvalid={!invalidTelePhone} h='77px'>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.telephone`)}
          </FormLabel>
          <Box height="70px">
            <Controller
              control={control}
              name="telephoneNumber"
              render={({ field }) => {
                return (
                  <NumberFormat
                    data-testid="telephone_number"
                    customInput={Input}
                    value={field.value}
                    onChange={e => field.onChange(e)}
                    format="(###)-###-####"
                    mask="_"
                    placeholder="(___)-___-____"
                    variant="required-field"
                  />
                )
              }}
            />
            <FormErrorMessage>{!invalidTelePhone ? 'Valid Phone Number Is Required' : null}</FormErrorMessage>
          </Box>
        </FormControl>

        <FormControl w={215} isInvalid={!!errors.telephoneNumberExtension} h='77px'>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.ext`)}
          </FormLabel>
          <Box height="70px">
            <Input type="text" {...register('telephoneNumberExtension', { 
              maxLength: { value: 45, message: 'Please use 45 characters only.' },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('telephoneNumberExtension', title)
              if (title?.length > 45) {
                setError('telephoneNumberExtension', {
                  type: 'maxLength',
                  message: 'Please use 45 characters only.',
                })
              } else {
                clearErrors('telephoneNumberExtension')
              }
            }} 
           />
            <FormErrorMessage pos={'absolute'}>{errors.telephoneNumberExtension?.message}</FormErrorMessage> 
          </Box>
        </FormControl>

        <FormControl w={215} isInvalid={!!errors.employeeId} h='77px'>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.employeeID`)}
          </FormLabel>
          <Box height="70px">
            <Input type="text" {...register('employeeId', { 
              maxLength: { value: 255, message: 'Please use 255 characters only.' },
            })}
            onChange={e => {
              const title = e?.target.value
              setValue('employeeId', title)
              if (title?.length > 255) {
                setError('employeeId', {
                  type: 'maxLength',
                  message: 'Please use 255 characters only.',
                })
              } else {
                clearErrors('employeeId')
              }
            }} 
           />
            <FormErrorMessage pos={'absolute'}>{errors.employeeId?.message}</FormErrorMessage> 
          </Box>
        </FormControl>
      </HStack>

      <HStack
        spacing="16px"
        pt="16px"
        pb="8px"
        alignItems="center"
        justifyContent="start"
        borderTop="1px solid #E2E8F0"
        mt="30px"
      >
        <>
          {!isReadOnly && user && (
            <Button
              variant="outline"
              isDisabled={user?.activated ? true : false}
              colorScheme="brand"
              onClick={() => setIsDeleteBtnClicked(true)}
            >
              {t(`${USER_MANAGEMENT}.modal.delete`)}
            </Button>
          )}
        </>

        <Spacer />
        <Button
          variant="outline"
          colorScheme="brand"
          onClick={() => {
            onClose()
            reset()
          }}
          data-testid="cancel-user-modal"
        >
          {t(`${USER_MANAGEMENT}.modal.cancel`)}
        </Button>
        <>
          {!isReadOnly && (
            <Button type="submit" colorScheme="brand" isDisabled={!!watchRequiredField}>
              {t(`${USER_MANAGEMENT}.modal.save`)}
            </Button>
          )}
        </>
        <ConfirmationBox
          title="Are You Sure?"
          content={`${
            (selectedOption[selectedOption?.length - 1] as any)?.label
          } is already reporting to another user. Proceed anyway?`}
          isOpen={!!selectedOption?.length}
          onClose={() => setSelectedOption([])}
          onConfirm={() => {
            setValue('directReports', selectedOption)
            setSelectedOption([])
          }}
        />
        <ConfirmationBox
          title={t(`${USER_MANAGEMENT}.modal.deleteUserModal`)}
          content={t(`${USER_MANAGEMENT}.modal.deleteUserContent`)}
          isOpen={isDeleteBtnClicked}
          onClose={() => setIsDeleteBtnClicked(false)}
          onConfirm={() => {
            deleteUser(user?.email, {
              onSuccess() {
                setIsDeleteBtnClicked(true)
                onClose()
              },
            })
          }}
          yesButtonText={t(`${USER_MANAGEMENT}.modal.delete`)}
          showNoButton={true}
        />
        <ConfirmationBox
          title={t(`${USER_MANAGEMENT}.modal.deleteUserModal`)}
          content={`${t(`${USER_MANAGEMENT}.modal.deactivateUser`)}`}
          extraContent={`Project Id: ${updateUserError?.missing_project_id}`}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={() => setModalOpen(false)}
          showNoButton={false}
          yesButtonText={t(`${USER_MANAGEMENT}.modal.oK`)}
        />
      </HStack>
    </form>
  )
}
