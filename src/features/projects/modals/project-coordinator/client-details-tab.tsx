import { Box, Text, Flex, SimpleGrid, Button, FormControl, FormLabel, Input, Divider, Checkbox, Grid, GridItem } from '@chakra-ui/react'
import React from 'react'

import ReactSelect from 'components/form/react-select'

const Details = props => {
  return (
    <Box>
      {/* <Flex minH="110px"> */}
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
        <FormControl>
          <FormLabel variant="strong-label" size="md">
            Name
          </FormLabel>
          <Input width="215px" variant="required-field" readOnly />
        </FormControl>
        </GridItem>
        <GridItem>

        <FormControl>
          <FormLabel variant="strong-label" size="md">
            Payment Terms
          </FormLabel>
          <Input width="215px" variant="required-field" readOnly />
        </FormControl>
        </GridItem>
        <GridItem>

        <FormControl>
          <FormLabel variant="strong-label" size="md">
            Payment Method
          </FormLabel>
          <Checkbox variant="required-field" readOnly mr={3} mt={4}>Credit Card</Checkbox>
          <Checkbox variant="required-field" readOnly mt={4}>Check</Checkbox>
        </FormControl>
        </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
      <GridItem>
          <FormControl height="40px">
            <FormLabel variant="strong-label" size="md">
              Address
            </FormLabel>
            <Input variant="required-field" readOnly />
          </FormControl>
          </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              City
            </FormLabel>
            <Input variant="required-field" readOnly />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              State
            </FormLabel>
            <ReactSelect selectProps={{ isBorderLeft: true }} readOnly />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Zip Code
            </FormLabel>
            <Input variant="required-field" readOnly />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Contact
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Phone No
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Email
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Market
              </FormLabel>
              <ReactSelect selectProps={{ isBorderLeft: true }} readOnly />
            </FormControl>
          </GridItem>
          </Grid>

        <Flex alignItems="center" py="3">
          <Text fontSize="16px" color="gray.600" fontWeight={500} w={'320px'}>
            Accounts Payable contact details
          </Text>
          <Divider border="1px solid #E2E8F0" />
        </Flex>

        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="4">          
          <GridItem>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Contact
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Phone No
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                City
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Comment
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </GridItem>
        </Grid>
        <Flex h="90px" alignItems="center" justifyContent="end" borderTop="1px solid #CBD5E0" py="3" mt={10}>
          {/* <Button colorScheme="brand" variant="outline" size="lg" mr={3} onClick={props.onClose}>
            Close
          </Button> */}
                  <Button colorScheme="brand">Cancel</Button>

        </Flex>
      </Box>
  )
}

export default Details
