import { Box, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { STATUS } from 'features/projects/status'
import { useTranslation } from 'react-i18next'

import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ProjectType } from 'types/project.type'

const InputLable: React.FC<{ title: string; htmlFor: string }> = ({ title, htmlFor }) => {
  const { t } = useTranslation()
  return (
    <FormLabel title={t(title)} isTruncated variant="strong-label" size="md" htmlFor={htmlFor}>
      {t(title)}
    </FormLabel>
  )
}

const Contact: React.FC<{ projectData: ProjectType; dataContact: any }> = props => {
  const { projectData, dataContact } = props
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = FormValues => {
    console.log('formValues', FormValues)
    reset()
  }

  const statusArray = [
    STATUS.New.valueOf(),
    STATUS.Active.valueOf(),
    STATUS.Punch.valueOf(),
    STATUS.PastDue.valueOf(),
    STATUS.Cancelled.valueOf(),
    STATUS.Closed.valueOf(),
    STATUS.Invoiced.valueOf(),
  ]

  const statusClientPaid_OverPayment = [STATUS.ClientPaid.valueOf(), STATUS.Overpayment.valueOf()].includes(
    (projectData?.projectStatus || '').toLowerCase(),
  )

  const projectStatus = statusArray.includes((projectData?.projectStatus || '').toLowerCase())

  const statusInvoice_Paid = [STATUS.Invoiced.valueOf(), STATUS.Paid.valueOf()].includes(
    projectData?.projectStatus.toLowerCase(),
  )

  const projectManager = dataContact?.projectManager
  const projectManagerPhoneNumber = dataContact?.projectManagerPhoneNumber
  const clientName = dataContact?.clientName
  const fieldDisable = dataContact ? true : false
  const superEmailAddress = dataContact?.superEmailAddress
  const superFirstName = dataContact?.superFirstName
  const superPhoneNumber = dataContact?.superPhoneNumber
  const superPhoneNumberExtension = dataContact?.superPhoneNumberExtension

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} id="contact">
        <Stack spacing={14} mt="7">
          <HStack spacing="16px">
            <Box h="40px">
              <FormControl w="215px" isInvalid={errors.projectManager}>
                <InputLable title={'projectCoordinator'} htmlFor={'projectCoordinator'} />
                <Controller
                  control={control}
                  name="projectManager"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        placeholder={projectManager}
                        isDisabled={statusInvoice_Paid || projectStatus || projectData?.projectStatus === 'clientPaid'}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.fpmPhone}>
                <InputLable title={'phone'} htmlFor={'phone'} />
                <Input
                  placeholder="098-987-2233"
                  id="fpmPhone"
                  value={projectManagerPhoneNumber}
                  isDisabled={projectStatus || statusInvoice_Paid}
                  {...register('fpmPhone', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="215px"
                />
                <FormErrorMessage>{errors.fpmPhone && errors.fpmPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <InputLable title={'ext'} htmlFor={'ext'} />
                <Input
                  id="ext"
                  value={superPhoneNumberExtension}
                  isDisabled={projectStatus || statusInvoice_Paid}
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <HStack spacing="16px">
            <Box h="40px">
              <FormControl w="215px" isInvalid={errors.projectCoordinator}>
                <InputLable title={'fieldProjectManager'} htmlFor={'fieldProjectManager'} />
                <Controller
                  control={control}
                  name="projectCoordinator"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        placeholder={projectManager}
                        isDisabled={statusInvoice_Paid}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.pcPhone}>
                <InputLable title={'phone'} htmlFor={'phone'} />
                <Input
                  placeholder="098-987-2233"
                  value={projectManagerPhoneNumber}
                  isDisabled={projectStatus || statusInvoice_Paid}
                  id="pcPhone"
                  {...register('pcPhone', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="215px"
                />
                <FormErrorMessage>{errors.pcPhone && errors.pcPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <InputLable title={'ext'} htmlFor={'ext'} />
                <Input
                  id="ext"
                  value={superPhoneNumberExtension}
                  isDisabled={projectStatus || statusInvoice_Paid}
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <HStack spacing="16px">
            <Box h="40px">
              <FormControl isInvalid={errors.superEmailName}>
                <InputLable title={'superName'} htmlFor={'superName'} />
                <Input
                  value={superFirstName}
                  id="superEmailName"
                  {...register('superEmailName', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.superEmailName && errors.superEmailName.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.superPhone}>
                <InputLable title={'superPhone'} htmlFor={'superPhone'} />
                <Input
                  value={superPhoneNumber}
                  id="superPhone"
                  {...register('superPhone', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.superPhone && errors.superPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <InputLable title={'ext'} htmlFor={'ext'} />
                <Input
                  id="ext"
                  value={superPhoneNumberExtension}
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.superEmail}>
                <InputLable title={'superEmail'} htmlFor={'superEmail'} />
                <Input
                  value={superEmailAddress}
                  id="superEmail"
                  {...register('superEmail', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.superEmail && errors.superEmail.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <Box h="40px">
            <FormControl w="215px" isInvalid={errors.client}>
              <InputLable title={'client'} htmlFor={'client'} />
              <Controller
                control={control}
                name="client"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      {...field}
                      selectProps={{ isBorderLeft: true }}
                      placeholder={clientName}
                      isDisabled={projectStatus || statusInvoice_Paid || fieldDisable || statusClientPaid_OverPayment}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}

export default Contact
