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

type DocumentsProps = {
  setNextTab: () => void
  vendor: VendorProfile
}

const downloadableDocument = (link, text) => {
  return (
    <a href={link} download style={{ minWidth: '20em', marginTop: '5px', color: '#4E87F8' }}>
      <Flex>
        <BiDownload fontSize="20px" />
        <Box ml="5px" fontSize="lg">
          {text}
        </Box>
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
          <HStack bg="white" h="96px" mt="5" mb="5">
            <Flex ml="4" minWidth="24em" alignContent="center">
              <Box width="25px" fontSize="20px">
                <BiFile color="#718096" />
              </Box>
              <Box fontSize="16px" fontWeight={600}>
                <Text>{t('W9DocumentDate')}</Text>
                <Text color="#718096"> {documents.w9DocumentDate ? documents.w9DocumentDate : 'mm/dd/yyyy'}</Text>
              </Box>
            </Flex>
            <Flex>
              <Box>
                <FormFileInput
                  errorMessage={errors.w9Document && errors.w9Document?.message}
                  label={''}
                  name={`w9Document`}
                  register={register}
                  isRequired={documents.w9DocumentUrl ? false : true}
                >
                  <Button rounded="none" roundedLeft={5} fontSize={16} fontWeight={400} bg="gray.100" h="36px" w={120}>
                    {t('chooseFile')}
                  </Button>
                </FormFileInput>
              </Box>
              <Box ml={6} pt={5}>
                {downloadableDocument(documents.w9DocumentUrl, 'W9 Document')}
                {/* {documents.w9DocumentUrl && downloadableDocument(documents.w9DocumentUrl, 'W9 Document')} */}
              </Box>
            </Flex>
          </HStack>

          <Box minH="96px" mt={12}>
            <Text fontSize="16px" fontWeight={600} color="#2D3748">
              {t('agreementSignedDate')}
            </Text>
            <HStack alignItems="baseline">
              <Box h="40px">
                <FormDatePicker
                  errorMessage={errors.agreementSignedDate && errors.agreementSignedDate?.message}
                  label={''}
                  name={`agreementSignedDate`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{ width: '25em' }}
                />
              </Box>
              <Flex>
                <Box>
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
                  {downloadableDocument(documents.agreementUrl, 'Agreement1.Jpeg')}
                  {/* {documents.agreementUrl && downloadableDocument(documents.agreementUrl, 'Agreement1.Jpeg')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>

          <HStack mt={5} mb={8}>
            <Text fontSize="16px" fontWeight={600} w="150px" color="#2D3748">
              Insurrances
            </Text>
            <Divider border="1px solid " />
          </HStack>

          <Box minH="96px" mt={12}>
            <Text fontSize="16px" fontWeight={600} color="#2D3748">
              {t('autoInsuranceExpDate')}
            </Text>
            <HStack alignItems="baseline">
              <Box>
                <FormDatePicker
                  errorMessage={errors.autoInsuranceExpDate && errors.autoInsuranceExpDate?.message}
                  label={''}
                  name={`autoInsuranceExpDate`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{ width: '25em' }}
                />
              </Box>
              <Flex>
                <Box>
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
                  {downloadableDocument(documents.insuranceUrl, 'DocAuto1.jpeg')}
                  {/* {documents.insuranceUrl && downloadableDocument(documents.insuranceUrl, 'DocAuto1.jpeg')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>

          <Divider border="1px solid " />

          <Box minH="96px" mt={8}>
            <Text fontSize="16px" fontWeight={600} color="#2D3748">
              {t('COIGLExpDate')}
            </Text>
            <HStack alignItems="baseline">
              <Box>
                <FormDatePicker
                  errorMessage={errors.coiGlExpDate && errors.coiGlExpDate?.message}
                  label={''}
                  name={`coiGlExpDate`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{ width: '25em' }}
                />
              </Box>

              <Flex w="100%" pr="20px">
                <Box>
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
                  {downloadableDocument(documents.insuranceUrl, 'COI2.jpeg')}
                  {/* {documents.coiGLExpUrl && downloadableDocument(documents.insuranceUrl, 'COI2.jpeg')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>

          <Divider border="1px solid " />

          <Box minH="96px" mt={8}>
            <Text fontSize="16px" fontWeight={600} color="#2D3748">
              {t('COIWCExpDate')}
            </Text>
            <HStack alignItems="baseline">
              <Box>
                <FormDatePicker
                  errorMessage={errors.coiWcExpDate && errors.coiWcExpDate?.message}
                  label={''}
                  name={`coiWcExpDate`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{ width: '25em' }}
                />
              </Box>

              <Flex w="100%" pr="20px">
                <Box>
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
                  {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'COIwc3.Png')}
                  {/* {documents.coiWcExpUrl && downloadableDocument(documents.coiWcExpUrl, 'COIwc3.Png')} */}
                </Box>
              </Flex>
            </HStack>
          </Box>
        </Box>
        <Box id="footer" w="100%" minH="60px" borderTop="1px solid #E2E8F0">
          <Button mt="16px" mr="60px" float={'right'} colorScheme="CustomPrimaryColor" size="md" type="submit">
            <Text fontSize="14px" fontStyle="normal" fontWeight={500}>
              {t('next')}
            </Text>
          </Button>
        </Box>
      </form>
    </Box>
  )
})
