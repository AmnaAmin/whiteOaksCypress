import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { SelectOption } from 'types/transaction.type'
import { useFieldsDisabled, useFieldsRequired, useWOAStartDateMin } from './hooks'

type ProjectManagerProps = {
  projectStatusSelectOptions: SelectOption[]
  projectTypeSelectOptions: SelectOption[]
}
const ProjectManagement: React.FC<ProjectManagerProps> = ({ projectStatusSelectOptions, projectTypeSelectOptions }) => {
  const dateToday = new Date().toISOString().split('T')[0]

  const {
    formState: { errors },
    control,
    register,
  } = useFormContext<ProjectDetailsFormValues>()

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

  return (
    <Box>
      <Stack>
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.status}>
              <FormLabel variant="strong-label" size="md">
                Status
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
                Type
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
                WO Number
              </FormLabel>
              <Input id="woNumber" {...register('woNumber')} autoComplete="off" />
              <FormErrorMessage>{errors.woNumber && errors.woNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.poNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="poNumber">
                PO Number
              </FormLabel>
              <Input id="poNumber" {...register('poNumber')} autoComplete="off" />
              <FormErrorMessage>{errors.poNumber && errors.poNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.projectName} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="projectName">
                Project Name
              </FormLabel>
              <Input placeholder="PC project 1" id="projectName" {...register('projectName')} autoComplete="off" />
              <FormErrorMessage>{errors.projectName && errors.projectName.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.clientStartDate}>
              <FormLabel variant="strong-label" size="md">
                Client Start
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
              <FormLabel variant="strong-label" size="md">
                Client Due
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
          <GridItem></GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.woaStartDate}>
              <FormLabel variant="strong-label" size="md">
                WOA Start
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
          <GridItem>
            <FormControl isInvalid={!!errors?.woaCompletionDate}>
              <FormLabel variant="strong-label" size="md">
                WOA Completion
              </FormLabel>
              <Input
                type="date"
                isDisabled={isWOACompletionDisabled}
                variant={isWOACompletionDateRequired ? 'required-field' : 'outline'}
                max={dateToday}
                {...register('woaCompletionDate', {
                  required: isWOACompletionDateRequired ? 'This is required field.' : false,
                })}
              />
              <FormErrorMessage>{errors?.woaCompletionDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.clientWalkthroughDate}>
              <FormLabel variant="strong-label" size="md" whiteSpace="nowrap">
                Client Walkthrough
              </FormLabel>
              <Input
                type="date"
                isDisabled={isClientWalkthroughDisabled}
                variant={isClientWalkthroughDateRequired ? 'required-field' : 'outline'}
                max={dateToday}
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
                Client Sign Off
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
