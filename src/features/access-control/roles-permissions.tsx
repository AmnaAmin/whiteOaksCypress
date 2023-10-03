import { SelectOption } from 'types/transaction.type'
import {
  HStack,
  Table,
  Tbody,
  Td,
  TableContainer,
  Thead,
  Tr,
  Text,
  Button,
  VStack,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
import { ACCESS_CONTROL } from 'features/access-control/access-control.i18n'
import { useTranslation } from 'react-i18next'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import Select from 'components/form/react-select'
import { useEffect, useState } from 'react'
import {
  ASSIGNMENTS,
  LOCATIONS,
  mapFormValuestoPayload,
  permissionsDefaultValues,
  setDefaultPermission,
  useCreateNewRoleMutation,
  useFetchAllPermissions,
  useUpdateRoleMutation,
} from 'api/access-control'
import { useAccountData } from 'api/user-account'

interface PemissionFormValues {
  roleName: string
  assignment: SelectOption
  location: SelectOption
  systemRole: boolean
  permissions: Array<{ name: string; edit: boolean; hide: boolean; read: boolean }>
}

export const RolesPermissions = ({ permissions, setNewRole, setSelectedRole, allowEdit }) => {
  const formReturn = useForm<PemissionFormValues>()
  const {
    formState: { errors },
  } = formReturn
  const { data: allPermissions } = useFetchAllPermissions()
  const { mutate: createRole } = useCreateNewRoleMutation()
  const { mutate: updateRole } = useUpdateRoleMutation(permissions?.[0]?.name)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control, register, reset } = formReturn
  const { data } = useAccountData()
  const isDevtekUser = data?.devAccount
  const { t } = useTranslation()
  useEffect(() => {
    reset(permissionsDefaultValues({ permissions }))
  }, [reset, permissions])

  const onSubmit = values => {
    let payload = mapFormValuestoPayload(values, allPermissions)
    if (!permissions) {
      createRole(payload as any, {
        onSuccess: () => {
          setNewRole?.(false)
        },
      })
    } else {
      payload['id'] = permissions?.[0]?.id
      updateRole(payload as any)
    }
  }
  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }
  return (
    <Box w="100%">
      <form
        onSubmit={formReturn.handleSubmit(onSubmit, err => console.log('err..', err))}
        onKeyDown={e => checkKeyDown(e)}
      >
        <VStack justifyContent={'start'} gap="20px">
          <HStack w="100%" gap="10px">
            <Box w="215px">
              <FormControl isInvalid={!!errors.roleName}>
                <FormLabel variant="strong-label" size="md">
                  {t(`${ACCESS_CONTROL}.roleName`)}
                </FormLabel>
                <Input
                  data-testid="roleName"
                  id="roleName"
                  disabled={!!permissions}
                  size="md"
                  variant="required-field"
                  {...register('roleName', {
                    required: 'This is required field.',
                  })}
                />
                <FormErrorMessage>{errors?.roleName && errors?.roleName?.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box w="215px">
              <FormControl isInvalid={!!errors.assignment}>
                <FormLabel variant="strong-label" size="md">
                  {t(`${ACCESS_CONTROL}.assignment`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="assignment"
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <div data-testid="assignment">
                        <Select
                          //isDisabled={!!permissions}
                          options={ASSIGNMENTS}
                          selectProps={{ isBorderLeft: true }}
                          {...field}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </div>
                    </>
                  )}
                />
              </FormControl>
            </Box>
            <Box w="215px">
              <FormControl isInvalid={!!errors.location}>
                <FormLabel variant="strong-label" size="md">
                  {t(`${ACCESS_CONTROL}.location`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="location"
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <div data-testid="locations">
                        <Select
                          options={LOCATIONS}
                          //isDisabled={!!permissions}
                          selectProps={{ isBorderLeft: true }}
                          {...field}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </div>
                    </>
                  )}
                />
              </FormControl>
            </Box>
            {isDevtekUser && (
              <Box w="215px">
                <FormControl isInvalid={!!errors.systemRole}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${ACCESS_CONTROL}.systemRole`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name={`systemRole`}
                    render={({ field, fieldState }) => (
                      <>
                        <Checkbox
                          data-testid={'systemRole'}
                          colorScheme="PrimaryCheckBox"
                          isChecked={field.value}
                          style={{ background: 'white', border: '#DFDFDF' }}
                          mr="2px"
                          onChange={value => {
                            field.onChange(value)
                          }}
                        ></Checkbox>
                      </>
                    )}
                  />
                </FormControl>
              </Box>
            )}
          </HStack>
          <VStack w="100%" justifyContent={'start'}>
            {isDevtekUser && (
              <HStack justifyContent={'space-between'} width="100%">
                <Text data-testid="access-control" fontSize="18px" fontWeight={500} color="gray.700">
                  {t(`${ACCESS_CONTROL}.accessPermissions`)}
                </Text>
                <FormLabel
                  data-testid="access-control"
                  variant="clickable-label"
                  size="md"
                  onClick={onOpen}
                  textDecor={'underline'}
                  _hover={{ color: 'brand.600', cursor: 'pointer' }}
                >
                  {t(`${ACCESS_CONTROL}.advancedPermissions`)}
                </FormLabel>
              </HStack>
            )}
            <PermissionsTable formControl={formReturn} permissionsData={permissions} />
            <Flex gap="10px" w="100%" justifyContent={'flex-end'}>
              <Button
                variant={'outline'}
                colorScheme="brand"
                onClick={() => {
                  setNewRole?.(false)
                  setSelectedRole?.(null)
                }}
              >
                {t(`cancel`)}
              </Button>
              {allowEdit && (
                <Button colorScheme="brand" type="submit" data-testid="saveBtn">
                  {t(`save`)}
                </Button>
              )}
            </Flex>
          </VStack>
        </VStack>
        <AdvancedPermissions isOpen={isOpen} onClose={onClose} formReturn={formReturn} />
      </form>
    </Box>
  )
}

const PermissionsTable = ({ formControl, permissionsData }) => {
  const { t } = useTranslation()
  const { control, setValue } = formControl
  const [selectedRow, setSelectedRow] = useState<number | null>()

  const { fields: permissions } = useFieldArray({
    control,
    name: 'permissions',
  })

  const watchPermissions = useWatch({ control, name: 'permissions' })
  const isHideAll = watchPermissions
    ? (Object?.values(watchPermissions)?.every((item: any) => item?.hide) as boolean)
    : false
  const isReadAll = watchPermissions
    ? (Object?.values(watchPermissions)?.every((item: any) => item?.read) as boolean)
    : false
  const isEditAll = watchPermissions
    ? (Object?.values(watchPermissions)?.every((item: any) => item?.edit) as boolean)
    : false

  useEffect(() => {
    const watchProjectPermissions = watchPermissions?.find(p => p.name === 'PROJECT')
    if (!permissionsData?.[0]?.systemRole) {
      if (watchProjectPermissions?.edit) {
        setDefaultPermission({ setValue, value: true })
      } else {
        setDefaultPermission({ setValue, value: null })
      }
    }
  }, [watchPermissions])

  return (
    <TableContainer w="100%" borderRadius={'6px'} border="1px solid #CBD5E0">
      <Table variant="striped-list" size="sm">
        <Thead position="sticky" top={0}>
          <Tr h={'45px'} bg="#F2F3F4">
            <Td borderRight="1px solid #CBD5E0">{t(`${ACCESS_CONTROL}.sections`)}</Td>
            <Td borderRight="1px solid #CBD5E0" textAlign={'center'}>
              <Checkbox
                data-testid={'check-hide'}
                colorScheme="PrimaryCheckBox"
                style={{ background: 'white', border: '#DFDFDF' }}
                mr="5px"
                isChecked={isHideAll}
                onChange={value => {
                  for (const key in watchPermissions) {
                    setValue(`permissions.${key}.hide`, value.currentTarget.checked)
                    if (value.currentTarget.checked) {
                      setValue(`permissions.${key}.edit`, !value.currentTarget.checked)
                      setValue(`permissions.${key}.read`, !value.currentTarget.checked)
                    }
                  }
                }}
              ></Checkbox>
              {t(`${ACCESS_CONTROL}.hide`)}
            </Td>
            <Td borderRight="1px solid #CBD5E0" textAlign={'center'}>
              <Checkbox
                data-testid={'check-read'}
                colorScheme="PrimaryCheckBox"
                style={{ background: 'white', border: '#DFDFDF' }}
                mr="5px"
                isChecked={isReadAll}
                onChange={value => {
                  for (const key in watchPermissions) {
                    setValue(`permissions.${key}.read`, value.currentTarget.checked)
                    if (value.currentTarget.checked) {
                      setValue(`permissions.${key}.edit`, !value.currentTarget.checked)
                      setValue(`permissions.${key}.hide`, !value.currentTarget.checked)
                    }
                  }
                }}
              ></Checkbox>
              {t(`${ACCESS_CONTROL}.read`)}
            </Td>
            <Td textAlign={'center'}>
              <Checkbox
                data-testid={'check-hide'}
                colorScheme="PrimaryCheckBox"
                style={{ background: 'white', border: '#DFDFDF' }}
                mr="5px"
                isChecked={isEditAll}
                onChange={value => {
                  for (const key in watchPermissions) {
                    setValue(`permissions.${key}.edit`, value.currentTarget.checked)
                    if (value.currentTarget.checked) {
                      setValue(`permissions.${key}.hide`, !value.currentTarget.checked)
                      setValue(`permissions.${key}.read`, !value.currentTarget.checked)
                    }
                  }
                }}
              ></Checkbox>
              {t(`${ACCESS_CONTROL}.edit`)}
            </Td>
          </Tr>
        </Thead>
        <Tbody>
          {permissions?.map((permission, index) => {
            return (
              <>
                <Tr
                  minH="45px"
                  onClick={() => {
                    if (index === selectedRow) {
                      setSelectedRow(null)
                    } else {
                      setSelectedRow(index)
                    }
                  }}
                  _hover={{ background: '#F3F8FF !important', cursor: 'pointer' }}
                  {...(selectedRow === index && { bg: '#F3F8FF !important' })}
                >
                  <Td w="50%" lineHeight="28px" borderRight="1px solid #CBD5E0">
                    {watchPermissions?.[index].name}
                  </Td>
                  <Td textAlign={'center'} borderRight="1px solid #CBD5E0">
                    <Controller
                      control={control}
                      name={`permissions.${index}.hide`}
                      render={({ field, fieldState }) => (
                        <>
                          <Checkbox
                            data-testid={watchPermissions?.[index].name + '.hide'}
                            colorScheme="PrimaryCheckBox"
                            isChecked={field.value}
                            style={{ background: 'white', border: '#DFDFDF' }}
                            mr="2px"
                            onChange={value => {
                              field.onChange(value)
                              setValue(`permissions.${index}.edit`, false)
                              setValue(`permissions.${index}.read`, false)
                            }}
                            // disabled={watchPermissions?.[index]?.read || watchPermissions?.[index]?.edit}
                          ></Checkbox>
                        </>
                      )}
                    />
                  </Td>
                  <Td textAlign={'center'} borderRight="1px solid #CBD5E0">
                    <Controller
                      control={control}
                      name={`permissions.${index}.read`}
                      render={({ field, fieldState }) => (
                        <>
                          <Checkbox
                            data-testid={watchPermissions?.[index].name + '.read'}
                            colorScheme="PrimaryCheckBox"
                            isChecked={field.value}
                            style={{ background: 'white', border: '#DFDFDF' }}
                            mr="2px"
                            onChange={value => {
                              field.onChange(value)
                              setValue(`permissions.${index}.hide`, false)
                              setValue(`permissions.${index}.edit`, false)
                            }}
                            // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.edit}
                          ></Checkbox>
                        </>
                      )}
                    />
                  </Td>
                  <Td textAlign={'center'}>
                    <Controller
                      control={control}
                      name={`permissions.${index}.edit`}
                      render={({ field, fieldState }) => (
                        <>
                          <Checkbox
                            data-testid={watchPermissions?.[index].name + '.edit'}
                            colorScheme="PrimaryCheckBox"
                            isChecked={field.value}
                            style={{ background: 'white', border: '#DFDFDF' }}
                            mr="2px"
                            onChange={value => {
                              field.onChange(value)
                              setValue(`permissions.${index}.hide`, false)
                              setValue(`permissions.${index}.read`, false)
                            }}
                            // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                          ></Checkbox>
                        </>
                      )}
                    />
                  </Td>
                </Tr>
              </>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

const AdvancedPermissions = ({ isOpen, onClose, formReturn }) => {
  const { t } = useTranslation()
  const { watch, setValue, control } = formReturn
  const advancedPermissionsWatch = watch('advancedPermissions')

  const isSelectAll = advancedPermissionsWatch
    ? (Object?.values(advancedPermissionsWatch)?.every(item => item) as boolean)
    : false
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size={'5xl'}
    >
      <ModalOverlay />
      <ModalContent rounded="6">
        <ModalHeader
          borderBottom="2px solid #E2E8F0"
          fontWeight={500}
          color="gray.600"
          fontSize="16px"
          fontStyle="normal"
          mb="5"
        >
          {t(`${ACCESS_CONTROL}.advancedPermissions`)}
        </ModalHeader>
        <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />

        <ModalBody>
          <Checkbox
            colorScheme="PrimaryCheckBox"
            style={{ background: 'white', border: '#DFDFDF' }}
            mr="2px"
            mb="20px"
            size="md"
            isChecked={isSelectAll}
            onChange={value => {
              for (const key in advancedPermissionsWatch) {
                setValue(`advancedPermissions.${key}`, value.currentTarget.checked)
              }
            }}
          >
            <Text fontSize="16px" color="gray.600">
              Select All
            </Text>
          </Checkbox>
          <HStack alignItems={'flex-start'}>
            <VStack w="33%" alignItems={'flex-start'}>
              <Text color="gray.500" fontWeight={500}>
                Project Management
              </Text>
              <Controller
                control={control}
                name={`advancedPermissions.hideCreateProject`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px" fontWeight={400}>
                        Hide Project Creation
                      </Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.hidePaidProjects`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px" fontWeight={400}>
                        Hide Paid Projects
                      </Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.woaStartEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px" fontWeight={400}>
                        Can Change WOA Start Date
                      </Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.clientStartEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Client Start Date</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.clientDueEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Client Due Date</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.verifyProjectEnable`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Verify Project</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Text color="gray.500" mt="25px !important" fontWeight={500}>
                Contacts
              </Text>
              <Controller
                control={control}
                name={`advancedPermissions.fpmEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change FPM</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.pcEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Project Coordinator</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.clientEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Client</Text>
                    </Checkbox>
                  </>
                )}
              />
            </VStack>
            <VStack
              maxW="35%"
              pl="40px"
              alignItems={'flex-start'}
              borderLeft="1px solid #E2E8F0"
              borderRight="1px solid #E2E8F0"
            >
              <Text color="gray.500" fontWeight={500}>
                Location
              </Text>
              <Controller
                control={control}
                name={`advancedPermissions.addressEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Address</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.marketEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Market</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.lockBoxEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Lock Box Code</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.gateCodeEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Gate Code</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Text color="gray.500" mt="25px !important" fontWeight={500}>
                Transaction
              </Text>
              <Controller
                control={control}
                name={`advancedPermissions.transStatusEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Status</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.transPaidDateEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Paid Date</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.transPaymentReceivedEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Payment Received</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.transInvoicedDateEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Change Invoiced Date</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.futureDateEnabled`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                        Enable Future Date for Payment Received
                      </Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.overrideDrawRestrictionOnPercentageCompletion`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                        Enable Creating Draw Without Percentage Completion Restrictions
                      </Text>
                    </Checkbox>
                  </>
                )}
              />
            </VStack>
            <VStack pl="20px" alignItems={'flex-start'}>
              <Text color="gray.500" fontWeight={500}>
                Work Order
              </Text>
              <Controller
                control={control}
                name={`advancedPermissions.cancelWorkOrderEnable`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Cancel Work order</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Text color="gray.500" mt="25px !important" fontWeight={500}>
                Vendor
              </Text>
              <Controller
                control={control}
                name={`advancedPermissions.deactivateVendor`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Deactivate Vendor</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.vendorAccountEdit`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Edit Vendor Accounts</Text>
                    </Checkbox>
                  </>
                )}
              />
              <Controller
                control={control}
                name={`advancedPermissions.verifyVendorDocuments`}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      colorScheme="PrimaryCheckBox"
                      isChecked={field.value}
                      style={{ background: 'white', border: '#DFDFDF' }}
                      mr="2px"
                      size="md"
                      onChange={value => {
                        field.onChange(value)
                      }}
                      // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                    >
                      <Text fontSize="14px">Can Verify Documents</Text>
                    </Checkbox>
                  </>
                )}
              />
            </VStack>
          </HStack>
        </ModalBody>
        <Flex flexFlow="row-reverse">
          <ModalFooter>
            <Button colorScheme="brand" data-testid="confirmation-no" mr={3} onClick={onClose}>
              {t(`save`)}
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  )
}
