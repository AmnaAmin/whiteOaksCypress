import { Box, Text, Flex, SimpleGrid, Button, FormControl, FormLabel, Input, Divider } from '@chakra-ui/react'
import React from 'react'

import ReactSelect from 'components/form/react-select'

const DetailsTab = props => {
  return (
    <Box>
      <SimpleGrid columns={1} minH="110px" alignItems={'center'}>
        <FormControl>
          <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
            Name
          </FormLabel>
          <Input width="215px" readOnly />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid w="86%" columns={4} spacing={4}>
        <Box>
          <FormControl height="40px">
            <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
              Address
            </FormLabel>
            <Input readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
              City
            </FormLabel>
            <Input readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
              State
            </FormLabel>
            <ReactSelect readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
              Zip Code
            </FormLabel>
            <Input readOnly />
          </FormControl>
        </Box>
      </SimpleGrid>

      <Box mt={5}>
        <Flex gap="15px">
          <Box>
            <FormControl height="40px">
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Contact
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Phone No
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Exit
              </FormLabel>
              <Input w="109px" readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Email
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>
          <Box w="215px">
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Market
              </FormLabel>
              <ReactSelect readOnly />
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
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Contact
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Phone No
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Exit
              </FormLabel>
              <Input w="109px" readOnly />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                City
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>
          <Box w="215px">
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Comments
              </FormLabel>
              <Input readOnly />
            </FormControl>
          </Box>
        </Flex>

        <Flex h="80px" alignItems="center" justifyContent="end" borderTop="1px solid #CBD5E0 ">
          <Button colorScheme="brand" variant="outline" mr={3} onClick={props.onClose}>
            Close
          </Button>
          <Button colorScheme="brand">Next</Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default DetailsTab
