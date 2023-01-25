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
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { BiDownload } from 'react-icons/bi'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useFormContext } from 'react-hook-form'
import { DocumentsCardFormValues, VendorProfile } from 'types/vendor.types'
import ChooseFileField from 'components/choose-file/choose-file'
import { useWatchDocumentFeild } from './hook'
import { SaveChangedFieldAlert } from './save-change-field'
import { VENDORPROFILE } from './vendor-profile.i18n'
import { datePickerFormat } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { AdminPortalVerifyDocument } from './verify-documents'

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
  const { t } = useTranslation()
  const { isFPM } = useUserRolesSelector()
  const { isAdmin } = useUserRolesSelector()

  const {
    formState: { errors, isSubmitSuccessful },
    control,
    setValue,
    getValues,
    register,
  } = useFormContext<DocumentsCardFormValues>()
  const documents = getValues()

  useEffect(() => {
    if (!vendor) {
      setChangeDateFields([])
    }
  }, [vendor])

  useEffect(() => {
    setChangeDateFields([])
  }, [isSubmitSuccessful])

  const {
    isW9DocumentDateChanged,
    watchW9DocumentFile,
    // watchW9DocumentDate,
    isAgreementSignedDateChanged,
    watchAgreementFile,
    watchAgreementSignedDate,
    isAutoInsuranceExpDateChanged,
    watchInsuranceFile,
    watchAutoInsuranceExpDate,
    isCoiGlExpDateChanged,
    watchCoiGlExpFile,
    watchCoiGlExpDate,
    isCoiWcExpDateChanged,
    watchCoiWcExpFile,
    watchCoiWcExpDate,
    isAllFiledWatch,
  } = useWatchDocumentFeild(control, vendor)

  // const isW9DocRequired = !!watchW9DocumentFile || !!documents.w9DocumentUrl
  const isAgreementRequired = !!watchAgreementFile || !!documents.agreementUrl
  const isInsuranceRequired = !!watchInsuranceFile || !!documents.insuranceUrl
  const isCoiGlExp = !!watchCoiGlExpFile || !!documents.coiGLExpUrl
  const isCoiWcExp = !!watchCoiWcExpFile || !!documents.coiWcExpUrl

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
      <a href={link} data-testid={testid} download style={{ minWidth: '20em', marginTop: '5px', color: '#345EA6' }}>
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
    setValue('w9DocumentDate', datePickerFormat(vendor?.w9DocumentDate!))
    setValue('w9Document', null)
    setValue('agreementSignedDate', datePickerFormat(vendor?.agreementSignedDate!))
    setValue('agreement', null)
    setValue('autoInsuranceExpDate', datePickerFormat(vendor?.autoInsuranceExpirationDate!))
    setValue('insurance', null)
    setValue('coiGlExpDate', datePickerFormat(vendor?.coiglExpirationDate!))
    setValue('coiGlExpFile', null)
    setValue('coiWcExpDate', datePickerFormat(vendor?.coiWcExpirationDate!))
    setValue('coiWcExpFile', null)
  }

  return (
    <>
      <VStack h="584px" overflow="auto" w="100%" alignItems="start" spacing="10px" pl="30px">
        <HStack
          flexDir={{ base: 'column', sm: 'row' }}
          spacing="16px"
          alignItems="flex-start"
          marginTop={{ base: '20px', md: '0' }}
        >
          <Flex w="215px">
            <Box>
              <FormControl isInvalid={!!errors.w9DocumentDate}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('W9DocumentDate')}
                </FormLabel>
                <Input
                  isDisabled={true}
                  w="215px"
                  {...register('w9DocumentDate')}
                  type="date"
                  data-testid="w9DocumentDate"
                />
                <FormErrorMessage>{errors.w9DocumentDate && errors.w9DocumentDate.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
          <HStack
            sx={{
              '@media screen and (max-width: 480px)': {
                ms: '0 !important',
                mt: '20px !important',
              },
            }}
          >
            <FormControl w="215px" isInvalid={!!errors.w9Document?.message}>
              <FormLabel variant="strong-label" size="md" color="#2D3748">
                {t('fileUpload')}
              </FormLabel>
              <Controller
                name="w9Document"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <VStack alignItems="baseline" pointerEvents={isFPM ? 'none' : 'auto'}>
                      <Box>
                        <ChooseFileField
                          name={field.name}
                          value={field.value?.name ? field.value?.name : t('chooseFile')}
                          isError={!!fieldState.error?.message}
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                          }}
                          onClear={() => setValue(field.name, null)}
                          disabled={isFPM}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      <Box overflow="hidden" top={16} h="18px">
                        {documents.w9DocumentUrl &&
                          downloadDocument(documents.w9DocumentUrl, t('W9Document'), 'w9DocumentLink')}
                      </Box>
                    </VStack>
                  )
                }}
              />
            </FormControl>
            {isW9DocumentDateChanged || watchW9DocumentFile ? (
              <SaveChangedFieldAlert />
            ) : (
              <AdminPortalVerifyDocument
                vendor={vendor as any}
                fieldName="W9DocumentCheckBox"
                registerToFormField={register}
              />
            )}
          </HStack>
        </HStack>
        <Box>
          <HStack
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems="flex-start"
            spacing="16px"
            marginTop={{ base: '20px', md: '0' }}
          >
            <Box>
              <FormControl isInvalid={!!errors.agreementSignedDate}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('agreementSignedDate')}
                </FormLabel>
                <Input
                  type="date"
                  w="215px"
                  {...(isAgreementRequired && { borderLeft: '2px solid #345EA6' })}
                  data-testid="agreementSignedDate"
                  {...register('agreementSignedDate', {
                    required: isAgreementRequired && 'This is required',
                  })}
                  isDisabled={isFPM}
                  {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
                />
                <FormErrorMessage>{errors.agreementSignedDate && errors.agreementSignedDate.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <HStack
              sx={{
                '@media screen and (max-width: 480px)': {
                  ms: '0 !important',
                  mt: '20px !important',
                },
              }}
            >
              <FormControl w="215px" isInvalid={!!errors.agreement?.message}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="agreement"
                  control={control}
                  rules={{
                    required: !!isAgreementSignedDateChanged ? isActive && 'This is required field.' : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline" pointerEvents={isFPM ? 'none' : 'auto'}>
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : t('chooseFile')}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                              setChangeDateFields([...changedDateFields, 'agreementSignedDate'])
                            }}
                            isRequired={!!isAgreementSignedDateChanged || !!watchAgreementSignedDate}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        <Box overflow="hidden" top={16} h="18px">
                          {documents.agreementUrl &&
                            downloadDocument(documents.agreementUrl, t('agreementSign'), 'agreementLink')}
                        </Box>
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {isAgreementSignedDateChanged || watchAgreementFile ? (
                <SaveChangedFieldAlert />
              ) : (
                <AdminPortalVerifyDocument
                  vendor={vendor as any}
                  fieldName="agreementSignCheckBox"
                  registerToFormField={register}
                />
              )}
            </HStack>
          </HStack>
        </Box>

        <HStack
          w="100%"
          pb={5}
          pt={1}
          sx={{
            '@media screen and (max-width: 480px)': {
              ms: '0 !important',
              mt: '30px !important',
            },
          }}
        >
          <FormLabel m={0} variant="strong-label" fontSize="18px" color="#2D3748">
            {t('insurance')}
          </FormLabel>

          <Divider borderColor="gray.300" />
        </HStack>
        <Box>
          <HStack
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems="flex-start"
            spacing="16px"
            marginTop={{ base: '20px', md: '0' }}
          >
            <Box>
              <FormControl isInvalid={!!errors.autoInsuranceExpDate}>
                <FormLabel
                  variant="strong-label"
                  size="md"
                  w="200px"
                  isTruncated
                  title={t('autoInsuranceExpDate')}
                  color="#2D3748"
                >
                  {t('autoInsuranceExpDate')}
                </FormLabel>
                <Input
                  type="date"
                  w="215px"
                  {...(isInsuranceRequired && { borderLeft: '2px solid #345EA6' })}
                  {...register('autoInsuranceExpDate', {
                    required: isInsuranceRequired && 'This is required field',
                  })}
                  {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
                  isDisabled={isFPM}
                  data-testid="autoInsuranceExpDate"
                />
                <FormErrorMessage>
                  {errors.autoInsuranceExpDate && errors.autoInsuranceExpDate.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <HStack
              sx={{
                '@media screen and (max-width: 480px)': {
                  ms: '0 !important',
                  mt: '20px !important',
                },
              }}
            >
              <FormControl w="215px" isInvalid={!!errors.insurance?.message}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="insurance"
                  control={control}
                  rules={{
                    required: isAutoInsuranceExpDateChanged && 'This is required field',
                    // changedDateFields.includes('autoInsuranceExpDate')
                    //   ? isActive && 'This is required field'
                    //   : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline" pointerEvents={isFPM ? 'none' : 'auto'}>
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : t('chooseFile')}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                              setChangeDateFields([...changedDateFields, 'autoInsuranceExpDate'])
                            }}
                            isRequired={!!isAutoInsuranceExpDateChanged || !!watchAutoInsuranceExpDate}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        <Box overflow="hidden" top={16} h="18px">
                          {documents.insuranceUrl &&
                            downloadDocument(documents.insuranceUrl, t('autoInsurance'), 'autoInsuranceLink')}
                        </Box>
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {isAutoInsuranceExpDateChanged || watchInsuranceFile ? (
                <SaveChangedFieldAlert />
              ) : (
                <AdminPortalVerifyDocument
                  vendor={vendor as any}
                  fieldName="autoInsuranceCheckBox"
                  registerToFormField={register}
                />
              )}
            </HStack>
          </HStack>
        </Box>
        <Box>
          <HStack
            flexDir={{ base: 'column', sm: 'row' }}
            marginTop={{ base: '20px', md: '0' }}
            alignItems="flex-start"
            spacing="16px"
          >
            <Box>
              <FormControl isInvalid={!!errors.coiGlExpDate}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('COIGLExpDate')}
                </FormLabel>
                <Input
                  type="date"
                  w="215px"
                  {...(isCoiGlExp && { borderLeft: '2px solid #345EA6' })}
                  {...register('coiGlExpDate', {
                    required: isCoiGlExp && 'This is required field',
                  })}
                  data-testid="coiGlExpDate"
                  isDisabled={isFPM}
                  {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
                />
                <FormErrorMessage>{errors.coiGlExpDate && errors.coiGlExpDate.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <HStack
              w="100%"
              pr="20px"
              sx={{
                '@media screen and (max-width: 480px)': {
                  ms: '0 !important',
                  mt: '20px !important',
                },
              }}
            >
              <FormControl w="215px" isInvalid={!!errors.coiGlExpFile?.message} color="#2D3748">
                <FormLabel variant="strong-label" size="md">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="coiGlExpFile"
                  control={control}
                  rules={{
                    required: isCoiGlExpDateChanged && 'This is required field',
                    //changedDateFields.includes('COIGLExpDate') ? isActive && 'This is required field' : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline" pointerEvents={isFPM ? 'none' : 'auto'}>
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : t('chooseFile')}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                              setChangeDateFields([...changedDateFields, 'COIGLExpDate'])
                            }}
                            isRequired={!!isCoiGlExpDateChanged || !!watchCoiGlExpDate}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        <Box overflow="hidden" top={16} h="18px">
                          {documents.coiGLExpUrl &&
                            downloadDocument(documents.coiGLExpUrl, t('generalLiability'), 'coiGlExpLink')}
                        </Box>
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {isCoiGlExpDateChanged || watchCoiGlExpFile ? (
                <SaveChangedFieldAlert />
              ) : (
                <AdminPortalVerifyDocument
                  vendor={vendor as any}
                  fieldName="coiGLExpCheckBox"
                  registerToFormField={register}
                />
              )}
            </HStack>
          </HStack>
        </Box>
        <Box>
          <HStack
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems="flex-start"
            spacing="16px"
            marginTop={{ base: '20px', md: '0' }}
          >
            <Box>
              <FormControl isInvalid={!!errors.coiWcExpDate}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('COIWCExpDate')}
                </FormLabel>
                <Input
                  type="date"
                  w="215px"
                  {...(isCoiWcExp && { borderLeft: '2px solid #345EA6' })}
                  {...register('coiWcExpDate', {
                    required: isCoiWcExp && 'This is required field',
                  })}
                  data-testid="coiWcExpDate"
                  isDisabled={isFPM}
                  {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
                />
                <FormErrorMessage>{errors.coiWcExpDate && errors.coiWcExpDate.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <HStack
              w="100%"
              pr="20px"
              sx={{
                '@media screen and (max-width: 480px)': {
                  ms: '0 !important',
                  mt: '20px !important',
                },
              }}
            >
              <FormControl w="215px" isInvalid={!!errors.coiWcExpFile?.message}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="coiWcExpFile"
                  control={control}
                  rules={{
                    required: isCoiWcExpDateChanged && 'This is required field',
                    //changedDateFields.includes('coiWcExpDate') ? isActive && 'This is required field' : '',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline" pointerEvents={isFPM ? 'none' : 'auto'}>
                        <Box>
                          <ChooseFileField
                            name={field.name}
                            value={field.value?.name ? field.value?.name : t('chooseFile')}
                            isError={!!fieldState.error?.message}
                            onChange={(file: any) => {
                              onFileChange(file)
                              field.onChange(file)
                              setChangeDateFields([...changedDateFields, 'coiWcExpDate'])
                            }}
                            isRequired={!!isCoiWcExpDateChanged || !!watchCoiWcExpDate}
                            onClear={() => setValue(field.name, null)}
                          ></ChooseFileField>
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        <Box overflow="hidden" top={16} h="18px">
                          {documents.coiWcExpUrl &&
                            downloadDocument(documents.coiWcExpUrl, t('workerComp'), 'coiWcExpLink')}
                        </Box>
                      </VStack>
                    )
                  }}
                />
              </FormControl>
              {isCoiWcExpDateChanged || watchCoiWcExpFile ? (
                <SaveChangedFieldAlert />
              ) : (
                <AdminPortalVerifyDocument
                  vendor={vendor as any}
                  fieldName="CoiWcExpCheckbox"
                  registerToFormField={register}
                />
              )}
            </HStack>
          </HStack>
        </Box>
      </VStack>

      <Flex
        id="footer"
        mt={2}
        height="72px"
        pt="8px"
        w="100%"
        borderTop="2px solid #CBD5E0"
        alignItems="center"
        justifyContent="end"
      >
        {isAllFiledWatch && (
          <Button variant="outline" colorScheme="darkPrimary" onClick={() => resetFields()} mr="3" isDisabled={isFPM}>
            {t(`${VENDORPROFILE}.discardChanges`)}
          </Button>
        )}
        {onClose && (
          <Button variant={isFPM ? 'solid' : 'outline'} colorScheme="darkPrimary" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        {!isFPM && (
          <Button
            type="submit"
            data-testid="saveDocumentCards"
            variant="solid"
            colorScheme="darkPrimary"
            isDisabled={isFPM}
          >
            {vendor?.id ? t('save') : t('next')}
          </Button>
        )}
      </Flex>
    </>
  )
}
