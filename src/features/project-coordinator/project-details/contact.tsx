import { Box, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'
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

const Contact = () => {
  const {
    register,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack minH="50vh" spacing={20} mt="7">
          <HStack spacing={4}>
            <Box h="40px">
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Field Project Manager</FormLabel>
                <ReactSelect selectProps={{ isBorderLeft: true }} />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.fpmPhone}>
                <FormLabel sx={labelStyle} htmlFor="fpmPhone">
                  FPM Phone
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
                <FormLabel sx={labelStyle} htmlFor="ext">
                  Ext
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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

          <HStack spacing={4}>
            <Box h="40px">
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Project Coordinator</FormLabel>
                <ReactSelect selectProps={{ isBorderLeft: true }} />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl isInvalid={errors.pcPhone}>
                <FormLabel sx={labelStyle} htmlFor="pcPhone">
                  PC Phone
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
                <FormLabel sx={labelStyle} htmlFor="ext">
                  Ext
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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

          <HStack spacing={4}>
            <Box h="40px">
              <FormControl isInvalid={errors.superEmailName}>
                <FormLabel sx={labelStyle} htmlFor="superEmailName">
                  Super Email Name
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
                <FormLabel sx={labelStyle} htmlFor="superPhone">
                  Super Phone
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
                <FormLabel sx={labelStyle} htmlFor="ext">
                  Ext
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
                <FormLabel sx={labelStyle} htmlFor="superEmail">
                  Super Email
                </FormLabel>
                <Input
                  sx={inputTextStyle}
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
            <FormControl w="215px">
              <FormLabel sx={labelStyle} htmlFor="client">
                Client
              </FormLabel>
              <ReactSelect selectProps={{ isBorderLeft: true }} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}

export default Contact
