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
                  return note === account.login ? <MessagesTypes userNote={note} /> : <MessagesTypes otherNote={note} />
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

// import React, { useEffect } from 'react'
// import { useAccountDetails } from 'api/vendor-details'
// import { NotesTab } from 'features/common/notes-tab'
// import { useClientNoteMutation, useClients, useNotes } from 'api/clients'
// import { Box, Button, Flex } from '@chakra-ui/react'
// import { useUserRolesSelector } from 'utils/redux-common-selectors'
// import { useTranslation } from 'react-i18next'

// type clientNotesProps = {
//   clientDetails?: any
//   setNotesCount?: any
//   onClose: () => void
// }

// export const ClientNotes: React.FC<clientNotesProps> = props => {
//   const { setNotesCount, clientDetails } = props
//   const { mutate: createNotes } = useClientNoteMutation(clientDetails?.id)
//   const { data: account } = useAccountDetails()
//   const { data: clients, refetch } = useClients()
//   const { notes = [] } = useNotes({ clientId: clientDetails?.id || 0 })
//   const { isProjectCoordinator } = useUserRolesSelector()
//   const { t } = useTranslation()

//   useEffect(() => {
//     if (notes?.length > 0 && setNotesCount) {
//       setNotesCount(notes.filter((note: any) => note.createdBy !== account.login)?.length)
//     }
//   }, [notes, clients, refetch])

//   const saveNote = data => {
//     const payload = {
//       comment: data.message,
//       clientId: clientDetails?.id,
//     }
//     createNotes(payload)
//   }

//   const btnStyle = {
//     alignItems: 'center',
//     justifyContent: 'end',
//     borderTop: '1px solid #CBD5E0',
//   }

//   return (
//     <>
//       <Box h="495px">
//         <NotesTab
//           saveNote={saveNote}
//           notes={notes}
//           contentStyle={{ padding: '25px', maxHeight: '400px' }}
//           pageLayoutStyle={{ bg: 'white', rounded: 16, pb: 2 }}
//         />
//       </Box>
//       <Flex style={btnStyle} py="4" pt={5} mt={4}>
//         <Button variant={!isProjectCoordinator ? 'outline' : ''} colorScheme="brand" onClick={props?.onClose}>
//           {t('cancel')}
//         </Button>
//         {!isProjectCoordinator && (
//           <Button
//             // disabled={isClientDetailsSaveButtonDisabled}
//             colorScheme="brand"
//             type="submit"
//             form="clientDetails"
//             ml={2}
//             onClick={saveNote}
//           >
//             {t('save')}
//           </Button>
//         )}
//       </Flex>
//     </>
//   )
// }

// export default ClientNotes
