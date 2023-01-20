import {
  Box,
  Button,
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
import { DevTool } from '@hookform/devtools'
import { useStates } from 'api/pc-projects'
import {
  FPMManagerTypes,
  useActiveAccountTypes,
  useCreateUserMutation,
  useDeleteUserDetails,
  useFilteredAvailabelManager,
  useFPMManagerRoles,
  userMangtPayload,
  useSaveUserDetails,
  useUser,
  useUserDetails,
  useViewVendor,
} from 'api/user-management'
import { languageOptions } from 'api/vendor-details'
import { ConfirmationBox } from 'components/Confirmation'
import { CheckboxButton } from 'components/form/checkbox-button'
import ReactSelect from 'components/form/react-select'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiErrorCircle } from 'react-icons/bi'
import NumberFormat from 'react-number-format'
import { UserForm } from 'types/user.types'
import { parseMarketFormValuesToAPIPayload } from 'utils/markets'
import { PasswordField } from './password-field'
import { USER_MANAGEMENT } from './user-management.i8n'
import { BONUS, DURATION } from './constants'
import { UserTypes } from 'utils/redux-common-selectors'
import { validateTelePhoneNumber } from 'utils/form-validation'

type UserManagement = {
  onClose: () => void
  user?: UserForm
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

export const UserManagementForm: React.FC<UserManagement> = ({ user, onClose }) => {
  const { t } = useTranslation()
  const form = useForm<UserForm>()
  const { stateSelectOptions: stateOptions } = useStates()
  const [isDeleteBtnClicked, setIsDeleteBtnClicked] = useState(false)
  const { options: accountTypeOptions } = useActiveAccountTypes()
  const { options: fpmManagerRoleOptions } = useFPMManagerRoles()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = form

  const { data: userInfo } = useUser(user?.email)
  const { mutate: updateUser } = useSaveUserDetails()
  const { mutate: addUser } = useCreateUserMutation()
  const { mutate: deleteUser } = useDeleteUserDetails()
  const { options: vendorTypes } = useViewVendor()

  useUserDetails({ form, userInfo })

  const formValues = watch()

  const accountType: any = formValues?.accountType
  const fpmRole: any = formValues?.fieldProjectManagerRoleId

  const isEditUser = !!(user && user.id)
  const isVendor = accountType?.label === 'Vendor'
  const isProjectCoordinator = accountType?.label === 'Project Coordinator'
  const isFPM = accountType?.label === 'Field Project Manager'

  // We only show markets when account type is either market fpm, regular fpm or it is project cordinator
  const showMarkets = useMemo(() => {
    //TODO - Add enums instead of using actual numerical values
    if ([61, 221].includes(fpmRole?.value)) {
      return true
    }
    return isProjectCoordinator
  }, [isProjectCoordinator, fpmRole])

  //TODO - Add enums instead of using actual numerical values
  // 59 is for Area FPM
  // 60 is for Regional FPM
  const showStates = fpmRole?.value === FPMManagerTypes.Area
  const showRegions = fpmRole?.value === FPMManagerTypes.Regional

  const noMarketsSelected = !validateMarket(formValues?.markets)
  const noStatesSelected = !validateState(formValues?.states)
  const noRegionSelected = !validateRegions(formValues?.regions)
  const invalidTelePhone =
    validateTelePhoneNumber(formValues?.telephoneNumber as string) || !formValues?.telephoneNumber

  const watchRequiredField =
    !formValues?.email ||
    !formValues?.firstName ||
    !formValues?.lastName ||
    (!isEditUser && !formValues?.newPassword) ||
    !formValues?.accountType ||
    !formValues?.streetAddress ||
    !formValues?.telephoneNumber ||
    !formValues?.langKey ||
    (isVendor && !formValues.vendorId) ||
    (isFPM && (!fpmRole || !formValues.managerRoleId || !formValues?.newTarget)) ||
    (showMarkets && noMarketsSelected) ||
    (showStates && !validateState(formValues?.states)) ||
    (showRegions && !validateRegions(formValues?.regions))

  const managerRoleOptions = useMemo(() => {
    // filter for Regional Manager
    if (showRegions) {
      return fpmManagerRoleOptions.filter(role =>
        [UserTypes.directorOfConstruction, UserTypes.operations].includes(role.value),
      )
    }

    // filter for market FPM
    if (fpmRole?.value === FPMManagerTypes.Market && showMarkets)
      return fpmManagerRoleOptions.filter(
        role => ![FPMManagerTypes.Market, FPMManagerTypes.Regular].includes(role.value),
      )

    // filter for regular FPM
    if (showMarkets) return fpmManagerRoleOptions.filter(role => ![FPMManagerTypes.Regular].includes(role.value))

    // filter for area FPM
    if (showStates)
      return fpmManagerRoleOptions.filter(role =>
        [UserTypes.directorOfConstruction, UserTypes.operations, FPMManagerTypes.Regional].includes(role.value),
      )
    return fpmManagerRoleOptions
  }, [fpmManagerRoleOptions])

  const selectedLocations = useMemo(() => {
    let locations = ''
    if (showStates) {
      locations =
        formValues?.states
          ?.filter(state => state.checked)
          .map(s => s.state.id)
          .toString() || ''
    }
    if (showMarkets && formValues?.markets && formValues.markets?.length > 0) {
      locations =
        formValues.markets
          .filter(market => market.checked)
          .map(m => m.market.id)
          .toString() || ''
    }
    if (showRegions && formValues?.regions && formValues.regions?.length > 0) {
      locations =
        formValues.regions
          .filter(regions => regions.checked)
          .map(r => r.region?.value)
          .toString() || ''
    }
    return locations
  }, [formValues])

  const { options: availableManagerOptions } = useFilteredAvailabelManager(
    formValues?.fieldProjectManagerRoleId,
    formValues?.managerRoleId,
    selectedLocations,
  )

  const managerOptions = useMemo(() => {
    return availableManagerOptions
  }, [availableManagerOptions?.length])
  // Clear any input field which is being conditionally rendered when user
  // changes account type
  const handleChangeAccountType = () => {
    setValue('parentFieldProjectManagerId', null)
    setValue('managerRoleId', null)
    setValue('fieldProjectManagerRoleId', undefined)
    setValue('newTarget', undefined)
    setValue('newBonus', undefined)
    setValue('ignoreQuota', undefined)
    setValue(
      'markets',
      formValues.markets?.map(market => ({ ...market, checked: false })),
    )
    setValue(
      'states',
      formValues.states?.map(state => ({ ...state, checked: false })),
    )
    setValue('vendorId', undefined)
  }

  const handleChangeFpmRole = () => {
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
    setValue('managerRoleId', null)
    setValue('parentFieldProjectManagerId', null)
  }

  const clearSelectedManager = () => {
    setValue('parentFieldProjectManagerId', null)
  }

  const onSubmit = useCallback(
    async formData => {
      let formattedPayload = userMangtPayload(formData)
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
    [userInfo, isVendor, addUser, updateUser, userMangtPayload],
  )

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
            <Input isDisabled={isEditUser} borderLeft="2.5px solid #4E87F8" type="id" {...register('id')} />
          </FormControl>
        )}
        <FormControl w={215} isInvalid={!!errors.email} h="77px">
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.email`)}
          </FormLabel>
          <Input
            isDisabled={isEditUser}
            borderLeft="2.5px solid #4E87F8"
            type="email"
            {...register('email', {
              required: 'This is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid Email Address',
              },
            })}
          />
          <FormErrorMessage pos={'absolute'}>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.firstName`)}
          </FormLabel>
          <Input borderLeft="2.5px solid #4E87F8" type="text" {...register('firstName')} />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.lastName`)}
          </FormLabel>
          <Input autoComplete="off" borderLeft="2.5px solid #4E87F8" type="text" {...register('lastName')} />
        </FormControl>
      </HStack>

      <HStack mt="30px">
        <PasswordField errors={errors} register={register} isRequired={!isEditUser} />
      </HStack>

      <HStack mt="30px" spacing={15}>
        <FormControl w="215px">
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.accountType`)}
          </FormLabel>
          <Controller
            control={control}
            name="accountType"
            render={({ field: { onChange, ...rest } }) => (
              <ReactSelect
                {...rest}
                isDisabled={userInfo && userInfo.userTypeLabel === 'Vendor'}
                selectProps={{ isBorderLeft: true }}
                options={accountTypeOptions}
                onChange={target => {
                  onChange(target)
                  handleChangeAccountType()
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
              <ReactSelect selectProps={{ isBorderLeft: true }} {...field} options={languageOptions} />
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
            {...register('activated')}
          >
            {t(`${USER_MANAGEMENT}.modal.activated`)}
          </Checkbox>
        </FormControl>
      </HStack>

      {isFPM ? (
        <HStack mt="30px" spacing={15}>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t(`${USER_MANAGEMENT}.modal.fieldProjectManagerRole`)}
            </FormLabel>
            <Controller
              control={control}
              name="fieldProjectManagerRoleId"
              render={({ field: { onChange, ...rest } }) => (
                <ReactSelect
                  {...rest}
                  selectProps={{ isBorderLeft: true }}
                  options={fpmManagerRoleOptions?.filter(
                    role => ![UserTypes.directorOfConstruction, UserTypes.operations].includes(role?.value),
                  )}
                  onChange={target => {
                    onChange(target)
                    handleChangeFpmRole()
                  }}
                />
              )}
            />
          </FormControl>
        </HStack>
      ) : null}

      {showMarkets ? (
        <VStack mt="30px" spacing={15} alignItems="start">
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
                          clearSelectedManager()
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

      {showStates ? (
        <VStack mt="30px" spacing={15} alignItems="start">
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
                        isChecked={state?.checked}
                        onChange={event => {
                          const checked = event.target.checked
                          onChange({ ...state, checked })
                          clearSelectedManager()
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

      {showRegions ? (
        <VStack mt="30px" spacing={15} alignItems="start">
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
                          clearSelectedManager()
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

      {isFPM ? (
        <>
          <HStack mt="30px" spacing={15}>
            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.managerRole`)}
              </FormLabel>
              <Controller
                control={control}
                name="managerRoleId"
                render={({ field: { onChange, ...rest } }) => (
                  <ReactSelect
                    {...rest}
                    selectProps={{ isBorderLeft: managerRoleOptions.length > 0 }}
                    options={managerRoleOptions}
                    onChange={param => {
                      onChange(param)
                      clearSelectedManager()
                    }}
                  />
                )}
              />
            </FormControl>
            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.parentFieldProjectManagerId`)}
              </FormLabel>
              <Controller
                control={control}
                name="parentFieldProjectManagerId"
                render={({ field }) => <ReactSelect {...field} options={managerOptions} />}
              />
            </FormControl>

            <FormControl w={215}>
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.newTarget`)}
              </FormLabel>
              <Input borderLeft="2.5px solid #4E87F8" type="number" {...register('newTarget')} />
            </FormControl>

            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.newBonus`)}
              </FormLabel>
              <Controller
                control={control}
                name="newBonus"
                render={({ field }) => <ReactSelect {...field} options={BONUS} />}
              />
            </FormControl>
          </HStack>
          <HStack mt="30px" spacing={15}>
            <FormControl w={215}>
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.ignoreQuota`)}
              </FormLabel>
              <Controller
                control={control}
                name="ignoreQuota"
                render={({ field }) => <ReactSelect {...field} options={DURATION} />}
              />
            </FormControl>
          </HStack>
        </>
      ) : null}

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
                  <ReactSelect selectProps={{ isBorderLeft: true }} {...field} options={vendorTypes} />
                )}
              />
            </FormControl>
          </HStack>
        </>
      ) : null}
      <HStack mt="30px" spacing={15}>
        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.address`)}
          </FormLabel>
          <Input borderLeft="2.5px solid #4E87F8" type="text" {...register('streetAddress')} />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.city`)}
          </FormLabel>
          <Input type="text" {...register('city')} />
        </FormControl>

        <FormControl w={215}>
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
                options={stateOptions}
                selectProps={{ isBorderLeft: showStates ? true : false }}
              />
            )}
          />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.zipcode`)}
          </FormLabel>
          <Input type="number" {...register('zipCode')} />
        </FormControl>
      </HStack>

      <HStack mt="30px" spacing={15}>
        <FormControl w={215} isInvalid={!invalidTelePhone}>
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
                    customInput={Input}
                    value={field.value}
                    onChange={e => field.onChange(e)}
                    format="(###)-###-####"
                    mask="_"
                    placeholder="(___)-___-____"
                    borderLeft="2.5px solid #4E87F8"
                  />
                )
              }}
            />
            <FormErrorMessage>{!invalidTelePhone ? 'Valid Phone Number Is Required' : null}</FormErrorMessage>
          </Box>
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.ext`)}
          </FormLabel>
          <Box height="70px">
            <Input type="text" {...register('telephoneNumberExtension')} />
          </Box>
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.employeeID`)}
          </FormLabel>
          <Box height="70px">
            <Input type="text" {...register('employeeId')} />
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
          {user && (
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
        >
          {t(`${USER_MANAGEMENT}.modal.cancel`)}
        </Button>

        <Button type="submit" colorScheme="brand" isDisabled={!!watchRequiredField || !invalidTelePhone}>
          {t(`${USER_MANAGEMENT}.modal.save`)}
        </Button>
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
      </HStack>
      <DevTool control={control} />
    </form>
  )
}
