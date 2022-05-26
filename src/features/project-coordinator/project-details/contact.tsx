import { Box, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

const Contact = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = FormValues => {
    console.log('formValues', FormValues)
    reset()
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} id="contact">
        <Stack minH="42vh" spacing={14} mt="7">
          <HStack spacing="16px">
            <Box h="40px">
              <FormControl w="215px" isInvalid={errors.projectManager}>
                <FormLabel variant="strong-label" size="md">
                  Field Project Manager
                </FormLabel>
                <Controller
                  control={control}
                  name="projectManager"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.fpmPhone}>
                <FormLabel variant="strong-label" size="md" htmlFor="fpmPhone">
                  FPM Phone
                </FormLabel>
                <Input
                  placeholder="098-987-2233"
                  id="fpmPhone"
                  {...register('fpmPhone', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="215px"
                />
                <FormErrorMessage>{errors.fpmPhone && errors.fpmPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <FormLabel variant="strong-label" size="md" htmlFor="ext">
                  Ext
                </FormLabel>
                <Input
                  id="ext"
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <HStack spacing="16px">
            <Box h="40px">
              <FormControl w="215px" isInvalid={errors.projectCoordinator}>
                <FormLabel variant="strong-label" size="md">
                  Project Coordinator
                </FormLabel>
                <Controller
                  control={control}
                  name="projectCoordinator"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.pcPhone}>
                <FormLabel variant="strong-label" size="md" htmlFor="pcPhone">
                  PC Phone
                </FormLabel>
                <Input
                  placeholder="098-987-2233"
                  id="pcPhone"
                  {...register('pcPhone', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="215px"
                />
                <FormErrorMessage>{errors.pcPhone && errors.pcPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <FormLabel variant="strong-label" size="md" htmlFor="ext">
                  Ext
                </FormLabel>
                <Input
                  id="ext"
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  bg="#EDF2F7"
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <HStack spacing="16px">
            <Box h="40px">
              <FormControl isInvalid={errors.superEmailName}>
                <FormLabel variant="strong-label" size="md" htmlFor="superEmailName">
                  Super Email Name
                </FormLabel>
                <Input
                  id="superEmailName"
                  {...register('superEmailName', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.superEmailName && errors.superEmailName.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.superPhone}>
                <FormLabel variant="strong-label" size="md" htmlFor="superPhone">
                  Super Phone
                </FormLabel>
                <Input
                  id="superPhone"
                  {...register('superPhone', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.superPhone && errors.superPhone.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box h="40px">
              <FormControl isInvalid={errors.ext}>
                <FormLabel variant="strong-label" size="md" htmlFor="ext">
                  Ext
                </FormLabel>
                <Input
                  id="ext"
                  {...register('ext', {
                    required: 'This is required',
                  })}
                  w="124px"
                />
                <FormErrorMessage>{errors.ext && errors.ext.message}</FormErrorMessage>
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.superEmail}>
                <FormLabel variant="strong-label" size="md" htmlFor="superEmail">
                  Super Email
                </FormLabel>
                <Input
                  id="superEmail"
                  {...register('superEmail', {
                    required: 'This is required',
                  })}
                  w="215px"
                />
                <FormErrorMessage>{errors.superEmail && errors.superEmail.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </HStack>

          <Box h="40px">
            <FormControl w="215px" isInvalid={errors.client}>
              <FormLabel variant="strong-label" size="md" htmlFor="client">
                Client
              </FormLabel>
              <Controller
                control={control}
                name="client"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}

export default Contact
