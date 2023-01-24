import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { PROJECT_STATUS, STATUS } from 'features/common/status'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { SelectOption } from 'types/transaction.type'
import { datePickerFormat } from 'utils/date-time-utils'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useFieldsDisabled, useFieldsRequired, useWOAStartDateMin } from './hooks'

type ProjectManagerProps = {
  projectStatusSelectOptions: SelectOption[]
  projectTypeSelectOptions: SelectOption[]
}
const ProjectManagement: React.FC<ProjectManagerProps> = ({ projectStatusSelectOptions, projectTypeSelectOptions }) => {
  const dateToday = new Date().toISOString().split('T')[0]
  const { t } = useTranslation()
  const { isAdmin } = useUserRolesSelector()
  const [overrideProjectStatusOptions, setOverrideProjectStatusOptions] = useState<any>([])

  const {
    formState: { errors },
    control,
    register,
    clearErrors,
    setValue,
  } = useFormContext<ProjectDetailsFormValues>()

  const watchStatus = useWatch({ name: 'status', control })

  const minOfWoaStartDate = useWOAStartDateMin(control)

  const {
    isWOAStartDisabled,
    isWOACompletionDisabled,
    isClientWalkthroughDisabled,
    isClientDueDateDisabled,
    isClientSignOffDisabled,
    isClientStartDateDisabled,
  } = useFieldsDisabled(control)

  const {
    isWOACompletionDateRequired,
    isClientWalkthroughDateRequired,
    isWOAStartDateRequired,
    isClientSignOffDateRequired,
  } = useFieldsRequired(control)

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

  return (
    <Box>
      <Stack>
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
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
            <FormControl w="215px" isInvalid={!!errors.type}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.type`)}
              </FormLabel>
              <Controller
                control={control}
                name="type"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect {...field} options={projectTypeSelectOptions} selectProps={{ isBorderLeft: true }} />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.woNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="woNumber">
                {t(`project.projectDetails.woNumber`)}
              </FormLabel>
              <Input id="woNumber" {...register('woNumber')} autoComplete="off" />
              <FormErrorMessage>{errors.woNumber && errors.woNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.poNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="poNumber">
                {t(`project.projectDetails.poNumber`)}
              </FormLabel>
              <Input id="poNumber" {...register('poNumber')} autoComplete="off" />
              <FormErrorMessage>{errors.poNumber && errors.poNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl w="215px">
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.overrideStatus`)}
              </FormLabel>
              <Controller
                control={control}
                name="overrideProjectStatus"
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      {...field}
                      options={overrideProjectStatusOptions}
                      isDisabled={!isAdmin}
                      isOptionDisabled={option => option.disabled}
                      onChange={option => {
                        clearErrors()
                        field.onChange(option)
                      }}
                    />
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.projectName} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="projectName">
                {t(`project.projectDetails.projectName`)}
              </FormLabel>
              <Input placeholder="PC project 1" id="projectName" {...register('projectName')} autoComplete="off" />
              <FormErrorMessage>{errors.projectName && errors.projectName.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.clientStartDate}>
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
            <FormControl isInvalid={!!errors?.clientDueDate}>
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
            <FormControl isInvalid={!!errors?.woaStartDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.woaStart`)}
              </FormLabel>
              <Input
                type="date"
                isDisabled={isWOAStartDisabled}
                min={minOfWoaStartDate}
                {...register('woaStartDate', { required: isWOAStartDateRequired ? 'This is required' : false })}
              />
              <FormErrorMessage>{errors?.woaStartDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem outline="1px solid green">
            <FormControl isInvalid={!!errors?.woaCompletionDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.woaCompletion`)}
              </FormLabel>
              <Input
                type="date"
                isDisabled={isWOACompletionDisabled}
                variant={isWOACompletionDateRequired ? 'required-field' : 'outline'}
                max={isAdmin ? '' : dateToday}
                {...register('woaCompletionDate', {
                  required: isWOACompletionDateRequired ? 'This is required field.' : false,
                })}
              />
              <FormErrorMessage>{errors?.woaCompletionDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem outline="1px solid green">
            <FormControl isInvalid={!!errors?.clientWalkthroughDate}>
              <FormLabel variant="strong-label" size="md" whiteSpace="nowrap">
                {t(`project.projectDetails.clientWalkthrough`)}
              </FormLabel>
              <Input
                type="date"
                isDisabled={isClientWalkthroughDisabled}
                variant={isClientWalkthroughDateRequired ? 'required-field' : 'outline'}
                max={isAdmin ? '' : dateToday}
                {...register('clientWalkthroughDate', {
                  required: isClientWalkthroughDateRequired ? 'This is required field.' : false,
                })}
              />
              <FormErrorMessage>{errors?.clientWalkthroughDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.clientSignOffDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.clientSignOff`)}
              </FormLabel>
              <Input
                type="date"
                isDisabled={isClientSignOffDisabled}
                variant={isClientSignOffDateRequired ? 'required-field' : 'outline'}
                max={dateToday}
                {...register('clientSignOffDate', {
                  required: isClientSignOffDateRequired ? 'This is required field.' : false,
                })}
              />
              <FormErrorMessage>{errors?.clientSignOffDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  )
}

export default ProjectManagement
