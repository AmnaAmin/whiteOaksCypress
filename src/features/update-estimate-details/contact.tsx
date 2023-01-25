import { Box, FormControl, FormErrorMessage, FormLabel, FormLabelProps, HStack, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { useTranslation } from 'react-i18next'

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import { SelectOption } from 'types/transaction.type'
import NumberFormat from 'react-number-format'

const InputLabel: React.FC<FormLabelProps> = ({ title, htmlFor }) => {
  const { t } = useTranslation()

  return (
    <FormLabel title={t(title as string)} isTruncated variant="strong-label" size="md" htmlFor={htmlFor}>
      {t(title as string)}
    </FormLabel>
  )
}

type ContactProps = {
  projectCoordinatorSelectOptions: SelectOption[]
  projectManagerSelectOptions: SelectOption[]
  clientSelectOptions: SelectOption[]
}
const Contact: React.FC<ContactProps> = ({
  projectCoordinatorSelectOptions,
  projectManagerSelectOptions,
  clientSelectOptions,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectDetailsFormValues>()

  const {
    isProjectCoordinatorDisabled,
    isProjectCoordinatorPhoneNumberDisabled,
    isProjectCoordinatorExtensionDisabled,
    isFieldProjectManagerDisabled,
    isFieldProjectManagerPhoneNumberDisabled,
    isFieldProjectManagerExtensionDisabled,
    isClientDisabled,
  } = useFieldsDisabled(control)

  return (
    <Stack spacing={14} mt="7">
      <HStack spacing="16px">
        <Box h="40px">
          <FormControl w="215px" isInvalid={!!errors.projectCoordinator}>
            <InputLabel title={'project.projectDetails.projectCoordinator'} htmlFor={'projectCoordinator'} />
            <Controller
              control={control}
              name="projectCoordinator"
              rules={{ required: !isProjectCoordinatorDisabled && 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    {...field}
                    selectProps={{ isBorderLeft: !isProjectCoordinatorDisabled }}
                    options={projectCoordinatorSelectOptions}
                    isDisabled={isProjectCoordinatorDisabled}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors?.projectCoordinatorPhoneNumber}>
            <InputLabel title={'project.projectDetails.phone'} htmlFor={'projectCoordinatorPhoneNumber'} />
            <Input
              placeholder="098-987-2233"
              id="projectCoordinatorPhoneNumber"
              isDisabled={isProjectCoordinatorPhoneNumberDisabled}
              {...register('projectCoordinatorPhoneNumber')}
              w="215px"
            />
            <FormErrorMessage>{errors?.projectCoordinatorPhoneNumber?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors.projectCoordinatorExtension}>
            <InputLabel title={'project.projectDetails.ext'} htmlFor={'projectCoordinatorExtension'}>
              Ext
            </InputLabel>
            <Input
              id="projectCoordinatorExtension"
              isDisabled={isProjectCoordinatorExtensionDisabled}
              {...register('projectCoordinatorExtension')}
              w="124px"
            />
            <FormErrorMessage>{errors?.projectCoordinatorExtension?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>

      <HStack spacing="16px">
        <Box h="40px">
          <FormControl w="215px" isInvalid={!!errors.fieldProjectManager}>
            <InputLabel title={'project.projectDetails.fieldProjectManager'} htmlFor={'fieldProjectManager'} />
            <Controller
              control={control}
              name="fieldProjectManager"
              rules={{ required: 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect
                    {...field}
                    selectProps={{ isBorderLeft: true }}
                    options={projectManagerSelectOptions}
                    isDisabled={isFieldProjectManagerDisabled}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors?.fieldProjectManagerPhoneNumber}>
            <InputLabel title={'project.projectDetails.phone'} htmlFor={'fieldProjectManagerPhoneNumber'} />
            <Input
              placeholder="098-987-2233"
              isDisabled={isFieldProjectManagerPhoneNumberDisabled}
              id="fieldProjectManagerPhoneNumber"
              {...register('fieldProjectManagerPhoneNumber')}
              w="215px"
            />
            <FormErrorMessage>{errors?.fieldProjectManagerPhoneNumber?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors?.fieldProjectManagerExtension}>
            <InputLabel title={'project.projectDetails.ext'} htmlFor={'fieldProjectManagerExtension'} />
            <Input
              id="fieldProjectManagerExtension"
              isDisabled={isFieldProjectManagerExtensionDisabled}
              {...register('fieldProjectManagerExtension')}
              w="124px"
            />
            <FormErrorMessage>{errors?.fieldProjectManagerExtension?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>

      <HStack spacing="16px">
        <Box h="40px">
          <FormControl isInvalid={!!errors?.superName}>
            <InputLabel title={'project.projectDetails.superName'} htmlFor={'superName'} />
            <Input id="superName" {...register('superName')} w="215px" />
            <FormErrorMessage>{errors?.superName?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors?.superPhoneNumber}>
            <InputLabel title={'project.projectDetails.superPhone'} htmlFor={'superPhoneNumber'} />
            <Controller
              control={control}
              name="superPhoneNumber"
              render={({ field, fieldState }) => {
                return (
                  <>
                    <NumberFormat
                      customInput={Input}
                      value={field.value}
                      onChange={e => field.onChange(e)}
                      format="(###)-###-####"
                      mask="_"
                      placeholder="(___)-___-____"
                    />
                    <FormErrorMessage>{fieldState?.error?.message}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>
        </Box>
        <Box h="40px">
          <FormControl isInvalid={!!errors?.superPhoneNumberExtension}>
            <InputLabel title={'project.projectDetails.ext'} htmlFor={'superPhoneNumberExtension'} />
            <Input id="superPhoneNumberExtension" {...register('superPhoneNumberExtension')} w="124px" />
            <FormErrorMessage>{errors?.superPhoneNumberExtension?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box h="40px">
          <FormControl isInvalid={!!errors.superEmail}>
            <InputLabel title={'project.projectDetails.superEmail'} htmlFor={'superEmail'} />
            <Input id="superEmail" {...register('superEmail')} w="215px" />
            <FormErrorMessage>{errors?.superEmail?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>

      <Box h="40px">
        <FormControl w="215px" isInvalid={!!errors.client}>
          <InputLabel title={'project.projectDetails.client'} htmlFor={'client'} />
          <Controller
            control={control}
            name="client"
            render={({ field, fieldState }) => (
              <>
                <ReactSelect
                  {...field}
                  options={clientSelectOptions}
                  selectProps={{ isBorderLeft: true }}
                  isDisabled={isClientDisabled}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </>
            )}
          />
        </FormControl>
      </Box>
    </Stack>
  )
}

export default Contact
