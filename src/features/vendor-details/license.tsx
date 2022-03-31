import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Box, Button, HStack, VStack, Center, Divider, Flex } from '@chakra-ui/react'
import { MdAdd } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import 'react-datepicker/dist/react-datepicker.css'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  licenseTypes,
  useSaveVendorDetails,
  parseLicenseValues,
  licenseDefaultFormValues,
  createVendorPayload,
} from 'utils/vendor-details'
import { FormSelect } from '../../components/react-hook-form-fields/select'
import { FormInput } from '../../components/react-hook-form-fields/input'
import { FormDatePicker } from '../../components/react-hook-form-fields/date-picker'
import { FormFileInput } from '../../components/react-hook-form-fields/file-input'
import { LicenseFormValues, VendorProfile } from '../../types/vendor.types'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'

type LicenseProps = {
  setNextTab: () => void
  vendor: VendorProfile
}

export const License = React.forwardRef((props: LicenseProps, ref) => {
  const { t } = useTranslation()
  const [startDate] = useState(new Date())
  const { mutate: saveLicenses } = useSaveVendorDetails()

  const defaultValues: LicenseFormValues = useMemo(() => {
    if (props.vendor) {
      return { licenses: licenseDefaultFormValues(props.vendor) }
    }

    return { licenses: [] }
  }, [props.vendor])

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
  } = useForm<LicenseFormValues>({
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, props.vendor, reset])

  const {
    fields: licenseFields,
    append,
    remove: removeLicense,
  } = useFieldArray({
    control,
    name: 'licenses',
  })
  const licenseValues = getValues()?.licenses

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      // console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

  const onSubmit = useCallback(
    async values => {
      const results = await parseLicenseValues(values)
      const vendorPayload = createVendorPayload({ licenseDocuments: results }, props.vendor)
      saveLicenses(vendorPayload, {
        onSuccess() {
          props.setNextTab()
        },
      })
    },
    [props, saveLicenses],
  )

  return (
    <Box>
      <form className="License Form" id="licenseForm" onSubmit={handleSubmit(onSubmit)}>
        <Button
          ml="13px"
          bg="#4E87F8"
          color="#FFFFFF"
          size="lg"
          _hover={{ bg: 'royalblue' }}
          onClick={() =>
            append({
              licenseType: '',
              licenseNumber: '',
              expiryDate: startDate.toDateString(),
              expirationFile: null,
            })
          }
        >
          <Box pos="relative" right="6px">
            <MdAdd />
          </Box>
          {t('addLicense')}
        </Button>
        <VStack align="start" minH="60vh" spacing="20px" ml="8px">
          {licenseFields.map((license, index) => {
            return (
              <HStack key={index} mt="40px">
                <Box w="2em" color="barColor.100" fontSize="15px">
                  <Center>
                    <MdOutlineCancel onClick={() => removeLicense(index)} />
                  </Center>
                </Box>
                <FormSelect
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseType?.message}
                  label={t('licenseType')}
                  name={`licenses.${index}.licenseType`}
                  control={control}
                  options={licenseTypes}
                  rules={{ required: 'This is required field' }}
                  controlStyle={{ w: '20em' }}
                  elementStyle={{
                    bg: 'white',
                    borderLeft: '1.5px solid #4E87F8',
                  }}
                />
                <FormInput
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseNumber?.message}
                  label={t('licenseNumber')}
                  placeholder="License Number"
                  register={register}
                  controlStyle={{ w: '20em' }}
                  elementStyle={{
                    bg: 'white',
                    borderLeft: '1.5px solid #4E87F8',
                  }}
                  rules={{ required: 'This is required field' }}
                  name={`licenses.${index}.licenseNumber`}
                />
                <FormDatePicker
                  errorMessage={errors.licenses && errors.licenses[index]?.expiryDate?.message}
                  label={t('expiryDate')}
                  name={`licenses.${index}.expiryDate`}
                  control={control}
                  rules={{ required: 'This is required field' }}
                  style={{ w: '20em' }}
                  defaultValue={startDate}
                />
                <VStack>
                  <FormFileInput
                    errorMessage={errors.licenses && errors.licenses[index]?.expirationFile?.message}
                    label={t('fileInput')}
                    name={`licenses.${index}.expirationFile`}
                    register={register}
                    style={{ w: '20em' }}
                    isRequired={true}
                    downloadableFile={licenseValues?.[index].downloadableFile}
                  >
                    <>
                      <Flex
                        justifyContent={'space-between'}
                        // variant="outline"
                        // size="lg"
                        rounded={4}
                        bg="gray.100"
                      >
                        <Button
                          rounded="none"
                          roundedLeft={5}
                          fontSize={16}
                          fontWeight={400}
                          bg="gray.100"
                          h="36px"
                          w={120}
                        >
                          {t('chooseFile')}
                        </Button>
                        <Divider orientation="vertical" />
                      </Flex>
                    </>
                  </FormFileInput>
                </VStack>
              </HStack>
            )
          })}
        </VStack>
        <Box>
          <Divider border="1px solid" />
        </Box>
        <Box id="footer" w="100%" minH="60px">
          <Button
            mt="16px"
            mr="60px"
            float={'right'}
            colorScheme="CustomPrimaryColor"
            size="md"
            type="submit"
            fontSize="14px"
            fontStyle="normal"
            fontWeight={500}
          >
            {t('next')}
          </Button>
        </Box>
      </form>
    </Box>
  )
})
