import React, { useState } from 'react'
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
} from '@chakra-ui/react'

import { useDocumentTypes, useUploadDocument } from 'api/vendor-projects'
import { useTranslation } from 'react-i18next'
import { Document } from 'types/vendor.types'

import ReactSelect from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'
import { Button } from 'components/button/button'
import { ViewLoader } from 'components/page-level-loader'
import { Controller, useForm, useWatch } from 'react-hook-form'
import ChooseFileField from 'components/choose-file/choose-file'
import { createDocumentPayload } from 'utils/file-utils'
import { useProjectWorkOrders } from 'api/projects'

export const UploadDocumentModal: React.FC<any> = ({ isOpen, onClose, projectId }) => {
  const { t } = useTranslation()
  const [documentType] = useState<SelectOption | undefined>()
  const { mutate: saveDocument, isLoading } = useUploadDocument()
  const { data: documentTypes, isLoading: isDocumentTypesLoading } = useDocumentTypes()
  const { data: workOders } = useProjectWorkOrders(projectId)

  const workOderState = workOders
    ? workOders?.map(state => ({
        label: `${state?.companyName}(${state?.skillName})`,
        value: state,
      }))
    : null

  const states = documentTypes
    ? documentTypes?.map(state => ({
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
    const vendorId = formValues?.against?.value?.vendorId?.toString()
    const workOrderId = formValues?.against?.value?.id?.toString()
    const documentPayload = await createDocumentPayload(
      formValues.chooseFile,
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

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
      }}
      size="3xl"
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
                <Grid gridTemplateColumns={'215px 215px 215px'} gap="15px">
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

                  <GridItem>
                    <FormControl isInvalid={!!errors?.chooseFile}>
                      <FormLabel htmlFor="chooseFile" variant="strong-label" size="md">
                        {t('uploadFile')}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="chooseFile"
                        rules={{
                          validate: file => {
                            return file?.name?.length > 30 ? 'File name length should be less than 30' : true
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
                  </GridItem>
                </Grid>
              </HStack>
            )}
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
