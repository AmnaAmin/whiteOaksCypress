import React, { useMemo, useCallback, useEffect } from 'react'
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

const downloadableDocument = (link, text) => {
  return (
    <a href={link} download style={{ minWidth: '20em', marginTop: '5px', color: '#4E87F8' }}>
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

  const defaultValue = vendor => {
    return documentCardsDefaultValues(vendor)
  }

  const defaultValues: DocumentsCardFormValues = useMemo(() => {
    if (props.vendor) {
      return defaultValue(props.vendor)
    }

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
      console.log('Value Change', value)
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
      <form className="Documents Form" id="documentForm" onSubmit={handleSubmit(onSubmit)}>
        <Box w="100%">
          <HStack direction="row" spacing={24}>
            <Flex minWidth="250px" alignSelf="baseline" mt="8px">
              <Box width="25px" fontSize="20px">
                <BiFile color="#718096" />
              </Box>
              <Box fontSize="16px" fontWeight={600}>
                <Text sx={labelStyle}>{t('W9DocumentDate')}</Text>
                <Text color="gray.600" fontStyle="normal" fontWeight={400} fontSize="14px">
                  {' '}
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
                  isRequired={documents.w9DocumentUrl ? false : true}
                >
                  <Button
                    rounded="none"
                    roundedLeft={5}
                    fontSize="16px"
                    fontWeight={400}
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
                {downloadableDocument(documents.w9DocumentUrl, 'W9 Document.png')}
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
                  style={{ width: '250px' }}
                />
              </Box>
              <Flex>
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.agreement && errors.agreement?.message}
                    label={''}
                    name={`agreement`}
                    register={register}
                    isRequired={false}
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
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {downloadableDocument(documents.agreementUrl, 'Agreement signed.jpeg')}
                  {/* {documents.agreementUrl && downloadableDocument(documents.agreementUrl, 'Agreement1.Jpeg')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>

          <Box w="940px">
            <Divider border="1px solid " />
          </Box>

          <Text fontSize="16px" fontWeight={500} color="gray.600" mt={6}>
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
                  style={{ width: '250px' }}
                />
              </Box>
              <Flex>
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.insurance && errors.insurance?.message}
                    label={''}
                    name={`insurance`}
                    register={register}
                    isRequired={false}
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
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {downloadableDocument(documents.insuranceUrl, 'Auto insurance.jpeg')}
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
                  style={{ width: '250px' }}
                />
              </Box>

              <Flex w="100%" pr="20px">
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.coiGlExpFile && errors.coiGlExpFile?.message}
                    label={''}
                    name={`coiGlExpFile`}
                    register={register}
                    isRequired={false}
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
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {downloadableDocument(documents.insuranceUrl, 'COI GL.jpeg')}
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
                  style={{ width: '250px' }}
                />
              </Box>

              <Flex w="100%" pr="20px">
                <Box pr="30px">
                  <FormFileInput
                    errorMessage={errors.coiWcExpFile && errors.coiWcExpFile?.message}
                    label={''}
                    name={`coiWcExpFile`}
                    register={register}
                    isRequired={false}
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
                  </FormFileInput>
                </Box>
                <Box ml={6} pt={5}>
                  {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'COI WC.png')}

                  {/* {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'COIwc3.Png')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>
        </Box>
        <Box w="1065px">
          <Divider border="1px solid " />
        </Box>
        <Box id="footer" w="1065px" pt={5}>
          <Button size="md" float={'right'} ml="5px" colorScheme="CustomPrimaryColor" type="submit">
            <Text fontSize="16px" fontStyle="normal" fontWeight={600}>
              {t('next')}
            </Text>
          </Button>
        </Box>
      </form>
    </Box>
  )
})
