import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, Flex, HStack, Text } from '@chakra-ui/react'
import { BiDownload } from 'react-icons/bi'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { DocumentsCardFormValues, VendorProfile } from 'types/vendor.types'
import {
  parseDocumentCardsValues,
  useSaveVendorDetails,
  documentCardsDefaultValues,
  createVendorPayload,
} from 'utils/vendor-details'
import { convertDateTimeToServer } from 'utils/date-time-utils'
import { t } from 'i18next'

const labelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  fontStyle: 'normal',
  color: 'gray.600',
}

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

const downloadableDocument = (link, text, testid?) => {
  return (
    <a href={link} data-testid={testid} download style={{ minWidth: '20em', marginTop: '5px', color: '#4E87F8' }}>
      <Flex>
        <BiDownload fontSize="sm" />
        <Text ml="5px" fontSize="14px" fontWeight={500} fontStyle="normal">
          {text}
        </Text>
      </Flex>
    </a>
  )
}

export const DocumentsCard = React.forwardRef((props: DocumentsProps, ref) => {
  const { vendor = {}, setNextTab } = props
  const { mutate: saveDocuments } = useSaveVendorDetails()

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
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
  } = useForm<DocumentsCardFormValues>({ defaultValues })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, vendor, reset])

  const documents = getValues()

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      // console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

  return (
    <form className="Documents Form" id="documentForm" data-testid="documentForm" onSubmit={handleSubmit(onSubmit)}>
      <Box w="940px">
        <Text sx={labelStyle}>{t('W9DocumentDate')}</Text>

        <HStack spacing={24}>
          <Box>
            <FormDatePicker
              disabled={true}
              errorMessage={errors.w9DocumentDate && errors.w9DocumentDate?.message}
              label={''}
              name={`w9DocumentDate`}
              control={control}
              placeholder="mm/dd/yyyy"
              style={{ width: '250px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
              testId="w9DocumentDate"
              onChange={e => {
                if (!changedDateFields.includes('w9DocumentDate')) {
                  setChangeDateFields([...changedDateFields, 'w9DocumentDate'])
                }
              }}
            />
          </Box>

          <Box>
            <FormFileInput
              errorMessage={errors.w9Document && errors.w9Document?.message}
              label={''}
              name={`w9Document`}
              register={register}
              testId="fileInputW9Document"
              isRequired={documents.w9DocumentUrl ? false : true}
            >
              {t('chooseFile')}
            </FormFileInput>
            {documents.w9DocumentUrl && (
              <Box>
                {downloadableDocument(documents.w9DocumentUrl, 'W9 Document', 'w9DocumentLink')}
                {/* {documents.w9DocumentUrl && downloadableDocument(documents.w9DocumentUrl, 'W9 Document')} */}
              </Box>
            )}
          </Box>
        </HStack>
        <Box w="940px">
          <Divider border="1px solid " />
        </Box>

        <Box mt={12}>
          <Text sx={labelStyle}>{t('agreementSignedDate')}</Text>
          <HStack alignItems="baseline" spacing={24}>
            <Box h="40px">
              <FormDatePicker
                errorMessage={errors.agreementSignedDate && errors.agreementSignedDate?.message}
                label={''}
                name={`agreementSignedDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '250px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="agreementSignedDate"
                onChange={e => {
                  if (!changedDateFields.includes('agreementSignedDate')) {
                    setChangeDateFields([...changedDateFields, 'agreementSignedDate'])
                  }
                }}
              />
            </Box>
            <Box>
              <FormFileInput
                errorMessage={errors.agreement && errors.agreement?.message}
                label={''}
                name={`agreement`}
                register={register}
                testId="fileInputAgreement"
                isRequired={changedDateFields.includes('agreementSignedDate')}
              >
                {t('chooseFile')}
              </FormFileInput>
              {documents.agreementUrl && (
                <Box>
                  {downloadableDocument(documents.agreementUrl, 'Agreement', 'agreementLink')}
                  {/* {documents.agreementUrl && downloadableDocument(documents.agreementUrl, 'Agreement1.Jpeg')} */}
                </Box>
              )}
            </Box>
          </HStack>
        </Box>

        <Box w="940px">
          <Divider border="1px solid " />
        </Box>

        <Text fontSize="18px" fontWeight={500} color="gray.600" mt={6}>
          {t('insurances')}
        </Text>

        <Box mt={6}>
          <Text sx={labelStyle}>{t('autoInsuranceExpDate')}</Text>
          <HStack alignItems="baseline" spacing={24}>
            <Box>
              <FormDatePicker
                errorMessage={errors.autoInsuranceExpDate && errors.autoInsuranceExpDate?.message}
                label={''}
                name={`autoInsuranceExpDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '250px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="autoInsuranceExpDate"
                onChange={e => {
                  if (!changedDateFields.includes('autoInsuranceExpDate')) {
                    setChangeDateFields([...changedDateFields, 'autoInsuranceExpDate'])
                  }
                }}
              />
            </Box>
            <Box>
              <FormFileInput
                errorMessage={errors.insurance && errors.insurance?.message}
                label={''}
                name={`insurance`}
                register={register}
                testId="fileInputInsurance"
                isRequired={changedDateFields.includes('autoInsuranceExpDate')}
              >
                {t('chooseFile')}
              </FormFileInput>
              {documents.insuranceUrl && (
                <Box>
                  {downloadableDocument(documents.insuranceUrl, 'Auto Insurance', 'autoInsuranceLink')}
                  {/* {documents.insuranceUrl && downloadableDocument(documents.insuranceUrl, 'DocAuto1.jpeg')} */}
                </Box>
              )}
            </Box>
          </HStack>
        </Box>

        <Box w="940px">
          <Divider border="1px solid " />
        </Box>

        <Box mt={8}>
          <Text sx={labelStyle}>{t('COIGLExpDate')}</Text>
          <HStack alignItems="baseline" spacing={24}>
            <Box>
              <FormDatePicker
                errorMessage={errors.coiGlExpDate && errors.coiGlExpDate?.message}
                label={''}
                name={`coiGlExpDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '250px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="coiGlExpDate"
                onChange={e => {
                  if (!changedDateFields.includes('COIGLExpDate')) {
                    setChangeDateFields([...changedDateFields, 'COIGLExpDate'])
                  }
                }}
              />
            </Box>

            <Box>
              <FormFileInput
                errorMessage={errors.coiGlExpFile && errors.coiGlExpFile?.message}
                label={''}
                name={`coiGlExpFile`}
                register={register}
                testId="fileInputCoiGlExp"
                isRequired={changedDateFields.includes('COIGLExpDate')}
              >
                {t('chooseFile')}
              </FormFileInput>
              {documents.coiGLExpUrl && (
                <Box>
                  {downloadableDocument(documents.insuranceUrl, 'General Liability', 'coiGlExpLink')}
                  {/* {documents.coiGLExpUrl && downloadableDocument(documents.insuranceUrl, 'COI2.jpeg')} */}
                </Box>
              )}
            </Box>
          </HStack>
        </Box>

        <Box w="940px">
          <Divider border="1px solid " />
        </Box>

        <Box mt={8}>
          <Text sx={labelStyle}>{t('COIWCExpDate')}</Text>
          <HStack alignItems="baseline" spacing={24}>
            <Box>
              <FormDatePicker
                errorMessage={errors.coiWcExpDate && errors.coiWcExpDate?.message}
                label={''}
                name={`coiWcExpDate`}
                control={control}
                placeholder="mm/dd/yyyy"
                style={{ width: '250px', color: 'gray.500', fontStyle: 'normal', fontWeight: 400, fontSize: '14px' }}
                testId="coiWcExpDate"
                onChange={e => {
                  if (!changedDateFields.includes('coiWcExpDate')) {
                    setChangeDateFields([...changedDateFields, 'coiWcExpDate'])
                  }
                }}
              />
            </Box>

            <Box>
              <FormFileInput
                errorMessage={errors.coiWcExpFile && errors.coiWcExpFile?.message}
                label={''}
                name={`coiWcExpFile`}
                register={register}
                testId="fileInputCoiWcExp"
                isRequired={changedDateFields.includes('coiWcExpDate')}
              >
                {t('chooseFile')}
              </FormFileInput>
              {documents.coiWcExpUrl && (
                <Box>
                  {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'Worker Comp', 'coiWcExpLink')}

                  {/* {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'COIwc3.Png')} */}
                </Box>
              )}
            </Box>
          </HStack>
        </Box>
      </Box>
      <Flex
        id="footer"
        w="100%"
        pt="14px"
        h="50px"
        mt="40px"
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
        {VendorType === 'detail' ? (
          <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="brand">
            {t('save')}
          </Button>
        ) : (
          <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="brand">
            {t('next')}
          </Button>
        )}
      </Flex>
    </form>
  )
}
