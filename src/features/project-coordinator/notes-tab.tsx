import {
  Avatar,
  Box,
  Flex,
  Textarea,
  WrapItem,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { useForm } from 'react-hook-form'

export const NotesTab = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm()
  const Submit = data => {
    console.log(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(Submit)}>
      <Box bg="white" rounded={16}>
        <Box h={550} p={10} pb={5} overflow="auto">
          <FormControl isInvalid={!!errors.input1?.message}>
            <Flex mb={3}>
              <Box mr={5} fontSize="12px" fontWeight={400} w="120px">
                <WrapItem justifyContent="center" mb={1}>
                  <Avatar size="sm" />
                </WrapItem>
                <Center color="gray.600">Admin@devtek.ai</Center>
                <Center color="gray.500">02/22/2022</Center>
              </Box>
              <Box w="100%">
                <Textarea
                  py={7}
                  minH="82px"
                  placeholder="Here is a sample placeholder"
                  {...register('input1', { required: 'This field is required.' })}
                />
                <FormErrorMessage>{errors.input1?.message}</FormErrorMessage>
              </Box>
            </Flex>
          </FormControl>

          <FormControl isInvalid={!!errors.input2?.message}>
            <Box mb={3} ml="130px">
              <Textarea
                py={7}
                minH="82px"
                placeholder="Here is a sample placeholder"
                {...register('input2', { required: 'This field is required.' })}
              />
              <FormErrorMessage>{errors.input2?.message}</FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl isInvalid={!!errors.input3?.message}>
            <Flex mb={3}>
              <Box mr={5} fontSize="12px" fontWeight={400} w="120px">
                <WrapItem justifyContent="center" mb={1}>
                  <Avatar size="sm" />
                </WrapItem>
                <Center color="gray.600">Admin@devtek.ai</Center>
                <Center color="gray.500">02/22/2022</Center>
              </Box>
              <Box w="100%">
                <Textarea
                  minH="127px"
                  placeholder="Here is a sample placeholder"
                  {...register('input3', { required: 'This field is required.' })}
                />
                <FormErrorMessage>{errors.input3?.message}</FormErrorMessage>
              </Box>
            </Flex>
          </FormControl>

          <FormControl isInvalid={!!errors.textArea?.message}>
            <Box mb={3} ml="130px">
              <FormLabel fontSize="16px" color="gray.600" fontWeight={500}>
                Enter New Note Here
              </FormLabel>
              <Textarea
                minH="118px"
                placeholder="Here is a sample placeholder"
                {...register('textArea', { required: 'This field is required.' })}
              />
              <FormErrorMessage>{errors.textArea?.message}</FormErrorMessage>
            </Box>
          </FormControl>
        </Box>

        <Flex borderTop="1px solid #E2E8F0" h="92px" justifyContent="end" alignItems="center" pr={3}>
          <Button type="submit" h="48px" w="130px" colorScheme="brand">
            Submit
          </Button>
        </Flex>
      </Box>
    </form>
  )
}
