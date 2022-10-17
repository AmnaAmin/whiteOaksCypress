import React, { useEffect, useRef } from 'react'
import { MessagesTypes } from 'features/common/notes-tab'
import { useClientNoteMutation, useNotes } from 'api/clients'
import { Box, Button, Center, Flex, FormControl, FormLabel, Textarea } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useAccountDetails } from 'api/vendor-details'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useForm, useWatch } from 'react-hook-form'

type clientNotesProps = {
  clientDetails?: any
  onClose: () => void
  textAreaStyle?: any
  messageBoxStyle?: any
}

export const ClientNotes = React.forwardRef((props: clientNotesProps) => {
  const { clientDetails, textAreaStyle, messageBoxStyle } = props
  const { t } = useTranslation()
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const { data: account } = useAccountDetails()
  const { isProjectCoordinator } = useUserRolesSelector()
  const { mutate: createNotes } = useClientNoteMutation(clientDetails?.id)

  const { notes = [] } = useNotes({
    clientId: clientDetails ? clientDetails?.id : 0,
  })

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }

  const { register, control, reset } = useForm()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
    reset()
  }, [notes])

  const message = useWatch({ name: 'message', control })

  function Submit() {
    const payload = {
      comment: message,
      clientId: clientDetails?.id,
    }
    createNotes(payload)
  }

  return (
    <>
      <Box p={0} height="400px" overflow={'auto'}>
        <form>
          {notes.length > 0 ? (
            notes && (
              <Box>
                {notes.map(note => {
                  return note === account?.login ? <MessagesTypes userNote={note} /> : <MessagesTypes otherNote={note} />
                })}
                <div ref={messagesEndRef} />
              </Box>
            )
          ) : (
            <Box width="100%" p={5}>
              {isProjectCoordinator && (
                <Center>
                  <FormLabel variant={'light-label'}>No Notes to show for this client.</FormLabel>
                </Center>
              )}
            </Box>
          )}
          {!isProjectCoordinator && (
            <FormControl {...textAreaStyle}>
              <FormLabel fontSize="16px" color="gray.600" fontWeight={500}>
                {t('enterNewNote')}
              </FormLabel>
              <Textarea flexWrap="wrap" h={'120px'} {...messageBoxStyle} {...register('message')} />
            </FormControl>
          )}
        </form>
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={!isProjectCoordinator ? 'outline' : 'solid'} colorScheme="brand" onClick={props?.onClose}>
          {t('cancel')}
        </Button>
        {!isProjectCoordinator && (
          <Button colorScheme="brand" ml={2} isDisabled={!message} onClick={Submit}>
            {t('save')}
          </Button>
        )}
      </Flex>
    </>
  )
})
export default ClientNotes
