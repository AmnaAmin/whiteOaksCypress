import { Avatar, Box, Flex, Textarea, WrapItem, Center, FormLabel, Text } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import notesAddminData from './notes-admin-data.json'

const MessagesTypes: React.FC<{ user?: string; other?: string }> = ({ user, other }) => {
  return (
    <Flex mb={4}>
      {other ? (
        <Box mr={5} fontSize="12px" fontWeight={400}>
          <WrapItem justifyContent="center" mb={1}>
            <Avatar size="sm" bg="blackAlpha.200" />
          </WrapItem>
          <Center color="gray.600">Admin@devtek.ai</Center>
          <Center color="gray.500">02/22/2022</Center>
        </Box>
      ) : (
        <Box w="115px" />
      )}
      <Text
        whiteSpace="pre-wrap"
        w="100%"
        p={7}
        rounded={6}
        bg={user ? 'blue.50' : 'gray.50'}
        border="1px solid #E2E8F0"
        flex="1"
        wordBreak="break-all"
      >
        {other}
        {user}
      </Text>
    </Flex>
  )
}

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
          <Box h={390} overflow="auto">
            {notesAddminData.map(data => {
              return <MessagesTypes other={data.message} />
            })}

            {messages.map(message => {
              return <MessagesTypes user={message} />
            })}
          </Box>

          <Flex>
            <Box w="125px" />
            <Box w="100%">
              <FormLabel fontSize="16px" color="gray.600" fontWeight={500}>
                Enter New Note Here
              </FormLabel>
              <Textarea flexWrap="wrap" minH="200px" {...register('message')} />
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
