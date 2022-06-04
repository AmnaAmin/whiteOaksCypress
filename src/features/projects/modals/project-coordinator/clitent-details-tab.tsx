import { Box, Text, Flex, SimpleGrid, Button, FormControl, FormLabel, Input, Divider } from '@chakra-ui/react'
import React from 'react'

import ReactSelect from 'components/form/react-select'

const DetailsTab = props => {
  return (
    <Box>
      <Flex minH="110px">
        <FormControl>
          <FormLabel variant="strong-label" size="md">
            Name
          </FormLabel>
          <Input width="215px" variant="required-field" readOnly />
        </FormControl>
      </Flex>

      <SimpleGrid w="86%" columns={4} spacing={4}>
        <Box>
          <FormControl height="40px">
            <FormLabel variant="strong-label" size="md">
              Address
            </FormLabel>
            <Input variant="required-field" readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              City
            </FormLabel>
            <Input variant="required-field" readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              State
            </FormLabel>
            <ReactSelect selectProps={{ isBorderLeft: true }} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Zip Code
            </FormLabel>
            <Input variant="required-field" readOnly />
          </FormControl>
        </Box>
      </SimpleGrid>

      <Box mt={5}>
        <Flex gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Contact
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Phone No
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Exit
              </FormLabel>
              <Input w="109px" readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Email
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </Box>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Market
              </FormLabel>
              <ReactSelect selectProps={{ isBorderLeft: true }} readOnly />
            </FormControl>
          </Box>
        </Flex>

        <Flex mt="32px" alignItems="center">
          <Text mr={1.5} fontSize="16px" color="gray.600" fontWeight={500}>
            Accounts Payable contact details
          </Text>
          <Divider border="1px solid #E2E8F0" />
        </Flex>
        <Flex my={10} gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Contact
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Phone No
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Exit
              </FormLabel>
              <Input w="109px" readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                City
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </Box>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Comments
              </FormLabel>
              <Input variant="required-field" readOnly />
            </FormControl>
          </Box>
        </Flex>

        <Flex h="90px" alignItems="center" justifyContent="end" borderTop="1px solid #CBD5E0 ">
          <Button colorScheme="brand" variant="outline" size="lg" mr={3} onClick={props.onClose}>
            Close
          </Button>
          <Button colorScheme="brand" size="lg">
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default DetailsTab
