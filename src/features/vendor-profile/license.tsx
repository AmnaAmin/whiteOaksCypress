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
} from '@chakra-ui/react'
import { MdOutlineCancel } from 'react-icons/md'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { licenseTypes, useVendorNext } from 'api/vendor-details'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { FormInput } from 'components/react-hook-form-fields/input'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { LicenseFormValues, VendorProfile } from 'types/vendor.types'
import { useTranslation } from 'react-i18next'

import { Button } from 'components/button/button'
import ChooseFileField from 'components/choose-file/choose-file'
import { BiAddToQueue, BiDownload } from 'react-icons/bi'
import { checkIsLicenseChanged } from './hook'
import { SaveChangedFieldAlert } from './save-change-field'
import { VENDORPROFILE } from './vendor-profile.i18n'
type LicenseProps = {
  vendor: VendorProfile
  onClose?: () => void
  isActive: boolean
}
type licenseFormProps = {
  vendor: VendorProfile
  onClose?: () => void
  isActive: boolean
}
export const License = React.forwardRef((props: LicenseProps, ref) => {
  return (
    <Box>
      <LicenseForm isActive={props.isActive} vendor={props.vendor} onClose={props.onClose} />
    </Box>
  )
})
export const LicenseForm = ({ vendor, isActive, onClose }: licenseFormProps) => {
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

  const watchChangeFields = licenseFields
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
  }

  const getSelectOptions = useCallback(
    index => {
      return licenseTypes.filter(sl => {
        return !selectedLicenseType.includes(sl.value) || sl.value === `${formValues?.licenses?.[index]?.licenseType}`
      })
    },
    [selectedLicenseType, formValues],
  )

  return (
    <Box>
      <VStack align="start" h="584px" spacing="15px" overflow="auto">
        <Button
          ml={'45px'}
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
        >
          {t('addLicense')}
        </Button>
        {licenseFields
          .map((license, index) => {
            const isLicenseChanged = checkIsLicenseChanged(
              formValues?.licenses?.[index],
              vendor?.licenseDocuments[index],
            )

            return (
              <HStack key={license?.id} mt="40px" spacing={4} data-testid="licenseRows" w="100%">
                <Box w="2em" color="#345EA6" fontSize="15px">
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
                  // options={licenseTypes}
                  options={getSelectOptions(index)}
                  rules={{ required: isActive && 'This is required field' }}
                  controlStyle={{ maxW: '215px' }}
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
                  controlStyle={{ maxW: '215px' }}
                  elementStyle={{
                    bg: 'white',
                  }}
                  rules={{ required: isActive && 'This is required field' }}
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
                  rules={{ required: isActive && 'This is required field' }}
                  style={{ maxW: '215px', h: '92px' }}
                  defaultValue={startDate}
                  testId={`expiryDate-` + index}
                />
                <VStack>
                  <FormControl w="215px" h="92px" isInvalid={!!errors.licenses?.[index]?.expirationFile?.message}>
                    <FormLabel variant="strong-label" size="md" color="#2D3748">
                      File Upload
                    </FormLabel>
                    <Controller
                      name={`licenses.${index}.expirationFile`}
                      control={control}
                      rules={
                        vendor?.licenseDocuments[index]?.s3Url ? {} : { required: isActive && 'This is required field' }
                      }
                      render={({ field, fieldState }) => {
                        return (
                          <VStack alignItems="baseline">
                            <Box>
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
                            {vendor?.licenseDocuments[index] && (
                              <Box overflow="hidden" pos="absolute" top={16}>
                                {downloadDocument(
                                  vendor?.licenseDocuments[index]?.s3Url,
                                  vendor?.licenseDocuments[index]?.fileType ?? 'doc.png',
                                )}
                              </Box>
                            )}
                          </VStack>
                        )
                      }}
                    />
                  </FormControl>
                </VStack>
                {isLicenseChanged ? (
                  <>
                    <SaveChangedFieldAlert />
                  </>
                ) : null}
              </HStack>
            )
          })
          .sort((curr: any, pre: any) => (curr.date > pre.date ? 1 : -1))}
      </VStack>
      <Flex
        id="footer"
        w="100%"
        height="72px"
        mt={2}
        pt="8px"
        alignItems="center"
        justifyContent="end"
        borderTop="2px solid #CBD5E0"
      >
        {watchChangeFields && (
          <Button variant="outline" colorScheme="darkPrimary" onClick={() => resetFields()} mr="3">
            {t(`${VENDORPROFILE}.discardChanges`)}
          </Button>
        )}

        {onClose && (
          <Button variant="outline" colorScheme="darkPrimary" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        <Button
          disabled={disableLicenseNext}
          type="submit"
          variant="solid"
          colorScheme="darkPrimary"
          data-testid="saveLicenses"
        >
          {vendor?.id ? t('save') : t('next')}
        </Button>
      </Flex>
    </Box>
  )
}
