import { Avatar, Box, Flex, Textarea, WrapItem, Center, FormLabel, Text } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import notesAddminMassage from './notes-data.json'

export const NotesTab = () => {
  const [messages, setMessage] = useState([] as any)
  const { handleSubmit, register, reset, control } = useForm()

  const message = useWatch({ name: 'message', control })
  const Submit = data => {
    setMessage(state => [...state, data.message])
    reset()
  }

  return (
    <form onSubmit={handleSubmit(Submit)}>
      <Box bg="white" rounded={16}>
        <Box p="40px 100px 0px 65px " overflow="auto">
          <Box h={400} zIndex={1} overflow="auto">
            {notesAddminMassage.map(massages => {
              return (
                <Flex mb={4}>
                  <Box mr={5} fontSize="12px" fontWeight={400}>
                    <WrapItem justifyContent="center" mb={1}>
                      <Avatar size="sm" bg="blackAlpha.200" />
                    </WrapItem>
                    <Center color="gray.600">Admin@devtek.ai</Center>
                    <Center color="gray.500">02/22/2022</Center>
                  </Box>
                  <Text
                    whiteSpace="pre-wrap"
                    w="100%"
                    p={7}
                    rounded={6}
                    bg="gray.50"
                    placeholder="Here is a sample placeholder"
                    border="1px solid #E2E8F0"
                    flex="1"
                    wordBreak="break-all"
                  >
                    {massages.massage}
                  </Text>
                </Flex>
              )
            })}

            {messages.map(message => {
              return (
                <Flex mb={4}>
                  <Box w="115px" />
                  <Text
                    p={7}
                    rounded={6}
                    bg="blue.50"
                    placeholder="Here is a sample placeholder"
                    border="1px solid #E2E8F0"
                    flex="1"
                    wordBreak="break-all"
                  >
                    {message}
                  </Text>
                </Flex>
              )
            })}
          </Box>

          <Flex zIndex={2}>
            <Box w="125px" />
            <Box w="100%">
              <FormLabel fontSize="16px" color="gray.600" fontWeight={500}>
                Enter New Note Here
              </FormLabel>
              <Textarea
                flexWrap="wrap"
                minH="200px"
                placeholder="Here is a sample placeholder"
                {...register('message')}
              />
            </Box>
          </Flex>
        </Box>

        <Flex mt={5} borderTop="1px solid #E2E8F0" h="92px" justifyContent="end" alignItems="center" pr={3}>
          <Button type="submit" colorScheme="brand" isDisabled={!message}>
            Submit
          </Button>
        </Flex>
      </Box>
    </form>
  )
}
