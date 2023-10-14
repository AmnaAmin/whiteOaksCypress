import { CheckIcon } from '@chakra-ui/icons'
import {
  Text,
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  HStack,
  Button,
  Divider,
  Link as LinkChakra,
  VStack,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { STATUS } from 'features/common/status'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ProjectDetailsFormValues, ProjectStatus } from 'types/project-details.types'
import { Project } from 'types/project.type'
import { SelectOption } from 'types/transaction.type'
import { datePickerFormat, dateFormat, dateISOFormatWithZeroTime } from 'utils/date-time-utils'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { useCurrentDate, useFieldsDisabled, useFieldsRequired, useWOAStartDateMin } from './hooks'
import { addDays } from 'date-fns'
import moment from 'moment'
import { capitalize } from 'utils/string-formatters'

type ProjectManagerProps = {
  projectStatusSelectOptions: SelectOption[]
  projectTypeSelectOptions: SelectOption[]
  projectOverrideStatusSelectOptions: any //SelectOption[]
  projectData: Project
  isReadOnly?: boolean
}
const ProjectManagement: React.FC<ProjectManagerProps> = ({
  projectStatusSelectOptions,
  projectTypeSelectOptions,
  projectOverrideStatusSelectOptions,
  projectData,
  isReadOnly,
}) => {
  const dateToday = new Date().toISOString().split('T')[0]
  const { t } = useTranslation()
  const { isAdmin } = useUserRolesSelector()

  useEffect(() => {
    if (isReadOnly) {
      Array.from(document.querySelectorAll("input")).forEach(input => {
        if (input.getAttribute("data-testid") !== "tableFilterInputField") {
            input.setAttribute("disabled", "true");
          }
      });
    };
  }, []);

  // const [overrideProjectStatusOptions, setOverrideProjectStatusOptions] = useState<any>([])
  // const [lastProjectStatus, setlastProjectStatus] = useState<any>('')

  const {
    formState: { errors },
    control,
    register,
    clearErrors,
    setValue,
  } = useFormContext<ProjectDetailsFormValues>()

  const watchStatus = useWatch({ name: 'status', control })
  const watchOverrideProjectStatus = useWatch({ name: 'overrideProjectStatus', control })
  const watchState = useWatch({ name: 'state', control })

  const minOfWoaStartDate = useWOAStartDateMin(control)
  const currentDate = useCurrentDate()
  const watchIsReconciled = useWatch({ name: 'isReconciled', control })

  const watchForm = useWatch({ control })
  const [lienDue, setLienDue] = useState<number | undefined>()

  const {
    isWOAStartDisabled,
    isWOACompletionDisabled,
    isClientWalkthroughDisabled,
    isClientDueDateDisabled,
    isClientSignOffDisabled,
    isClientStartDateDisabled,
    isReconcileDisabled,
  } = useFieldsDisabled(control)

  const {
    isWOACompletionDateRequired,
    isClientWalkthroughDateRequired,
    isWOAStartDateRequired,
    isClientSignOffDateRequired,
  } = useFieldsRequired(control)

  const sentenceCaseActive = STATUS.Active.charAt(0).toUpperCase() + STATUS.Active.slice(1).toLowerCase()

  const sentenceCaseNew = STATUS.New.charAt(0).toUpperCase() + STATUS.New.slice(1).toLowerCase()

  useEffect(() => {
    if (watchStatus?.label === sentenceCaseActive) {
      setValue('woaStartDate', datePickerFormat(new Date()))
    }
    if (watchStatus?.label === sentenceCaseNew) {
      setValue('woaStartDate', 'mm/dd/yyyy')
    }
  }, [watchStatus?.label])

  useEffect(() => {
    if (watchState) {
      setLienDue(watchState?.lienDue)
    }
  }, [watchState])

  useEffect(() => {
    if (
      watchStatus?.label === STATUS.Disputed.toUpperCase() ||
      watchOverrideProjectStatus?.label === STATUS.Disputed.toUpperCase()
    ) {
      setValue('previousStatus', projectData?.projectStatusId)
    }
  }, [watchStatus?.label, watchOverrideProjectStatus?.label, projectData?.projectStatusId])

  const redirectToEstimateDetails = pId => {
    window.location.href = `estimate-details/${pId}/`
  }
  const updateProjCloseDueDate = op => {
    //checking if project status selected is reconcile from dropdown then set its value accordingly
    if (op.value === ProjectStatus.Reconcile) {
      setValue('projectClosedDueDate', datePickerFormat(moment().add(2, 'd')))
    }
    //checking if project status selected is active,punch from dropdown then set Closed Due Date null
    if (op.value === ProjectStatus.Active || op.value === ProjectStatus.Punch) {
      setValue('projectClosedDueDate', null)
    }
  }

  const sentenceCaseReconcile = capitalize(STATUS.Reconcile)
  const overrideProjectStatusOptionsLowercase = projectOverrideStatusSelectOptions.map(option => {
    return { ...option, label: capitalize(option.label) }
  })
  return (
    <Box>
      <VStack gap="32px" alignItems={'flex-start'}>
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
                    <div data-testid="proj-status">
                      <ReactSelect
                        {...field}
                        isDisabled={isReadOnly}
                        options={projectStatusSelectOptions}
                        isOptionDisabled={option => option.disabled}
                        onChange={option => {
                          clearErrors()
                          updateProjCloseDueDate(option)
                          field.onChange(option)
                        }}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </div>
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
                    <ReactSelect {...field} options={projectTypeSelectOptions} selectProps={{ isBorderLeft: true }} isDisabled={isReadOnly} />
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
            <FormControl isInvalid={!!errors.claimNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="claimNumber">
                {t(`project.projectDetails.claimNumber`)}
              </FormLabel>
              <Input size="md" id="claimNumber" {...register('claimNumber')} autoComplete="off" />
              <FormErrorMessage>{errors.claimNumber && errors.claimNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.reoNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="reoNumber">
                {t(`project.projectDetails.reoNumber`)}
              </FormLabel>
              <Input size="md" id="reoNumber" {...register('reoNumber')} autoComplete="off" />
              <FormErrorMessage>{errors.reoNumber && errors.reoNumber.message}</FormErrorMessage>
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
                      options={overrideProjectStatusOptionsLowercase} // {overrideProjectStatusOptions}
                      isDisabled={!isAdmin}
                      isOptionDisabled={option => option.disabled}
                      onChange={option => {
                        setValue('projectClosedDueDate', null)

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
              <Input size="md" id="projectName" {...register('projectName')} autoComplete="off" />
              <FormErrorMessage>{errors.projectName && errors.projectName.message}</FormErrorMessage>
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
                onChange={e => {
                  const enteredDate = e.target.value
                  if (enteredDate < currentDate) {
                    setValue('disqualifiedRevenueFlag', true)
                    setValue('disqualifiedRevenueDate', datePickerFormat(moment(enteredDate).add(2, 'days')))
                  }
                }}
              />
              <FormErrorMessage>{errors?.clientDueDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.woaStartDate} w="215px">
              <FormLabel variant="strong-label" size="md" noOfLines={1}>
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
          <GridItem>
            <FormControl isInvalid={!!errors?.woaCompletionDate} w="215px">
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
                onChange={e => {
                  const woaCompletion = e.target.value
                  if (woaCompletion && woaCompletion !== '') {
                    const lienExpiryDate = addDays(
                      new Date(dateISOFormatWithZeroTime(woaCompletion) as string),
                      lienDue ?? 0,
                    )
                    setValue('lienExpiryDate', datePickerFormat(lienExpiryDate))
                  } else {
                    setValue('lienExpiryDate', null)
                  }
                  setValue('woaCompletionDate', datePickerFormat(woaCompletion))
                }}
              />
              <FormErrorMessage>{errors?.woaCompletionDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
          <GridItem>
            <FormControl isInvalid={!!errors?.clientWalkthroughDate} w="215px">
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
            <FormControl isInvalid={!!errors?.clientSignOffDate} w="215px">
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

          <GridItem>
            <FormControl isInvalid={!!errors?.projectClosedDueDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.closedDueDate`)}
              </FormLabel>
              <Input type="date" isDisabled={!isAdmin ?? true} {...register('projectClosedDueDate')} />
              <FormErrorMessage>{errors?.projectClosedDueDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
          <GridItem>
            <FormControl isInvalid={!!errors?.lienExpiryDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.lienRightsExpires`)}
              </FormLabel>
              <Input type="date" isDisabled={true} {...register('lienExpiryDate')} />
              <FormErrorMessage>{errors?.lienExpiryDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.lienFiled}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.lienFiled`)}
              </FormLabel>
              <Input type="date" {...register('lienFiled')} />
              <FormErrorMessage>{errors?.lienFiled?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t(`verifyProject`)}
              </FormLabel>
              <Checkbox
                colorScheme="PrimaryCheckBox"
                isChecked={watchIsReconciled === null ? false : watchIsReconciled}
                variant={'normal'}
                data-testid="notifyVendorCheckBox"
                disabled={isReconcileDisabled || watchStatus?.label !== sentenceCaseReconcile}
                size="md"
                {...register('isReconciled')}
              >
                <Text color="#4A5568" fontWeight="400" fontSize="14px">
                  {watchForm.verifiedDate
                    ? `${t(`verifyProjectDesc`)} ${watchForm.verifiedbyDesc} on ${dateFormat(watchForm.verifiedDate)}`
                    : ''}
                </Text>
              </Checkbox>
            </FormControl>
          </GridItem>

          {!!projectData?.estimateId && (
            <GridItem colSpan={2}>
              <FormControl>
                <HStack fontSize="16px" fontWeight={500}>
                  <Button variant="green" colorScheme="green" size="md" rightIcon={<CheckIcon />}>
                    {t(`project.projectDetails.estimated`)}
                  </Button>

                  <>
                    <Divider orientation={'vertical'} height="30px" borderLeft={'1px solid #CBD5E0'} />
                    <Text w="250px" lineHeight="22px" h="40px" color="gray.500" fontSize={'10px'} fontWeight={400}>
                      {t(`project.projectDetails.estimatedText`)}{' '}
                      <LinkChakra
                        color="brand.300"
                        fontWeight={'500'}
                        onClick={() => {
                          redirectToEstimateDetails(projectData?.estimateId)
                        }}
                      >
                        Id: E{projectData?.estimateId}
                      </LinkChakra>
                    </Text>
                  </>
                </HStack>
              </FormControl>
            </GridItem>
          )}
        </Grid>
      </VStack>
    </Box>
  )
}

export default ProjectManagement
