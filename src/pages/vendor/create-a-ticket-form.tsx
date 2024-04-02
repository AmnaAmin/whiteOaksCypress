import React, { useEffect } from 'react'
import {
  Box,
  FormControl,
  FormErrorMessage,
  Grid,
  VStack,
  HStack,
  Textarea,
  FormLabel,
  Divider,
  Input,
  Flex,
  Text,
  Stack,
  Icon,
} from '@chakra-ui/react'
import ChooseFileField from 'components/choose-file/choose-file'
import { Controller, useForm } from 'react-hook-form'
import {
  getSupportFormDefaultValues,
  ISSUE_TYPE_OPTIONS,
  parseSupportFormValuesToAPIEditPayload,
  parseSupportFormValuesToAPIPayload,
  SEVERITY_OPTIONS,
  STATUS_OPTIONS,
  useCreateTicketMutation,
  useEditTicketMutation,
} from 'api/support'
import { useRoleBasedPermissions, useUserProfile, useUserRolesSelector } from 'utils/redux-common-selectors'
import { FileAttachment, SupportFormValues } from 'types/support.types'
import { Account } from 'types/account.types'
import { Button } from 'components/button/button'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'components/form/react-select'
import { SUPPORT } from 'features/support/support.i18n'
import { BiCalendar, BiDetail, BiDownload } from 'react-icons/bi'
import { dateFormat } from 'utils/date-time-utils'

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

const ReadonlyInfoCard: React.FC<{ icon: React.ElementType; value: string; title: string }> = ({
  icon,
  value,
  title,
}) => {
  const { t } = useTranslation()
  return (
    <HStack spacing="12px">
      <Stack h="40px">
        <Icon as={icon} fontSize="20px" color="gray.500" />
      </Stack>
      <Stack spacing={0}>
        <Text color="gray.600" fontSize="14px" fontWeight={500}>
          {t(`${SUPPORT}.${title}`)}
        </Text>
        <Text color="gray.500" fontSize="14px" fontWeight={400}>
          {value}
        </Text>
      </Stack>
    </HStack>
  )
}

type CreateATicketTypes = {
  onClose?: () => void
  supportPage?: string
  supportDetail?: any
  setLoading?: (boolean) => void
}

export const CreateATicketForm: React.FC<CreateATicketTypes> = ({
  onClose,
  supportPage,
  supportDetail,
  setLoading,
}) => {
  const { t } = useTranslation()
  const { email } = useUserProfile() as Account
  const defaultValues = React.useMemo(() => {
    return getSupportFormDefaultValues(email)
  }, [email])
  const { isAdmin } = useUserRolesSelector()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('SUPPORT.READ')
  const onFileChange = (document: File) => {
    if (!document) return

    const reader = new FileReader()
    reader.addEventListener('load', readFile)
    reader.readAsDataURL(document)
  }

  const {
    formState: { errors },
    control,
    setValue,
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    setError,
  } = useForm<SupportFormValues>({
    defaultValues,
  })

  const setIssueType = () => {
    const typeValue = supportDetail?.lkpSupportTypeId
    if (typeValue === 4) {
      return {
        label: 'Bug',
        value: 4,
      }
    } else if (typeValue === 5) {
      return {
        label: 'Feature Request',
        value: 5,
      }
    }
  }

  const setSeverity = () => {
    const severityValue = supportDetail?.lkpSeverityId
    if (severityValue === 1) {
      return {
        label: 'Major',
        value: 1,
      }
    } else if (severityValue === 2) {
      return {
        label: 'Low',
        value: 2,
      }
    } else if (severityValue === 3) {
      return {
        label: 'Medium',
        value: 3,
      }
    }
  }

  const setStatus = () => {
    const statusValue = supportDetail?.lkpStatusId
    if (statusValue === 66) {
      return {
        label: 'New',
        value: 66,
      }
    } else if (statusValue === 67) {
      return {
        label: 'Work In Progress',
        value: 67,
      }
    } else if (statusValue === 69) {
      return {
        label: 'Resolved',
        value: 69,
      }
    } else if (statusValue === 70) {
      return {
        label: 'Rejected',
        value: 70,
      }
    }
  }

  useEffect(() => {
    setValue('issueType', setIssueType() as any)
    setValue('severity', setSeverity() as any)
    setValue('status', setStatus() as any)
    setValue('title', supportDetail?.title)
    setValue('description', supportDetail?.description)
    setValue('resolution', supportDetail?.resolution)
  }, [setValue])

  const watchFields = watch()

  const watchRequiredField =
    !watchFields?.issueType || !watchFields?.severity || !watchFields?.title || !watchFields?.description

  const [fileBlob, setFileBlob] = React.useState<Blob>()
  const { mutate: createTicket, isLoading: creatLoading } = useCreateTicketMutation()
  const { mutate: EditTicket, isLoading: editLoading } = useEditTicketMutation()

  const Lodings = creatLoading || editLoading

  useEffect(() => {
    setLoading?.(Lodings)
  }, [setLoading?.(Lodings)])

  const readFile = (event: any) => {
    setFileBlob(event.target?.result?.split(',')?.[1])
  }

  const onSubmit = (formValues: SupportFormValues) => {
    const attachment: FileAttachment = {
      newFileName: formValues.attachment?.name ?? '',
      newFileObject: fileBlob as Blob,
    }
    const payload = parseSupportFormValuesToAPIPayload(formValues, attachment)
    const editPayload = parseSupportFormValuesToAPIEditPayload(formValues, supportDetail, attachment)
    if (supportDetail) {
      EditTicket(editPayload, {
        onSuccess: () => {
          onClose?.()
          reset()
        },
      })
    } else {
      createTicket(payload, {
        onSuccess: () => {
          onClose?.()
          reset()
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mt="40px" ml="20px" h="calc(100vh - 333px)" overflow="auto">
        <Box>
          {!supportPage && !supportDetail && (
            <FormLabel variant="strong-label" size="lg" color="gray.600" mb="8" w="100%">
              <HStack w="100%">
                <Box fontSize="18px" whiteSpace="nowrap">
                  {t(`${SUPPORT}.createTicket`)}
                </Box>
                <Divider width="90%" />
              </HStack>
            </FormLabel>
          )}
          <Grid templateColumns="repeat(1, 1fr)" gap={5} maxWidth="700px">
            {supportDetail && (
              <HStack spacing="58px" borderBottom="1px solid #E2E8F0" pb="27px">
                <ReadonlyInfoCard
                  icon={BiCalendar}
                  value={dateFormat(supportDetail?.createdDate)}
                  title={'dateCreated'}
                />
                <ReadonlyInfoCard icon={BiDetail} value={supportDetail?.createdBy} title={'createdBy'} />
              </HStack>
            )}
            <HStack spacing={3}>
              <FormControl isInvalid={!!errors.issueType} w="215px" data-testid="issue-Type">
                <FormLabel htmlFor="issueType" variant="strong-label" color="gray.600">
                  {t(`${SUPPORT}.issueType`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="issueType"
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                       classNamePrefix={'issueTypeDropdown'}
                        id="issueType"
                        isDisabled={isReadOnly}
                        options={ISSUE_TYPE_OPTIONS}
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.severity} w="215px" data-testid="severity">
                <FormLabel htmlFor="severity" variant="strong-label" color="gray.600">
                  {t(`${SUPPORT}.severity`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="severity"
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                       classNamePrefix={'severityDropdown'}
                        id="severity"
                        options={SEVERITY_OPTIONS}
                        isDisabled={isReadOnly}
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>

              <FormControl w="215px" data-testid="status">
                <FormLabel htmlFor="status" variant="strong-label" color="gray.600">
                  {t(`${SUPPORT}.status`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                       classNamePrefix={'ticketStatus'}
                        id="status"
                        options={STATUS_OPTIONS}
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        isDisabled={!isAdmin}
                      />
                    </>
                  )}
                />
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.title?.message} w="449px">
              <FormLabel htmlFor="title" variant="strong-label" color="gray.600">
                {t(`${SUPPORT}.title`)}
              </FormLabel>

              <Input
                h="40px"
                id="Title"
                type="text"
                bg="white"
                disabled={isReadOnly}
                {...register('title', {
                  required: 'This is a required field',
                  maxLength: {
                    value: 100,
                    message: 'Please Use 100 characters Only.',
                  },
                })}
                onChange={e => {
                  const title = e.target.value
                  if (title.length > 100) {
                    setError('title', {
                      type: 'maxLength',
                      message: 'Please Use 100 characters Only.',
                    })
                  } else {
                    clearErrors('title')
                  }
                }}
                data-testid="title-input"
                borderLeft={'2px solid #345EA6'}
                _hover={{
                  borderLeft: '2px solid #345EA6 !important',
                }}
              />

              <FormErrorMessage data-testid="title-error-message">{errors.title?.message}</FormErrorMessage>
            </FormControl>
          </Grid>
        </Box>

        <Box w="449px" mt="30px">
          <FormControl isInvalid={!!errors.description?.message}>
            <FormLabel htmlFor="description" variant="strong-label" color="gray.600">
              {t(`${SUPPORT}.descriptions`)}
            </FormLabel>
            <Textarea
              size="lg"
              bg="white"
              h="100px"
              id="description"
              {...register('description', {
                required: 'This is required field',
                maxLength: {
                  value: 1000,
                  message: 'Please Use 1000 characters Only',
                },
              })}
              isDisabled={isReadOnly}
              _disabled={{ bg: '#EDF2F7', cursor: 'not-allowed' }}
              onChange={e => {
                const title = e.target.value
                if (title.length > 1000) {
                  setError('description', {
                    type: 'maxLength',
                    message: 'Please Use 1000 characters Only',
                  })
                } else {
                  clearErrors('description')
                }
              }}
              data-testid="descriptions"
              borderLeft={'2px solid #345EA6'}
              _hover={{
                borderLeft: '2px solid #345EA6 !important',
              }}
              fontSize="12px"
              color="gray.600"
            />
            <FormErrorMessage data-testid="description-error-message">{errors.description?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box w="449px" mt="30px">
          <FormControl isInvalid={!!errors.resolution?.message}>
            <FormLabel htmlFor="resolution" variant="strong-label" color="gray.600">
              {t(`${SUPPORT}.resolution`)}
            </FormLabel>
            <Textarea
              isDisabled={!isAdmin}
              _disabled={{ bg: '#EDF2F7', cursor: 'not-allowed' }}
              size="lg"
              bg="white"
              h="100px"
              id="resolution"
              {...register('resolution', {
                maxLength: {
                  value: 1000,
                  message: 'Please Use 1000 characters Only',
                },
              })}
              onChange={e => {
                const title = e.target.value
                if (title.length > 1000) {
                  setError('resolution', {
                    type: 'maxLength',
                    message: 'Please Use 1000 characters Only',
                  })
                } else {
                  clearErrors('resolution')
                }
              }}
              fontSize="12px"
              color="gray.600"
            />
            <FormErrorMessage data-testid="resolution-error-message">{errors.resolution?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <FormControl mt="30px" w="290px">
          <FormLabel variant="strong-label" color="gray.600" mb={1}>
            {t(`${SUPPORT}.fileUpload`)}
          </FormLabel>
          <Controller
            name="attachment"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <VStack alignItems="baseline">
                  <Box>
                    <ChooseFileField
                      testId="file-Upload"
                      name={field.name}
                      value={field.value ? field.value?.name : t('chooseFile')}
                      isError={!!fieldState.error?.message}
                      onChange={(file: any) => {
                        onFileChange(file)
                        field.onChange(file)
                      }}
                      onClear={() => setValue(field.name, null)}
                      inputStyle={{ borderLeft: '2px solid #E2E8F0' }}
                      disabled={isReadOnly}
                    ></ChooseFileField>
                  </Box>
                  {supportDetail?.s3Url && downloadDocument(supportDetail?.s3Url, supportDetail?.s3Url)}
                </VStack>
              )
            }}
          />
        </FormControl>
      </Box>
      <HStack w="100%" h="100px" mt="20px" justifyContent="end" borderTop="2px solid #E2E8F0">
        {(supportDetail || supportPage) && (
          <Button variant="outline" onClick={onClose} colorScheme="brand">
            {t(`${SUPPORT}.cancel`)}
          </Button>
        )}
         <>
          {!isReadOnly &&(
        <Button type="submit" colorScheme="brand" data-testid="save" isDisabled={watchRequiredField || Lodings}>
          {t(`${SUPPORT}.save`)}
        </Button>
          )}
          </>
      </HStack>
    </form>
  )
}

export default CreateATicketForm
