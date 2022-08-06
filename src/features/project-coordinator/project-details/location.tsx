import { FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'

const Location: React.FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectDetailsFormValues>()

  const {
    isAddressDisabled,
    isCityDisabled,
    isZipDisabled,
    isGateCodeDisabled,
    isMarketDisabled,
    isLockBoxCodeDisabled,
  } = useFieldsDisabled(control)

  return (
    <Stack>
      <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
        <GridItem>
          <FormControl isInvalid={!!errors.address} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="address">
              Address
            </FormLabel>
            <Input isDisabled={isAddressDisabled} id="address" {...register('address')} />
            <FormErrorMessage>{errors?.address?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.city} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="city">
              City
            </FormLabel>
            <Input isDisabled={isCityDisabled} id="city" {...register('city')} />
            <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.state} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="state">
              State
            </FormLabel>
            <Input isDisabled={isCityDisabled} id="state" {...register('state')} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.zip} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="zip">
              Zip
            </FormLabel>
            <Input isDisabled={isZipDisabled} id="zip" {...register('zip')} />
            <FormErrorMessage>{errors.zip && errors.zip.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.market} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="market">
              Market
            </FormLabel>
            <Input isDisabled={isMarketDisabled} id="market" {...register('market')} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.gateCode} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="gateCode">
              Gate Code
            </FormLabel>
            <Input border=" 1px solid #E2E8F0" disabled={isGateCodeDisabled} id="gateCode" {...register('gateCode')} />
            <FormErrorMessage>{errors.gateCode && errors.gateCode.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.lockBoxCode} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="lockBoxCode">
              Lock Box Code
            </FormLabel>
            <Input
              border=" 1px solid #E2E8F0"
              disabled={isLockBoxCodeDisabled}
              id="lockBoxCode"
              {...register('lockBoxCode')}
            />
            <FormErrorMessage>{errors.lockBoxCode && errors.lockBoxCode.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.hoaContactPhoneNumber} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="hoaContactPhoneNumber">
              HOA Contact Phone
            </FormLabel>
            <Input border=" 1px solid #E2E8F0" id="hoaContactPhoneNumber" {...register('hoaContactPhoneNumber')} />
            <FormErrorMessage>{errors?.hoaContactPhoneNumber?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.hoaContactExtension} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="hoaContactExtension">
              Ext
            </FormLabel>
            <Input border=" 1px solid #E2E8F0" id="hoaContactExtension" {...register('hoaContactExtension')} />
            <FormErrorMessage>{errors?.hoaContactExtension?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.hoaContactEmail} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="hoaContactEmail">
              HOA Contact Email
            </FormLabel>
            <Input border=" 1px solid #E2E8F0" id="hoaContactEmail" {...register('hoaContactEmail')} />
            <FormErrorMessage>{errors.hoaContactEmail && errors.hoaContactEmail.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
      </Grid>
    </Stack>
  )
}

export default Location
