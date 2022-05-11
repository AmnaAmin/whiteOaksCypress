import {
  Box,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  VStack,
  Text,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'

const labelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  Color: 'gray.600',
}

const Details = () => {
  return (
    <Stack spacing={3}>
      <Grid templateColumns="repeat(3,215px)" rowGap="6" columnGap="4">
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Business Name</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Score</FormLabel>

            <ReactSelect selectProps={{ isBorderLeft: true }} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Status</FormLabel>
            <ReactSelect selectProps={{ isBorderLeft: true }} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Primary Contact</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Primary Email</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Secondary Contact</FormLabel>

            <Input />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Secondary Email</FormLabel>

            <Input />
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
      </Grid>

      <HStack spacing="4" pb="2" pt="2">
        <Box w="215px">
          <FormControl>
            <FormLabel sx={labelStyle}>Business Phone No</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </Box>
        <Box w="109px">
          <FormControl>
            <FormLabel sx={labelStyle}>Ext</FormLabel>

            <Input />
          </FormControl>
        </Box>
        <Box w="215px">
          <FormControl>
            <FormLabel sx={labelStyle}>State</FormLabel>

            <Input />
          </FormControl>
        </Box>
        <Box w="109px">
          <FormControl>
            <FormLabel sx={labelStyle}>Ext</FormLabel>

            <Input />
          </FormControl>
        </Box>
      </HStack>

      <Grid templateColumns="repeat(4,215px)" rowGap="6" columnGap="4">
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Street Address</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>City</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>State</FormLabel>

            <ReactSelect selectProps={{ isBorderLeft: true }} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Zipcode</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Capacity</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>EIN</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>SIN</FormLabel>

            <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
        <GridItem></GridItem>
      </Grid>
      <Box>
        <Stack alignItems="center" direction="row">
          <VStack alignItems="start">
            <Text sx={labelStyle}>Payment Method</Text>
            <HStack>
              <Checkbox colorScheme="gray">Credit Card</Checkbox>
              <Checkbox colorScheme="gray">Check</Checkbox>
              <Checkbox colorScheme="gray">ACH</Checkbox>
            </HStack>
          </VStack>
          <Box w="215px">
            <FormControl>
              <FormLabel sx={labelStyle} mb="0">
                Payments Terms
              </FormLabel>
              <ReactSelect selectProps={{ isBorderLeft: true }} />
            </FormControl>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Details
