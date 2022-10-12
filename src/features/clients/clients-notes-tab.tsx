// import React, { useRef } from 'react'
// import { MessagesTypes } from 'features/common/notes-tab'
// import { useNotes } from 'api/clients'
// import { Box, Button, Center, Flex, FormLabel } from '@chakra-ui/react'
// import { useTranslation } from 'react-i18next'
// import { useAccountDetails } from 'api/vendor-details'
// import { useUserRolesSelector } from 'utils/redux-common-selectors'
// import { useFormContext } from 'react-hook-form'
// import { ClientFormValues } from 'types/client.type'

// type clientNotesProps = {
//   clientDetails?: any
//   onClose: () => void
// }

// export const ClientNotes = React.forwardRef((props: clientNotesProps) => {
//   const { clientDetails } = props
//   const { t } = useTranslation()
//   const messagesEndRef = useRef<null | HTMLDivElement>(null)
//   const { data: account } = useAccountDetails()
//   const { isProjectCoordinator } = useUserRolesSelector()

//   const { notes = [] } = useNotes({
//     clientId: clientDetails?.id,
//   })

//   const btnStyle = {
//     alignItems: 'center',
//     justifyContent: 'end',
//     borderTop: '1px solid #CBD5E0',
//   }

//   const {
//     register,
//     formState: { errors },
//     control,
//     watch,
//   } = useFormContext<ClientFormValues>()

//   return (
//     <>
//       <Box p={0} height="400px" overflow={'auto'}>
//         {notes.length > 0 ? (
//           notes && (
//             <Box>
//               {notes.map(note => {
//                 return note === account.login ? <MessagesTypes userNote={note} /> : <MessagesTypes otherNote={note} />
//               })}
//               <div ref={messagesEndRef} />
//             </Box>
//           )
//         ) : (
//           <Box width="100%" p={5}>
//             <Center>
//               <FormLabel variant={'light-label'}>No Notes to show for this client.</FormLabel>
//             </Center>
//           </Box>
//         )}
//       </Box>
//       <Flex style={btnStyle} py="4" pt={5} mt={4}>
//         <Button variant={!isProjectCoordinator ? 'outline' : ''} colorScheme="brand" onClick={props?.onClose}>
//           {t('cancel')}
//         </Button>
//         {!isProjectCoordinator && (
//           <Button colorScheme="brand" type="submit" form="newClientForm" ml={2}>
//             {t('save')}
//           </Button>
//         )}
//       </Flex>
//     </>
//   )
// })
// export default ClientNotes

import React, { useEffect } from 'react'
import { useAccountDetails } from 'api/vendor-details'
import { NotesTab } from 'features/common/notes-tab'
import { useClientNoteMutation, useClients, useNotes } from 'api/clients'
import { Box } from '@chakra-ui/react'

type clientNotesProps = {
  clientDetails?: any
  setNotesCount?: any
  onClose: () => void
}

export const ClientNotes: React.FC<clientNotesProps> = props => {
  const { setNotesCount, clientDetails } = props
  const { mutate: createNotes } = useClientNoteMutation(clientDetails?.id)
  const { data: account } = useAccountDetails()
  const { data: clients, refetch } = useClients()
  const { notes = [] } = useNotes({ clientId: clientDetails?.id || 0 })

  useEffect(() => {
    if (notes?.length > 0 && setNotesCount) {
      setNotesCount(notes.filter((note: any) => note.createdBy !== account.login)?.length)
    }
  }, [notes, clients, refetch])

  const saveNote = data => {
    const payload = {
      comment: data.message,
      clientId: clientDetails?.id,
    }
    createNotes(payload)
  }
  return (
    <Box h="495px">
      <NotesTab
        saveNote={saveNote}
        notes={notes}
        contentStyle={{ padding: '25px', maxHeight: '400px' }}
        pageLayoutStyle={{ bg: 'white', rounded: 16, pb: 2 }}
      />
    </Box>
  )
}

export default ClientNotes
