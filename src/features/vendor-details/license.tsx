import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Box, HStack, VStack, Center, Icon, Flex } from '@chakra-ui/react'
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
import { Button } from 'components/button/button'

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

  const { mutate: saveLicenses } = useSaveVendorDetails()

  const onSubmit = useCallback(
    async values => {
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
  const [startDate] = useState(null)
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
    const subscription = watch(value => {})
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])
  return (
    <Box>
      <form className="License Form" id="licenseForm" data-testid="licenseForm" onSubmit={handleSubmit(onSubmit)}>
        <Button
          _hover={{ bg: '#EBF8FF' }}
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
                  errorMessage={errors.licenses && errors.licenses[index]?.licenseType?.message}
                  label={t('licenseType')}
                  name={`licenses.${index}.licenseType`}
                  control={control}
                  options={licenseTypes}
                  rules={{ required: 'This is required field' }}
                  controlStyle={{ W: '215px' }}
                  elementStyle={{
                    bg: 'white',
                    borderLeft: '2px solid #4E87F8',
                    w: '215px',
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
                    w: '215px',
                  }}
                  rules={{ required: 'This is required field' }}
                  name={`licenses.${index}.licenseNumber`}
                  testId={`licenseNumber-` + index}
                  variant="reguired-field"
                />

                <FormDatePicker
                  errorMessage={errors.licenses && errors.licenses[index]?.expiryDate?.message}
                  label={t('expiryDate')}
                  name={`licenses.${index}.expiryDate`}
                  control={control}
                  rules={{ required: 'This is required field' }}
                  style={{ w: '215px' }}
                  elementStyle={{
                    bg: 'white',
                    w: '215px',
                  }}
                  defaultValue={startDate}
                  isRequired={true}
                  placeholder="mm/dd/yy"
                  testId={`expiryDate-` + index}
                />
                <VStack>
                  <Box h="100px">
                    <FormFileInput
                      errorMessage={errors.licenses && errors.licenses[index]?.expirationFile?.message}
                      // label={t('fileInput')}
                      name={`licenses.${index}.expirationFile`}
                      register={register}
                      style={{ minW: '20em', mt: '25px' }}
                      isRequired={true}
                      downloadableFile={licenseValues?.[index].downloadableFile}
                      testId={`expirationFile-` + index}
                    >
                      {t('chooseFile')}
                    </FormFileInput>
                  </Box>
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
