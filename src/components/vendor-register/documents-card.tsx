/*eslint-disable */
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
import { useTranslation } from 'react-i18next'

type DocumentsProps = {
  isActive: boolean
}
type DocumentFormProps = {
  onClose?: () => void
  isActive: boolean
}
export const DocumentsCard = React.forwardRef((props: DocumentsProps, ref) => {
  return (
    <Box w="100%">
      <DocumentsForm isActive={props.isActive}></DocumentsForm>
    </Box>
  )
})

export const DocumentsForm = ({ isActive }: DocumentFormProps) => {
  const [changedDateFields, setChangeDateFields] = useState<string[]>([])
  const { t } = useTranslation()

  const {
    formState: { errors },
    control,
    setValue,
    getValues,
    register,
    watch,
  } = useFormContext<DocumentsCardFormValues>()
  const documents = getValues()
  const watchAgreementFile = watch('agreement')

  /*const {
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
  } = useWatchDocumentFeild(control, vendor)*/

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
    /*setValue('w9DocumentDate', datePickerFormat(vendor?.w9DocumentDate!))
    setValue('w9Document', null)
    setValue('agreementSignedDate', datePickerFormat(vendor?.agreementSignedDate!))
    setValue('agreement', null)
    setValue('autoInsuranceExpDate', datePickerFormat(vendor?.autoInsuranceExpirationDate!))
    setValue('insurance', null)
    setValue('coiGlExpDate', datePickerFormat(vendor?.coiglExpirationDate!))
    setValue('coiGlExpFile', null)
    setValue('coiWcExpDate', datePickerFormat(vendor?.coiWcExpirationDate!))
    setValue('coiWcExpFile', null)*/
  }

  const formLabeStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'gray.700',
  }
  const minDate = new Date()
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
                <FormLabel variant="strong-label" sx={formLabeStyle}>
                  {t('W9DocumentDate')}
                </FormLabel>
                <Input
                  variant = "required-field"
                  isDisabled={true}
                  w="215px"
                  type="date"
                  {...register('w9DocumentDate')}
                  data-testid="w9DocumentDate"
                  min={minDate.toISOString().split('T')[0]}
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
              <FormLabel variant="strong-label" sx={formLabeStyle}>
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
                          isRequired
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
                    </VStack>
                  )
                }}
              />
            </FormControl>
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
                <FormLabel variant="strong-label" sx={formLabeStyle}>
                  {t('agreementSignedDate')}
                </FormLabel>
                <Input
                  variant = "required-field"
                  type="date"
                  w="215px"
                  min={minDate.toISOString().split('T')[0]}
                  {...(!!watchAgreementFile && { borderLeft: '2px solid #345EA6' })}
                  data-testid="agreementSignedDate"
                  {...register('agreementSignedDate', {
                    required: !!watchAgreementFile && 'This is required',
                  })}
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
                <FormLabel variant="strong-label" sx={formLabeStyle}>
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
                            isRequired
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
                      </VStack>
                    )
                  }}
                />
              </FormControl>
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
          <FormLabel m={0} variant="strong-label" fontSize="16px" fontWeight="500" color="gray.600">
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
                  w="200px"
                  isTruncated
                  title={t('autoInsuranceExpDate')}
                  sx={formLabeStyle}
                >
                  {t('autoInsuranceExpDate')}
                </FormLabel>
                <Input variant = "required-field" min={minDate.toISOString().split('T')[0]} type="date" w="215px" {...register('autoInsuranceExpDate')} data-testid="autoInsuranceExpDate" />
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
                <FormLabel variant="strong-label" sx={formLabeStyle}>
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
                            isRequired
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
                      </VStack>
                    )
                  }}
                />
              </FormControl>
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
                <FormLabel variant="strong-label" sx={formLabeStyle}>
                  {t('COIGLExpDate')}
                </FormLabel>
                <Input variant = "required-field" min={minDate.toISOString().split('T')[0]} type="date" w="215px" {...register('coiGlExpDate')} data-testid="coiGlExpDate" />
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
                <FormLabel variant="strong-label" sx={formLabeStyle}>
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
                            isRequired
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
                      </VStack>
                    )
                  }}
                />
              </FormControl>
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
              <FormControl isInvalid={!!errors.coiWcExpDate}>
                <FormLabel variant="strong-label" size="md" color="#2D3748">
                  {t('COIWCExpDate')}
                </FormLabel>
                <Input variant = "required-field" min={minDate.toISOString().split('T')[0]} type="date" w="215px" {...register('coiWcExpDate')} data-testid="coiWcExpDate" />
                <FormErrorMessage>{errors.coiWcExpDate && errors.coiWcExpDate?.message}</FormErrorMessage>
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
              <FormControl w="215px" isInvalid={!!errors.coiWcExpFile?.message} color="#2D3748">
                <FormLabel variant="strong-label" size="md">
                  {t('fileUpload')}
                </FormLabel>
                <Controller
                  name="coiWcExpFile"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack alignItems="baseline">
                        <Box>
                          <ChooseFileField
                            isRequired
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
                      </VStack>
                    )
                  }}
                />
              </FormControl>
            </HStack>
          </HStack>
        </Box>
      </VStack>
    </>
  )
}
