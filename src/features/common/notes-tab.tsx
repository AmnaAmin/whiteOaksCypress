import {
  Avatar,
  Box,
  Flex,
  Textarea,
  WrapItem,
  FormLabel,
  Text,
  HStack,
  FormControl,
  Progress,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAccountDetails } from 'api/vendor-details'
import { convertDateWithTimeStamp } from 'utils/date-time-utils'
import React, { useRef, useEffect } from 'react'
import { BiSpreadsheet } from 'react-icons/bi'
import NumberFormat from 'react-number-format'

export const MessagesTypes: React.FC<{ userNote?: any; otherNote?: any }> = ({ userNote, otherNote }) => {
  return (
    <Flex mb={4} flexDir={{ base: 'column', lg: 'row' }} alignItems="start" mt="20px">
      {otherNote ? (
        <Flex w="150px" flexDir={'column'} mr={5} fontSize="12px" fontWeight={400} mb={{ base: '10px', lg: 'unset' }}>
          <WrapItem justifyContent="center" mb={1}>
            <Avatar size="sm" bg="blackAlpha.200" />
          </WrapItem>
          <Flex justifyContent="center" color="gray.600">
            <Box maxW="150px" whiteSpace={'nowrap'} overflow="hidden" textOverflow={'ellipsis'}>
              {otherNote.createdBy}
            </Box>
          </Flex>
          <Flex justifyContent="center" color="gray.500">
            <span>{convertDateWithTimeStamp(otherNote.createdDate)}</span>
          </Flex>
        </Flex>
      ) : (
        <Flex w="150px" flexDir={'column'} mr={5} fontSize="12px" fontWeight={400} mb={{ base: '10px', lg: 'unset' }}>
          <WrapItem justifyContent="center" mb={1}>
            <Avatar size="sm" bg="blackAlpha.200" />
          </WrapItem>
          <Flex justifyContent="center" color="gray.600">
            <Box maxW="150px" whiteSpace={'nowrap'} overflow="hidden" textOverflow={'ellipsis'}>
              {userNote.createdBy}
            </Box>
          </Flex>
          <Flex justifyContent="center" color="gray.500">
            <span>{convertDateWithTimeStamp(userNote.createdDate)}</span>
          </Flex>
        </Flex>
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
  saveNote?: (note) => void
  onClose?: () => void
  messageBoxStyle?: any
  chatListStyle?: any
  pageLayoutStyle?: any
  hideSave?: boolean
  textAreaStyle?: any
  contentStyle?: any
  hideFooter?: boolean
  navigateToProjectDetails?: any
  isNotesLoading?: boolean
  projectData?: any
  projectCompletion?: boolean
  isPercentageDisabled?: boolean
  isWOCancelled?: boolean
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
    textAreaStyle,
    contentStyle,
    hideFooter,
    navigateToProjectDetails,
    isNotesLoading,
    projectData,
    projectCompletion,
    isPercentageDisabled,
    isWOCancelled,
  } = props
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()
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
  const completion = useWatch({ name: 'percentageCompletion', control })
  const Submit = data => {
    if (saveNote) {
      saveNote(data)
    }
    reset()
  }

  useEffect(() => {
    if (projectData?.percentageCompletion) setValue('percentageCompletion', projectData?.percentageCompletion)
  }, [projectData])

  return (
    <Box {...pageLayoutStyle}>
      {isNotesLoading && <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />}
      <form onSubmit={handleSubmit(Submit)}>
        <Flex flexDirection={'column'} justifyContent="space-between" {...contentStyle}>
          {projectCompletion && (
            <FormControl w="215px">
              <FormLabel fontSize="16px" color="gray.600" fontWeight={500} htmlFor="percentageCompletion">
                {t('completeion')}
              </FormLabel>
              <Controller
                control={control}
                name="percentageCompletion"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        size="md"
                        disabled={isPercentageDisabled}
                        customInput={Input}
                        value={field.value}
                        onChange={e => field.onChange(e)}
                        suffix="%"
                      />
                    </>
                  )
                }}
              />
            </FormControl>
          )}
          <Box {...chatListStyle} overflow="auto">
            {notes && notes.length > 0 && (
              <Box>
                {notes.map(note => {
                  return note.createdBy === account?.login ? (
                    <MessagesTypes userNote={note} />
                  ) : (
                    <MessagesTypes otherNote={note} />
                  )
                })}
                <div ref={messagesEndRef} />
              </Box>
            )}
          </Box>
          <FormControl {...textAreaStyle} isInvalid={!!errors.message}>
            <FormLabel fontSize="16px" color="gray.600" fontWeight={500}>
              {t('enterNewNote')}
            </FormLabel>
            <Textarea
              disabled={hideSave}
              _disabled={{ bg: '#EDF2F7', cursor: 'not-allowed' }}
              flexWrap="wrap"
              h={'120px'}
              {...messageBoxStyle}
              {...register('message', {
                maxLength: { value: 65535, message: 'Please Use 65535 characters Only.' },
              })}
              onChange={e => {
                const title = e.target.value
                setValue('message', title)
                if (title.length > 65535) {
                  setError('message', {
                    type: 'maxLength',
                    message: 'Please Use 65535 characters Only.',
                  })
                } else {
                  clearErrors('message')
                }
              }}
              data-testid="note_textarea"
            />

            {errors.message && errors.message.type === 'maxLength' && (
              <FormErrorMessage data-testid="trans_description">{errors.message.message}</FormErrorMessage>
            )}
          </FormControl>
        </Flex>
        {!hideFooter && (
          <HStack borderTop="1px solid #CBD5E0" bg="white">
            <HStack padding={5} justifyContent="start" w="100%">
              {navigateToProjectDetails && (
                <Button
                  variant="outline"
                  colorScheme="brand"
                  size="md"
                  onClick={navigateToProjectDetails}
                  leftIcon={<BiSpreadsheet />}
                >
                  {t('seeProjectDetails')}
                </Button>
              )}
            </HStack>
            <HStack padding={5} spacing="16px" w="100%" justifyContent="end">
              {onClose && (
                <Button variant="outline" colorScheme="darkPrimary" onClick={onClose}>
                  {t('cancel')}
                </Button>
              )}
              {!hideSave && (
                <Button
                  type="submit"
                  data-testid="notes_submit"
                  colorScheme="darkPrimary"
                  isDisabled={(!message && !completion) || !!isNotesLoading || isWOCancelled}
                >
                  {t('submit')}
                </Button>
              )}
            </HStack>
          </HStack>
        )}
      </form>
    </Box>
  )
}
