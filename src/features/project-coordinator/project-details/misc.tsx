import { FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import { DatePickerInput } from 'components/react-hook-form-fields/date-picker'
import { STATUS } from 'features/projects/status'
import React from 'react'
import { useFormContext } from 'react-hook-form'
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
  } = getValues()

  return (
    <Stack>
      <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Created
            </FormLabel>

            <DatePickerInput value={dateCreated ? dateFormat(dateCreated) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Active
            </FormLabel>

            <DatePickerInput value={activeDate ? dateFormat(activeDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Punch
            </FormLabel>

            <DatePickerInput value={punchDate ? dateFormat(punchDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Closed
            </FormLabel>

            <DatePickerInput value={closedDate ? dateFormat(closedDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Client Paid
            </FormLabel>

            <DatePickerInput value={clientPaidDate ? dateFormat(clientPaidDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Collection
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
              Disputed
            </FormLabel>

            <DatePickerInput
              value={disputedDate && status?.value === STATUS.Dispute ? dateFormat(disputedDate) : 'mm/dd/yyyy'}
              disable
            />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              WOA Paid
            </FormLabel>

            <DatePickerInput value={woaPaidDate ? dateFormat(woaPaidDate) : 'mm/dd/yyyy'} disable />

            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.dueDateVariance} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="dueDateVariance">
              Due Date Variance
            </FormLabel>
            <Input value={dueDateVariance as number} isDisabled id="dueDate" {...register('dueDateVariance')} />
            <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.payDateVariance} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="payDateVariance">
              Pay Date Variance
            </FormLabel>

            <Input value={payDateVariance as number} isDisabled id="payDateVariance" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="payVariance">
              Pay Variance
            </FormLabel>
            <Input value={payVariance as number} isDisabled id="payVariance" />
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
      </Grid>
    </Stack>
  )
}

export default Misc
