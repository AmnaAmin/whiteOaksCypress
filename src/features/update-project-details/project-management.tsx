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
  Link,
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
import { useCurrentDate, useFieldsDisabled, useFieldsRequired, useMinMaxDateSelector } from './hooks'
import { addDays } from 'date-fns'
import moment from 'moment'
import { capitalize } from 'utils/string-formatters'
import { useGetProjectFinancialOverview } from 'api/projects'
import { ConfirmationBox } from 'components/Confirmation'
import { usePaymentUserOptions } from 'api/pc-projects'

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
  const paymentOptions = usePaymentUserOptions()
  const [remainingArCheck, setRemainingArCheck] = useState<boolean>(false)
  const dateToday = new Date().toISOString().split('T')[0]
  const { t } = useTranslation()
  const { permissions } = useRoleBasedPermissions()
  const isAdmin = permissions?.includes('ALL')
  const canPreInvoice = permissions.some(p => ['PREINVOICED.EDIT', 'ALL'].includes(p))
  const projectStatusId: number = projectData?.projectStatusId || -1
  const { isAccounting } = useUserRolesSelector()
  const isAdminOrAccount = isAdmin || isAccounting
  useEffect(() => {
    if (isReadOnly) {
      Array.from(document.querySelectorAll('input')).forEach(input => {
        if (input.getAttribute('data-testid') !== 'tableFilterInputField') {
          input.setAttribute('disabled', 'true')
        }
      })
    }
  }, [])

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

  const { woaCompletionMin, woaStartMin } = useMinMaxDateSelector(control)

  const currentDate = useCurrentDate()
  const watchIsReconciled = useWatch({ name: 'isReconciled', control })
  const watchPreInvoiced = useWatch({ name: 'preInvoiced', control })
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
    isWOACompletionDateRequiredNew,
    isClientWalkthroughDateRequired,
    isClientWalkthroughDateRequiredNew,
    isWOAStartDateRequired,
    isClientSignOffDateRequired,
  } = useFieldsRequired(control)

  //invoiced, cancelled, client paid, paid, disputed
  const disabledPreIvoiceStatusIds = [
    ProjectStatus.Invoiced,
    ProjectStatus.Cancelled,
    ProjectStatus.ClientPaid,
    ProjectStatus.Paid,
    ProjectStatus.Disputed,
  ]

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

  const { financialOveriewTableData } = useGetProjectFinancialOverview(projectData?.id)
  const checkRemainingAR = projectStatus => {
    if (projectStatus.value === ProjectStatus.Invoiced && financialOveriewTableData[0]?.accountReceivable > 0)
      setRemainingArCheck(true)
    else setRemainingArCheck(false)
  }

  const sentenceCaseReconcile = capitalize(STATUS.Reconcile)
  const overrideProjectStatusOptionsLowercase = projectOverrideStatusSelectOptions.map(option => {
    return { ...option, label: capitalize(option.label) }
  })
  return (
    <Box>
      <VStack gap="32px" alignItems={'flex-start'}>
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="32px" w="908px">
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
                        classNamePrefix={'projectStatus'}
                        isDisabled={isReadOnly}
                        options={projectStatusSelectOptions}
                        isOptionDisabled={option => option.disabled}
                        onChange={option => {
                          checkRemainingAR(option)
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
                    <ReactSelect
                      {...field}
                      classNamePrefix={'projectType'}
                      options={projectTypeSelectOptions}
                      selectProps={{ isBorderLeft: true }}
                      isDisabled={isReadOnly}
                    />
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
              <Input
                id="woNumber"
                {...register('woNumber', {
                  maxLength: { value: 50, message: 'Character limit reached (maximum 50 characters)' },
                })}
                autoComplete="off"
                maxLength={50}
              />
              {watchForm?.woNumber && watchForm?.woNumber.length === 50 && (
                <Text color="red" fontSize="xs">
                  Please Use 50 Characters only.
                </Text>
              )}
              <FormErrorMessage>{errors.woNumber && errors.woNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.poNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="poNumber">
                {t(`project.projectDetails.poNumber`)}
              </FormLabel>
              <Input
                id="poNumber"
                {...register('poNumber', {
                  maxLength: { value: 50, message: 'Character limit reached (maximum 50 characters)' },
                })}
                autoComplete="off"
                maxLength={50}
              />
              {watchForm?.poNumber && watchForm?.poNumber.length === 50 && (
                <Text color="red" fontSize="xs">
                  Please Use 50 Characters only.
                </Text>
              )}
              <FormErrorMessage>{errors.poNumber && errors.poNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.claimNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="claimNumber">
                {t(`project.projectDetails.claimNumber`)}
              </FormLabel>
              <Input
                size="md"
                id="claimNumber"
                {...register('claimNumber', {
                  maxLength: { value: 50, message: 'Character limit reached (maximum 50 characters)' },
                })}
                autoComplete="off"
                maxLength={50}
              />
              {watchForm?.claimNumber && watchForm?.claimNumber.length === 50 && (
                <Text color="red" fontSize="xs">
                  Please Use 50 Characters only.
                </Text>
              )}
              <FormErrorMessage>{errors.claimNumber && errors.claimNumber.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.reoNumber} w="215px">
              <FormLabel variant="strong-label" size="md" htmlFor="reoNumber">
                {t(`project.projectDetails.reoNumber`)}
              </FormLabel>
              <Input
                size="md"
                id="reoNumber"
                {...register('reoNumber', {
                  maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
                })}
                autoComplete="off"
                maxLength={255}
              />
              {watchForm?.reoNumber && watchForm?.reoNumber.length === 255 && (
                <Text color="red" fontSize="xs">
                  Please Use 255 Characters only.
                </Text>
              )}
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
                      classNamePrefix={'overrideStatusProject'}
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
              <Input
                size="md"
                id="projectName"
                {...register('projectName', {
                  maxLength: { value: 255, message: 'Character limit reached (maximum 255 characters)' },
                })}
                autoComplete="off"
                maxLength={255}
              />
              {watchForm?.projectName && watchForm?.projectName.length === 255 && (
                <Text color="red" fontSize="xs">
                  Please Use 255 Characters only.
                </Text>
              )}
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
                min={woaStartMin}
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
                data-testid="woaStartDate"
                isDisabled={isWOAStartDisabled}
                min={woaStartMin}
                {...register('woaStartDate', {
                  required: isWOAStartDateRequired ? 'This is required' : false,
                  validate: value => {
                    if (!value) {
                      return true
                    }

                    return (
                      new Date(value) >= new Date(woaStartMin) ||
                      'WOA start date cannot be less than client start date.'
                    )
                  },
                })}
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
                variant={isWOACompletionDateRequired || isWOACompletionDateRequiredNew ? 'required-field' : 'outline'}
                max={isAdmin ? '' : dateToday}
                min={isAdmin ? '' : woaCompletionMin}
                {...register('woaCompletionDate', {
                  required:
                    isWOACompletionDateRequired || isWOACompletionDateRequiredNew ? 'This is required field.' : false,
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
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="32px" w="908px">
          <GridItem>
            <FormControl isInvalid={!!errors?.clientWalkthroughDate} w="215px">
              <FormLabel variant="strong-label" size="md" whiteSpace="nowrap">
                {t(`project.projectDetails.clientWalkthrough`)}
              </FormLabel>
              <Input
                type="date"
                isDisabled={isClientWalkthroughDisabled}
                variant={
                  isClientWalkthroughDateRequired || isClientWalkthroughDateRequiredNew ? 'required-field' : 'outline'
                }
                max={isAdmin ? '' : dateToday}
                {...register('clientWalkthroughDate', {
                  required:
                    isClientWalkthroughDateRequired || isClientWalkthroughDateRequiredNew
                      ? 'This is required field.'
                      : false,
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
            <FormControl w="215px" isInvalid={!!errors?.projectClosedDueDate}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.closedDueDate`)}
              </FormLabel>
              <Input type="date" isDisabled={!isAdmin ?? true} {...register('projectClosedDueDate')} />
              <FormErrorMessage>{errors?.projectClosedDueDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <VStack alignItems="start" fontSize="12px" fontWeight={400}>
              <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.paymentSource`)}
              </FormLabel>
              <FormControl >
                <HStack spacing="16px">
                  {paymentOptions?.map(payment => {
                    return (
                      <Controller
                        control={control}
                        name={`${payment.label}` as any}
               
                        render={({ field, fieldState }) => (
                          <>
                            <div data-testid={payment.label}>
                              <Checkbox
                              size='md'
                                colorScheme="brand"
                                isChecked={field.value as boolean}
                                onChange={event => {
                                  const isChecked = event.target.checked
                                  field.onChange(isChecked)
                                  
                                }}
                                isDisabled={!isAdminOrAccount}
                                mr="2px"
                              >
                                {t(payment.label)}
                              </Checkbox>
                            </div>
                          </>
                        )}
                      />
                    )
                  })}
                </HStack>
              </FormControl>
            </VStack>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="32px" w="908px">
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
        <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="32px" w="908px">
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

          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Pre Invoice
              </FormLabel>
              <Checkbox
                colorScheme="PrimaryCheckBox"
                variant={'normal'}
                isChecked={watchPreInvoiced === null ? false : watchPreInvoiced}
                data-testid="preInvoiceCheckbox"
                disabled={disabledPreIvoiceStatusIds.includes(projectStatusId) || !canPreInvoice}
                size="md"
                {...register('preInvoiced')}
              ></Checkbox>
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
                      <Link
                        data-testid="estimate_id"
                        color="brand.300"
                        fontWeight={'500'}
                        href={`estimate-details/${projectData?.estimateId}/`}
                      >
                        Id: E{projectData?.estimateId}
                      </Link>
                    </Text>
                  </>
                </HStack>
              </FormControl>
            </GridItem>
          )}
        </Grid>
      </VStack>
      <ConfirmationBox
        title={t(`remaininAR`)}
        content={t(`remainARAlert`)}
        isOpen={remainingArCheck}
        onClose={() => setRemainingArCheck(false)}
        onConfirm={() => setRemainingArCheck(false)}
        showNoButton={false}
        yesButtonText={t(`acknowledge`)}
      />
    </Box>
  )
}

export default ProjectManagement
