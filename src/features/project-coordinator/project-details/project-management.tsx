import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Stack,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const labelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'gray.600',
}

const inputTextStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'blackAlpha.500',
}

const ProjectManagement = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      woNumber: null,
      poNumber: null,
      projectName: null,
      woaStart: null,
      woaCompletion: null,
      clientStart: null,
      clientDue: null,
      clientClickWalkThrough: null,
      clientSignOff: null,
    },
  })

  const onSubmit = FormValues => {
    console.log('FormValues', FormValues)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack minH="35vh" spacing={14}>
          <Grid templateColumns="repeat(4,1fr)" rowGap={10} columnGap={4} w="908px">
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Status</FormLabel>
                <ReactSelect />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Type</FormLabel>
                <ReactSelect selectProps={{ isBorderLeft: true }} />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.woNumber} w="215px">
                <FormLabel sx={labelStyle} htmlFor="woNumber">
                  WO Number
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
                <FormLabel sx={labelStyle} htmlFor="poNumber">
                  PO Number
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Override Status</FormLabel>
                <ReactSelect />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.projectName} w="215px">
                <FormLabel sx={labelStyle} htmlFor="projectName">
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
                <FormLabel sx={labelStyle}>WOA Start</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    borderLeft: '2px solid #4E87F8',
                  }}
                  errorMessage={errors?.woaStart?.message}
                  label={''}
                  name={`woaStart`}
                  control={control}
                  rules={{ required: 'This is required field' }}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    height: '40px',
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>WOA Completion</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    borderLeft: '2px solid #4E87F8',
                  }}
                  errorMessage={errors?.woaCompletion?.message}
                  label={''}
                  name={`woaCompletion`}
                  rules={{ required: 'This is required field' }}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    height: '40px',
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Client Start</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    borderLeft: '2px solid #4E87F8',
                  }}
                  errorMessage={errors?.clientStart?.message}
                  label={''}
                  name={`clientStart`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  rules={{ required: 'This is required field' }}
                  style={{
                    width: '215px',
                    height: '40px',
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Client Due</FormLabel>

                <FormDatePicker
                  elementStyle={{
                    borderLeft: '2px solid #4E87F8',
                  }}
                  errorMessage={errors?.clientDue?.message}
                  label={''}
                  name={`clientDue`}
                  control={control}
                  rules={{ required: 'This is required field' }}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    height: '40px',
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle} whiteSpace="nowrap">
                  Client Click Walk Through
                </FormLabel>
                <FormDatePicker
                  elementStyle={{
                    borderLeft: '2px solid #4E87F8',
                  }}
                  errorMessage={errors?.clientClickWalkThrough?.message}
                  label={''}
                  name={`clientClickWalkThrough`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  rules={{ required: 'This is required field' }}
                  style={{
                    width: '215px',
                    height: '40px',
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Client Sign Off</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    borderLeft: '2px solid #4E87F8',
                  }}
                  errorMessage={errors?.clientSignOff?.message}
                  label={''}
                  name={`clientSignOff`}
                  rules={{ required: 'This is required field' }}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    height: '40px',
                  }}
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Stack>
            <Box pr="8">
              <Divider border="1px solid" />
            </Box>
            <Box w="100%" pb="3">
              <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" size="lg" type="submit">
                Save
              </Button>
            </Box>
          </Stack>
        </Stack>
      </form>
    </Box>
  )
}

export default ProjectManagement
