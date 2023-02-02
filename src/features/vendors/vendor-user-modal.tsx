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
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { languageOptions, useVendorProfile } from 'api/vendor-details'
import { Vendor } from 'types/vendor.types'
import { Controller, useForm } from 'react-hook-form'
import { PasswordField } from 'features/user-management/password-field'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'components/form/react-select'
import NumberFormat from 'react-number-format'
import { validateTelePhoneNumber } from 'utils/form-validation'
import { useAddUpdateVendorUser, useVendorUserDetails } from 'api/vendor-user'

const VendorUserModal = ({
  vendorDetails,
  onClose,
  isOpen,
  parentVendorId,
}: {
  vendorDetails: Vendor | any
  onClose: () => void
  isOpen: boolean
  parentVendorId: number
}) => {
  const { t } = useTranslation()

  //es-lint-disable-next-line
  const { data: vendorProfileData, isLoading } = useVendorProfile(vendorDetails?.id)

  const isEditUser = !!(vendorDetails && vendorDetails.id)

  const form = useForm()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue
  } = form;

  useVendorUserDetails( form, vendorDetails );

  const formValues = watch()

  const invalidTelePhone =
    validateTelePhoneNumber(formValues?.telephoneNumber as string) || !formValues?.telephoneNumber

  const { mutate: createUpdateUser } = useAddUpdateVendorUser()

  const onSubmit = values => {
    console.log(values)

    const userPayload = {
      login: formValues.email,
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      userActivated: true,
      vendorAdmin: formValues.vendorAdmin,
      primaryAdmin: true,
      langKey: formValues.langKey.value,
      phoneNumber: formValues.telephoneNumber,
      vendorId: parentVendorId,
    } as any

    if (isEditUser) {
      userPayload.id = vendorDetails?.id
    }

    createUpdateUser(userPayload, {
      onSuccess: () => {
        onCloseModal()
      },
    })
  }

  

  const onCloseModal = () => {
    onClose();
    setValue( "telephoneNumber", "" );
    reset();
  }

  console.log(errors)

  return (
    <div>
      <Modal size="none" isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent w="600px" rounded={3} borderTop="2px solid #4E87F8" bg="#fff">
          <ModalHeader
            h="63px"
            borderBottom="1px solid #E2E8F0"
            color="gray.600"
            fontSize={16}
            fontWeight={500}
            bg="white"
          >
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text lineHeight="22px" h="22px" pr={2}>
                  {vendorDetails ? 'Edit User: ' + vendorDetails?.id : 'New User'}
                </Text>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody px="9px" pb="22px" bg="white" borderBottom="1px solid #E2E8F0">
            <chakra.form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              action="#"
            >
              <Box mt="14px">
                {isLoading ? (
                  <BlankSlate width="60px" />
                ) : (
                  <Box ml="20px">
                    <HStack mt="30px" spacing={15}>
                      <FormControl w={215}>
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.firstName`)}
                        </FormLabel>
                        <Input variant="required-field" type="text" {...register('firstName')} />
                      </FormControl>

                      <FormControl w={215}>
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.lastName`)}
                        </FormLabel>
                        <Input autoComplete="off" variant="required-field" type="text" {...register('lastName')} />
                      </FormControl>
                    </HStack>

                    <HStack mt="30px" spacing={15}>
                      <FormControl w={215} isInvalid={!!errors.email} h="120px">
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.email`)}
                        </FormLabel>
                        <Input
                          isDisabled={isEditUser}
                          variant="required-field"
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

                      <HStack mt="30px" h="120px">
                        <PasswordField errors={errors} register={register} isRequired={!isEditUser} />
                      </HStack>
                    </HStack>

                    <HStack mt="30px" spacing={15}>
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

                      <FormControl w={215} isInvalid={!invalidTelePhone} mt="20px">
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.telephone`)}
                        </FormLabel>
                        <Box height="40px">
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
                                  variant="required-field"
                                />
                              )
                            }}
                          />
                          <FormErrorMessage>
                            {!invalidTelePhone ? 'Valid Phone Number Is Required' : null}
                          </FormErrorMessage>
                        </Box>
                      </FormControl>
                    </HStack>

                    <HStack mt="30px">
                      <Box></Box>
                      <FormControl w="215px">
                        <Box>
                          <Checkbox {...register('vendorAdmin')}>Admin</Checkbox>
                        </Box>
                      </FormControl>
                    </HStack>
                  </Box>
                )}
              </Box>
              <Flex borderTop="1px solid #E2E8F0" mt="20px" pt="20px" justifyContent="right">
                <HStack spacing="16px" >
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClose()
                      reset()
                    }}
                    colorScheme="brand"
                  >
                    {t('cancel')}
                  </Button>
                  <Button type="submit" colorScheme="brand">
                    {t('save')}
                  </Button>
                </HStack>
              </Flex>
            </chakra.form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default VendorUserModal
