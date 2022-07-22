import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import { DatePickerInput } from 'components/react-hook-form-fields/date-picker'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { ProjectType } from 'types/project.type'
import { dateFormatter } from 'utils/date-time-utils'
import { usePCProject } from 'utils/pc-projects'

const Misc: React.FC<{ projectData: ProjectType; dataMisc?: any }> = props => {
  const { projectId } = useParams<{ projectId: string }>()
  const { projectData } = usePCProject(projectId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = formValues => {
    console.log('FormValues', formValues)
    reset()
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} id="misc">
        <Stack>
          <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Created
                </FormLabel>

                <DatePickerInput
                  value={projectData?.createdDate !== null ? dateFormatter(projectData?.createdDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Active
                </FormLabel>

                <DatePickerInput
                  value={projectData?.woaStartDate !== null ? dateFormatter(projectData?.woaStartDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Punch
                </FormLabel>

                <DatePickerInput
                  value={projectData?.clientSignoffDate !== null ? dateFormatter(projectData?.clientSignoffDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Closed
                </FormLabel>

                <DatePickerInput
                  value={projectData?.projectClosedDate !== null ? dateFormatter(projectData?.projectClosedDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Paid
                </FormLabel>

                <DatePickerInput
                  value={projectData?.clientPaidDate !== null ? dateFormatter(projectData?.clientPaidDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Collection
                </FormLabel>

                <DatePickerInput
                  value={projectData?.woaCompletionDate !== null  && projectData?.projectStatus === 'COLLECTION' ? dateFormatter(projectData?.woaCompletionDate) : 'mm/dd/yyyy'}
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
                  value={projectData?.woaBackdatedInvoiceDate !== null && projectData?.projectStatus === 'DISPUTED' ? dateFormatter(projectData?.woaBackdatedInvoiceDate) : 'mm/dd/yyyy'}
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

                <DatePickerInput
                  value={projectData?.woaPaidDate !== null ? dateFormatter(projectData?.woaPaidDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.dueDateVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="dueDateVariance">
                  Due Date Variance
                </FormLabel>
                <Input
                  value={projectData?.dueDateVariance as string}
                  isDisabled
                  id="dueDate"
                  {...register('dueDateVariance')}
                />
                <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.finalDateVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="finalDateVariance">
                  Pay Date Variance
                </FormLabel>

                <Input
                  value={projectData?.signoffDateVariance as string}
                  isDisabled
                  id="finalDate"
                  {...register('finalDateVariance')}
                />
                <FormErrorMessage>{errors.finalDateVariance && errors.finalDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.payVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="payVariance">
                  Pay Variance
                </FormLabel>
                <Input
                  value={projectData?.woaPayVariance as string}
                  isDisabled
                  id="payVariance"
                  {...register('payVariance')}
                />
                <FormErrorMessage>{errors.payVariance && errors.payVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
          </Grid>
        </Stack>
      </form>
    </Box>
  )
}

export default Misc
