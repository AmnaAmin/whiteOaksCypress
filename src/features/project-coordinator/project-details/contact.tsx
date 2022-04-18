import { Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack } from '@chakra-ui/react'
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
        <Stack h="50vh" spacing={20} mt="7">
          <HStack spacing={5}>
            <Box h="40px">
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Field Project Manager</FormLabel>
                <ReactSelect selectProps={{ isLeftBorder: true }} />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl sx={inputTextStyle} isInvalid={errors.fpmPhone}>
                <FormLabel sx={labelStyle} htmlFor="fpmPhone">
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
              <FormControl sx={inputTextStyle} isInvalid={errors.ext}>
                <FormLabel sx={labelStyle} htmlFor="ext">
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

          <HStack spacing={5}>
            <Box h="40px">
              <FormControl w="215px">
                <FormLabel sx={labelStyle}>Project Coordinator</FormLabel>
                <ReactSelect />
              </FormControl>
            </Box>

            <Box h="40px">
              <FormControl sx={inputTextStyle} isInvalid={errors.pcPhone}>
                <FormLabel sx={labelStyle} htmlFor="pcPhone">
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
              <FormControl sx={inputTextStyle} isInvalid={errors.ext}>
                <FormLabel sx={labelStyle} htmlFor="ext">
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

          <HStack spacing={5}>
            <Box h="40px">
              <FormControl sx={inputTextStyle} isInvalid={errors.superEmailName}>
                <FormLabel sx={labelStyle} htmlFor="superEmailName">
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
              <FormControl sx={inputTextStyle} isInvalid={errors.superPhone}>
                <FormLabel sx={labelStyle} htmlFor="superPhone">
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
              <FormControl sx={inputTextStyle} isInvalid={errors.ext}>
                <FormLabel sx={labelStyle} htmlFor="ext">
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
              <FormControl sx={inputTextStyle} isInvalid={errors.superEmail}>
                <FormLabel sx={labelStyle} htmlFor="superEmail">
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
            <FormControl w="215px">
              <FormLabel sx={labelStyle} htmlFor="client">
                Client
              </FormLabel>
              <ReactSelect selectProps={{ isLeftBorder: true }} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </Box>
        </Stack>

        <Stack w="100%">
          <Box pr="8">
            <Divider border="1px solid" />
          </Box>
          <Box w="100%" minH="70px">
            <Button
              mt="8px"
              mr="7"
              float={'right'}
              colorScheme="CustomPrimaryColor"
              _focus={{ outline: 'none' }}
              w="130px"
              h="40px"
              fontSize="14px"
              fontStyle="normal"
              fontWeight={500}
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}

export default Contact
