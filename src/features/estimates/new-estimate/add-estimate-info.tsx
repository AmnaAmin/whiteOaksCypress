import React from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Checkbox
} from '@chakra-ui/react'

import { Controller, useFormContext } from 'react-hook-form'
import { ProjectFormValues } from 'types/estimate.type'
import { useTranslation } from 'react-i18next'
import { CustomRequiredInput, NumberInput } from 'components/input/input'
import { NEW_ESTIMATE } from 'features/vendor/estimates/estimates.i18n'


type InfoProps = {
  setNextTab: () => void
  onClose: () => void
}

export const AddEstimateInfo = React.forwardRef((props: InfoProps, ref) => {
  const { t } = useTranslation()

  const {
    register,
    formState: { errors },
    control,
    watch
  } = useFormContext<ProjectFormValues>()

  //const isProjectInformationNextButtonDisabled = useProjectInformationNextButtonDisabled(control, errors)

  const dueInWatch  = watch("dueIn");
  
  return (
    <Flex flexDir="column">
      <Box px="6" minH="300px">
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} pb="3">
          <GridItem>
            <FormControl isInvalid={!!errors?.name}>
              <FormLabel isTruncated title={t(`${NEW_ESTIMATE}.name`)} size="md" htmlFor="name">
                {t(`${NEW_ESTIMATE}.name`)}
              </FormLabel>
              <Input id="name" {...register('name', {})} autoComplete="off" />
            </FormControl>
          </GridItem>

          <GridItem style={{ textAlign: 'left' }}>
            <FormControl>
              <FormLabel isTruncated title="Due In" size="md">
                Due In
              </FormLabel>
              <Input
                type="date"
                variant="required-field"
                {...register('dueIn', { required: 'This is required field' })}
              />
              <FormErrorMessage>{errors.dueIn && errors.dueIn?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          
        </Grid>
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
          <GridItem style={{ textAlign: 'left' }}>
            <FormControl>
              <FormLabel isTruncated title="Start Date" size="md">
                Start Date
              </FormLabel>
              <Input
                type="date"
                variant="required-field"
                {...register('clientStartDate', { required: 'This is required field' })}
              />
              <FormErrorMessage>{errors.clientStartDate && errors.clientStartDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel isTruncated title={t(`${NEW_ESTIMATE}.clientDueDate`)} size="md">
                Due Date
              </FormLabel>
              <Input
                type="date"
                variant="required-field"
                {...register('clientDueDate', { required: 'This is required field' })}
              />
              <FormErrorMessage>{errors.clientDueDate && errors.clientDueDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          
        </Grid>
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl>
              <Controller
                control={control}
                name="dueIn"
                render={ ( { field, fieldState } ) => (
                  <Checkbox mt="15%"
                    variant="normal"
                    colorScheme="PrimaryCheckBox"
                    isChecked={ field.value }
                    onChange={ e => field.onChange( e.target.checked ) }
                  >
                    Paid Amount
                  </Checkbox>
                ) }
              />
              
            </FormControl>
          </GridItem>
          { !!dueInWatch && (<GridItem>
            <FormControl isInvalid={!!errors?.sowOriginalContractAmount}>
              <FormLabel isTruncated title={t(`${NEW_ESTIMATE}.originalSOWAmount`)} size="md">
                Amount
              </FormLabel>
              <Controller
                control={control}
                name="sowOriginalContractAmount"
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberInput
                        value={field.value}
                        onValueChange={values => {
                          const { floatValue } = values
                          field.onChange(floatValue)
                        }}
                        customInput={CustomRequiredInput}
                        thousandSeparator={true}
                        prefix={'$'}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              />
            </FormControl>
          </GridItem> ) }
        </Grid>
      </Box>

      <Flex display="flex" justifyContent="end" borderTop="1px solid #E2E8F0" pt="5" px="6">
        <Button variant="outline" size="md" colorScheme="brand" onClick={props.onClose}>
          {t(`${NEW_ESTIMATE}.cancel`)}
        </Button>
        <Button
          //disabled={isProjectInformationNextButtonDisabled}
          colorScheme="brand"
          size="md"
          ml="3"
          onClick={props.setNextTab}
        >
          {t(`${NEW_ESTIMATE}.next`)}
        </Button>
      </Flex>
    </Flex>
  )
})
