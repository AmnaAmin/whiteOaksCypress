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

const Details = () => {
  return (
    <Stack spacing={3}>
      <Grid templateColumns="repeat(3,215px)" rowGap="6" columnGap="4">
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Business Name
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Score
            </FormLabel>

            <ReactSelect selectProps={{ isBorderLeft: true }} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Status
            </FormLabel>
            <ReactSelect selectProps={{ isBorderLeft: true }} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Primary Contact
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Primary Email
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Secondary Contact
            </FormLabel>

            <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Secondary Email
            </FormLabel>

            <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
      </Grid>

      <HStack spacing="4" pb="2" pt="2">
        <Box w="215px">
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Business Phone No
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Ext
            </FormLabel>

            <Input w="109px" variant="outline" size="md" placeholder="Input size medium" />
          </FormControl>
        </Box>
        <Box w="215px">
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              State
            </FormLabel>

            <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
          </FormControl>
        </Box>
        <Box w="109px">
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Ext
            </FormLabel>

            <Input w="109px" variant="outline" size="md" placeholder="Input size medium" />
          </FormControl>
        </Box>
      </HStack>

      <Grid templateColumns="repeat(4,215px)" rowGap="6" columnGap="4">
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Street Address
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              City
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              State
            </FormLabel>

            <ReactSelect selectProps={{ isBorderLeft: true }} />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Zipcode
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Capacity
            </FormLabel>

            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              EIN
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              SIN
            </FormLabel>
            <Input w="215px" variant="reguired-field" size="md" placeholder="Input size medium" />
          </FormControl>
        </GridItem>
        <GridItem></GridItem>
        <GridItem></GridItem>
      </Grid>
      <Box>
        <Stack alignItems="center" direction="row">
          <VStack alignItems="start">
            <Text fontSize="14px" fontWeight={500} color="gray.600">
              Payment Method
            </Text>
            <HStack>
              <Checkbox colorScheme="gray">Credit Card</Checkbox>
              <Checkbox colorScheme="gray">Check</Checkbox>
              <Checkbox colorScheme="gray">ACH</Checkbox>
            </HStack>
          </VStack>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md" mb="0">
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
