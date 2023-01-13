import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  HStack,
  FormErrorMessage,
  ModalCloseButton,
  Progress,
  Grid,
  GridItem,
  useMediaQuery,
} from '@chakra-ui/react'

import { useDocumentTypes, useUploadDocument } from 'api/vendor-projects'
import { useTranslation } from 'react-i18next'
import { Document } from 'types/vendor.types'

import ReactSelect from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'
import { Button } from 'components/button/button'
import { ViewLoader } from 'components/page-level-loader'
import { Controller, useForm, useWatch } from 'react-hook-form'
import FileDragDrop from 'components/file-drag-drop/file-drag-drop'
import { createDocumentPayload } from 'utils/file-utils'
import { useProjectWorkOrders } from 'api/projects'
import { STATUS } from 'features/common/status'
import { DOCUMENT_TYPES } from 'constants/documents.constants'

export const UploadDocumentModal: React.FC<any> = ({ isOpen, onClose, projectId }) => {
  const { t } = useTranslation()
  const [documentType] = useState<SelectOption | undefined>()
  const { mutate: saveDocument, isLoading } = useUploadDocument()
  const { data: documentTypes, isLoading: isDocumentTypesLoading } = useDocumentTypes()
  const { data: workOrders } = useProjectWorkOrders(projectId)
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  //Permit document against vendor dropdown should not show Cancelled WO vendors list.
  const permitWorkOrders = workOrders?.filter(wo => !STATUS.Cancelled.includes(wo?.statusLabel?.toLowerCase()))

  const workOderState =
    permitWorkOrders && permitWorkOrders?.length > 0
      ? permitWorkOrders?.map(state => ({
          label: `${state?.companyName}(${state?.skillName})`,

          value: state,
        }))
      : null

  const states = documentTypes
    ? documentTypes
        ?.filter(doc => ![DOCUMENT_TYPES.ORIGINAL_SOW].includes(doc.id))
        ?.map(state => ({
          label: state?.value,
          value: state?.id,
        }))
    : null

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = async formValues => {
    const vendorId = formValues?.against?.value?.vendorId?.toString() || ''
    const workOrderId = formValues?.against?.value?.id?.toString() || ''
    console.log('formValues', formValues)

    let documentPayload
    let fileDoc
    const results = await Promise.all(
      formValues?.chooseFile.map(async (docFile: any, index: number) => {
        console.log('docFile', docFile)
        fileDoc = await createDocumentPayload(docFile, formValues?.documentTypes?.value?.toString())
        console.log('fileDoc', fileDoc)
        documentPayload.push(fileDoc)
        console.log('documentPayload', documentPayload)
      }),
    )
    // documentPayload.push(results)
    // console.log('results', results)

    // let chFile
    // formValues?.chooseFile &&
    //   formValues?.chooseFile.forEach((file, index) => {

    //     const chooseF = {
    //       chooseFile: file?.chooseFile,
    //     }
    //     chFile.push(chooseF)
    //   })
    // console.log('chFile', chFile)

    const documents = formValues.documents.forEach(async file => {
    const documentPayload = await createDocumentPayload(
      formValues.chooseFile[0],
      formValues?.documentTypes?.value?.toString(),
    )

    const doc: Document = {
      ...documentPayload,
      projectId,
      vendorId,
      workOrderId,
    }

    saveDocument(doc, {
      onSuccess() {
        onClose()
        reset()
      },
    })
  }

  const watchField = useWatch({
    control,
    name: 'documentTypes',
  })
  const watchPermitOption = watchField?.label === 'Permit'

  const [modalSize, setModalSize] = useState<string>('3xl')

  useEffect(() => {
    isMobile ? setModalSize('sm') : setModalSize('3xl')
  }, [isMobile])

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
      }}
      size={modalSize}
      variant="custom"
    >
      <ModalOverlay />
      <ModalContent minH="317px">
        <ModalHeader>{t('uploadDocument')}</ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} onClick={() => reset()} />
        {isLoading && <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />}
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} id="ReactHookFrom">
            {isDocumentTypesLoading ? (
              <ViewLoader />
            ) : (
              <HStack h="130px">
                <Grid gridTemplateColumns={{ md: '215px 215px 215px', sm: '' }} gap="15px">
                  <GridItem>
                    <FormControl isInvalid={!!errors?.documentTypes} data-testid="document-type">
                      <FormLabel htmlFor="documentType" variant="strong-label" size="md">
                        {t('documentType')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="documentTypes"
                        rules={{ required: 'Document type is required' }}
                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState }) => {
                          return (
                            <>
                              <ReactSelect
                                options={states}
                                selectProps={{ isBorderLeft: true, menuHeight: '110px' }}
                                value={documentType}
                                onChange={onChange}
                              />

                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  {watchPermitOption && (
                    <GridItem>
                      <FormControl isInvalid={!!errors?.against} data-testid="document-type">
                        <FormLabel htmlFor="documentType" variant="strong-label" size="md">
                          {t('against')}
                        </FormLabel>
                        <Controller
                          control={control}
                          name="against"
                          rules={{ required: 'Against type is required' }}
                          render={({ field: { onChange, onBlur, value, name, ref }, fieldState }) => {
                            return (
                              <>
                                <ReactSelect
                                  options={workOderState}
                                  selectProps={{ isBorderLeft: true, menuHeight: '110px' }}
                                  value={documentType}
                                  onChange={onChange}
                                />

                                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                              </>
                            )
                          }}
                        />
                      </FormControl>
                    </GridItem>
                  )}

                  {/* <GridItem>
                    <FormControl isInvalid={!!errors?.chooseFile}>
                      <FormLabel htmlFor="chooseFile" variant="strong-label" size="md">
                        {t('uploadFile')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="chooseFile"
                        rules={{
                          validate: file => {
                            return file?.name?.length > 255 ? 'File name length should be less than 255' : true
                          },
                          required: 'Document file is required',
                        }}
                        render={({ field, fieldState }) => {
                          const fileName = field?.value?.name ?? (t('chooseFile') as string)
                          return (
                            <>
                              <ChooseFileField
                                testId="choose-document"
                                name={field.name}
                                value={fileName}
                                isRequired={true}
                                isError={!!fieldState.error?.message}
                                onChange={(file: any) => {
                                  field.onChange(file)
                                }}
                              />
                              <FormErrorMessage>{fieldState?.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </GridItem> */}
                </Grid>
              </HStack>
            )}
            <>
              <FormControl isInvalid={!!errors?.chooseFile}>
                <Controller
                  control={control}
                  name="chooseFile"
                  rules={{
                    validate: files => {
                      const fileLengthExceeded = files?.some(file => file?.name?.length > 255)
                      return fileLengthExceeded ? 'File name length should be less than 255' : true
                    },
                    required: 'Document file is required',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <FileDragDrop
                          isRequired
                          testId="choose-document"
                          name={field.name}
                          onUpload={(docs: any) => {
                            field.onChange(docs)
                          }}
                        />
                        <FormErrorMessage>{fieldState?.error?.message}</FormErrorMessage>
                      </>
                    )
                  }}
                />
              </FormControl>
            </>
          </form>
        </ModalBody>
        <ModalFooter>
          <HStack spacing="16px">
            <Button
              variant="outline"
              onClick={() => {
                onClose()
                reset()
              }}
              colorScheme="brand"
            >
              {t('cancel')}
            </Button>
            <Button type="submit" isDisabled={isLoading} colorScheme="brand" form="ReactHookFrom">
              {t('save')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
