import { Checkbox, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import { DatePickerInput } from 'components/react-hook-form-fields/date-picker'
import { STATUS } from 'features/common/status'

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'

const Misc: React.FC = () => {
  const {
    register,
    getValues,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<ProjectDetailsFormValues>()

  const {
    dateCreated,
    activeDate,
    punchDate,
    closedDate,
    clientPaidDate,
    collectionDate,
    disputedDate,
    woaPaidDate,
    dueDateVariance,
    payDateVariance,
    payVariance,
    status,
    reconcileDate,
    verifiedDate,
  } = getValues()
  //const { isAdmin } = useUserRolesSelector()
  const showRevenue = false
  const { t } = useTranslation()

  return (
    <Stack>
      <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.created`)}
            </FormLabel>

            <DatePickerInput
              testId="proj-created"
              value={dateCreated ? dateFormat(dateCreated) : 'mm/dd/yyyy'}
              disable
            />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.active`)}
            </FormLabel>

            <DatePickerInput testId="proj-active" value={activeDate ? dateFormat(activeDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.punch`)}
            </FormLabel>

            <DatePickerInput testId="proj-punch" value={punchDate ? dateFormat(punchDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.closed`)}
            </FormLabel>

            <DatePickerInput testId="proj-closed" value={closedDate ? dateFormat(closedDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.clientPaid`)}
            </FormLabel>

            <DatePickerInput
              testId="proj-clientPaid"
              value={clientPaidDate ? dateFormat(clientPaidDate) : 'mm/dd/yyyy'}
              disable
            />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.collection`)}
            </FormLabel>

            <DatePickerInput
              testId="proj-collection"
              value={collectionDate && status?.value === STATUS.Collection ? dateFormat(collectionDate) : 'mm/dd/yyyy'}
              disable
            />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.disputed`)}
            </FormLabel>

            <DatePickerInput
              testId="proj-disputed"
              value={disputedDate ? dateFormat(disputedDate) : 'mm/dd/yyyy'}
              disable
            />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.woaPaid`)}
            </FormLabel>

            <DatePickerInput
              testId="proj-woa-Paid"
              value={woaPaidDate ? dateFormat(woaPaidDate) : 'mm/dd/yyyy'}
              disable
            />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.dueDateVariance} w="215px">
            <FormLabel
              datatest-id="proj-dueDate"
              variant="strong-label"
              size="md"
              htmlFor="dueDateVariance"
              noOfLines={1}
            >
              {t(`project.projectDetails.dueDateVariance`)}
            </FormLabel>
            <Input
              datatest-id="due-Date"
              value={dueDateVariance as number}
              isDisabled
              id="dueDate"
              {...register('dueDateVariance')}
            />
            <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.payDateVariance} w="215px">
            <FormLabel
              datatest-id="proj-paidDate"
              variant="strong-label"
              size="md"
              htmlFor="payDateVariance"
              noOfLines={1}
            >
              {t(`project.projectDetails.payDateVariance`)}
            </FormLabel>

            <Input datatest-id="pay-Variance" value={payDateVariance as number} isDisabled id="payDateVariance" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="payVariance">
              {t(`project.projectDetails.payVariance`)}
            </FormLabel>
            <Input value={payVariance as number} isDisabled id="payVariance" datatest-id="proj-payVar" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="reconcileDate">
              {t(`project.projectDetails.reconcileDate`)}
            </FormLabel>
            <DatePickerInput
              testId="proj-Reconcile"
              value={reconcileDate ? dateFormat(reconcileDate) : 'mm/dd/yyyy'}
              disable
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="verifiedDate">
              {t(`project.projectDetails.verifiedDate`)}
            </FormLabel>
            <DatePickerInput
              testId="proj-verified"
              value={verifiedDate ? dateFormat(verifiedDate) : 'mm/dd/yyyy'}
              disable
            />
          </FormControl>
        </GridItem>
        {showRevenue && (
          <>
            <GridItem>
              <FormControl w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="disqualifiedRevenueDate">
                  {t(`project.projectDetails.disqualifiedRevenueDate`)}
                </FormLabel>
                <Input type="date" {...register('disqualifiedRevenueDate')} />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl maxW="500px">
                <FormLabel variant="strong-label" size="md">
                  {t(`project.projectDetails.verifyRevenue`)}
                </FormLabel>

                <Controller
                  name={`disqualifiedRevenueFlag`}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Checkbox
                        pt={2}
                        //checked={value!}
                        colorScheme="PrimaryCheckBox"
                        variant={'normal'}
                        data-testid="disqualify_CheckBox"
                        size="md"
                        onChange={e => {
                          onChange(e)
                          e.target.checked
                            ? setValue('disqualifiedRevenueDate', datePickerFormat(new Date()))
                            : setValue('disqualifiedRevenueDate', null)
                        }}
                        isChecked={!!value}
                      ></Checkbox>
                    )
                  }}
                />
              </FormControl>
            </GridItem>
          </>
        )}
      </Grid>
    </Stack>
  )
}

export default Misc
