import React, { useState } from 'react'
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
  } = useFormContext<LicenseFormValues>()

  const {
    fields: licenseFields,
    append,
    remove: removeLicense,
  } = useFieldArray({
    control,
    name: 'licenses',
  })

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
      <Button
        variant="outline"
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
        leftIcon={<BiAddToQueue />}
      >
        {t('addLicense')}
      </Button>
      <VStack align="start" h="470px" spacing="15px" overflow="auto">
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
                rules={{ required: isActive && 'This is required field' }}
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
                <FormControl w="290px" h="92px" isInvalid={!!errors.licenses?.[index]?.expirationFile?.message}>
                  <FormLabel variant="strong-label" size="md">
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
            </HStack>
          )
        })}
      </VStack>
      <Flex
        id="footer"
        w="100%"
        height="72px"
        pt="8px"
        alignItems="center"
        justifyContent="end"
        borderTop="2px solid #E2E8F0"
      >
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        <Button
          disabled={disableLicenseNext}
          type="submit"
          variant="solid"
          colorScheme="brand"
          data-testid="saveLicenses"
        >
          {vendor?.id ? t('save') : t('next')}
        </Button>
      </Flex>
    </Box>
  )
}
