import { Avatar, Box, Flex, Textarea, WrapItem, Center, FormLabel, Text, HStack, VStack } from '@chakra-ui/react'
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
        <Box w="113px" />
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
type NotesProps = {
  notes: Array<any>
  saveNote: (note) => void
  onClose?: () => void
  messageBoxStyle?: any
  chatListStyle?: any
  pageLayoutStyle?: any
  hideSave?: boolean
  labelTextBoxStyle?: any
  contentStyle?: any
}

export const NotesTab = (props: NotesProps) => {
  const {
    notes,
    saveNote,
    onClose,
    messageBoxStyle,
    chatListStyle,
    pageLayoutStyle,
    hideSave,
    labelTextBoxStyle,
    contentStyle,
  } = props
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
      <Box {...pageLayoutStyle} bg="white">
        <Box {...contentStyle}>
          <Box h={chatListStyle?.height || '300px'} {...chatListStyle} overflow="auto">
            {notes && notes.length > 0 && (
              <Box>
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
          </Box>
          <Flex mt="10px">
            <Box w="100%" {...labelTextBoxStyle}>
              <FormLabel fontSize="16px" color="gray.600" fontWeight={500}>
                {t('enterNewNote')}
              </FormLabel>
              <Textarea
                flexWrap="wrap"
                h={messageBoxStyle?.height || '200px'}
                {...messageBoxStyle}
                {...register('message')}
              />
            </Box>
          </Flex>
        </Box>
        <HStack borderTop="1px solid #CBD5E0" bg="white">
          <HStack padding={5} spacing="16px" w="100%" justifyContent="end">
            {onClose && (
              <Button variant="outline" colorScheme="brand" onClick={onClose}>
                {t('cancel')}
              </Button>
            )}
            {!hideSave && (
              <Button type="submit" colorScheme="brand" isDisabled={!message}>
                {t('save')}
              </Button>
            )}
          </HStack>
        </HStack>
      </Box>
    </form>
  )
}
