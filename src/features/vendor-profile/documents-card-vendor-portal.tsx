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
import { VendorPortalVerifyDocument } from './verify-documents'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

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
  const { isAdmin } = useUserRolesSelector()

  const {
    formState: { errors },
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
  const isAgreementRequired = !!watchAgreementFile || !!documents.agreementUrl

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
      <VStack h="614px" w="100%" alignItems="start" spacing="10px">
        <HStack
          flexDir={{ base: 'column', sm: 'row' }}
          spacing="16px"
          alignItems="flex-start"
          marginTop={{ base: '20px', sm: '0' }}
          w="100%"
          sx={{
            '@media only screen and (max-width: 480px)': {
              paddingBottom: '10px',
              borderBottom: '1px solid #ddd',
            },
          }}
        >
          <FormControl w={{ base: '100%', sm: 'unset' }} isInvalid={!!errors.w9DocumentDate}>
            <FormLabel variant="strong-label" size="md" color="#2D3748">
              {t('W9DocumentDate')}
            </FormLabel>
            <Input
              isDisabled={true}
              w={{ base: '100%', sm: '215px' }}
              type="date"
              {...register('w9DocumentDate')}
              data-testid="w9DocumentDate"
              css={{
                '&::-webkit-date-and-time-value': {
                  textAlign: 'left',
                },
              }}
            />
            <FormErrorMessage>{errors.w9DocumentDate && errors.w9DocumentDate.message}</FormErrorMessage>
          </FormControl>

          <HStack
            sx={{
              '@media screen and (max-width: 480px)': {
                ms: '0 !important',
                mt: '20px !important',
              },
            }}
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'start', sm: 'center' }}
            spacing={{ base: 0, sm: '0.5rem' }}
            w={{ base: '100%', sm: 'unset' }}
          >
            <FormControl isInvalid={!!errors.w9Document?.message} w={{ base: '100%', sm: '215px' }}>
              <FormLabel variant="strong-label" size="md" color="#2D3748">
                {t('fileUpload')}
              </FormLabel>
              <Controller
                name="w9Document"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <VStack alignItems="baseline">
                      <Box w={{ base: '100%', sm: '215px' }}>
                        <ChooseFileField
                          name={field.name}
                          value={field.value?.name ? field.value?.name : t('chooseFile')}
                          isError={!!fieldState.error?.message}
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                          }}
                          onClear={() => setValue(field.name, null)}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      <Box overflow="hidden" top={16} h={{ base: '0', sm: '18px' }}>
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
              <VendorPortalVerifyDocument vendor={vendor as any} fieldName="W9Document" />
            )}
          </HStack>
        </HStack>

        <HStack
          flexDir={{ base: 'column', sm: 'row' }}
          alignItems="flex-start"
          spacing="16px"
          marginTop={{ base: '20px', md: '0' }}
          w={{ base: '100%', sm: 'unset' }}
        >
          <FormControl w={{ base: '100%', sm: '215px' }} isInvalid={!!errors.agreementSignedDate}>
            <FormLabel variant="strong-label" size="md" color="#2D3748">
              {t('agreementSignedDate')}
            </FormLabel>
            <Input
              {...(isAgreementRequired && { borderLeft: '2px solid #345EA6' })}
              type="date"
              w={{ base: '100%', sm: '215px' }}
              data-testid="agreementSignedDate"
              {...register('agreementSignedDate', { required: isAgreementRequired && 'This is required' })}
              {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
              css={{
                '&::-webkit-date-and-time-value': {
                  textAlign: 'left',
                },
              }}
            />
            <FormErrorMessage>{errors.agreementSignedDate && errors.agreementSignedDate.message}</FormErrorMessage>
          </FormControl>

          <HStack
            sx={{
              '@media screen and (max-width: 480px)': {
                ms: '0 !important',
                mt: '20px !important',
              },
            }}
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'start', sm: 'center' }}
            spacing={{ base: 0, sm: '0.5rem' }}
            w={{ base: '100%', sm: 'unset' }}
          >
            <FormControl w={{ base: '100%', sm: '215px' }} isInvalid={!!errors.agreement?.message}>
              <FormLabel variant="strong-label" size="md" color="#2D3748">
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
                      <Box w={{ base: '100%', sm: '215px' }}>
                        <ChooseFileField
                          name={field.name}
                          value={field.value?.name ? field.value?.name : t('chooseFile')}
                          isError={!!fieldState.error?.message}
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                          }}
                          onClear={() => setValue(field.name, null)}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      <Box overflow="hidden" top={16} h={{ base: '0', sm: '18px' }}>
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
              <VendorPortalVerifyDocument vendor={vendor as any} fieldName="agreementSign" />
            )}
          </HStack>
        </HStack>

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

        <HStack
          flexDir={{ base: 'column', sm: 'row' }}
          alignItems="flex-start"
          spacing="16px"
          marginTop={{ base: '20px', md: '0' }}
          w={{ base: '100%', sm: 'unset' }}
          sx={{
            '@media only screen and (max-width: 480px)': {
              paddingBottom: '10px',
              borderBottom: '1px solid #ddd',
            },
          }}
        >
          <FormControl isInvalid={!!errors.autoInsuranceExpDate} w={{ base: '100%', sm: '215px' }}>
            <FormLabel variant="strong-label" size="md" isTruncated title={t('autoInsuranceExpDate')} color="#2D3748">
              {t('autoInsuranceExpDate')}
            </FormLabel>
            <Input
              type="date"
              w={{ base: '100%', sm: '215px' }}
              {...register('autoInsuranceExpDate')}
              data-testid="autoInsuranceExpDate"
              {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
            />
            <FormErrorMessage>{errors.autoInsuranceExpDate && errors.autoInsuranceExpDate.message}</FormErrorMessage>
          </FormControl>

          <HStack
            sx={{
              '@media screen and (max-width: 480px)': {
                ms: '0 !important',
                mt: '20px !important',
              },
            }}
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'start', sm: 'center' }}
            spacing={{ base: 0, sm: '0.5rem' }}
            w={{ base: '100%', sm: 'unset' }}
          >
            <FormControl w={{ base: '100%', sm: '215px' }} isInvalid={!!errors.insurance?.message}>
              <FormLabel variant="strong-label" size="md" color="#2D3748">
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
                      <Box w={{ base: '100%', sm: '215px' }}>
                        <ChooseFileField
                          name={field.name}
                          value={field.value?.name ? field.value?.name : t('chooseFile')}
                          isError={!!fieldState.error?.message}
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                          }}
                          onClear={() => setValue(field.name, null)}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      <Box overflow="hidden" top={16} h={{ base: '0', sm: '18px' }}>
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
              <VendorPortalVerifyDocument vendor={vendor as any} fieldName="autoInsurance" />
            )}
          </HStack>
        </HStack>

        <HStack
          flexDir={{ base: 'column', sm: 'row' }}
          marginTop={{ base: '20px', md: '0' }}
          alignItems="flex-start"
          spacing="16px"
          w={{ base: '100%', sm: 'unset' }}
          sx={{
            '@media only screen and (max-width: 480px)': {
              paddingBottom: '10px',
              borderBottom: '1px solid #ddd',
            },
          }}
        >
          <FormControl w={{ base: '100%', sm: '215px' }} isInvalid={!!errors.coiGlExpDate}>
            <FormLabel variant="strong-label" size="md" color="#2D3748">
              {t('COIGLExpDate')}
            </FormLabel>
            <Input
              type="date"
              w={{ base: '100%', sm: '215px' }}
              {...register('coiGlExpDate')}
              data-testid="coiGlExpDate"
              {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
              css={{
                '&::-webkit-date-and-time-value': {
                  textAlign: 'left',
                },
              }}
            />
            <FormErrorMessage>{errors.coiGlExpDate && errors.coiGlExpDate.message}</FormErrorMessage>
          </FormControl>

          <HStack
            sx={{
              '@media screen and (max-width: 480px)': {
                ms: '0 !important',
                mt: '20px !important',
              },
            }}
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'start', sm: 'center' }}
            spacing={{ base: 0, sm: '0.5rem' }}
            w={{ base: '100%', sm: 'unset' }}
          >
            <FormControl w={{ base: '100%', sm: '215px' }} isInvalid={!!errors.coiGlExpFile?.message} color="#2D3748">
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
                      <Box w={{ base: '100%', sm: '215px' }}>
                        <ChooseFileField
                          name={field.name}
                          value={field.value?.name ? field.value?.name : t('chooseFile')}
                          isError={!!fieldState.error?.message}
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                          }}
                          onClear={() => setValue(field.name, null)}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      <Box overflow="hidden" top={16} h={{ base: '0', sm: '18px' }}>
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
              <VendorPortalVerifyDocument vendor={vendor as any} fieldName="coiGLExp" />
            )}
          </HStack>
        </HStack>

        <HStack
          flexDir={{ base: 'column', sm: 'row' }}
          alignItems="flex-start"
          spacing="16px"
          marginTop={{ base: '20px', md: '0' }}
          w={{ base: '100%', sm: 'unset' }}
        >
          <FormControl w={{ base: '100%', sm: '215px' }} isInvalid={!!errors.coiWcExpDate}>
            <FormLabel variant="strong-label" size="md" color="#2D3748">
              {t('COIWCExpDate')}
            </FormLabel>
            <Input
              type="date"
              w={{ base: '100%', sm: '215px' }}
              {...register('coiWcExpDate')}
              data-testid="coiWcExpDate"
              {...(!isAdmin && { min: datePickerFormat(new Date()) as string })}
              css={{
                '&::-webkit-date-and-time-value': {
                  textAlign: 'left',
                },
              }}
            />
            <FormErrorMessage>{errors.coiGlExpDate && errors.coiGlExpDate.message}</FormErrorMessage>
          </FormControl>

          <HStack
            sx={{
              '@media screen and (max-width: 480px)': {
                ms: '0 !important',
                mt: '20px !important',
              },
            }}
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'start', sm: 'center' }}
            spacing={{ base: 0, sm: '0.5rem' }}
            w={{ base: '100%', sm: 'unset' }}
          >
            <FormControl w={{ base: '100%', sm: '215px' }} isInvalid={!!errors.coiWcExpFile?.message}>
              <FormLabel variant="strong-label" size="md" color="#2D3748">
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
                      <Box w={{ base: '100%', sm: '215px' }}>
                        <ChooseFileField
                          name={field.name}
                          value={field.value?.name ? field.value?.name : t('chooseFile')}
                          isError={!!fieldState.error?.message}
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                          }}
                          onClear={() => setValue(field.name, null)}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      <Box overflow="hidden" top={16} h={{ base: '0', sm: '18px' }}>
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
              <VendorPortalVerifyDocument vendor={vendor as any} fieldName="CoiWcExp" />
            )}
          </HStack>
        </HStack>
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
          <Button variant="outline" colorScheme="darkPrimary" onClick={() => resetFields()} mr="3">
            {t(`${VENDORPROFILE}.discardChanges`)}
          </Button>
        )}
        {onClose && (
          <Button variant="outline" colorScheme="darkPrimary" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}

        <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="darkPrimary">
          {vendor?.id ? t('save') : t('next')}
        </Button>
      </Flex>
    </>
  )
}
