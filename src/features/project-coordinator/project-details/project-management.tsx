import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

const ProjectManagement = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm()

  const onSubmit = FormValues => {
    console.log('FormValues', FormValues)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} id="project">
        <Stack minH="32vh">
          <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
            <GridItem>
              <FormControl w="215px" isInvalid={errors.status}>
                <FormLabel variant="strong-label" size="md">
                  Status
                </FormLabel>
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.type}>
                <FormLabel variant="strong-label" size="md">
                  Type
                </FormLabel>
                <Controller
                  control={control}
                  name="type"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.woNumber} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="woNumber">
                  WO Number
                </FormLabel>
                <Input
                  placeholder="222"
                  id="woNumber"
                  {...register('woNumber', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.woNumber && errors.woNumber.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.poNumber} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="poNumber">
                  PO Number
                </FormLabel>
                <Input
                  placeholder="3456"
                  id="poNumber"
                  {...register('poNumber', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.poNumber && errors.poNumber.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.projectName} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="projectName">
                  Project Number
                </FormLabel>
                <Input
                  placeholder="PC project 1"
                  id="projectName"
                  {...register('projectName', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.projectName && errors.projectName.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Start
                </FormLabel>
                <Input variant="reguired-field" type="date" />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Completion
                </FormLabel>
                <Input type="date" />
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Start
                </FormLabel>
                <Input variant="reguired-field" type="date" />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Due
                </FormLabel>
                <Input variant="reguired-field" type="date" />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md" whiteSpace="nowrap">
                  Client Click Walk Through
                </FormLabel>
                <Input type="date" />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Sign Off
                </FormLabel>
                <Input type="date" />
              </FormControl>
            </GridItem>
          </Grid>
        </Stack>
      </form>
    </Box>
  )
}

export default ProjectManagement
