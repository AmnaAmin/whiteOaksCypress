import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { BiDownload } from 'react-icons/bi'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useFormContext } from 'react-hook-form'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { DocumentsCardFormValues, VendorProfile } from 'types/vendor.types'
import { t } from 'i18next'
import ChooseFileField from 'components/choose-file/choose-file'
import { useWatchDocumentFeild } from './hook'
import { SaveChangedFieldAlert } from './save-change-field'
import { VENDORPROFILE } from './vendor-profile.i18n'
import { dateFormat } from 'utils/date-time-utils'

type DocumentsProps = {
  vendor: VendorProfile
  onClose?: () => void
  VendorType: string
  isActive: boolean
}
type DocumentFormProps = {
  vendor: VendorProfile
  onClose?: () => void
  isActive: boolean
}
export const DocumentsCard = React.forwardRef((props: DocumentsProps, ref) => {
  return (
    <Box w="100%">
      <DocumentsForm isActive={props.isActive} vendor={props.vendor} onClose={props.onClose}></DocumentsForm>
    </Box>
  )
})
export const DocumentsForm = ({ vendor, onClose, isActive }: DocumentFormProps) => {
  const [changedDateFields, setChangeDateFields] = useState<string[]>([])

  const {
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext<DocumentsCardFormValues>()
  const documents = getValues()

  useEffect(() => {
    if (!vendor) {
      setChangeDateFields([])
    }
  }, [vendor])

  const {
    isW9DocumentDateChanged,
    watchW9DocumentFile,
    isAgreementSignedDateChanged,
    watchAgreementFile,
    isAutoInsuranceExpDateChanged,
    watchInsuranceFile,
    isCoiGlExpDateChanged,
    watchCoiGlExpFile,
    isCoiWcExpDateChanged,
    watchCoiWcExpFile,
    isAllFiledWatch,
  } = useWatchDocumentFeild(control, vendor)

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
  const downloadDocument = (link, text, testid?) => {
    return (
      <a href={link} data-testid={testid} download style={{ minWidth: '20em', marginTop: '5px', color: '#4E87F8' }}>
        <Flex ml={1}>
          <BiDownload fontSize="sm" />
          <Text ml="5px" fontSize="12px" fontStyle="normal" w="170px" isTruncated>
            {text}
          </Text>
        </Flex>
      </a>
    )
  }

  const resetFields = () => {
    setValue('w9DocumentDate', dateFormat(vendor?.w9DocumentDate!))
    setValue('w9Document', null)
    setValue('agreementSignedDate', dateFormat(vendor?.agreementSignedDate!))
    setValue('agreement', null)
    setValue('autoInsuranceExpDate', dateFormat(vendor?.autoInsuranceExpirationDate!))
    setValue('insurance', null)
    setValue('coiGlExpDate', dateFormat(vendor?.coiglExpirationDate!))
    setValue('coiGlExpFile', null)
    setValue('coiWcExpDate', dateFormat(vendor?.coiWcExpirationDate!))
    setValue('coiWcExpFile', null)
  }

  return (
    <>
      <Box h="502px" overflow="auto">
        <HStack spacing="16px" alignItems="flex-start">
          <Flex w="215px">
            <Box>
              <FormLabel variant="strong-label" size="md">
                {t('W9DocumentDate')}
              </FormLabel>
              <FormDatePicker
                disabled={true}
                errorMessage={errors.w9DocumentDate && errors.w9DocumentDate?.message}
                label={''}
                name={`w9DocumentDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '215px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="w9DocumentDate"
                onChange={e => {
                  if (!changedDateFields.includes('w9DocumentDate')) {
                    setChangeDateFields([...changedDateFields, 'w9DocumentDate'])
                  }
                }}
              />
            </Box>
          </Flex>
          <HStack>
            <FormControl w="215px" isInvalid={!!errors.w9Document?.message}>
              <FormLabel variant="strong-label" size="md">
                {t('fileUpload')}
              </FormLabel>
              <Controller
                name="w9Document"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <VStack alignItems="baseline">
                      <Box>
                        <ChooseFileField
                          name={field.name}
                          value={field.value?.name ? field.value?.name : 'Choose File'}
                          isError={!!fieldState.error?.message}
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                          }}
                          onClear={() => setValue(field.name, null)}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      {documents.w9DocumentUrl && (
                        <Box overflow="hidden" top={16}>
                          {downloadDocument(documents.w9DocumentUrl, 'W9 Document', 'w9DocumentLink')}
                        </Box>
                      )}
                    </VStack>
                  )
                }}
              />
            </FormControl>
            {(!isW9DocumentDateChanged || watchW9DocumentFile) && <SaveChangedFieldAlert />}
          </HStack>
        </HStack>
        <Box mt="30px">
          <HStack alignItems="flex-start" spacing="16px">
            <Box>
              <FormLabel variant="strong-label" size="md">
                {t('agreementSignedDate')}
              </FormLabel>
              <FormDatePicker
                errorMessage={errors.agreementSignedDate && errors.agreementSignedDate?.message}
                label={''}
                name={`agreementSignedDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '215px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="agreementSignedDate"
                onChange={e => {
                  if (!changedDateFields.includes('agreementSignedDate')) {
                    setChangeDateFields([...changedDateFields, 'agreementSignedDate'])
                  }
                }}
              />
            </Box>
            <HStack>
              <FormControl w="215px" isInvalid={!!errors.agreement?.message}>
                <FormLabel variant="strong-label" size="md">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="agreement"
                  control={control}
                  rules={{
                    required: changedDateFields.includes('agreementSignedDate')
                      ? isActive && 'This is required field'
                      : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline">
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : 'Choose File'}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                            }}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {documents.agreementUrl && (
                          <Box overflow="hidden" top={16}>
                            {downloadDocument(documents.agreementUrl, 'Agreement Sign', 'agreementLink')}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {(!isAgreementSignedDateChanged || watchAgreementFile) && <SaveChangedFieldAlert />}
            </HStack>
          </HStack>
        </Box>

        <HStack mt="30px">
          <FormLabel m={0} variant="strong-label" size="lg">
            {t('insurance')}
          </FormLabel>

          <Divider borderColor="gray.300" />
        </HStack>
        <Box mt="30px">
          <HStack alignItems="flex-start" spacing="16px">
            <Box>
              <FormLabel variant="strong-label" size="md" w="200px" isTruncated title={t('autoInsuranceExpDate')}>
                {t('autoInsuranceExpDate')}
              </FormLabel>
              <FormDatePicker
                errorMessage={errors.autoInsuranceExpDate && errors.autoInsuranceExpDate?.message}
                label={''}
                name={`autoInsuranceExpDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '215px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="autoInsuranceExpDate"
                onChange={e => {
                  if (!changedDateFields.includes('autoInsuranceExpDate')) {
                    setChangeDateFields([...changedDateFields, 'autoInsuranceExpDate'])
                  }
                }}
              />
            </Box>
            <HStack>
              <FormControl w="215px" isInvalid={!!errors.insurance?.message}>
                <FormLabel variant="strong-label" size="md">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="insurance"
                  control={control}
                  rules={{
                    required: changedDateFields.includes('autoInsuranceExpDate')
                      ? isActive && 'This is required field'
                      : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline">
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : 'Choose File'}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                            }}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {documents.insuranceUrl && (
                          <Box overflow="hidden" top={16}>
                            {downloadDocument(documents.insuranceUrl, 'Auto Insurance', 'autoInsuranceLink')}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {(!isAutoInsuranceExpDateChanged || watchInsuranceFile) && <SaveChangedFieldAlert />}
            </HStack>
          </HStack>
        </Box>
        <Box mt="30px">
          <HStack alignItems="flex-start" spacing="16px">
            <Box>
              <FormLabel variant="strong-label" size="md">
                {t('COIGLExpDate')}
              </FormLabel>
              <FormDatePicker
                errorMessage={errors.coiGlExpDate && errors.coiGlExpDate?.message}
                label={''}
                name={`coiGlExpDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '215px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="coiGlExpDate"
                onChange={e => {
                  if (!changedDateFields.includes('COIGLExpDate')) {
                    setChangeDateFields([...changedDateFields, 'COIGLExpDate'])
                  }
                }}
              />
            </Box>
            <HStack w="100%" pr="20px">
              <FormControl w="215px" isInvalid={!!errors.coiGlExpFile?.message}>
                <FormLabel variant="strong-label" size="md">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="coiGlExpFile"
                  control={control}
                  rules={{
                    required: changedDateFields.includes('COIGLExpDate') ? isActive && 'This is required field' : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline">
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : 'Choose File'}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                            }}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {documents.coiGLExpUrl && (
                          <Box overflow="hidden" top={16}>
                            {downloadDocument(documents.coiGLExpUrl, 'General Liability', 'coiGlExpLink')}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {(!isCoiGlExpDateChanged || watchCoiGlExpFile) && <SaveChangedFieldAlert />}
            </HStack>
          </HStack>
        </Box>
        <Box mt="30px">
          <HStack alignItems="flex-start" spacing="16px">
            <Box>
              <FormLabel variant="strong-label" size="md">
                {t('COIWCExpDate')}
              </FormLabel>
              <FormDatePicker
                errorMessage={errors.coiWcExpDate && errors.coiWcExpDate?.message}
                label={''}
                name={`coiWcExpDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '215px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="coiWcExpDate"
                onChange={e => {
                  if (!changedDateFields.includes('coiWcExpDate')) {
                    setChangeDateFields([...changedDateFields, 'coiWcExpDate'])
                  }
                }}
              />
            </Box>
            <HStack w="100%" pr="20px">
              <FormControl w="215px" isInvalid={!!errors.coiWcExpFile?.message}>
                <FormLabel variant="strong-label" size="md">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="coiWcExpFile"
                  control={control}
                  rules={{
                    required: changedDateFields.includes('coiWcExpDate') ? isActive && 'This is required field' : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline">
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : 'Choose File'}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                            }}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {documents.coiWcExpUrl && (
                          <Box overflow="hidden" top={16}>
                            {downloadDocument(documents.coiWcExpUrl, 'Worker Comp', 'coiWcExpLink')}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {(!isCoiWcExpDateChanged || watchCoiWcExpFile) && <SaveChangedFieldAlert />}
            </HStack>
          </HStack>
        </Box>
      </Box>

      <Flex
        id="footer"
        mt={2}
        height="72px"
        pt="8px"
        w="100%"
        borderTop="2px solid #E2E8F0"
        alignItems="center"
        justifyContent="end"
      >
        {isAllFiledWatch && (
          <Button variant="outline" colorScheme="brand" onClick={() => resetFields()} mr="3">
            {t(`${VENDORPROFILE}.discardChanges`)}
          </Button>
        )}
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="brand">
          {vendor?.id ? t('save') : t('next')}
        </Button>
      </Flex>
    </>
  )
}
