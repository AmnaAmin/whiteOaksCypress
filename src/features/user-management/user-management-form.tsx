import {
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
  useActiveAccountTypes,
  useAllManagers,
  useCreateUserMutation,
  useDeleteUserDetails,
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
export const BONUS = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 1,
    label: '1%',
  },
  {
    value: 2,
    label: '2%',
  },
  {
    value: 3,
    label: '3%',
  },
  {
    value: 4,
    label: '4%',
  },
  {
    value: 5,
    label: '5%',
  },
  {
    value: 6,
    label: '6%',
  },
  {
    value: 7,
    label: '7%',
  },
  {
    value: 8,
    label: '8%',
  },
  {
    value: 9,
    label: '9%',
  },
  {
    value: 10,
    label: '10%',
  },
]

export const DURATION = [
  {
    value: 0,
    label: 'No',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 90,
    label: '90',
  },
  {
    value: -1,
    label: 'Indefinitely',
  },
]

export const UserManagementForm: React.FC<UserManagement> = ({ user, onClose }) => {
  const { t } = useTranslation()
  const form = useForm<UserForm>()
  const { stateSelectOptions: stateOptions } = useStates()
  const [isDeleteBtnClicked, setIsDeleteBtnClicked] = useState(false)
  const { options: accountTypeOptions } = useActiveAccountTypes()
  const { options: availableManagers } = useAllManagers()
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

  const showMarkets = useMemo(() => {
    if ([61, 221].includes(fpmRole?.value)) {
      return true
    }
    return isProjectCoordinator
  }, [isProjectCoordinator, fpmRole])

  const showStates = fpmRole?.value === 59
  const showRegions = fpmRole?.value === 60;

  const noMarketsSelected = !validateMarket(formValues?.markets)

  const watchRequiredField =
    !formValues?.email ||
    !formValues?.firstName ||
    !formValues?.lastName ||
    !formValues?.accountType ||
    !formValues?.streetAddress ||
    !formValues?.telephoneNumber ||
    !formValues?.langKey ||
    (isVendor && !formValues.vendorId) ||
    (isFPM && (!fpmRole || !formValues?.newTarget)) ||
    (showMarkets && noMarketsSelected) ||
    (showStates && !validateState(formValues?.states)) ||
    (showRegions && !validateRegions(formValues?.regions));

  const handleChangeAccountType = () => {
    setValue('parentFieldProjectManagerId', null)
    // setValue('managerRoleId', undefined)
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
            <Input
              isDisabled={isEditUser}
              borderLeft="2.5px solid #4E87F8"
              type="id"
              {...register('id')}
            />
          </FormControl>
        )}
        <FormControl w={215}>
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
                message: 'Invalid email',
              }
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
          <Input
            autoComplete="off"
            borderLeft="2.5px solid #4E87F8"
            type="text"
            {...register('lastName')}
          />
        </FormControl>
      </HStack>

      <HStack mt="30px">
        <PasswordField errors={errors} register={register} />
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
              <ReactSelect selectProps={{ isBorderLeft: true }} {...field} options={languageOptions}/>
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
                  options={fpmManagerRoleOptions}
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
        <VStack mt="30px">
          <FormLabel variant="strong-label" size="md" alignSelf="start">
            {t(`${USER_MANAGEMENT}.modal.state`)}
          </FormLabel>
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
        <VStack mt="30px" alignItems="start">
          <FormLabel variant="strong-label" size="md" alignSelf="start">
            {t(`${USER_MANAGEMENT}.modal.regions`)}
          </FormLabel>
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
            {/* <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                Manager Role
              </FormLabel>
              <Controller
                control={control}
                name="managerRoleId"
                render={({ field }) => (
                  <ReactSelect {...field} options={[]} />
                )}
              />
            </FormControl> */}
            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.parentFieldProjectManagerId`)}
              </FormLabel>
              <Controller
                control={control}
                name="parentFieldProjectManagerId"
                render={({ field }) => <ReactSelect {...field} options={availableManagers} />}
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
              <ReactSelect id="state" {...field} options={stateOptions} selectProps={{ isBorderLeft: showStates ? true : false }} />
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
        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.telephone`)}
          </FormLabel>
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
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.ext`)}
          </FormLabel>
          <Input type="text" {...register('telephoneNumberExtension')} />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.employeeID`)}
          </FormLabel>
          <Input type="text" {...register('employeeId')} />
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
              _disabled={{
                bg: '#EBF8FF',
                color: '#4E87F8',
                opacity: 0.5,
              }}
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
        <Button type="submit" colorScheme="brand" isDisabled={!!watchRequiredField}>
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
