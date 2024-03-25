import { Box, Flex, SimpleGrid, Button, FormControl, FormLabel, Input, Stack, Checkbox } from '@chakra-ui/react'
import React from 'react'

import ReactSelect from 'components/form/react-select'
import { documentScore, documentStatus, documentTerm } from 'api/vendor-projects'

const VendorDetails = props => {
  return (
    <Box>
      <Flex minH="100px" gap="15px">
        <Box>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Business Name
            </FormLabel>
            <Input variant="required-field" isRequired />
          </FormControl>
        </Box>
        <Box w="215px">
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Score
            </FormLabel>
            <ReactSelect  classNamePrefix={'scoreOptions'} selectProps={{ isBorderLeft: true }} options={documentScore} isRequired />
          </FormControl>
        </Box>
        <Box w="215px">
          <FormControl isRequired>
            <FormLabel variant="strong-label" size="md">
              Status
            </FormLabel>
            <ReactSelect  classNamePrefix={'statusProject'} selectProps={{ isBorderLeft: true }} options={documentStatus}  variant="required-field"  isRequired />
          </FormControl>
        </Box>
      </Flex>

      <SimpleGrid w="86%" columns={4} spacing={4}>
        <Box>
          <FormControl height="40px">
            <FormLabel variant="strong-label" size="md">
              Primary Contact
            </FormLabel>
            <Input variant="required-field" />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Secondary Contact
            </FormLabel>
            <Input />
          </FormControl>
        </Box>
      </SimpleGrid>

      <Box mt={5}>
        <Flex gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Buisness Phone No
              </FormLabel>
              <Input variant="required-field" />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Exit
              </FormLabel>
              <Input w="109px" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Secondary Phone No
              </FormLabel>
              <Input />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Exit
              </FormLabel>
              <Input w="109px" />
            </FormControl>
          </Box>
        </Flex>

        <Flex mt="32px" gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Primary Email
              </FormLabel>
              <Input variant="required-field" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Secondary Email
              </FormLabel>
              <Input />
            </FormControl>
          </Box>
        </Flex>

        <Flex my={10} gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Street Address
              </FormLabel>
              <Input variant="required-field" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                City
              </FormLabel>
              <Input variant="required-field" />
            </FormControl>
          </Box>

          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                State
              </FormLabel>
              <ReactSelect  classNamePrefix={'StateOptions'} selectProps={{ isBorderLeft: true }} />
            </FormControl>
          </Box>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Zipcode
              </FormLabel>
              <Input variant="required-field" />
            </FormControl>
          </Box>
        </Flex>

        <Flex mt="2px" gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Capacity
              </FormLabel>
              <Input variant="required-field" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                EIN/SSN
              </FormLabel>
              <Input variant="required-field" />
            </FormControl>
          </Box>
        </Flex>

        <Flex mt="32px" gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                Payment Method
              </FormLabel>
              <Stack mt="15px" spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox size="md" colorScheme="brand" variant="link">
                  Credit Card
                </Checkbox>
                <Checkbox size="md" colorScheme="brand" defaultChecked variant="link">
                  Check
                </Checkbox>
                <Checkbox size="md" colorScheme="brand" variant="link">
                  ACH
                </Checkbox>
              </Stack>
            </FormControl>
          </Box>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Payment Terms
              </FormLabel>
              <ReactSelect  classNamePrefix={'paymentTermOptions'} selectProps={{ isBorderLeft: true }} options={documentTerm} />
            </FormControl>
          </Box>
        </Flex>

        <Flex mt="52px" h="89px" alignItems="center" justifyContent="end" borderTop="1px solid #CBD5E0 ">
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

export default VendorDetails
