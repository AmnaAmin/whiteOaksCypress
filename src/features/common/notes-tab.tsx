import { Avatar, Box, Flex, Textarea, WrapItem, Center, FormLabel, Text } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAccountDetails } from 'utils/vendor-details'
import { convertDateTimeFromServer } from 'utils/date-time-utils'
import React, { useRef, useEffect } from 'react'

const MessagesTypes: React.FC<{ userNote?: any; otherNote?: any }> = ({ userNote, otherNote }) => {
  return (
    <Flex mb={4}>
      {otherNote ? (
        <Box mr={5} fontSize="12px" fontWeight={400}>
          <WrapItem justifyContent="center" mb={1}>
            <Avatar size="sm" bg="blackAlpha.200" />
          </WrapItem>
          <Center color="gray.600">{otherNote.createdBy}</Center>
          <Center color="gray.500">{convertDateTimeFromServer(otherNote.createdDate)}</Center>
        </Box>
      ) : (
        <Box w="115px" />
      )}
      <Text
        whiteSpace="pre-wrap"
        w="100%"
        p={7}
        rounded={6}
        bg={userNote ? 'blue.50' : 'gray.50'}
        border="1px solid #E2E8F0"
        flex="1"
        wordBreak="break-all"
      >
        {otherNote && otherNote.comment}
        {userNote && userNote.comment}
      </Text>
    </Flex>
  )
}

export const NotesTab = props => {
  const { notes, saveNote, onClose } = props
  const { handleSubmit, register, reset, control } = useForm()
  const { data: account } = useAccountDetails()
  const { t } = useTranslation()
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [notes])

  const message = useWatch({ name: 'message', control })
  const Submit = data => {
    saveNote(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(Submit)}>
      <Box bg="white" rounded={16}>
        <Box overflow="auto">
          {notes && notes.length > 0 && (
            <Box h={390} overflow="auto">
              {notes.map(note => {
                return note.createdBy === account.login ? (
                  <MessagesTypes userNote={note} />
                ) : (
                  <MessagesTypes otherNote={note} />
                )
              })}
              <div ref={messagesEndRef} />
            </Box>
          )}
          <Flex>
            <Box w="125px" />
            <Box w="100%">
              <FormLabel fontSize="16px" color="gray.600" fontWeight={500}>
                {t('enterNewNote')}
              </FormLabel>
              <Textarea flexWrap="wrap" minH="150px" {...register('message')} />
            </Box>
          </Flex>
        </Box>

        <Flex mt={5} borderTop="1px solid #E2E8F0" h="92px" justifyContent="end" alignItems="center" pr={3}>
          {onClose && (
            <Button colorScheme="brand" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}
          <Button type="submit" colorScheme="brand" isDisabled={!message}>
            {t('save')}
          </Button>
        </Flex>
      </Box>
    </form>
  )
}
