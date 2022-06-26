import React, { useState, useCallback, useEffect, useMemo } from 'react'
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
} from '@chakra-ui/react'
import { MdAdd } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  licenseTypes,
  useSaveVendorDetails,
  parseLicenseValues,
  licenseDefaultFormValues,
  createVendorPayload,
} from 'utils/vendor-details'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { FormInput } from 'components/react-hook-form-fields/input'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { LicenseFormValues, VendorProfile } from 'types/vendor.types'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { Button } from 'components/button/button'
import ChooseFileField from 'components/choose-file/choose-file'
import { BiDownload } from 'react-icons/bi'
type LicenseProps = {
  setNextTab: () => void
  vendor: VendorProfile
  onClose?: () => void
}
type licenseFormProps = {
  vendor: VendorProfile
  onSubmit: (values: any) => void
  onClose?: () => void
}
export const License = React.forwardRef((props: LicenseProps, ref) => {
  const { vendor = {}, setNextTab } = props

  const { mutate: saveLicenses } = useSaveVendorDetails('License')

  const onSubmit = useCallback(
    async values => {
      console.log('submit the file......')
      const results = await parseLicenseValues(values)
      const vendorPayload = createVendorPayload({ licenseDocuments: results }, vendor)
      saveLicenses(vendorPayload, {
        onSuccess() {
          setNextTab()
        },
      })
    },
    [vendor, setNextTab, saveLicenses],
  )
  return (
    <Box>
      <LicenseForm vendor={props.vendor} onSubmit={onSubmit} onClose={props.onClose} />
    </Box>
  )
})
export const LicenseForm = ({ vendor, onSubmit, onClose }: licenseFormProps) => {
  const [startDate] = useState()
  const { t } = useTranslation()
  const defaultValues: LicenseFormValues = useMemo(() => {
    if (vendor) {
      return { licenses: licenseDefaultFormValues(vendor) }
    }
    return { licenses: [] }
  }, [vendor])
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
  } = useForm<LicenseFormValues>({
    defaultValues,
  })
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, vendor, reset])
  const {
    fields: licenseFields,
    append,
    remove: removeLicense,
  } = useFieldArray({
    control,
    name: 'licenses',
  })
  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {})
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])
  const [
    ,
    // fileBlob
    setFileBlob,
  ] = React.useState<Blob>()
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
      <a href={link} download style={{ minWidth: '20em', marginTop: '5px', color: '#4E87F8' }}>
        <Flex ml={1}>
          <BiDownload fontSize="sm" />
          <Text ml="5px" fontSize="12px" fontStyle="normal" w="170px" isTruncated>
            {text}
          </Text>
        </Flex>
      </a>
    )
  }
  return (
    <Box>
      <form className="License Form" id="licenseForm" data-testid="licenseForm" onSubmit={handleSubmit(onSubmit)}>
        <Button
          variant="outline"
          ml="13px"
          colorScheme="brand"
          data-testid="addLicense"
          onClick={() =>
            append({
              licenseType: '',
              licenseNumber: '',
              expiryDate: startDate,
              expirationFile: null,
            })
          }
        >
          <Box pos="relative" right="6px">
            <MdAdd />
          </Box>
          {t('addLicense')}
        </Button>
        <VStack align="start" h="470px" spacing="15px" ml="8px" overflow="auto">
          {licenseFields.map((license, index) => {
            return (
              <HStack key={index} mt="40px" spacing={4} data-testid="licenseRows" w="100%">
                <Box w="2em" color="barColor.100" fontSize="15px">
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
                  disable={license?.expirationFile ? 'none' : ''}
                  bg={license?.expirationFile ? 'gray.50' : 'white'}
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseType?.message}
                  label={t('licenseType')}
                  name={`licenses.${index}.licenseType`}
                  control={control}
                  options={licenseTypes}
                  rules={{ required: 'This is required field' }}
                  controlStyle={{ maxW: '215px' }}
                  elementStyle={{
                    bg: 'white',
                    borderLeft: '2px solid #4E87F8',
                  }}
                  testId={`licenseType-` + index}
                />
                <FormInput
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseNumber?.message}
                  label={t('licenseNumber')}
                  placeholder="License Number"
                  register={register}
                  controlStyle={{ maxW: '215px' }}
                  elementStyle={{
                    bg: 'white',
                  }}
                  rules={{ required: 'This is required field' }}
                  name={`licenses.${index}.licenseNumber`}
                  testId={`licenseNumber-` + index}
                  variant="required-field"
                />
                <FormDatePicker
                  isRequired={true}
                  placeholder="mm/dd/yy"
                  errorMessage={errors.licenses && errors.licenses[index]?.expiryDate?.message}
                  label={t('expiryDate')}
                  name={`licenses.${index}.expiryDate`}
                  control={control}
                  rules={{ required: 'This is required field' }}
                  style={{ maxW: '215px', h: '92px' }}
                  defaultValue={startDate}
                  testId={`expiryDate-` + index}
                />
                <VStack>
                  <FormControl w="290px" h="92px" isInvalid={!!errors.licenses?.[index]?.expirationFile?.message}>
                    <FormLabel variant="strong-label" size="md">
                      File Upload
                    </FormLabel>
                    <Controller
                      name={`licenses.${index}.expirationFile`}
                      control={control}
                      rules={{ required: 'This is required field' }}
                      render={({ field, fieldState }) => {
                        return (
                          <VStack alignItems="baseline">
                            <Box>
                              <ChooseFileField
                                testId={`expirationFile-` + index}
                                name={field.name}
                                value={field.value?.name ? field.value?.name : 'Choose File'}
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
                            {vendor?.licenseDocuments[index] && (
                              <Box overflow="hidden" pos="absolute" top={16}>
                                {downloadDocument(
                                  vendor?.licenseDocuments[index]?.s3Url,
                                  field.value ? field.value?.name : 'doc.png',
                                )}
                              </Box>
                            )}
                          </VStack>
                        )
                      }}
                    />
                  </FormControl>
                </VStack>
              </HStack>
            )
          })}
        </VStack>
        <Flex id="footer" w="100%" pt="12px" alignItems="center" justifyContent="end" borderTop="2px solid #E2E8F0">
          {onClose && (
            <Button variant="outline" colorScheme="brand" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="solid" colorScheme="brand" data-testid="saveLicenses">
            {t('save')}
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
