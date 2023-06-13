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
} from '@chakra-ui/react'
import { ACCESS_CONTROL } from 'features/access-control/access-control.i18n'
import { useTranslation } from 'react-i18next'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Select from 'components/form/react-select'
import { useEffect } from 'react'
import {
  ASSIGNMENTS,
  LOCATIONS,
  mapFormValuestoPayload,
  mapPermissionsToFormValues,
  useCreateNewRoleMutation,
  useFetchAllPermissions,
  useUpdateRoleMutation,
} from 'api/access-control'

interface PemissionFormValues {
  roleName: string
  assignment: SelectOption
  location: SelectOption
  permissions: Array<{ name: string; edit: boolean; hide: boolean; read: boolean }>
}

export const RolesPermissions = ({ permissions, setNewRole, setSelectedRole }) => {
  const formReturn = useForm<PemissionFormValues>()
  const {
    formState: { errors },
  } = formReturn
  const { data: allPermissions } = useFetchAllPermissions()
  const { mutate: createRole } = useCreateNewRoleMutation()
  const { mutate: updateRole } = useUpdateRoleMutation(permissions?.[0]?.name)
  const { control, register, reset } = formReturn
  const { t } = useTranslation()
  useEffect(() => {
    reset(permissionsDefaultValues({ permissions }))
  }, [reset, permissions])

  const permissionsDefaultValues = ({ permissions }) => {
    const permission = permissions?.[0]
    return {
      roleName: permission?.name ?? '',
      location: LOCATIONS?.find(l => l.value === permission?.location),
      assignment: ASSIGNMENTS?.find(a => a.value === permission?.assignment),
      permissions: mapPermissionsToFormValues(permission?.permissions),
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
                        <Select options={ASSIGNMENTS} selectProps={{ isBorderLeft: true }} {...field} />
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
                        <Select options={LOCATIONS} selectProps={{ isBorderLeft: true }} {...field} />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </div>
                    </>
                  )}
                />
              </FormControl>
            </Box>
          </HStack>
          <VStack w="100%" gap="10px" justifyContent={'start'}>
            <Text w="100%" data-testid="access-control" fontSize="18px" fontWeight={500} color="gray.700">
              {t(`${ACCESS_CONTROL}.accessPermissions`)}
            </Text>
            <PermissionsTable formControl={formReturn} />
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
              <Button colorScheme="brand" type="submit">
                {t(`save`)}
              </Button>
            </Flex>
          </VStack>
        </VStack>
      </form>
    </Box>
  )
}

const PermissionsTable = ({ formControl }) => {
  const { t } = useTranslation()
  const { control, watch, setValue } = formControl

  const { fields: permissions } = useFieldArray({
    control,
    name: 'permissions',
  })

  const watchPermissions = watch('permissions')

  return (
    <TableContainer w="100%" borderRadius={'6px'} border="1px solid #CBD5E0">
      <Table variant="striped-list" size="sm">
        <Thead position="sticky" top={0}>
          <Tr h={'45px'} bg="#F2F3F4">
            <Td borderRight="1px solid #CBD5E0">{t(`${ACCESS_CONTROL}.sections`)}</Td>
            <Td borderRight="1px solid #CBD5E0" textAlign={'center'}>
              {t(`${ACCESS_CONTROL}.hide`)}
            </Td>
            <Td borderRight="1px solid #CBD5E0" textAlign={'center'}>
              {t(`${ACCESS_CONTROL}.read`)}
            </Td>
            <Td textAlign={'center'}>{t(`${ACCESS_CONTROL}.edit`)}</Td>
          </Tr>
        </Thead>
        <Tbody>
          {permissions?.map((permission, index) => {
            return (
              <>
                <Tr minH="45px">
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
                            colorScheme="PrimaryCheckBox"
                            isChecked={field.value}
                            style={{ background: 'white', border: '#DFDFDF' }}
                            data-dis={{ background: 'red !important' }}
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
