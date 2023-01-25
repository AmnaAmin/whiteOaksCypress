import { FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import Select from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'

type LocationProps = {
  stateSelectOptions: SelectOption[]
  marketSelectOptions: SelectOption[]
}

const Location: React.FC<LocationProps> = ({ stateSelectOptions, marketSelectOptions }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectDetailsFormValues>()

  const {
    isAddressDisabled,
    isCityDisabled,
    isZipDisabled,
    isStateDisabled,
    isGateCodeDisabled,
    isMarketDisabled,
    isLockBoxCodeDisabled,
  } = useFieldsDisabled(control)

  const { t } = useTranslation()

  return (
    <Stack>
      <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
        <GridItem>
          <FormControl isInvalid={!!errors.address} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="address">
              {t(`project.projectDetails.address`)}
            </FormLabel>
            <Input isDisabled={isAddressDisabled} id="address" {...register('address')} />
            <FormErrorMessage>{errors?.address?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.city} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="city">
              {t(`project.projectDetails.city`)}
            </FormLabel>
            <Input isDisabled={isCityDisabled} id="city" {...register('city')} />
            <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.state} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="state">
              {t(`project.projectDetails.state`)}
            </FormLabel>
            <Controller
              control={control}
              name={`state`}
              rules={{ required: 'This is required field' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={stateSelectOptions}
                    size="md"
                    value={field.value}
                    isDisabled={isStateDisabled}
                    selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                    onChange={option => {
                      field.onChange(option)
                    }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
            {/* <Input isDisabled={isCityDisabled} id="state" {...register('state')} /> */}
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.zip} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="zip">
              {t(`project.projectDetails.zip`)}
            </FormLabel>
            <Input isDisabled={isZipDisabled} id="zip" {...register('zip')} />
            <FormErrorMessage>{errors.zip && errors.zip.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.market} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="market">
              {t(`project.projectDetails.market`)}
            </FormLabel>
            {/* <Input isDisabled={isMarketDisabled} id="market" {...register('market')} /> */}
            <Controller
              control={control}
              name={`market`}
              rules={{ required: 'This is required field' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={marketSelectOptions}
                    size="md"
                    value={field.value}
                    selectProps={{ isBorderLeft: true, menuHeight: '120px' }}
                    isDisabled={isMarketDisabled}
                    onChange={option => {
                      field.onChange(option)
                    }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.gateCode} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="gateCode">
              {t(`project.projectDetails.gateCode`)}
            </FormLabel>
            <Input border=" 1px solid #E2E8F0" disabled={isGateCodeDisabled} id="gateCode" {...register('gateCode')} />
            <FormErrorMessage>{errors.gateCode && errors.gateCode.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.lockBoxCode} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="lockBoxCode" noOfLines={1}>
              {t(`project.projectDetails.lockBoxCode`)}
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
            <FormLabel variant="strong-label" size="md" htmlFor="hoaContactPhoneNumber" noOfLines={1}>
              {t(`project.projectDetails.hoaContactPhone`)}
            </FormLabel>
            <Controller
              control={control}
              name="hoaContactPhoneNumber"
              render={({ field, fieldState }) => {
                return (
                  <>
                    <NumberFormat
                      customInput={Input}
                      value={field.value}
                      onChange={e => field.onChange(e)}
                      format="(###)-###-####"
                      mask="_"
                      placeholder="(___)-___-____"
                    />
                    <FormErrorMessage>{fieldState?.error?.message}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.hoaContactExtension} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="hoaContactExtension">
              {t(`project.projectDetails.ext`)}
            </FormLabel>
            <Input border=" 1px solid #E2E8F0" id="hoaContactExtension" {...register('hoaContactExtension')} />
            <FormErrorMessage>{errors?.hoaContactExtension?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.hoaContactEmail} w="215px">
            <FormLabel variant="strong-label" size="md" htmlFor="hoaContactEmail" noOfLines={1}>
              {t(`project.projectDetails.hoaContactEmail`)}
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
