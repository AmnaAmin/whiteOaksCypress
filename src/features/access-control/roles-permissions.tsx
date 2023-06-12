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
import { ASSIGNMENTS, LOCATIONS, SECTIONS } from 'api/access-control'

interface PemissionFormValues {
  roleName: string
  assignment: SelectOption
  location: SelectOption
  permissions: Array<{ name: string; edit: boolean; hide: boolean; read: boolean }>
}

export const RolesPermissions = ({ permissions }) => {
  const formReturn = useForm<PemissionFormValues>()
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

  const mapPermissionsToFormValues = permissionsArray => {
    const permissions = permissionsArray?.map(p => {
      const permissionKey = p.key
      const splitPermission = permissionKey.split('.')
      return { section: splitPermission?.[0], action: splitPermission?.[splitPermission?.length - 1] }
    })

    const sectionWisePermissions = [] as any
    SECTIONS?.forEach(s => {
      const permissionObj = permissions?.find(p => s.value === p.section)
      sectionWisePermissions?.push({
        name: s.value,
        edit: permissionObj?.action === 'EDIT',
        read: permissionObj?.action === 'READ',
        hide: !permissionObj,
      })
    })
    return sectionWisePermissions
  }

  const onSubmit = values => {}
  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }
  return (
    <Box w="100%">
      <form onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <VStack justifyContent={'start'} gap="20px">
          <HStack w="100%" gap="10px">
            <Box w="215px">
              <FormControl>
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
              </FormControl>
            </Box>
            <Box w="215px">
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t(`${ACCESS_CONTROL}.assignment`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="assignment"
                  rules={{ required: true }}
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
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t(`${ACCESS_CONTROL}.location`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="location"
                  rules={{ required: true }}
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
              <Button variant={'outline'} colorScheme="brand" onClick={() => {}}>
                {t(`cancel`)}
              </Button>
              <Button colorScheme="brand" onClick={() => {}}>
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
  const { control, watch, getValues } = formControl

  const { fields: permissions } = useFieldArray({
    control,
    name: 'permissions',
  })

  const watchPermissions = watch('permissions')
  console.log(getValues())

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
                      rules={{ required: 'This is a required field' }}
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
                      rules={{ required: 'This is a required field' }}
                      render={({ field, fieldState }) => (
                        <>
                          <Checkbox
                            colorScheme="PrimaryCheckBox"
                            isChecked={field.value}
                            style={{ background: 'white', border: '#DFDFDF' }}
                            mr="2px"
                            onChange={value => {
                              field.onChange(value)
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
                      rules={{ required: 'This is a required field' }}
                      render={({ field, fieldState }) => (
                        <>
                          <Checkbox
                            colorScheme="PrimaryCheckBox"
                            isChecked={field.value}
                            style={{ background: 'white', border: '#DFDFDF' }}
                            mr="2px"
                            onChange={value => {
                              field.onChange(value)
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
