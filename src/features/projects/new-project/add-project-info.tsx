import React from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  VStack,
} from '@chakra-ui/react'

import { Controller, useFormContext } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import ReactSelect from 'components/form/react-select'
import ChooseFileField from 'components/choose-file/choose-file'
import { useTranslation } from 'react-i18next'
import { useProjectTypeSelectOptions } from 'api/pc-projects'
import { CustomRequiredInput, NumberResInput } from 'components/input/input'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { useProjectInformationNextButtonDisabled, useWOStartDateMin } from './hooks'

type InfoProps = {
  setNextTab: () => void
  onClose: () => void
}

export const AddProjectInfo = React.forwardRef((props: InfoProps, ref) => {
  const { t } = useTranslation()
  const { projectTypeSelectOptions } = useProjectTypeSelectOptions()

  const {
    register,
    formState: { errors },
    control,
    setValue,
    setError,
    clearErrors,
  } = useFormContext<ProjectFormValues>()

  const isProjectInformationNextButtonDisabled = useProjectInformationNextButtonDisabled(control, errors)

  const woStartDateMin = useWOStartDateMin(control)

  const [fileBlob, setFileBlob] = React.useState<Blob>()
  const readFile = (event: any) => {
    setFileBlob(event.target?.result?.split(',')?.[1])
  }

  const onFileChange = (document: File) => {
    if (!document) return

    const reader = new FileReader()
    reader.addEventListener('load', readFile)
    reader.readAsDataURL(document)
    setValue('documents', fileBlob as Blob)
  }

  return (
    <Flex flexDir="column" minH="420px">
      <Box flex="1">
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} pb="3">
          <GridItem>
            <FormControl isInvalid={!!errors?.name}>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.name`)} size="md" htmlFor="name">
                {t(`${NEW_PROJECT}.name`)}
              </FormLabel>
              <Input id="name" {...register('name')} autoComplete="off" />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.type`)} size="md">
                {t(`${NEW_PROJECT}.type`)}
              </FormLabel>
              <Controller
                control={control}
                name={`projectType`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value, onChange }, fieldState }) => (
                  <>
                    <ReactSelect
                      id="projectType"
                      options={projectTypeSelectOptions}
                      selected={value}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => onChange(option)}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors?.woNumber}>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.woNumber`)} size="md" htmlFor="woNumber">
                {t(`${NEW_PROJECT}.woNumber`)}
              </FormLabel>
              <Input id="woNumber" {...register('woNumber')} autoComplete="off" />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors?.poNumber}>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.poNumber`)} size="md" htmlFor="poNumber">
                {t(`${NEW_PROJECT}.poNumber`)}
              </FormLabel>
              <Input id="poNumber" {...register('poNumber')} autoComplete="off" />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
          <GridItem style={{ textAlign: 'left' }}>
            <FormControl>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.clientStartDate`)} size="md">
                {t(`${NEW_PROJECT}.clientStartDate`)}
              </FormLabel>
              <Input
                type="date"
                variant="required-field"
                {...register('clientStartDate', { required: 'This is required field' })}
              />
              <FormErrorMessage>{errors.clientStartDate && errors.clientStartDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.clientDueDate`)} size="md">
                {t(`${NEW_PROJECT}.clientDueDate`)}
              </FormLabel>
              <Input
                type="date"
                variant="required-field"
                min={woStartDateMin}
                {...register('clientDueDate', { required: 'This is required field' })}
              />
              <FormErrorMessage>{errors.clientDueDate && errors.clientDueDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.woStartDate`)} size="md">
                {t(`${NEW_PROJECT}.woStartDate`)}
              </FormLabel>
              <Input type="date" min={woStartDateMin} {...register('woaStartDate')} />
              <FormErrorMessage>{errors.woaStartDate && errors.woaStartDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3" mt={3}>
          <GridItem>
            <FormControl isInvalid={!!errors?.sowOriginalContractAmount}>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.originalSOWAmount`)} size="md">
                {t(`${NEW_PROJECT}.originalSOWAmount`)}
              </FormLabel>
              <Controller
                control={control}
                name="sowOriginalContractAmount"
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberResInput
                        value={field.value}
                        onValueChange={values => {
                          const { floatValue } = values
                          field.onChange(floatValue)
                        }}
                        customInput={CustomRequiredInput}
                        thousandSeparator={true}
                        prefix={'$'}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem mb={10}>
            <FormControl isInvalid={!!errors?.documents}>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.uploadProjectSOW`)} size="md">
                {t(`${NEW_PROJECT}.uploadProjectSOW`)}
              </FormLabel>
              <Controller
                name="documents"
                control={control}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => {
                  return (
                    <VStack alignItems="baseline">
                      <Box>
                        <ChooseFileField
                          isRequired
                          name={field.name}
                          value={field.value ? field.value?.name : t(`${NEW_PROJECT}.chooseFile`)}
                          isError={!!fieldState.error?.message}
                          acceptedFiles=".pdf,.png,.jpg,.jpeg"
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                            if (!['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                              setError(field.name, {
                                type: 'custom',
                                message: t(`${NEW_PROJECT}.fileFormat`),
                              })
                            }
                          }}
                          onClear={() => {
                            setValue(field.name, null)
                            clearErrors([field.name])
                          }}
                        ></ChooseFileField>
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </Box>
                    </VStack>
                  )
                }}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>

      <Flex display="flex" justifyContent="end" borderTop="1px solid #E2E8F0" pt="5">
        <Button variant="outline" size="md" colorScheme="brand" onClick={props.onClose}>
          {t(`${NEW_PROJECT}.cancel`)}
        </Button>
        <Button
          disabled={isProjectInformationNextButtonDisabled}
          colorScheme="CustomPrimaryColor"
          size="md"
          ml="3"
          onClick={props.setNextTab}
        >
          {t(`${NEW_PROJECT}.next`)}
        </Button>
      </Flex>
    </Flex>
  )
})
