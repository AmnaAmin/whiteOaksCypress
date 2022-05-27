import React from 'react'
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  VStack,
  HStack,
  Input,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import Select from 'components/form/react-select'
import ChooseFileField from 'components/choose-file/choose-file'
import { Controller, useForm } from 'react-hook-form'
// import { disabledInputStyle } from '../theme/common-style'
import {
  getSupportFormDefaultValues,
  ISSUE_TYPE_OPTIONS,
  parseSupportFormValuesToAPIPayload,
  SEVERITY_OPTIONS,
  // STATUS_OPTIONS,
  useCreateTicketMutation,
} from 'utils/support'
import { useUserProfile } from 'utils/redux-common-selectors'
import { FileAttachment, SupportFormValues } from 'types/support.types'
import { Account } from 'types/account.types'
import { BiDownload } from 'react-icons/bi'
import { Button } from 'components/button/button'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'

const CreateATicket = () => {
  const toast = useToast()
  const { t } = useTranslation()
  const { mutate: createTicket } = useCreateTicketMutation()
  const { email } = useUserProfile() as Account
  const defaultValues = React.useMemo(() => {
    return getSupportFormDefaultValues(email)
  }, [email])

  const [fileBlob, setFileBlob] = React.useState<Blob>()

  const readFile = (event: any) => {
    setFileBlob(event.target?.result?.split(',')?.[1])
  }

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
  } = useForm<SupportFormValues>({
    defaultValues,
  })

  const onSubmit = (formValues: SupportFormValues) => {
    const attachment: FileAttachment = {
      newFileName: formValues.attachment?.name ?? '',
      newFileObject: fileBlob as Blob,
    }

    const payload = parseSupportFormValuesToAPIPayload(formValues, attachment)
    createTicket(payload, {
      onSuccess() {
        toast({
          title: 'Support Ticket Creation',
          description: 'Support ticket has been created successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
    })
  }

  const downloadDocument = (link, text) => {
    return (
      <a href={link} download style={{ minWidth: '20em', marginTop: '5px', color: '#4E87F8' }}>
        <Flex ml={1}>
          <BiDownload fontSize="sm" />
          <Text ml="5px" fontSize="12px" fontStyle="normal">
            {text}
          </Text>
        </Flex>
      </a>
    )
  }

  return (
    <Card pb="0">
      <Box mt="40px" ml="20px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Text fontSize="18px" fontWeight={500} color="gray.600" mb="8">
              {t('createTicket')}
            </Text>

            <Grid templateColumns="repeat(1, 1fr)" gap={8} maxWidth="700px">
              {/* <FormControl>
                <FormLabel htmlFor="createdBy" fontSize="16px">
                  Created By
                </FormLabel>
                <Input
                  disabled
                  h="40px"
                  id="createdBy"
                  type="text"
                  borderLeft="2px solid #4E87F8"
                  bg="white"
                  _disabled={disabledInputStyle}
                  {...register("createdBy")}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="createdDate" fontSize="16px">
                  Created Date
                </FormLabel>
                <Input
                  disabled
                  h="40px"
                  id="createdDate"
                  type="text"
                  bg="white"
                  _disabled={disabledInputStyle}
                  {...register("createdDate")}
                />
              </FormControl> */}
              <HStack spacing={3}>
                <FormControl isInvalid={!!errors.issueType} w="215px">
                  <FormLabel htmlFor="issueType" fontSize="14px" fontWeight={500} fontStyle="normal" color="gray.600">
                    {t('issueType')}{' '}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="issueType"
                    rules={{ required: 'This is required field' }}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          id="issueType"
                          options={ISSUE_TYPE_OPTIONS}
                          {...field}
                          style={{ borderLeft: '2px solid green' }}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.severity} w="215px">
                  <FormLabel htmlFor="severity" fontSize="14px" fontWeight={500} fontStyle="normal" color="gray.600">
                    {t('severity')}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="severity"
                    rules={{ required: 'This is required field' }}
                    render={({ field, fieldState }) => (
                      <>
                        <Select id="severity" options={SEVERITY_OPTIONS} {...field} />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.title?.message} w="320px">
                <FormLabel htmlFor="title" fontSize="14px" fontWeight={500} fontStyle="normal" color="gray.600">
                  {t('title')}
                </FormLabel>
                <Input
                  h="40px"
                  id="Title"
                  type="text"
                  bg="white"
                  {...register('title', {
                    required: 'This is required field',
                  })}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>

              {/* <FormControl isInvalid={!!errors.status}>
                <FormLabel htmlFor="status" fontSize="16px">
                Status
                </FormLabel>
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select id="status" options={STATUS_OPTIONS} {...field} isDisabled />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl> */}
            </Grid>
          </Box>

          <Box w="434px" mt="30px">
            <FormControl isInvalid={!!errors.description?.message}>
              <FormLabel htmlFor="description" fontSize="14px" fontWeight={500} fontStyle="normal" color="gray.600">
                {t('descriptions')}{' '}
              </FormLabel>
              <Textarea
                size="lg"
                bg="white"
                h="140px"
                id="description"
                {...register('description', {
                  required: 'This is required field',
                })}
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>

            {/* <FormControl mt="30px">
              <FormLabel htmlFor="resolution" fontSize="16px">
                Resolution(1000 Characters)
              </FormLabel>
              <Textarea size="lg" bg="gray.200" h="140px" id="resolution" {...register('resolution')} />
            </FormControl> */}
          </Box>

          <FormControl mt="40px" w="290px" mb="40px" isInvalid={!!errors.attachment?.message}>
            <FormLabel fontSize="14px" fontWeight={500} fontStyle="normal" color="gray.600" mb={1}>
              File Upload
            </FormLabel>
            <Controller
              name="attachment"
              control={control}
              rules={{ required: 'This is required field' }}
              render={({ field, fieldState }) => {
                return (
                  <VStack alignItems="baseline">
                    <Box>
                      <ChooseFileField
                        name={field.name}
                        value={field.value ? field.value?.name : 'Choose File'}
                        isError={!!fieldState.error?.message}
                        onChange={(file: any) => {
                          onFileChange(file)
                          field.onChange(file)
                        }}
                        onClear={() => setValue(field.name, null)}
                      >
                        {t('chooseFile')}
                      </ChooseFileField>

                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </Box>
                    {field.value && (
                      <Box>{downloadDocument(document, field.value ? field.value?.name : 'doc.png')}</Box>
                    )}
                  </VStack>
                )
              }}
            />
          </FormControl>

          <Flex
            flexDirection="row-reverse"
            w="100%"
            h="100px"
            mt="100px"
            alignItems="center"
            justifyContent="end"
            borderTop="2px solid #E2E8F0"
          >
            <Button type="submit" colorScheme="brand">
              Save
            </Button>
          </Flex>
        </form>
      </Box>
    </Card>
  )
}

export default CreateATicket
