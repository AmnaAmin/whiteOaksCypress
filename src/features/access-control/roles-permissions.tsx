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
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
  useGetSections,
  useUpdateRoleMutation,
} from 'api/access-control'
import { useAccountData } from 'api/user-account'
import { Card } from 'components/card/card'
import { TabCustom } from 'features/work-order/work-order-edit'
import { EstimateRolePermissions } from './estimates-roles-permission'
import { ConstructionRolePermissions } from './construction-roles-permissions'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

interface PemissionFormValues {
  roleName: string
  assignment: SelectOption
  location: SelectOption
  systemRole: boolean
  permissions: Array<{ name: string; edit: boolean; hide: boolean; read: boolean }>
}

export const RolesPermissions = ({ permissions, setNewRole, setSelectedRole, allowEdit }) => {
  const formReturn = useForm<PemissionFormValues>()
  const { isAdmin } = useUserRolesSelector()
  const {
    formState: { errors },
    setValue,
  } = formReturn
  const { data: allPermissions } = useFetchAllPermissions()
  const { mutate: createRole } = useCreateNewRoleMutation()
  const { mutate: updateRole } = useUpdateRoleMutation(permissions?.[0]?.name)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control, register, reset, watch } = formReturn
  const { data } = useAccountData()
  const isDevtekUser = data?.devAccount
  const sections = useGetSections({ isDevtekUser })
  const { t } = useTranslation()
  useEffect(() => {
    reset(permissionsDefaultValues({ permissions, sections }))
  }, [reset, permissions, sections?.length])

  const watchPermissions = watch('permissions')

  const checkDefaultPermissions = assignment => {
    const defaultSections = ['PROJECT', 'VENDOR', 'ESTIMATE']
    let sectionPermission = [] as any
    defaultSections.forEach(section => {
      const permission = watchPermissions?.find(p => p?.name === section)
      sectionPermission.push({ name: section, isEdit: permission?.edit })
    })

    if (!permissions?.[0]?.systemRole) {
      setDefaultPermission({
        setValue,
        sectionPermission,
        assignment,
      })
    }
  }

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
      payload['userTypeId'] = permissions?.[0]?.userTypeId
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
                  onKeyDown={e => {
                    if (e.code === 'Space') {
                      e.stopPropagation()
                      e.preventDefault()
                    }
                  }}
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
                         classNamePrefix={'assignmentDropDown'}
                          //isDisabled={!!permissions}
                          options={ASSIGNMENTS}
                          selectProps={{ isBorderLeft: true }}
                          {...field}
                          onChange={option => {
                            field.onChange(option)
                            checkDefaultPermissions(option.value)
                          }}
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
                         classNamePrefix={'locationDropdown'}
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
            {/*isDevtekUser && (
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
            )*/}
          </HStack>
          <VStack w="100%" justifyContent={'start'}>
            {isAdmin && (
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
            <PermissionsTable formControl={formReturn} checkDefaultPermissions={checkDefaultPermissions} />
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

const PermissionsTable = ({ formControl, checkDefaultPermissions }) => {
  const { t } = useTranslation()
  const { control, setValue } = formControl
  const [selectedRow, setSelectedRow] = useState<number | null>()
  const { fields: permissions } = useFieldArray({
    control,
    name: 'permissions',
  })

  const watchPermissions = useWatch({ control, name: 'permissions' })
  const watchAssignment = useWatch({ control, name: 'assignment' })

  const isHideAll = watchPermissions
    ? (Object?.values(watchPermissions)?.every((item: any) => item?.hide) as boolean)
    : false
  const isReadAll = watchPermissions
    ? (Object?.values(watchPermissions)?.every((item: any) => item?.read) as boolean)
    : false
  const isEditAll = watchPermissions
    ? (Object?.values(watchPermissions)?.every((item: any) => item?.edit) as boolean)
    : false

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
                  checkDefaultPermissions(watchAssignment?.value)
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
                  checkDefaultPermissions(watchAssignment?.value)
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
                  checkDefaultPermissions(watchAssignment?.value)
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
                  key={index}
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
                    {watchPermissions?.[index].label}
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
                              checkDefaultPermissions(watchAssignment?.value)
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
                              checkDefaultPermissions(watchAssignment?.value)
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
                              checkDefaultPermissions(watchAssignment?.value)
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
  const [tabIndex, setTabIndex] = useState(0)

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
      <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8" backgroundColor="#fff">
        <ModalHeader
          h="63px"
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

        <ModalBody justifyContent="center" backgroundColor="#fff">
          <Tabs
            size="md"
            variant="enclosed"
            index={tabIndex}
            onChange={index => setTabIndex(index)}
            colorScheme="brand"
          >
            <TabList borderBottom="none">
              <TabCustom>{t('Construction')}</TabCustom>
              <TabCustom>{t('Estimates')}</TabCustom>
            </TabList>
            <Card borderTopLeftRadius="0px !important" borderTopRightRadius="6px">
              <TabPanels mt="10px">
                <TabPanel pt="0px" pl="3px" pb="0px" h="550px" mb="20px" overflowY={'auto'}>
                  <ConstructionRolePermissions formReturn={formReturn} />
                </TabPanel>
                <TabPanel pt="0px" pl="3px" pb="0px" h="550px" mb="20px" overflowY={'auto'}>
                  <EstimateRolePermissions formReturn={formReturn} />
                </TabPanel>
              </TabPanels>
            </Card>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="brand" data-testid="confirmation-no" mr={3} onClick={onClose}>
            {t(`done`)}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
