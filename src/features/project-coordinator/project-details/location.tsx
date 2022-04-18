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
  color: 'gray.400',
}

const Location = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = formValues => {
    console.log('FormValues', formValues)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box h="39vh">
          <Grid templateColumns="repeat(4,1fr)" rowGap={10} w="60%">
            <GridItem>
              <FormControl isInvalid={errors.address} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="address">
                  Address
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  placeholder="2037 SW TRENTON LN"
                  bg="#EDF2F7"
                  id="address"
                  {...register('address', {
                    required: 'This is required',
                  })}
                  borderLeft="2px solid #4E87F8"
                />
                <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.city} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="city">
                  City
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  placeholder="East Point"
                  bg="#EDF2F7"
                  id="city"
                  {...register('city', {
                    required: 'This is required',
                  })}
                  borderLeft="2px solid #4E87F8"
                />
                <FormErrorMessage>{errors.city && errors.city.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.state} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="state">
                  State
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  placeholder="NC"
                  bg="#EDF2F7"
                  id="state"
                  {...register('state', {
                    required: 'This is required',
                  })}
                  borderLeft="2px solid #4E87F8"
                />
                <FormErrorMessage>{errors.state && errors.state.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.zip} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="zip">
                  Zip
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  placeholder="28164"
                  bg="#EDF2F7"
                  id="zip"
                  {...register('zip', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.zip && errors.zip.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.market} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="market">
                  Market
                </FormLabel>
                <Input
                  border=" 1px solid #E2E8F0"
                  placeholder="Atlanta"
                  bg="#EDF2F7"
                  id="market"
                  {...register('market', {
                    required: 'This is required',
                  })}
                  borderLeft="2px solid #4E87F8"
                />
                <FormErrorMessage>{errors.market && errors.market.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.gateCode} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="gateCode">
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
              <FormControl isInvalid={errors.lockBoxCode} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="lockBoxCode">
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
              <FormControl isInvalid={errors.hoaContactPhone} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="hoaContactPhone">
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
              <FormControl isInvalid={errors.ext} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="ext">
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
              <FormControl isInvalid={errors.hoaContactEmail} w="215px" sx={inputTextStyle}>
                <FormLabel sx={labelStyle} htmlFor="hoaContactEmail">
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
        </Box>

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
              h="48px"
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

export default Location
