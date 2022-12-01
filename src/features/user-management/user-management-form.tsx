import { Button, Checkbox, Flex, FormControl, FormLabel, HStack, Input, Spacer, VStack } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { useStates } from 'api/pc-projects'
import {
  useAccountTypes,
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
import { setValues } from 'framer-motion/types/render/utils/setters'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  }
];

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
];


export const UserManagementForm: React.FC<UserManagement> = ({ user, onClose }) => {
  const { t } = useTranslation()
  const form = useForm<UserForm>()
  const { stateSelectOptions: stateOptions } = useStates()
  const [isDeleteBtnClicked, setIsDeleteBtnClicked] = useState(false)
  const { options: accountTypeOptions } = useAccountTypes()
  const { options: availableManagers } = useAllManagers()
  const { options: fpmManagerRoleOptions } = useFPMManagerRoles()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = form

  const { data: userInfo } = useUser(user?.email)
  const { mutate: updateUser } = useSaveUserDetails()
  const { mutate: addUser } = useCreateUserMutation();
  const { mutate: deleteUser } = useDeleteUserDetails()
  const { options: vendorTypes } = useViewVendor()
  useUserDetails({ form, userInfo })

  /**
   * When we are calling reset() on form, we are not getting
   * latest formValues from useWatch hook
   */
  const formValues = useWatch({ control })
  const accountType: any = formValues?.accountType;
  const fpmRole: any = formValues?.fieldProjectManagerRoleId;

  const watchRequiredField =
    !formValues?.email ||
    !formValues?.firstName ||
    !formValues?.lastName ||
    !formValues?.accountType ||
    !formValues?.streetAddress ||
    !formValues?.telephoneNumber ||
    !formValues?.langKey ||
    (
      accountType?.label === 'Project Coordinator' &&
      !validateMarket(formValues?.markets)
    )

  console.log('formValues - ', formValues);

  const isVendor = accountType?.label === 'Vendor'
  const isProjectCoordinator = accountType?.label === 'Project Coordinator';
  const isFPM = accountType?.label === 'Field Project Manager';

  const showMarkets = useMemo(() => {
    if ([61, 221].includes(fpmRole?.value)) {
      return true;
    }
    return isProjectCoordinator;
  }, [isProjectCoordinator, fpmRole]);

  const showStates = fpmRole?.value === 59;
  const showRegions = fpmRole?.value === 60;

  const handleChangeAccountType = () => {
    setValue('parentFieldProjectManagerId', null)
    setValue('managerRoleId', undefined)
    setValue('fieldProjectManagerRoleId', undefined)
    setValue('newTarget', undefined)
    setValue('newBonus', undefined)
    setValue('ignoreQuota', undefined)
    setValue('markets', formValues.markets?.map((market) => ({ ...market, checked: false })))
    setValue('states', formValues.states?.map((state) => ({ ...state, checked: false })))
    setValue('vendorId', undefined)
  }

  const handleChangeFpmRole = () => {
    setValue('markets', formValues.markets?.map((market) => ({ ...market, checked: false })))
    setValue('states', formValues.states?.map((state) => ({ ...state, checked: false })))
  }

  console.log('userInfo - ', userInfo);
  console.log('isVendor - ', isVendor);
  const onSubmit = useCallback(
    async formData => {

      let formattedPayload = userMangtPayload(formData)
      if(isVendor){
        formattedPayload={...formattedPayload,vendorId:formattedPayload?.vendorId?.value}
      }
      const mutation = userInfo?.id ? updateUser : addUser;
      console.log('formattedPayload ', formattedPayload);
      mutation(
        parseMarketFormValuesToAPIPayload(formattedPayload
        ), {
        onSuccess() {
          onClose()
        },
        onError() {
          onClose()
        },
      })
    },
    [userInfo, isVendor, addUser, updateUser, userMangtPayload],
  )

  const isEditUser = !!(user && user.id)

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
              placeholder="id"
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
            placeholder="Email"
            {...register('email')}
          />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.firstName`)}
          </FormLabel>
          <Input borderLeft="2.5px solid #4E87F8" type="text" placeholder="First Name" {...register('firstName')} />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.lastName`)}
          </FormLabel>
          <Input
            autoComplete="off"
            borderLeft="2.5px solid #4E87F8"
            type="text"
            placeholder="Last Name"
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
                onChange={(target) => {
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
                  options={fpmManagerRoleOptions}
                  onChange={(target) => {
                    onChange(target)
                    handleChangeFpmRole()
                  }}
                />
              )}
            />
          </FormControl>
        </HStack>
      ) : null
      }

      {showMarkets ? (
        <HStack mt="30px" spacing={15}>
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
        </HStack>
      ) : null}

      {/* TODO - check from product and backend, whether states and regions are the same thing */}
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

      {isFPM ? (
        <>
          <HStack mt="30px" spacing={15}>
            <FormControl w="215px">
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
            </FormControl>
            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.parentFieldProjectManagerId`)}
              </FormLabel>
              <Controller
                control={control}
                name="parentFieldProjectManagerId"
                render={({ field }) => (
                  <ReactSelect {...field} options={availableManagers} />
                )}
              />
            </FormControl>

            <FormControl w={215}>
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.newTarget`)}
              </FormLabel>
              <Input borderLeft="2.5px solid #4E87F8" type="text" {...register('newTarget')} />
            </FormControl>

            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`${USER_MANAGEMENT}.modal.newBonus`)}
              </FormLabel>
              <Controller
                control={control}
                name="newBonus"
                render={({ field }) => (
                  <ReactSelect {...field} options={BONUS} />
                )}
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
                render={({ field }) => (
                  <ReactSelect {...field} options={DURATION} />
                )}
              />
            </FormControl>
          </HStack>
        </>
      ) : null}

      {isVendor ?
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
        : null}
      <HStack mt="30px" spacing={15}>
        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.address`)}
          </FormLabel>
          <Input borderLeft="2.5px solid #4E87F8" type="text" placeholder="Address" {...register('streetAddress')} />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.city`)}
          </FormLabel>
          <Input type="text" placeholder="City" {...register('city')} />
        </FormControl>

        <FormControl w={215}>
          <FormLabel variant="strong-label" size="md">
            {t(`${USER_MANAGEMENT}.modal.state`)}
          </FormLabel>
          <Controller
            control={control}
            name="state"
            render={({ field }) => <ReactSelect id="state" {...field} options={stateOptions} />}
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
