import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import { DatePickerInput } from 'components/react-hook-form-fields/date-picker'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { ProjectType } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
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
                  value={projectData?.createdDate ? dateFormat(projectData?.createdDate as string) : 'mm/dd/yyyy'}
                  color='#718096'
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
                  value={projectData?.modifiedDate && projectData?.projectStatus !== 'NEW' ? dateFormat(projectData?.modifiedDate as string) : 'mm/dd/yyyy'}
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
                  value={projectData?.modifiedDate && projectData?.projectStatus !== 'ACTIVE' ? dateFormat(projectData?.modifiedDate as string) : 'mm/dd/yyyy'}
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
                  value={projectData?.projectClosedDate ? dateFormat(projectData?.projectClosedDate as string) : 'mm/dd/yyyy'}
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
                  value={projectData?.clientPaidDate ? dateFormat(projectData?.clientPaidDate as unknown as string) : 'mm/dd/yyyy'}
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

                <DatePickerInput //date has to be added, once the funcationality is implemented 
                  value={projectData?.woaCompletionDate && projectData?.projectStatus === 'COLLECTION' ? dateFormat(projectData?.woaCompletionDate) : 'mm/dd/yyyy'}
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

                <DatePickerInput //date has to be added, once the funcationality is implemented 
                  value={projectData?.woaBackdatedInvoiceDate && projectData?.projectStatus === 'DISPUTED' ? dateFormat(projectData?.woaBackdatedInvoiceDate) : 'mm/dd/yyyy'}
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
                  value={projectData?.woaPaidDate ? dateFormat(projectData?.woaPaidDate as string) : 'mm/dd/yyyy'}
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
