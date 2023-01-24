import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack, VStack } from '@chakra-ui/react'
import ChooseFileField from 'components/choose-file/choose-file'
import ReactSelect from 'components/form/react-select'
import { CustomRequiredInput, NumberInput } from 'components/input/input'
import { PROJECT_STATUS, STATUS } from 'features/common/status'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ProjectDetailsFormValues } from 'types/estimate-details.types'
import { SelectOption } from 'types/transaction.type'
import { datePickerFormat } from 'utils/date-time-utils'
import { useFieldsDisabled, useWOAStartDateMin } from './hooks'

type ProjectManagerProps = {
  projectStatusSelectOptions: SelectOption[]
  projectTypeSelectOptions: SelectOption[]
}
const ProjectManagement: React.FC<ProjectManagerProps> = ({ projectStatusSelectOptions, projectTypeSelectOptions }) => {
  
  const { t } = useTranslation()
  
  const [, setOverrideProjectStatusOptions] = useState<any>([])

  const {
    formState: { errors },
    control,
    register,
    clearErrors,
    setValue,
    setError
  } = useFormContext<ProjectDetailsFormValues>()

  const watchStatus = useWatch({ name: 'status', control })

  const minOfWoaStartDate = useWOAStartDateMin(control)

  const {
    isClientDueDateDisabled,
    isClientStartDateDisabled,
  } = useFieldsDisabled(control)


  useEffect(() => {
    if (watchStatus?.label === STATUS.Active.toUpperCase()) {
      setValue('woaStartDate', datePickerFormat(new Date()))
    }
    if (watchStatus?.label === STATUS.New.toUpperCase()) {
      setValue('woaStartDate', 'mm/dd/yyyy')
    }
  }, [watchStatus?.label])

  // Setting Override Status dropdown on the basis of Project Status
  useEffect(() => {
    setOverrideProjectStatusOptions([])
    if (watchStatus !== undefined) {
      setOverrideProjectStatusOptions([])
      // Project Status -> Active
      if (watchStatus?.value === 8) {
        setOverrideProjectStatusOptions([PROJECT_STATUS.new])
      }
      // Project Status -> Punch
      else if (watchStatus?.value === 9) {
        setOverrideProjectStatusOptions([PROJECT_STATUS.new])
      }
      // Project Status -> Closed
      else if (watchStatus?.value === 10) {
        setOverrideProjectStatusOptions([PROJECT_STATUS.new, PROJECT_STATUS.active, PROJECT_STATUS.punch])
      }
      // Project Status -> Invoiced
      else if (watchStatus?.value === 11) {
        setOverrideProjectStatusOptions([
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          PROJECT_STATUS.punch,
          PROJECT_STATUS.closed,
        ])
      }
      // Project Status -> Paid
      else if (watchStatus?.value === 41) {
        setOverrideProjectStatusOptions([
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          PROJECT_STATUS.punch,
          PROJECT_STATUS.closed,
          PROJECT_STATUS.invoiced,
        ])
      }
      // Project Status -> Client Paid
      else if (watchStatus?.value === 72) {
        setOverrideProjectStatusOptions([
          PROJECT_STATUS.new,
          PROJECT_STATUS.active,
          PROJECT_STATUS.punch,
          PROJECT_STATUS.closed,
          PROJECT_STATUS.invoiced,
        ])
      }
    }
  }, [watchStatus])

  const [fileBlob, setFileBlob] = React.useState<Blob>()
  const readFile = (event: any) => {
    setFileBlob(event.target?.result?.split(',')?.[1])
  }

  const onFileChange = (document: File) => {
    if (!document) return

    const reader = new FileReader()
    reader.addEventListener('load', readFile)
    reader.readAsDataURL(document)
    setValue('estimateDocument', fileBlob as Blob)
  }

  return (
    <Box>
      <Stack>
        <Grid templateColumns="repeat(2,1fr)" rowGap="32px" columnGap="16px" w="908px">
          <GridItem>
            <FormControl isInvalid={!!errors.projectName} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="projectName">
                {t(`estimate.estimateDetails.estimateName`)}
              </FormLabel>
              <Input placeholder="PC project 1" id="projectName" {...register('projectName')} autoComplete="off" />
              <FormErrorMessage>{errors.projectName && errors.projectName.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.status}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.status`)}
              </FormLabel>
              <Controller
                control={control}
                name="status"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      {...field}
                      options={projectStatusSelectOptions}
                      isOptionDisabled={option => option.disabled}
                      onChange={option => {
                        clearErrors()
                        field.onChange(option)
                      }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          
          
          <GridItem>
            <FormControl isInvalid={!!errors?.clientStartDate} w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.clientStart`)}
              </FormLabel>
              <Input
                variant="required-field"
                type="date"
                isDisabled={isClientStartDateDisabled}
                required
                {...register('clientStartDate')}
              />
              <FormErrorMessage>{errors?.clientStartDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.clientDueDate} w="215px">
              <FormLabel variant="strong-label" size="md" noOfLines={1}>
                {t(`project.projectDetails.clientDue`)}
              </FormLabel>
              <Input
                variant="required-field"
                type="date"
                isDisabled={isClientDueDateDisabled}
                required
                min={minOfWoaStartDate}
                {...register('clientDueDate')}
              />
              <FormErrorMessage>{errors?.clientDueDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          
          
          <GridItem>
            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
               Amount
              </FormLabel>
              <Controller
                control={control}
                name="amount"
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberInput
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
              <FormErrorMessage>{errors?.clientSignOffDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel isTruncated  size="md">
                Upload Estimate
              </FormLabel>
              <Controller
                name="estimateDocument"
                control={control}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => {
                  return (
                    <VStack alignItems="baseline">
                      <Box>
                        <ChooseFileField
                          isRequired
                          name={field.name}
                          value={field.value ? field.value?.name : "Choose File"}
                          isError={!!fieldState.error?.message}
                          acceptedFiles=".pdf,.png,.jpg,.jpeg"
                          onChange={(file: any) => {
                            onFileChange(file)
                            field.onChange(file)
                            if (!['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                              setError(field.name, {
                                type: 'custom',
                                message: "Please select a valid file format (pdf, png, jpg, jpeg)",
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
      </Stack>
    </Box>
  )
}

export default ProjectManagement
