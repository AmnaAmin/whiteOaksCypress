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
  Stack,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { languageOptions } from 'api/vendor-details'
import { Vendor } from 'types/vendor.types'
import { Controller, useForm } from 'react-hook-form'
import { PasswordField } from 'features/user-management/password-field'
import { USER_MANAGEMENT } from 'features/user-management/user-management.i8n'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'components/form/react-select'
import NumberFormat from 'react-number-format'
import { validateTelePhoneNumber } from 'utils/form-validation'
import { useAddVendorUser, useVendorUserDetails, useUpdateVendorUser } from 'api/vendor-user'
import { useStates } from 'api/pc-projects'
import { useAuth } from 'utils/auth-context'
import { useState, useEffect } from 'react'
import { Card } from 'components/card/card'

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
  //const { isLoading } = useVendorProfile(vendorDetails?.id)

  const isEditUser = !!(vendorDetails && vendorDetails.id)

  const form = useForm()

  const { stateSelectOptions: stateOptions } = useStates()

  const { data: userInfo } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = form

  useVendorUserDetails(form, vendorDetails)

  const formValues = watch()

  const watchRequiredField =
    !formValues?.email ||
    !formValues?.firstName ||
    !formValues?.lastName ||
    (!isEditUser && !formValues?.newPassword) ||
    !formValues?.state ||
    !formValues?.streetAddress ||
    !formValues?.telephoneNumber ||
    !formValues?.langKey ||
    !formValues?.city ||
    !formValues?.zipCode

  const invalidTelePhone =
    validateTelePhoneNumber(formValues?.telephoneNumber as string) || !formValues?.telephoneNumber

  const { mutate: createUser } = useAddVendorUser()
  const { mutate: updateUser } = useUpdateVendorUser()

  const onSubmit = values => {
    const userPayload = {
      login: formValues.email,
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      vendorAdmin: formValues.vendorAdmin,
      primaryAdmin: formValues.primaryAdmin,
      langKey: formValues.langKey?.value || '',
      telephoneNumber: formValues.telephoneNumber,
      vendorId: parentVendorId,
      city: formValues.city,
      streetAddress: formValues.streetAddress,
      stateId: formValues.state?.id || '',
      zipCode: formValues.zipCode,
      activated: formValues.activated,
      parentId: userInfo?.user.id,
    } as any

    if (isEditUser) {
      userPayload.id = vendorDetails?.id
    }

    if (formValues.newPassword !== '' && formValues.newPassword.length >= 4) {
      userPayload.password = formValues.newPassword
    }

    if (isEditUser) {
      updateUser(userPayload, {
        onSuccess: () => {
          onCloseModal()
        },
      })
    } else {
      createUser(userPayload, {
        onSuccess: () => {
          onCloseModal()
        },
      })
    }
  }

  const onCloseModal = () => {
    onClose()
    setValue('telephoneNumber', '')
    reset()
  }

  const isPrimaryDisabled = !formValues.vendorAdmin

  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('3xl')

  useEffect(() => {
    if (isMobile) {
      setModalSize('sm')
    } else {
      setModalSize('3xl')
    }
  }, [isMobile])

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onCloseModal} size={modalSize} variant="custom">
        <ModalOverlay />
        <ModalContent w="950px" rounded={3} borderTop="2px solid #4E87F8" bg="#fff">
          <Box
            sx={{
              '@media screen and (max-width: 480px)': {
                position: "sticky",
                top: "0",
                zIndex: 99,
                zoom: 1
              },
            }}
          >
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
          </Box>
          <ModalBody bg='#F2F3F4' px='12px'  pb="22px"  borderBottom="1px solid #E2E8F0">
          <Card borderTopRightRadius='6px' borderTopLeftRadius='6px'>
            <chakra.form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              action="#"
              sx={{
                '@media screen and (max-width: 480px)': {
                  '.chakra-form-control': {
                    marginTop: '20px',
                    width: '80%',
                    marginInline: '0 !important',
                  },
                  '.chakra-form-control:first-child': {
                    marginTop: '0px',
                  },
                  '.chakra-input__group': {
                    width: '100%',
                    marginInline: '0 !important',
                  },
                },
              }}
            >
              <Box ml="20px">
                      <Stack alignItems="center" direction="row" spacing="16px" mt="30px">
                        <VStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
                          <FormLabel variant="strong-label" size="md">
                            Vendor Roles
                          </FormLabel>
                          <FormControl>
                            <HStack spacing="16px">
                              <Checkbox
                                {...register('vendorAdmin', {
                                  onChange: e => {
                                    if (!e.target.checked) setValue('primaryAdmin', false)
                                  },
                                })}
                                colorScheme="brand"
                              >
                                Admin
                              </Checkbox>
                              <Checkbox
                                isChecked={formValues.primaryAdmin}
                                isDisabled={isPrimaryDisabled}
                                {...register('primaryAdmin')}
                              >
                                <chakra.span position="relative">Primary</chakra.span>
                              </Checkbox>
                            </HStack>
                            <FormErrorMessage pos="absolute">{errors.Check?.message}</FormErrorMessage>
                          </FormControl>
                        </VStack>
                      </Stack>
                    </Box>
              <Box mt="14px">
                {false ? (
                  <BlankSlate width="60px" />
                ) : (
                  <Box ml="20px">
                    <HStack
                      mt="30px"
                      spacing={15}
                      sx={{
                        '@media screen and (max-width: 480px)': {
                          flexDirection: 'column',
                          alignItems: 'baseline',
                        },
                      }}
                    >
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
                        <Input variant="required-field" type="text" {...register('firstName')} />
                      </FormControl>

                      <FormControl w={215}>
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.lastName`)}
                        </FormLabel>
                        <Input autoComplete="off" variant="required-field" type="text" {...register('lastName')} />
                      </FormControl>
                    </HStack>

                    <HStack
                      mt="30px"
                      sx={{
                        '@media screen and (max-width: 480px)': {
                          flexDirection: 'column',
                          alignItems: 'baseline',
                          marginInlineStart: '0px',
                        },
                      }}
                    >
                      <PasswordField errors={errors} register={register} isRequired={!isEditUser} />
                    </HStack>

                    <HStack
                      mt="30px"
                      spacing={15}
                      sx={{
                        '@media screen and (max-width: 480px)': {
                          flexDirection: 'column',
                          alignItems: 'baseline',
                        },
                      }}
                    >
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
                    <HStack
                      mt="30px"
                      spacing={15}
                      sx={{
                        '@media screen and (max-width: 480px)': {
                          flexDirection: 'column',
                          alignItems: 'baseline',
                        },
                      }}
                    >
                      <FormControl w={215}>
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.address`)}
                        </FormLabel>
                        <Input variant="required-field" type="text" {...register('streetAddress')} />
                      </FormControl>

                      <FormControl w={215}>
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.city`)}
                        </FormLabel>
                        <Input type="text" {...register('city')} variant="required-field" />
                      </FormControl>

                    </HStack>                 
                    <HStack
                      mt="30px"
                      spacing={15}
                      sx={{
                        '@media screen and (max-width: 480px)': {
                          flexDirection: 'column',
                          alignItems: 'baseline',
                        },
                      }}
                    >
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
                              selectProps={{ isBorderLeft: true }}
                            />
                          )}
                        />
                      </FormControl>

                      <FormControl w={215}>
                        <FormLabel variant="strong-label" size="md">
                          {t(`${USER_MANAGEMENT}.modal.zipcode`)}
                        </FormLabel>
                        <Input type="number" {...register('zipCode')} variant="required-field" />
                      </FormControl>
                    </HStack>                  
                  </Box>                 
                )}
              </Box>
              <Flex borderTop="1px solid #E2E8F0" mt="20px" pt="20px" justifyContent="right">
                <HStack spacing="16px">
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
                  <Button type="submit" colorScheme="brand" disabled={!!watchRequiredField}>
                    {t('save')}
                  </Button>
                </HStack>
              </Flex>
            </chakra.form>
            </Card>
          </ModalBody>        
        </ModalContent>
      </Modal>
    </div>
  )
}

export default VendorUserModal
