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
  InputGroup,
  InputRightElement,
  Stack,
  Icon,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { BiCalendar } from 'react-icons/bi'

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

function Misc() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = formValues => {
    console.log('FormValues', formValues)
    reset()
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box h="51vh">
          <Grid templateColumns="repeat(4,1fr)" rowGap={7} columnGap={4} w="60%">
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Created</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Active</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Punch</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Closed</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>

                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Client Paid</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Collection</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>Disputed</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>WOA Invoice</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel sx={labelStyle}>WOA Paid</FormLabel>
                <InputGroup>
                  <Input placeholder="mm/dd/yyyy" isDisabled={true} />
                  <InputRightElement children={<Icon as={BiCalendar} boxSize={5} color="gray.500" mr="3" />} />
                </InputGroup>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl isInvalid={errors.dueDateVariance} w="215px">
                <FormLabel sx={labelStyle} htmlFor="dueDateVariance">
                  Due Date Variance
                </FormLabel>
                <Input sx={inputTextStyle} isDisabled={true} id="dueDate" {...register('dueDateVariance')} />
                <FormErrorMessage>{errors.dueDateVariance && errors.dueDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.finalDateVariance} w="215px">
                <FormLabel sx={labelStyle} htmlFor="finalDateVariance">
                  Final Date Variance
                </FormLabel>

                <Input sx={inputTextStyle} isDisabled={true} id="finalDate" {...register('finalDateVariance')} />
                <FormErrorMessage>{errors.finalDateVariance && errors.finalDateVariance.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.payVariance} w="215px">
                <FormLabel sx={labelStyle} htmlFor="payVariance">
                  Pay Variance
                </FormLabel>
                <Input sx={inputTextStyle} isDisabled={true} id="payVariance" {...register('payVariance')} />
                <FormErrorMessage>{errors.payVariance && errors.payVariance.message}</FormErrorMessage>
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

export default Misc
