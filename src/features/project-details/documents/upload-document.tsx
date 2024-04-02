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
import ReactSelect from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'
import { Button } from 'components/button/button'
import { ViewLoader } from 'components/page-level-loader'
import { Controller, useForm, useWatch } from 'react-hook-form'
import FileDragDrop from 'components/file-drag-drop/file-drag-drop'
import { useProjectWorkOrders } from 'api/projects'
import { STATUS } from 'features/common/status'
import { DOCUMENT_TYPES } from 'constants/documents.constants'
import { readFileContent } from 'api/vendor-details'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

export const UploadDocumentModal: React.FC<any> = ({ isOpen, onClose, projectId }) => {
  const { t } = useTranslation()
  const [documentType] = useState<SelectOption | undefined>()
  const [againstValue, setAgainstValue] = useState<SelectOption | null>()
  const { mutate: saveDocument, isLoading } = useUploadDocument()
  const { data: documentTypes, isLoading: isDocumentTypesLoading } = useDocumentTypes()
  const { data: workOrders } = useProjectWorkOrders(projectId)
  const [isMobile] = useMediaQuery('(max-width: 480px)')
  const [workOrderAndSOW, setworkOrderAndSOW] = useState<any[]>([])
  const { isVendor } = useUserRolesSelector()

  //Permit document against vendor dropdown should not show Cancelled WO vendors list.
  const permitWorkOrders = workOrders?.filter(wo => !STATUS.Cancelled.includes(wo?.statusLabel?.toLowerCase()))

  const workOderState = permitWorkOrders && permitWorkOrders?.length > 0
    ? permitWorkOrders?.map(state => ({
      label: `${state?.companyName}(${state?.skillName})`,

      value: state,
    }))
    : null

  const docTypes = documentTypes
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
    watch,
    setValue
  } = useForm()
  const values = watch('against')

  const creatDocumentsPayload = async (documents: Array<any>, documentType: string) => {
    const vendorId = values?.value?.vendorId?.toString() || ''
    const workOrderId = values?.value?.id?.toString() || ''
    const results = await Promise.all(
      documents.map(async (document: any, index: number) => {
        let doc = {}
        const fileContents = await readFileContent(document)
        doc = {
          path: document.name,
          fileType: document.name,
          fileObject: fileContents,
          fileObjectContentType: document.type,
          documentType,
          projectId,
          vendorId,
          workOrderId,
        }
        return doc
      }),
    )
    return results
  }

  const onSubmit = async formValues => {
    const documentPayload = await creatDocumentsPayload(
      formValues.chooseFile,
      formValues?.documentTypes?.value?.toString(),
    )

    saveDocument(documentPayload as any[], {
      onSuccess() {
        onClose()
        reset()
        setAgainstValue(null)
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

  useEffect(() => {
    if (permitWorkOrders && permitWorkOrders?.length > 0) {
      const structuredWOs = permitWorkOrders?.map(state => ({
        label: `WO ${state.id} (${state?.companyName})`,
        value: state,
      }))
      if (isVendor) {
        setworkOrderAndSOW([...structuredWOs])
      } else {
        setworkOrderAndSOW([{ label: 'Project SOW', value: null }, ...structuredWOs])
      }
    }
  }, [workOrders])


  const onModalCloseButton = () => {
    reset()
    setAgainstValue(null)
  }

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
        setAgainstValue(null)
      }}
      size={modalSize}
      variant="custom"
    >
      <ModalOverlay />
      <ModalContent minH="317px">
        <ModalHeader>{t('uploadDocument')}</ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} onClick={onModalCloseButton} />
        {isLoading && <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />}
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} id="ReactHookFrom">
            {isDocumentTypesLoading ? (
              <ViewLoader />
            ) : (
              <HStack h="90px">
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
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <ReactSelect
                                classNamePrefix={'documentType'}
                                options={docTypes}
                                selectProps={{ isBorderLeft: true, menuHeight: '200px' }}
                                value={documentType}
                                onChange={(file: any) => {
                                  field.onChange(file)
                                  setValue('against', null)
                                  setAgainstValue(null)
                                }}
                              />

                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isInvalid={!!errors?.against} data-testid="document-type-against">
                      <FormLabel htmlFor="documentType" variant="strong-label" size="md">
                        {t('against')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="against"
                        rules={watchPermitOption || isVendor ? { required: 'Against type is required' } : { required: false }}
                        render={({ field: { onChange }, fieldState }) => {
                          return (
                            <>
                              <ReactSelect
                                classNamePrefix={'documentAgainst'}
                                options={watchPermitOption ? workOderState : workOrderAndSOW}
                                selectProps={{ isBorderLeft: isVendor || watchPermitOption, menuHeight: '110px' }}
                                value={againstValue}
                                onChange={(val) => {
                                  onChange(val)
                                  setAgainstValue(val)
                                }}

                              />

                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </GridItem>
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
                setAgainstValue(null)
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
