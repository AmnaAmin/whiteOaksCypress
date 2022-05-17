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

function Misc() {
  const [changedDateFields, setChangeDateFields] = useState<string[]>([])
  const {
    register,
    control,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack minH="51vh" spacing={14}>
          <Grid templateColumns="repeat(4,1fr)" rowGap={7} columnGap={4} w="908px">
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Created</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.created && errors.created?.message}
                  label={''}
                  name={`created`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="created"
                  onChange={e => {
                    if (!changedDateFields.includes('created')) {
                      setChangeDateFields([...changedDateFields, 'created'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Active</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.active && errors.active?.message}
                  label={''}
                  name={`active`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="active"
                  onChange={e => {
                    if (!changedDateFields.includes('active')) {
                      setChangeDateFields([...changedDateFields, 'active'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Punch</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.punch && errors.punch?.message}
                  label={''}
                  name={`punch`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="punch"
                  onChange={e => {
                    if (!changedDateFields.includes('punch')) {
                      setChangeDateFields([...changedDateFields, 'punch'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Closed</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    borderLeft: '2px solid #4E87F8',
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.coiWcExpDate && errors.coiWcExpDate?.message}
                  label={''}
                  name={`coiWcExpDate`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="coiWcExpDate"
                  onChange={e => {
                    if (!changedDateFields.includes('coiWcExpDate')) {
                      setChangeDateFields([...changedDateFields, 'coiWcExpDate'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Client Paid</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.clientPaid && errors.clientPaid?.message}
                  label={''}
                  name={`clientPaid`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="clientPaid"
                  onChange={e => {
                    if (!changedDateFields.includes('clientPaid')) {
                      setChangeDateFields([...changedDateFields, 'clientPaid'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Collection</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.collection && errors.collection?.message}
                  label={''}
                  name={`collection`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="collection"
                  onChange={e => {
                    if (!changedDateFields.includes('collection')) {
                      setChangeDateFields([...changedDateFields, 'collection'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Disputed</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.disputed && errors.disputed?.message}
                  label={''}
                  name={`disputed`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="disputed"
                  onChange={e => {
                    if (!changedDateFields.includes('disputed')) {
                      setChangeDateFields([...changedDateFields, 'disputed'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>WOA Invoice</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.woaInvoice && errors.woaInvoice?.message}
                  label={''}
                  name={`woaInvoice`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="woaInvoice"
                  onChange={e => {
                    if (!changedDateFields.includes('woaInvoice')) {
                      setChangeDateFields([...changedDateFields, 'woaInvoice'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>WOA Paid</FormLabel>
                <FormDatePicker
                  elementStyle={{
                    backgroundColor: '#EDF2F7',
                  }}
                  errorMessage={errors.woaPaid && errors.woaPaid?.message}
                  label={''}
                  name={`woaPaid`}
                  control={control}
                  placeholder="mm/dd/yyyy"
                  style={{
                    width: '215px',
                    fontSize: '14px',
                  }}
                  testId="woaPaid"
                  onChange={e => {
                    if (!changedDateFields.includes('woaPaid')) {
                      setChangeDateFields([...changedDateFields, 'woaPaid'])
                    }
                  }}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl isInvalid={errors.dueDateVariance} w="215px">
                <FormLabel sx={labelStyle} htmlFor="dueDateVariance">
                  Due Date Variance
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  bg="#EDF2F7"
                  id="dueDate"
                  {...register('dueDateVariance', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.finalDateVariance} w="215px">
                <FormLabel sx={labelStyle} htmlFor="finalDateVariance">
                  Final Date Variance
                </FormLabel>

                <Input
                  sx={inputTextStyle}
                  bg="#EDF2F7"
                  id="finalDate"
                  {...register('finalDateVariance', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.finalDateVariance && errors.finalDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.payVariance} w="215px">
                <FormLabel sx={labelStyle} htmlFor="payVariance">
                  Pay Variance
                </FormLabel>
                <Input
                  sx={inputTextStyle}
                  bg="#EDF2F7"
                  id="payVariance"
                  {...register('payVariance', { required: 'This is required' })}
                />
                <FormErrorMessage>{errors.payVariance && errors.payVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
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

export default Misc
