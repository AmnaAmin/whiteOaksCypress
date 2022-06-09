import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import { DatePickerInput } from 'components/react-hook-form-fields/date-picker'
import React from 'react'
import { useForm } from 'react-hook-form'
import { dateFormatter } from 'utils/date-time-utils'

const Misc = (dataMisc: any) => {
  console.log(dataMisc?.dataMisc)

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
                  value={
                    dataMisc?.dataMisc?.createdDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.createdDate)
                      : 'mm/dd/yyyy'
                  }
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
                  value={
                    dataMisc?.dataMisc?.woaStartDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.woaStartDate)
                      : 'mm/dd/yyyy'
                  }
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
                  value={
                    dataMisc?.dataMisc?.clientSignoffDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.clientSignoffDate)
                      : 'mm/dd/yyyy'
                  }
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
                  value={
                    dataMisc?.dataMisc?.projectClosedDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.projectClosedDate)
                      : 'mm/dd/yyyy'
                  }
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
                  value={
                    dataMisc?.dataMisc?.clientPaidDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.clientPaidDate)
                      : 'mm/dd/yyyy'
                  }
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
                  value={
                    dataMisc?.dataMisc?.woaCompletionDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.woaCompletionDate)
                      : 'mm/dd/yyyy'
                  }
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
                  value={
                    dataMisc?.dataMisc?.woaBackdatedInvoiceDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.woaBackdatedInvoiceDate)
                      : 'mm/dd/yyyy'
                  }
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Invoice
                </FormLabel>

                <DatePickerInput
                  value={
                    dataMisc?.dataMisc?.woaInvoiceDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.woaInvoiceDate)
                      : 'mm/dd/yyyy'
                  }
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
                  value={
                    dataMisc?.dataMisc?.woaPaidDate !== null
                      ? dateFormatter(dataMisc?.dataMisc?.woaPaidDate)
                      : 'mm/dd/yyyy'
                  }
                  disable
                />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl isInvalid={errors.dueDateVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="dueDateVariance">
                  Due Date Variance
                </FormLabel>
                <Input
                  value={dataMisc?.dataMisc?.dueDateVariance}
                  isDisabled={true}
                  id="dueDate"
                  {...register('dueDateVariance')}
                />
                <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.finalDateVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="finalDateVariance">
                  Final Date Variance
                </FormLabel>

                <Input
                  value={dataMisc?.dataMisc?.signoffDateVariance}
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
                <Input
                  value={dataMisc?.dataMisc?.woaPayVariance}
                  isDisabled={true}
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
