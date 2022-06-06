import React, { useMemo, useCallback, useEffect, useState } from 'react'
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
import { Controller, useForm } from 'react-hook-form'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { DocumentsCardFormValues, VendorProfile } from 'types/vendor.types'
import {
  parseDocumentCardsValues,
  useSaveVendorDetails,
  documentCardsDefaultValues,
  createVendorPayload,
} from 'utils/vendor-details'
import { convertDateTimeToServer } from 'utils/date-time-utils'
import { t } from 'i18next'
import ChooseFileField from 'components/choose-file/choose-file'

type DocumentsProps = {
  setNextTab: () => void
  vendor: VendorProfile
  onClose?: () => void
  VendorType: string
}
type DocumentFormProps = {
  vendor: VendorProfile
  onSubmit: (values: any) => void
  onClose?: () => void
  VendorType?: string
}
export const DocumentsCard = React.forwardRef((props: DocumentsProps, ref) => {
  const { vendor = {}, setNextTab } = props
  // const { mutate: saveDocuments } = useSaveVendorDetails()
  const { mutate: saveDocuments } = useSaveVendorDetails('Document')
  const onSubmit = useCallback(
    async values => {
      const results = await parseDocumentCardsValues(values)
      const updatedObject = {
        documents: results,
        agreementSignedDate: convertDateTimeToServer(values.agreementSignedDate),
        autoInsuranceExpirationDate: convertDateTimeToServer(values.autoInsuranceExpDate),
        coiglExpirationDate: convertDateTimeToServer(values.coiGlExpDate),
        coiWcExpirationDate: convertDateTimeToServer(values.coiWcExpDate),
      }
      const vendorPayload = createVendorPayload(updatedObject, vendor)
      saveDocuments(vendorPayload, {
        onSuccess() {
          setNextTab()
        },
      })
    },
    [vendor, setNextTab, saveDocuments],
  )
  return (
    <Box w="100%">
      <DocumentsForm
        VendorType={props.VendorType}
        vendor={props.vendor}
        onSubmit={onSubmit}
        onClose={props.onClose}
      ></DocumentsForm>
    </Box>
  )
})
export const DocumentsForm = ({ vendor, VendorType, onSubmit, onClose }: DocumentFormProps) => {
  const [changedDateFields, setChangeDateFields] = useState<string[]>([])
  const defaultValue = vendor => {
    return documentCardsDefaultValues(vendor)
  }
  const defaultValues: DocumentsCardFormValues = useMemo(() => {
    if (vendor) {
      return defaultValue(vendor)
    }
    setChangeDateFields([])
    return {}
  }, [vendor])
  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,

    setValue,
    reset,
  } = useForm<DocumentsCardFormValues>({ defaultValues })
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, vendor, reset])

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      // console.log('Value Change', value)
    })
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
  return (
    <form className="Documents Form" id="documentForm" data-testid="documentForm" onSubmit={handleSubmit(onSubmit)}>
      <Box w="95%" h="65vh">
        <HStack spacing="16px" alignItems="center">
          <Flex w="215px">
            <Box>
              <FormLabel variant="strong-label" size="md">
                W9 Document
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
          <Flex>
            <FormControl w="290px" isInvalid={!!errors.w9Document?.message}>
              <FormLabel variant="strong-label" size="md">
                File Upload
              </FormLabel>
              <Controller
                name="w9Document"
                control={control}
                rules={{ required: 'This is required field' }}
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
                        <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                      {field.value?.name && (
                        <Box overflow="hidden" pos="absolute" top={16}>
                          {downloadDocument(document, field.value ? field.value?.name : 'doc.png', 'w9DocumentLink')}
                        </Box>
                      )}
                    </VStack>
                  )
                }}
              />
            </FormControl>
          </Flex>
        </HStack>
        <Box mt="32px">
          <HStack alignItems="center" spacing="16px">
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
            <Flex>
              <FormControl w="290px" isInvalid={!!errors.agreement?.message}>
                <FormLabel variant="strong-label" size="md">
                  File Upload
                </FormLabel>
                <Controller
                  name="agreement"
                  control={control}
                  // rules={{ required: 'This is required field' }}
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
                          <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {field.value?.name && (
                          <Box overflow="hidden" pos="absolute" top={16}>
                            {downloadDocument(document, field.value ? field.value?.name : 'doc.png', 'agreementLink')}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
            </Flex>
          </HStack>
        </Box>
        <Flex mt="32px" alignItems="center">
          <Text fontSize="18px" fontWeight={500} color="gray.600" mr={3}>
            Insurances
          </Text>
          <Divider border="1px solid " />
        </Flex>
        <Box mt="32px">
          <HStack alignItems="center" spacing="16px">
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
            <Flex>
              <FormControl w="290px" isInvalid={!!errors.insurance?.message}>
                <FormLabel variant="strong-label" size="md">
                  File Upload
                </FormLabel>
                <Controller
                  name="insurance"
                  control={control}
                  // rules={{ required: 'This is required field' }}
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
                          <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {field.value?.name && (
                          <Box overflow="hidden" pos="absolute" top={16}>
                            {downloadDocument(
                              document,
                              field.value ? field.value?.name : 'doc.png',
                              'autoInsuranceLink',
                            )}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
            </Flex>
          </HStack>
        </Box>
        <Box mt="32px">
          <HStack alignItems="center" spacing="16px">
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
            <Flex w="100%" pr="20px">
              <FormControl w="290px" isInvalid={!!errors.coiGlExpFile?.message}>
                <FormLabel variant="strong-label" size="md">
                  File Upload
                </FormLabel>
                <Controller
                  name="coiGlExpFile"
                  control={control}
                  // rules={{ required: 'This is required field' }}
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
                          <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {field.value?.name && (
                          <Box overflow="hidden" pos="absolute" top={16}>
                            {downloadDocument(document, field.value ? field.value?.name : 'doc.png', 'coiGlExpLink')}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
            </Flex>
          </HStack>
        </Box>
        <Box mt="32px">
          <HStack alignItems="center" spacing="16px">
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
            <Flex w="100%" pr="20px">
              <FormControl w="290px" isInvalid={!!errors.coiWcExpFile?.message}>
                <FormLabel variant="strong-label" size="md">
                  File Upload
                </FormLabel>
                <Controller
                  name="coiWcExpFile"
                  control={control}
                  // rules={{ required: 'This is required field' }}
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
                          <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                        </Box>
                        {field.value?.name && (
                          <Box overflow="hidden" pos="absolute" top={16}>
                            {downloadDocument(document, field.value ? field.value?.name : 'doc.png', 'coiWcExpLink')}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </FormControl>
            </Flex>
          </HStack>
        </Box>
      </Box>

      <Flex
        id="footer"
        mt={2}
        w="100%"
        h="100px"
        minH="60px"
        borderTop="2px solid #E2E8F0"
        alignItems="center"
        justifyContent="end"
      >
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="brand">
          {t('save')}
        </Button>
      </Flex>
    </form>
  )
}
