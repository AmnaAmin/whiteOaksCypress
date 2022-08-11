import React, { useRef } from 'react'
import { MessagesTypes } from 'features/common/notes-tab'
import { useNotes } from 'utils/clients'
import { Box, Button, Center, Flex, FormLabel } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useAccountDetails } from 'utils/vendor-details'

type clientNotesProps = {
  clientDetails?: any
  onClose: () => void
}

export const ClientNotes = React.forwardRef((props: clientNotesProps) => {
  const { clientDetails } = props
  const { t } = useTranslation()
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const { data: account } = useAccountDetails()

  const { notes = [] } = useNotes({
    clientId: clientDetails?.id,
  })

  console.log('notes', notes)

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }
  return (
    <>
      <Box p={0} height="400px" overflow={'auto'}>
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
          <Box width="100%">
            {' '}
            <Center>
              <FormLabel variant={'light-label'}>No Notes to show for this client.</FormLabel>
            </Center>
          </Box>
        )}
      </Box>
      <Flex style={btnStyle} py="4" pt={5}>
        <Button colorScheme="brand" onClick={props?.onClose}>
          {t('cancel')}
        </Button>
      </Flex>
    </>
  )
})
export default ClientNotes
