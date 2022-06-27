import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import { DatePickerInput } from 'components/react-hook-form-fields/date-picker'
import React from 'react'
import { useForm } from 'react-hook-form'
import { dateFormatter } from 'utils/date-time-utils'

const Misc = (dataMisc: any) => {
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
  const createdDate = dataMisc?.dataMisc?.createdDate
  const woaStartDate = dataMisc?.dataMisc?.woaStartDate
  const clientSignoffDate = dataMisc?.dataMisc?.clientSignoffDate
  const projectClosedDate = dataMisc?.dataMisc?.projectClosedDate
  const clientPaidDate = dataMisc?.dataMisc?.clientPaidDate
  const woaCompletionDate = dataMisc?.dataMisc?.woaCompletionDate
  const woaBackdatedInvoiceDate = dataMisc?.dataMisc?.woaBackdatedInvoiceDate
  // const woaInvoiceDate = dataMisc?.dataMisc?.woaInvoiceDate
  const woaPaidDate = dataMisc?.dataMisc?.woaPaidDate
  const dueDateVariance = dataMisc?.dataMisc?.dueDateVariance
  const signoffDateVariance = dataMisc?.dataMisc?.signoffDateVariance
  const woaPayVariance = dataMisc?.dataMisc?.woaPayVariance

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

                <DatePickerInput value={createdDate !== null ? dateFormatter(createdDate) : 'mm/dd/yyyy'} disable />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Active
                </FormLabel>

                <DatePickerInput value={woaStartDate !== null ? dateFormatter(woaStartDate) : 'mm/dd/yyyy'} disable />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Punch
                </FormLabel>

                <DatePickerInput
                  value={clientSignoffDate !== null ? dateFormatter(clientSignoffDate) : 'mm/dd/yyyy'}
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
                  value={projectClosedDate !== null ? dateFormatter(projectClosedDate) : 'mm/dd/yyyy'}
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
                  value={clientPaidDate !== null ? dateFormatter(clientPaidDate) : 'mm/dd/yyyy'}
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
                  value={woaCompletionDate !== null ? dateFormatter(woaCompletionDate) : 'mm/dd/yyyy'}
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
                  value={woaBackdatedInvoiceDate !== null ? dateFormatter(woaBackdatedInvoiceDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            {/* Figma change? */}

            {/* <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Invoice
                </FormLabel>

                <DatePickerInput
                  value={woaInvoiceDate !== null ? dateFormatter(woaInvoiceDate) : 'mm/dd/yyyy'}
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem> */}
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Paid
                </FormLabel>

                <DatePickerInput value={woaPaidDate !== null ? dateFormatter(woaPaidDate) : 'mm/dd/yyyy'} disable />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.dueDateVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="dueDateVariance">
                  Due Date Variance
                </FormLabel>
                <Input value={dueDateVariance} isDisabled={true} id="dueDate" {...register('dueDateVariance')} />
                <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.finalDateVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="finalDateVariance">
                  Pay Date Variance
                </FormLabel>

                <Input
                  value={signoffDateVariance}
                  isDisabled={true}
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
                <Input value={woaPayVariance} isDisabled={true} id="payVariance" {...register('payVariance')} />
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
