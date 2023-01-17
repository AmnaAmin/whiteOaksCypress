/*eslint-disable */
import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  HStack,
  VStack,
  Center,
  Icon,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Input,
} from '@chakra-ui/react'
import { MdOutlineCancel } from 'react-icons/md'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { licenseTypes, useVendorNext } from 'api/vendor-details'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { FormInput } from 'components/react-hook-form-fields/input'
import { LicenseFormValues, VendorProfile } from 'types/vendor.types'
import { useTranslation } from 'react-i18next'

import { Button } from 'components/button/button'
import ChooseFileField from 'components/choose-file/choose-file'
import { BiAddToQueue, BiDownload } from 'react-icons/bi'

type LicenseProps = {
  isActive: boolean
}
type licenseFormProps = {
  isActive: boolean
}
export const LicenseCard = React.forwardRef((props: LicenseProps, ref) => {
  return (
    <Box>
      <LicenseForm isActive={props.isActive} />
    </Box>
  )
})
export const LicenseForm = ({ isActive }: licenseFormProps) => {
  const [startDate] = useState(null)
  const { t } = useTranslation()

  const {
    formState: { errors },
    control,
    register,
    setValue,
    watch,
  } = useFormContext<LicenseFormValues>()

  const {
    fields: licenseFields,
    append,
    remove: removeLicense,
  } = useFieldArray({
    control,
    name: 'licenses',
  })

  const formValues = watch()

  const selectedLicenseType = useMemo(() => {
    return formValues?.licenses?.map(value => value.licenseType) ?? []
  }, [formValues])

  const { disableLicenseNext } = useVendorNext({ control })
  const [, setFileBlob] = React.useState<Blob>()
  const readFile = (event: any) => {
    setFileBlob(event.target?.result?.split(',')?.[1])
  }
  const onFileChange = (document: File) => {
    if (!document) return
    const reader = new FileReader()
    reader.addEventListener('load', readFile)
    reader.readAsDataURL(document)
  }
  const downloadDocument = (link, text) => {
    return (
      <a href={link} download style={{ minWidth: '20em', marginTop: '5px', color: '#345EA6' }}>
        <Flex ml={1}>
          <BiDownload fontSize="sm" />
          <Text ml="5px" fontSize="12px" fontStyle="normal" w="170px" isTruncated>
            {text}
          </Text>
        </Flex>
      </a>
    )
  }

  /*const watchChangeFields = licenseFields
    ?.map((e, index) => checkIsLicenseChanged(formValues?.licenses?.[index], vendor?.licenseDocuments[index]))
    .includes(true)

  const resetFields = () => {
    licenseFields?.map((value, index) => {
      return [
        setValue(`licenses.${index}.licenseType`, value?.licenseType),
        setValue(`licenses.${index}.licenseNumber`, value?.licenseNumber),
        setValue(`licenses.${index}.expiryDate`, value?.expiryDate),
        setValue(`licenses.${index}.expirationFile`, null),
      ]
    })
  }*/

  const getSelectOptions = useCallback(
    index => {
      return licenseTypes.filter(selectedLicense => {
        return (
          !selectedLicenseType.includes(selectedLicense.value) ||
          selectedLicense.value === `${formValues?.licenses?.[index]?.licenseType}`
        )
      })
    },
    [selectedLicenseType, formValues],
  )

  return (
    <Box>
      <VStack align="start" h="584px" spacing="15px" overflow="auto">
        <Box width={{ base: '100%', md: 'auto' }}>
          <Button
            ml={{ sm: '0px', md: '45px' }}
            variant="outline"
            colorScheme="darkPrimary"
            data-testid="addLicense"
            onClick={() =>
              append({
                licenseType: '',
                licenseNumber: '',
                expiryDate: startDate,
                expirationFile: null,
              })
            }
            leftIcon={<BiAddToQueue />}
            width={{ base: '100%', md: 'auto' }}
          >
            {t('addLicense')}
          </Button>
        </Box>
        {licenseFields
          .map((license, index) => {
            return (
              <HStack
                flexDir={{ base: 'column', sm: 'row' }}
                key={license?.id}
                mt={{ base: '-40px', md: '40px' }}
                spacing={4}
                data-testid="licenseRows"
                w="100%"
                alignItems={{ base: '', md: 'center' }}
              >
                <Box w="2em" color="#345EA6" fontSize="15px" m={{ base: '4%', md: 0 }}>
                  <Center>
                    <Icon
                      as={MdOutlineCancel}
                      onClick={() => removeLicense(index)}
                      data-testid={`removeLicense-` + index}
                      cursor="pointer"
                      boxSize={5}
                      mt="6px"
                    />
                  </Center>
                </Box>

                <FormSelect
                  disable={!!license.licenseType}
                  bg={license?.expirationFile ? 'gray.50' : 'white'}
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseType?.message}
                  label={t('licenseType')}
                  name={`licenses.${index}.licenseType`}
                  control={control}
                  options={getSelectOptions(index)}
                  rules={{ required: isActive && 'This is required field' }}
                  controlStyle={{
                    maxW: { ...{ sm: '95%', md: '215px' } },
                  }}
                  elementStyle={{
                    bg: 'white',
                    borderLeft: '2px solid #345EA6',
                  }}
                  testId={`licenseType-` + index}
                />
                <FormInput
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseNumber?.message}
                  label={t('licenseNumber')}
                  placeholder=""
                  register={register}
                  controlStyle={{
                    w: { ...{ sm: '100%', md: '215px' } },
                    maxW: { ...{ sm: '95%', md: '215px' } },
                  }}
                  elementStyle={{
                    bg: 'white',
                  }}
                  rules={{ required: isActive && 'This is required field' }}
                  name={`licenses.${index}.licenseNumber`}
                  testId={`licenseNumber-` + index}
                  variant="required-field"
                />
                <Box h="105px">
                  <FormControl
                    isInvalid={!!errors.licenses?.[index]?.expiryDate?.message}
                  >
                    <FormLabel variant="strong-label" size="md" color="#2D3748">
                      {t('expiryDate')}
                    </FormLabel>
                    <Input
                      w={{ base: '100%', md: '215px' }}
                      type="date"
                      variant="required-field"
                      {...register(`licenses.${index}.expiryDate`)}
                      data-testid={`expiryDate-` + index}
                    />
                    <FormErrorMessage  pos="absolute">
                      {errors.licenses && errors.licenses[index]?.expiryDate?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                </Box>

                <VStack alignItems={{ base: '', md: 'center' }}>
                  <FormControl
                    w={{ base: '100%', md: '215px' }}
                    h="92px"
                    isInvalid={!!errors.licenses?.[index]?.expirationFile?.message}
                  >
                    <FormLabel size="md" color="#2D3748">
                      File Upload
                    </FormLabel>
                    <Controller
                      name={`licenses.${index}.expirationFile`}
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <VStack alignItems="baseline">
                            <Box w="100%">
                              <ChooseFileField
                                testId={`expirationFile-` + index}
                                name={field.name}
                                value={field.value?.name ? field.value?.name : t('chooseFile')}
                                isError={!!fieldState.error?.message}
                                onChange={(file: any) => {
                                  onFileChange(file)
                                  field.onChange(file)
                                }}
                                onClear={() => setValue(field.name, null)}
                              ></ChooseFileField>
                              <FormErrorMessage bottom="5px" pos="absolute">
                                {fieldState.error?.message}
                              </FormErrorMessage>
                            </Box>
                          </VStack>
                        )
                      }}
                    />
                  </FormControl>
                </VStack>
              </HStack>
            )
          })
          .sort((curr: any, pre: any) => (curr.date > pre.date ? 1 : -1))}
      </VStack>
    </Box>
  )
}
