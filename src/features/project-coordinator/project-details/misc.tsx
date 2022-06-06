import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

const Misc = () => {
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

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Active
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Punch
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Closed
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Paid
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Collection
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Disputed
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Invoice
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Paid
                </FormLabel>

                <Input placeholder="mm/dd/yyyy" type="date" isDisabled={true} />

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
                <Input isDisabled={true} id="dueDate" {...register('dueDateVariance')} />
                <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.finalDateVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="finalDateVariance">
                  Final Date Variance
                </FormLabel>

                <Input isDisabled={true} id="finalDate" {...register('finalDateVariance')} />
                <FormErrorMessage>{errors.finalDateVariance && errors.finalDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.payVariance} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="payVariance">
                  Pay Variance
                </FormLabel>
                <Input isDisabled={true} id="payVariance" {...register('payVariance')} />
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
