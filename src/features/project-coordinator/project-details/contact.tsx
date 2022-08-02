import { Box, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { STATUS } from 'features/projects/status'
import { useTranslation } from 'react-i18next'

import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ProjectType } from 'types/project.type'

const InputLabel: React.FC<{ title: string; htmlFor: string }> = ({ title, htmlFor }) => {
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

  const disableStatusList = [
    STATUS.New.valueOf(),
    STATUS.Active.valueOf(),
    STATUS.Punch.valueOf(),
    STATUS.PastDue.valueOf(),
    STATUS.Cancelled.valueOf(),
    STATUS.Closed.valueOf(),
    STATUS.Invoiced.valueOf(),
  ]

  const isDisabled = disableStatusList.includes((projectData?.projectStatus || '').toLowerCase())

  const isClientPaid = [STATUS.ClientPaid.valueOf(), STATUS.Overpayment.valueOf()].includes(
    (projectData?.projectStatus || '').toLowerCase(),
  )
  const isInvoicedPaid = [STATUS.Invoiced.valueOf(), STATUS.Paid.valueOf()].includes(
    projectData?.projectStatus.toLowerCase(),
  )

  const projectManager = dataContact?.projectManager
  const projectManagerPhoneNumber = dataContact?.projectManagerPhoneNumber
  const clientName = dataContact?.clientName
  const isContactNull = !dataContact
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
                <InputLabel title={'projectCoordinator'} htmlFor={'projectCoordinator'} />
                <Controller
                  control={control}
                  name="projectManager"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        placeholder={
                          <Box noOfLines={1} title={projectManager}>
                            {projectManager}
                          </Box>
                        }
                        isDisabled={isInvoicedPaid || isDisabled || projectData?.projectStatus === 'clientPaid'}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.fpmPhone}>
                <InputLabel title={'phone'} htmlFor={'phone'} />
                <Input
                  placeholder="098-987-2233"
                  id="fpmPhone"
                  value={projectManagerPhoneNumber}
                  isDisabled={isDisabled || isInvoicedPaid || isClientPaid}
                  {...register('fpmPhone', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.fpmPhone && errors.fpmPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <InputLabel title={'ext'} htmlFor={'ext'} />
                <Input
                  id="ext"
                  value={superPhoneNumberExtension}
                  isDisabled={isDisabled || isInvoicedPaid || isClientPaid}
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <HStack spacing="16px">
            <Box h="40px">
              <FormControl w="215px" isInvalid={errors.projectCoordinator}>
                <InputLabel title={'fieldProjectManager'} htmlFor={'fieldProjectManager'} />
                <Controller
                  control={control}
                  name="projectCoordinator"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        placeholder={
                          <Box noOfLines={1} title={projectManager}>
                            {projectManager}
                          </Box>
                        }
                        isDisabled={isInvoicedPaid}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.pcPhone}>
                <InputLabel title={'phone'} htmlFor={'phone'} />
                <Input
                  placeholder="098-987-2233"
                  value={projectManagerPhoneNumber}
                  isDisabled={isDisabled || isInvoicedPaid || isClientPaid}
                  id="pcPhone"
                  {...register('pcPhone', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.pcPhone && errors.pcPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <InputLabel title={'ext'} htmlFor={'ext'} />
                <Input
                  id="ext"
                  value={superPhoneNumberExtension}
                  isDisabled={isDisabled || isInvoicedPaid || isClientPaid}
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <HStack spacing="16px">
            <Box h="40px">
              <FormControl isInvalid={errors.superEmailName}>
                <InputLabel title={'superName'} htmlFor={'superName'} />
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
                <InputLabel title={'superPhone'} htmlFor={'superPhone'} />
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
                <InputLabel title={'ext'} htmlFor={'ext'} />
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
                <InputLabel title={'superEmail'} htmlFor={'superEmail'} />
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
              <InputLabel title={'client'} htmlFor={'client'} />
              <Controller
                control={control}
                name="client"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      {...field}
                      selectProps={{ isBorderLeft: true }}
                      placeholder={
                        <Box noOfLines={1} title={clientName}>
                          {clientName}
                        </Box>
                      }
                      isDisabled={isDisabled || isInvoicedPaid || isContactNull || isClientPaid}
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
