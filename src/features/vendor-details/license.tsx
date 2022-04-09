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
import { FormSelect } from 'components/react-hook-form-fields/select'
import { FormInput } from 'components/react-hook-form-fields/input'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { LicenseFormValues, VendorProfile } from 'types/vendor.types'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'

type LicenseProps = {
  setNextTab: () => void
  vendor: VendorProfile
}

export const License = React.forwardRef((props: LicenseProps, ref) => {
  const { mutate: saveLicenses } = useSaveVendorDetails()

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
      <LicenseForm vendor={props.vendor} onSubmit={onSubmit} />
    </Box>
  )
})

export const LicenseForm = ({ vendor, onSubmit }) => {
  const [startDate] = useState(new Date())
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
    getValues,
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
  const licenseValues = getValues()?.licenses

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      // console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])
  return (
    <Box>
      <form className="License Form" id="licenseForm" data-testid="licenseForm" onSubmit={handleSubmit(onSubmit)}>
        <Button
          variant="outline"
          ml="13px"
          color="#4E87F8"
          fontSize="14px"
          fontWeight={500}
          size="lg"
          _hover={{ bg: 'gray.200' }}
          data-testid="addLicense"
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
        <VStack align="start" minH="60vh" spacing="15px" ml="8px">
          {licenseFields.map((license, index) => {
            return (
              <HStack key={index} mt="40px" spacing={4} data-testid="licenseRows">
                <Box w="2em" color="barColor.100" fontSize="15px">
                  <Center>
                    <MdOutlineCancel onClick={() => removeLicense(index)} data-testid={`removeLicense-` + index} />
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
                    borderLeft: '2px solid #4E87F8',
                  }}
                  testId={`licenseType-` + index}
                />
                <FormInput
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseNumber?.message}
                  label={t('licenseNumber')}
                  placeholder="License Number"
                  register={register}
                  controlStyle={{ w: '20em' }}
                  elementStyle={{
                    bg: 'white',
                  }}
                  rules={{ required: 'This is required field' }}
                  name={`licenses.${index}.licenseNumber`}
                  testId={`licenseNumber-` + index}
                />
                <FormDatePicker
                  errorMessage={errors.licenses && errors.licenses[index]?.expiryDate?.message}
                  label={t('expiryDate')}
                  name={`licenses.${index}.expiryDate`}
                  control={control}
                  rules={{ required: 'This is required field' }}
                  style={{ w: '20em' }}
                  defaultValue={startDate}
                  testId={`expiryDate-` + index}
                />
                <VStack>
                  <FormFileInput
                    errorMessage={errors.licenses && errors.licenses[index]?.expirationFile?.message}
                    // label={t('fileInput')}
                    name={`licenses.${index}.expirationFile`}
                    register={register}
                    style={{ w: '20em', mt: '25px' }}
                    isRequired={true}
                    downloadableFile={licenseValues?.[index].downloadableFile}
                    testId={`expirationFile-` + index}
                  >
                    <>
                      <Flex
                        justifyContent={'space-between'}
                        // variant="outline"
                        // size="lg"
                        rounded={4}
                        bg="gray.100"
                        h="36px"
                        w={120}
                      >
                        <Button
                          rounded="none"
                          roundedLeft={5}
                          fontSize="14px"
                          fontWeight={500}
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
            _focus={{ outline: 'none' }}
            _hover={{ bg: 'blue', fontWeight: '600' }}
            size="md"
            type="submit"
            fontSize="14px"
            fontStyle="normal"
            fontWeight={500}
            data-testid="saveLicenses"
          >
            {t('next')}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
