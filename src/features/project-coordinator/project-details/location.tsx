import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

const Location: React.FC<{ height?: string }> = props => {
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
      <form onSubmit={handleSubmit(onSubmit)} id="location">
        <Stack minH={props.height ? '290px' : '430px'}>
          <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
            <GridItem>
              <FormControl isInvalid={errors.address} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="address">
                  Address
                </FormLabel>
                <Input
                  variant="required-field"
                  placeholder="2037 SW TRENTON LN"
                  isDisabled={true}
                  id="address"
                  {...register('address', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.city} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="city">
                  City
                </FormLabel>
                <Input
                  variant="required-field"
                  placeholder="East Point"
                  isDisabled={true}
                  id="city"
                  {...register('city', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.city && errors.city.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.state} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="state">
                  State
                </FormLabel>
                <Input
                  variant="required-field"
                  placeholder="NC"
                  isDisabled={true}
                  id="state"
                  {...register('state', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.state && errors.state.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.zip} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="zip">
                  Zip
                </FormLabel>
                <Input
                  placeholder="28164"
                  isDisabled={true}
                  id="zip"
                  {...register('zip', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.zip && errors.zip.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.market} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="market">
                  Market
                </FormLabel>
                <Input
                  variant="required-field"
                  placeholder="Atlanta"
                  isDisabled={true}
                  id="market"
                  {...register('market', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.market && errors.market.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.gateCode} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="gateCode">
                  Gate Code
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  placeholder="2334"
                  id="gateCode"
                  {...register('gateCode', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.gateCode && errors.gateCode.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.lockBoxCode} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="lockBoxCode">
                  Lock Box Code
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  placeholder="5678"
                  id="lockBoxCode"
                  {...register('lockBoxCode', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.lockBoxCode && errors.lockBoxCode.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl isInvalid={errors.hoaContactPhone} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="hoaContactPhone">
                  HOA Contact Phone
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  id="hoaContactPhone"
                  {...register('hoaContactPhone', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.hoaContactPhone && errors.hoaContactPhone.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.ext} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="ext">
                  Ext
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  id="ext"
                  {...register('ext', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.hoaContactEmail} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="hoaContactEmail">
                  HOA Contact Email
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  id="hoaContactEmail"
                  {...register('hoaContactEmail', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.hoaContactEmail && errors.hoaContactEmail.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
          </Grid>
        </Stack>
      </form>
    </Box>
  )
}

export default Location
