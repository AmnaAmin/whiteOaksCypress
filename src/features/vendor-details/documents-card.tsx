import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, Flex, HStack, Text } from '@chakra-ui/react'
import { BiDownload, BiFile } from 'react-icons/bi'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { FormDatePicker } from '../../components/react-hook-form-fields/date-picker'
import { FormFileInput } from '../../components/react-hook-form-fields/file-input'
import { DocumentsCardFormValues, VendorProfile } from '../../types/vendor.types'
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
  const { mutate: saveDocuments } = useSaveVendorDetails()
  const [changedDateFields, setChangeDateFields] = useState<string[]>([])

  const defaultValue = vendor => {
    return documentCardsDefaultValues(vendor)
  }

  const defaultValues: DocumentsCardFormValues = useMemo(() => {
    if (props.vendor) {
      return defaultValue(props.vendor)
    }
    setChangeDateFields([])
    return {}
  }, [props.vendor])

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
  }, [defaultValues, props, reset])

  const documents = getValues()

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
      const results = await parseDocumentCardsValues(values)
      const updatedObject = {
        documents: results,
        agreementSignedDate: convertDateTimeToServer(values.agreementSignedDate),
        autoInsuranceExpirationDate: convertDateTimeToServer(values.autoInsuranceExpDate),
        coiglExpirationDate: convertDateTimeToServer(values.coiGlExpDate),
        coiWcExpirationDate: convertDateTimeToServer(values.coiWcExpDate),
      }
      const vendorPayload = createVendorPayload(updatedObject, props.vendor)
      saveDocuments(vendorPayload, {
        onSuccess() {
          props.setNextTab()
        },
      })
    },
    [props, saveDocuments],
  )

  return (
    <Box>
      <form className="Documents Form" id="documentForm" data-testid="documentForm" onSubmit={handleSubmit(onSubmit)}>
        <Box w="100%">
          <HStack direction="row" spacing={24}>
            <Flex minWidth="250px" alignSelf="baseline" mt="8px">
              <Box width="25px" fontSize="20px">
                <BiFile color="#718096" />
              </Box>
              <Box fontSize="16px" fontWeight={600}>
                <Text sx={labelStyle}>{t('W9DocumentDate')}</Text>
                <Text color="gray.500" fontStyle="normal" fontWeight={400} fontSize="14px" data-testid="w9DocumentDate">
                  {documents.w9DocumentDate ? documents.w9DocumentDate : 'mm/dd/yyyy'}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box pr="30px">
                <FormFileInput
                  errorMessage={errors.w9Document && errors.w9Document?.message}
                  label={''}
                  name={`w9Document`}
                  register={register}
                  // testId="fileInput"
                  isRequired={documents.w9DocumentUrl ? false : true}
                >
                  <Button
                    rounded="none"
                    roundedLeft={5}
                    fontSize="14px"
                    fontWeight={500}
                    color="gray.600"
                    bg="gray.100"
                    h="36px"
                    w={120}
                  >
                    {t('chooseFile')}
                  </Button>
                </FormFileInput>
              </Box>
              <Box ml={6} pt={5}>
                {downloadableDocument(documents.w9DocumentUrl, 'W9 Document', 'w9DocumentLink')}
                {/* {documents.w9DocumentUrl && downloadableDocument(documents.w9DocumentUrl, 'W9 Document')} */}
              </Box>
            </Flex>
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
              <Flex>
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.agreement && errors.agreement?.message}
                    label={''}
                    name={`agreement`}
                    register={register}
                    isRequired={changedDateFields.includes('agreementSignedDate')}
                  >
                    <Button
                      rounded="none"
                      roundedLeft={5}
                      fontSize="14px"
                      fontWeight={500}
                      color="gray.600"
                      bg="gray.100"
                      h="36px"
                      w={120}
                    >
                      {t('chooseFile')}
                    </Button>
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {downloadableDocument(documents.agreementUrl, 'Agreement', 'agreementLink')}
                  {/* {documents.agreementUrl && downloadableDocument(documents.agreementUrl, 'Agreement1.Jpeg')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>

          <Box w="940px">
            <Divider border="1px solid " />
          </Box>

          <Text fontSize="18px" fontWeight={500} color="gray.600" mt={6}>
            Insurances
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
              <Flex>
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.insurance && errors.insurance?.message}
                    label={''}
                    name={`insurance`}
                    register={register}
                    isRequired={changedDateFields.includes('autoInsuranceExpDate')}
                  >
                    <Button
                      rounded="none"
                      roundedLeft={5}
                      fontSize="14px"
                      fontWeight={500}
                      color="gray.600"
                      bg="gray.100"
                      h="36px"
                      w={120}
                    >
                      {t('chooseFile')}
                    </Button>
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {downloadableDocument(documents.insuranceUrl, 'Auto Insurance', 'autoInsuranceLink')}
                  {/* {documents.insuranceUrl && downloadableDocument(documents.insuranceUrl, 'DocAuto1.jpeg')} */}
                </Box>
              </Flex>
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

              <Flex w="100%" pr="20px">
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.coiGlExpFile && errors.coiGlExpFile?.message}
                    label={''}
                    name={`coiGlExpFile`}
                    register={register}
                    isRequired={changedDateFields.includes('COIGLExpDate')}
                  >
                    <Button
                      rounded="none"
                      roundedLeft={5}
                      fontSize="14px"
                      fontWeight={500}
                      color="gray.600"
                      bg="gray.100"
                      h="36px"
                      w={120}
                    >
                      {t('chooseFile')}
                    </Button>
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {downloadableDocument(documents.insuranceUrl, 'General Liability', 'coiGlExpLink')}
                  {/* {documents.coiGLExpUrl && downloadableDocument(documents.insuranceUrl, 'COI2.jpeg')} */}
                </Box>
              </Flex>
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

              <Flex w="100%" pr="20px">
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.coiWcExpFile && errors.coiWcExpFile?.message}
                    label={''}
                    name={`coiWcExpFile`}
                    register={register}
                    isRequired={changedDateFields.includes('coiWcExpDate')}
                  >
                    <Button
                      rounded="none"
                      roundedLeft={5}
                      fontSize="14px"
                      fontWeight={500}
                      color="gray.600"
                      bg="gray.100"
                      h="36px"
                      w={120}
                    >
                      {t('chooseFile')}
                    </Button>
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'Worker Comp', 'coiWcExpLink')}

                  {/* {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'COIwc3.Png')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>
        </Box>
        <Box id="footer" w="100%" minH="60px" borderTop="1px solid #E2E8F0">
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
            {/* {t('next')} */}
            Next
          </Button>
        </Box>
      </form>
    </Box>
  )
})
