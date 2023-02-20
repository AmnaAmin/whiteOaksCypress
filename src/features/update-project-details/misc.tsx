import { FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import { DatePickerInput } from 'components/react-hook-form-fields/date-picker'
import { STATUS } from 'features/common/status'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { dateFormat } from 'utils/date-time-utils'

const Misc: React.FC = () => {
  const {
    register,
    getValues,
    formState: { errors },
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

  const { t } = useTranslation()

  return (
    <Stack>
      <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
        <GridItem>
          <FormControl>
            <FormLabel datatest-id='abc' variant="strong-label" size="md">
              {t(`project.projectDetails.created`)}
            </FormLabel>

            <DatePickerInput value={dateCreated ? dateFormat(dateCreated) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.active`)}
            </FormLabel>

            <DatePickerInput value={activeDate ? dateFormat(activeDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.punch`)}
            </FormLabel>

            <DatePickerInput value={punchDate ? dateFormat(punchDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.closed`)}
            </FormLabel>

            <DatePickerInput value={closedDate ? dateFormat(closedDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.clientPaid`)}
            </FormLabel>

            <DatePickerInput value={clientPaidDate ? dateFormat(clientPaidDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.collection`)}
            </FormLabel>

            <DatePickerInput
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

            <DatePickerInput value={disputedDate ? dateFormat(disputedDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t(`project.projectDetails.woaPaid`)}
            </FormLabel>

            <DatePickerInput value={woaPaidDate ? dateFormat(woaPaidDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.dueDateVariance} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="dueDateVariance" noOfLines={1}>
              {t(`project.projectDetails.dueDateVariance`)}
            </FormLabel>
            <Input datatest-id='due-Date' value={dueDateVariance as number} isDisabled id="dueDate" {...register('dueDateVariance')} />
            <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.payDateVariance} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="payDateVariance" noOfLines={1}>
              {t(`project.projectDetails.payDateVariance`)}
            </FormLabel>

            <Input datatest-id='pay-Variance' value={payDateVariance as number} isDisabled id="payDateVariance" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="payVariance">
              {t(`project.projectDetails.payVariance`)}
            </FormLabel>
            <Input value={payVariance as number} isDisabled id="payVariance" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="reconcileDate">
              {t(`project.projectDetails.reconcileDate`)}
            </FormLabel>
            <DatePickerInput value={reconcileDate ? dateFormat(reconcileDate) : 'mm/dd/yyyy'} disable />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="verifiedDate">
              {t(`project.projectDetails.verifiedDate`)}
            </FormLabel>
            <DatePickerInput value={verifiedDate ? dateFormat(verifiedDate) : 'mm/dd/yyyy'} disable />
          </FormControl>          
        </GridItem>
      </Grid>
    </Stack>
  )
}

export default Misc
